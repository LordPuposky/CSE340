-- ============================================
-- DATABASE REBUILD FILE
-- ============================================
-- Drop existing objects
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS client CASCADE;
DROP TYPE IF EXISTS public.account_type CASCADE;
-- Create account_type ENUM
CREATE TYPE public.account_type AS ENUM ('Client', 'Employee', 'Admin');
-- Create account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) NOT NULL UNIQUE,
    account_password VARCHAR(255) NOT NULL,
    account_type public.account_type NOT NULL DEFAULT 'Client'
);
-- Create classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL
);
-- Create inventory table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INTEGER NOT NULL,
    inv_description TEXT,
    inv_image VARCHAR(255),
    inv_thumbnail VARCHAR(255),
    inv_price DECIMAL(10, 2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR(50),
    classification_id INTEGER NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES classification(classification_id)
);
-- Insert classification data
INSERT INTO classification (classification_name)
VALUES ('Sport'),
    ('SUV'),
    ('Sedan'),
    ('Truck');
-- Insert inventory data
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'GM',
        'Hummer',
        2023,
        'This vehicle has small interiors for comfortable rides',
        '/images/hummer.jpg',
        '/images/hummer-tn.jpg',
        45000.00,
        15000,
        'Yellow',
        2
    ),
    (
        'Chevy',
        'Camaro',
        2022,
        'Fast and sporty',
        '/images/camaro.jpg',
        '/images/camaro-tn.jpg',
        35000.00,
        8000,
        'Red',
        1
    ),
    (
        'Ford',
        'Mustang',
        2021,
        'Classic sports car',
        '/images/mustang.jpg',
        '/images/mustang-tn.jpg',
        40000.00,
        12000,
        'Blue',
        1
    );
-- 4. Update GM Hummer description (replace "small interiors" with "a huge interior")
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- 6. Update image paths to add /vehicles
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');