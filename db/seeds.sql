INSERT INTO department_table(department_name)
VALUES('Sales'), ('Engineering'), ('Finance'), ('Legal');
SELECT * FROM department_table;

INSERT INTO role_table(role_title, salary, department_id) VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);
SELECT * FROM role_table;

INSERT INTO employee_table(first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, null),
('Mike', 'Chan', 2, 1),
('Ashley', 'rodriguez', 3, null),
('Kevin', 'Tupik', 4, 3),
('Malia', 'Brown', 5, null),
('Sarah', 'Lourd', 6, null),
('Tom', 'allen', 7, 6),
('Rick', 'Ross', 4, 4);
SELECT * FROM employee_table;