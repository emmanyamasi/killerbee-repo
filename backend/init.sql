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
