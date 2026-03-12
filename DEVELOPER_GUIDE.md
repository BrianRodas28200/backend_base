# 🚀 Guía para Desarrolladores

Bienvenido al backend base. Este proyecto está diseñado como un punto de partida robusto y escalable para aplicaciones Node.js con TypeScript.

## 📋 Requisitos Previos

- **Node.js** (v16 o superior)
- **MySQL** (v8.0 o superior)
- **TypeScript** (v4.5 o superior)
- **Git** para control de versiones

## 🛠️ Configuración Inicial

### 1. Clonar el Repositorio
```bash
git clone https://github.com/BrianRodas28200/backend_base.git
cd backend_base
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

### 4. Configurar Base de Datos
```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestionpro;

-- Usar la base de datos
USE gestionpro;

-- El procedimiento almacenado sp_login debe ser creado manualmente
-- Ver archivo database-setup.sql para referencia
```

## 🏗️ Estructura del Proyecto

```
backend_base/
├── 📁 src/                    # Código fuente principal
│   ├── 🚀 app.ts              # Configuración de Express
│   ├── 🌐 server.ts           # Punto de entrada del servidor
│   ├── ⚙️ config/             # Configuraciones
│   │   ├── 🗄️ database.ts     # Conexión MySQL
│   │   └── 🔐 env.ts           # Variables de entorno
│   ├── 🎮 controllers/          # Controladores base
│   │   └── BaseController.ts
│   ├── 🛡️ middleware/           # Middlewares personalizados
│   │   ├── auth.ts             # Autenticación JWT
│   │   ├── errorHandler.ts      # Manejo de errores
│   │   └── validation.ts        # Validación de inputs
│   ├── 📊 models/              # Modelos de datos base
│   │   └── BaseModel.ts
│   ├── 📦 modules/              # Módulos de funcionalidad
│   │   └── auth/               # Módulo de autenticación
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       └── auth.routes.ts
│   ├── 🛤️ routes/              # Rutas de la API
│   │   └── index.ts
│   ├── 📝 types/               # Definiciones TypeScript
│   │   ├── auth.ts
│   │   └── index.ts
│   └── 🔧 utils/               # Utilidades
│       ├── database.ts          # Servicio MySQL
│       ├── jwt.ts              # Servicio JWT
│       ├── password.ts         # Servicio de passwords
│       └── sqlite.ts            # Servicio SQLite para refresh tokens
├── 📦 package.json              # Dependencias del proyecto
├── 🔧 tsconfig.json             # Configuración TypeScript
├── 🚫 .gitignore                # Archivos ignorados por Git
├── 📄 README.md                # Documentación del proyecto
└── 🗄️ data/                   # Base de datos SQLite (creada automáticamente)
```

## 🎯 ¿Dónde Agregar Tu Código?

### 📁 **Para agregar nuevos módulos** (ej: módulo de productos):

1. **Crear la carpeta del módulo**:
```bash
mkdir src/modules/products
```

2. **Crear los archivos del módulo**:
```bash
# src/modules/products/
touch products.model.ts      # Modelo de datos
touch products.service.ts     # Lógica de negocio
touch products.controller.ts  # Controlador HTTP
touch products.routes.ts     # Rutas de la API
```

3. **Ejemplo de estructura para products.model.ts**:
```typescript
import { RowDataPacket } from 'mysql2';
import { BaseModel } from '../../models/BaseModel';

export interface Product extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

export class ProductModel extends BaseModel {
  constructor() {
    super('products');
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    return await this.create(productData);
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.findById(id);
  }

  async getAllProducts(limit = 10, offset = 0): Promise<Product[]> {
    return await this.query<Product>('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset]);
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<number> {
    return await this.update(id, productData);
  }

  async deleteProduct(id: number): Promise<number> {
    return await this.delete(id);
  }
}
```

4. **Ejemplo de products.service.ts**:
```typescript
import { ProductModel, Product } from '../models/products.model';

export class ProductService {
  private productModel: ProductModel;

  constructor() {
    this.productModel = new ProductModel();
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const productId = await this.productModel.createProduct(productData);
    return await this.productModel.getProductById(productId);
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productModel.getProductById(id);
  }

  async getAllProducts(page = 1, limit = 10): Promise<{products: Product[], total: number}> {
    const offset = (page - 1) * limit;
    const products = await this.productModel.getAllProducts(limit, offset);
    const totalResult = await this.productModel.queryOne('SELECT COUNT(*) as total FROM products');
    
    return {
      products,
      total: totalResult?.total || 0
    };
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
    await this.productModel.updateProduct(id, productData);
    return await this.productModel.getProductById(id);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const affectedRows = await this.productModel.deleteProduct(id);
    return affectedRows > 0;
  }
}
```

5. **Ejemplo de products.controller.ts**:
```typescript
import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../controllers/BaseController';
import { ProductService } from './products.service';
import { validate } from '../../middleware/validation';

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category_id: z.number().positive('Category is required'),
});

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().positive('Price must be positive').optional(),
  category_id: z.number().positive('Category is required').optional(),
});

export class ProductController extends BaseController {
  private productService: ProductService;

  constructor() {
    super();
    this.productService = new ProductService();
  }

  createProduct = this.handleAsync(async (req: Request, res: Response) => {
    const productData = req.body;
    const product = await this.productService.createProduct(productData);
    this.sendSuccess(res, 'Product created successfully', product);
  });

