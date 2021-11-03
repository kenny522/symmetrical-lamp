DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE department_table (
  id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30),
  PRIMARY KEY (id)
);
  
CREATE TABLE role_table (
  role_id INT AUTO_INCREMENT NOT NULL,
  role_title VARCHAR(30),
  salary DECIMAL(10,2),
  department_id INT,
  PRIMARY KEY (role_id),
  FOREIGN KEY(department_id) REFERENCES department_table(id) ON DELETE SET NULL
);
  
  
CREATE TABLE employee_table (
  employee_id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (employee_id),
  FOREIGN KEY(role_id) REFERENCES role_table(role_id) ON DELETE SET NULL,
  FOREIGN KEY(manager_id) REFERENCES employee_table(employee_id) ON DELETE SET NULL
);