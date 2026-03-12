-- Base de datos para el backend base
-- Este script se ejecuta automáticamente al iniciar MySQL con Docker

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS gestionpro;

-- Usar la base de datos
USE gestionpro;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (user)
);

-- Crear procedimiento almacenado para login
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_login(
    IN p_user VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT 
        id AS pk_user,
        user AS username,
        name AS first_name,
        '' AS last_name,
        CONCAT(user, '@example.com') AS email,
        'user' AS role_name
    FROM users 
    WHERE user = p_user AND password = p_password
    LIMIT 1;
END //

DELIMITER ;

-- Insertar usuario de ejemplo si no existe
INSERT IGNORE INTO users (name, user, password) 
VALUES ('Admin User', 'admin', 'admin1234');

-- Crear procedimiento almacenado para crear usuario
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_create_user(
    IN p_name VARCHAR(255),
    IN p_user VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_created_by INT
)
BEGIN
    DECLARE user_exists INT;
    
    -- Verificar si el usuario ya existe
    SELECT COUNT(*) INTO user_exists 
    FROM users 
    WHERE user = p_user;
    
    IF user_exists = 0 THEN
        INSERT INTO users (name, user, password)
        VALUES (p_name, p_user, p_password);
        
        SELECT LAST_INSERT_ID() AS user_id, 'User created successfully' AS message;
    ELSE
        SELECT 0 AS user_id, 'User already exists' AS message;
    END IF;
END //

DELIMITER ;

-- Crear procedimiento almacenado para obtener usuario por ID
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_get_user(
    IN p_user_id INT
)
BEGIN
    SELECT 
        id AS pk_user,
        user AS username,
        name AS first_name,
        '' AS last_name,
        CONCAT(user, '@example.com') AS email,
        'user' AS role_name,
        created_at,
        updated_at
    FROM users 
    WHERE id = p_user_id;
END //

DELIMITER ;

-- Crear procedimiento almacenado para actualizar usuario
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_update_user(
    IN p_user_id INT,
    IN p_name VARCHAR(255),
    IN p_user VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_exists INT;
    
    -- Verificar si el usuario existe
    SELECT COUNT(*) INTO user_exists 
    FROM users 
    WHERE id = p_user_id;
    
    IF user_exists > 0 THEN
        UPDATE users 
        SET 
            name = p_name,
            user = p_user,
            password = p_password,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_user_id;
        
        SELECT 1 AS affected_rows, 'User updated successfully' AS message;
    ELSE
        SELECT 0 AS affected_rows, 'User not found' AS message;
    END IF;
END //

DELIMITER ;

-- Crear procedimiento almacenado para eliminar usuario
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_delete_user(
    IN p_user_id INT
)
BEGIN
    DECLARE user_exists INT;
    
    -- Verificar si el usuario existe
    SELECT COUNT(*) INTO user_exists 
    FROM users 
    WHERE id = p_user_id;
    
    IF user_exists > 0 THEN
        DELETE FROM users WHERE id = p_user_id;
        
        SELECT 1 AS affected_rows, 'User deleted successfully' AS message;
    ELSE
        SELECT 0 AS affected_rows, 'User not found' AS message;
    END IF;
END //

DELIMITER ;

-- Crear procedimiento almacenado para listar usuarios
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_list_users(
    IN p_page INT DEFAULT 1,
    IN p_limit INT DEFAULT 10
)
BEGIN
    DECLARE v_offset INT;
    
    SET v_offset = (p_page - 1) * p_limit;
    
    SELECT 
        id AS pk_user,
        user AS username,
        name AS first_name,
        '' AS last_name,
        CONCAT(user, '@example.com') AS email,
        'user' AS role_name,
        created_at,
        updated_at
    FROM users 
    ORDER BY created_at DESC
    LIMIT p_limit OFFSET v_offset;
    
    -- También devolver el total para paginación
    SELECT COUNT(*) AS total_users FROM users;
END //

DELIMITER ;

-- Mostrar las tablas creadas
SHOW TABLES;

-- Mostrar los procedimientos almacenados creados
SHOW PROCEDURE STATUS WHERE Db = 'gestionpro';
