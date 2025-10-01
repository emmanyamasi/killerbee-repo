-- Roles table
CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(100) UNIQUE NOT NULL
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT REFERENCES roles(role_id) ON DELETE CASCADE
);



INSERT INTO roles (role_name) VALUES ('Admin'), ('R&D'), ('Test'), ('Factory');

INSERT INTO users (name, email, password, role_id)
VALUES ('admin', 'admin@gmail.com', '1234', 1); -- You can hash password later
 







-- Models table (freeze bee products)
CREATE TABLE models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  pUHT NUMERIC(10,2),   -- price per unit before tax
  range VARCHAR(100)    -- product range/category
);






-- Ingredients table
CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);





-- Junction table: each model has many ingredients with precise weight
CREATE TABLE model_ingredients (
  model_id INT REFERENCES models(id) ON DELETE CASCADE,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
  weight NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (model_id, ingredient_id)
);




-- Manufacturing processes for each model
CREATE TABLE processes (
  id SERIAL PRIMARY KEY,
  model_id INT REFERENCES models(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  description TEXT NOT NULL,
  validated BOOLEAN DEFAULT FALSE  -- will be set true by Test role
);





-- Add some ingredients
INSERT INTO ingredients (name, description) VALUES
('Sugar', 'Refined sugar'),
('Milk', 'Whole milk'),
('Honey', 'Natural honey');

-- Add a model
INSERT INTO models (name, description, pUHT, range)
VALUES ('FreezeBee Classic', 'Original freeze bee', 12.50, 'Standard');

-- Link model to ingredients
INSERT INTO model_ingredients (model_id, ingredient_id, weight)
VALUES (1, 1, 50.0),  -- 50g sugar
       (1, 2, 30.0),  -- 30g milk
       (1, 3, 20.0);  -- 20g honey

-- Add process steps
INSERT INTO processes (model_id, step_number, description)
VALUES (1, 1, 'Mix sugar and milk'),
       (1, 2, 'Add honey and blend'),
       (1, 3, 'Freeze and package');