  getProductById = this.handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(Number(id));
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    this.sendSuccess(res, 'Product retrieved successfully', product);
  });

  getAllProducts = this.handleAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    
    const result = await this.productService.getAllProducts(page, limit);
    this.sendSuccess(res, 'Products retrieved successfully', result);
  });

  updateProduct = this.handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await this.productService.updateProduct(Number(id), updateData);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    this.sendSuccess(res, 'Product updated successfully', product);
  });

  deleteProduct = this.handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await this.productService.deleteProduct(Number(id));
    
    if (!success) {
      throw new Error('Product not found');
    }
    
    this.sendSuccess(res, 'Product deleted successfully');
  });
}

export const productController = new ProductController();

// Route handlers with validation
export const createProductHandler = [validate(createProductSchema), productController.createProduct];
export const updateProductHandler = [validate(updateProductSchema), productController.updateProduct];
export const getProductByIdHandler = [productController.getProductById];
export const getAllProductsHandler = [productController.getAllProducts];
export const deleteProductHandler = [productController.deleteProduct];
```

6. **Ejemplo de products.routes.ts**:
```typescript
import { Router } from 'express';
import { 
  createProductHandler, 
  updateProductHandler, 
  getProductByIdHandler, 
  getAllProductsHandler, 
  deleteProductHandler 
} from './products.controller';

const router = Router();

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private
 */
router.post('/', createProductHandler);

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination
 * @access  Private
 */
router.get('/', getAllProductsHandler);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Private
 */
router.get('/:id', getProductByIdHandler);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private
 */
router.put('/:id', updateProductHandler);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private
 */
router.delete('/:id', deleteProductHandler);

export default router;
```

7. **Registrar las nuevas rutas en src/routes/index.ts**:
```typescript
// Agregar después de las rutas existentes
import productRoutes from '../modules/products/products.routes';

// Agregar al router principal
router.use('/products', authenticate, productRoutes);
```

## 🔐 **Procedimientos Almacenados**

El backend está diseñado para usar **exclusivamente procedimientos almacenados** para operaciones de base de datos.

### Ejemplo de crear un nuevo procedimiento almacenado:

```sql
DELIMITER //

CREATE PROCEDURE sp_create_product(
    IN p_name VARCHAR(255),
    IN p_description TEXT,
    IN p_price DECIMAL(10,2),
    IN p_category_id INT,
    IN p_created_by INT
)
BEGIN
    INSERT INTO products (name, description, price, category_id, created_by, created_at, updated_at)
    VALUES (p_name, p_description, p_price, p_category_id, p_created_by, NOW(), NOW());
    
    SELECT LAST_INSERT_ID() as product_id;
END //

DELIMITER ;
```

### Para usar el procedimiento en el servicio:

```typescript
// En products.service.ts
async createProduct(productData: any): Promise<Product> {
  const result = await DatabaseService.callSPOne<any>('sp_create_product', [
    productData.name,
    productData.description,
    productData.price,
    productData.category_id,
    1 // ID del usuario que crea
  ]);
  
  return result.product_id;
}
```

## 🎨 **Estilos y Convenciones**

### Nomenclatura
- **Archivos**: PascalCase (ej: `ProductController.ts`)
- **Clases**: PascalCase (ej: `ProductService`)
- **Métodos**: camelCase (ej: `createProduct`)
- **Variables**: camelCase (ej: `productData`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`)

### Estructura de Archivos
```typescript
// 1. Imports (al principio)
import { ... } from '...';

// 2. Interfaces/Types
export interface Product {
  id: number;
  name: string;
  // ...
}

// 3. Clases
export class ProductService {
  // ...
}

// 4. Exportaciones (al final)
export const productService = new ProductService();
export const productController = new ProductController();
```

## 🔧 **Comandos Útiles**

### Desarrollo
```bash
npm run dev          # Iniciar servidor en modo desarrollo
npm run build        # Compilar TypeScript
npm run start        # Iniciar servidor en producción
```

### Base de Datos
```bash
# Para ejecutar scripts SQL
mysql -u root -p gestionpro < script.sql

# Para conectar a MySQL
mysql -u root -p -e "USE gestionpro"
```

## 📝 **Testing**

### Ejemplo de test para productos:
```typescript
// tests/products.test.ts
import { ProductService } from '../src/modules/products/products.service';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  test('should create a product', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category_id: 1
    };

    const product = await productService.createProduct(productData);
    
    expect(product).toBeDefined();
    expect(product.name).toBe(productData.name);
  });
});
```

## 🚀 **Despliegue**

### Variables de Entorno para Producción
```env
NODE_ENV=production
PORT=3100
DB_HOST=tu-host-de-produccion
DB_NAME=gestionpro
DB_USER=tu-usuario-db
DB_PASSWORD=tu-password-db
JWT_ACCESS_SECRET=tu-super-secreto-access-key
JWT_REFRESH_SECRET=tu-super-secreto-refresh-key
```

## 🔄 **Flujo de Trabajo Recomendado**

1. **Crear rama de feature**: `git checkout -b feature/nuevo-modulo`
2. **Desarrollar**: Agregar código siguiendo las convenciones
3. **Probar**: `npm test` para verificar funcionalidad
4. **Hacer commit**: `git add . && git commit -m "Add new module"`
5. **Push y PR**: `git push origin feature/nuevo-modulo` y crear Pull Request

## 📚 **Documentación Adicional**

- **Express.js**: https://expressjs.com/
- **TypeScript**: https://www.typescriptlang.org/
- **MySQL**: https://dev.mysql.com/doc/
- **JWT**: https://jwt.io/
- **Zod**: https://zod.dev/

## 🤝 **Soporte**

Si tienes dudas o necesitas ayuda:
1. Revisa este archivo de guía
2. Explora el código existente para entender los patrones
3. Sigue las convenciones establecidas
4. No dudes en consultar si algo no está claro

---

**¡Feliz desarrollo! 🚀**
