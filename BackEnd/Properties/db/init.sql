CREATE DATABASE IF NOT EXISTS PropertyService;
USE PropertyService;

CREATE TABLE IF NOT EXISTS Properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,  
    is_available ENUM('disponible', 'no disponible') DEFAULT 'disponible', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES OwnerService.Owners(id) ON DELETE CASCADE
);

ALTER TABLE Properties ADD COLUMN image LONGBLOB NULL;
ALTER TABLE Properties ADD COLUMN city VARCHAR(100) NOT NULL;
