DROP DATABASE IF EXISTS organization_db;
CREATE DATABASE organization_db;

USE organization_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE positions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES departments(id)
  ON DELETE SET NULL
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  position_id INT,
  FOREIGN KEY (position_id)
  REFERENCES positions(id)
  ON DELETE SET NULL,
  manager_id INT,
  FOREIGN KEY (manager_id) 
  REFERENCES employees(id) 
  ON DELETE SET NULL
);
