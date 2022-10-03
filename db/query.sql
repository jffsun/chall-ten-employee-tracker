SELECT employees.id, employees.first_name, employees.last_name, positions.title, 
positions.salary, employees.manager_id
FROM employees JOIN 
    (positions JOIN departments
ON departments.id=positions.department_id)
ON employees.position_id = positions.id
ORDER BY employees.id;



-- Columns to be shown in joined table; TO DO - Manager's ID as Concatenated first_name + last_name
SELECT employees.id, employees.first_name, employees.last_name, positions.title, 
positions.salary, employees.manager_id

-- Table 1: employees JOINS
FROM employees JOIN 

    -- Table 2: positions JOINS Table 3: departments
    (positions JOIN departments

-- positions joins departments on their shared department ids 
ON departments.id=positions.department_id)

-- employees joins positions on their shared position ids
ON employees.position_id = positions.id
ORDER BY employees.id;