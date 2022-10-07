// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Will store specific results from queries
const departmentNames = [];
const departmentIDs = [];
const addEmplPositions = [];
const addEmplPositionIDs = [];
const addEmplManagers = [];
const addEmplManagerIDs = [];
const fullNames = [];
const positionsTitles = [];
const positionsIDs = [];
const employeeIDs = [];

// Inquirer prompts
var menu = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'menuAnswer',
    choices: [
          'View All Employees', 
          'Add Employee', 
          'Update Employee Position',
          'View All Positions',
          'Add Position',
          'View All Departments',
          'Add Department',
          'Quit'
          ]
};

var addEmpl = [
    {
        type: 'input',
        name: 'addEmplFirst',
        message: 'What is the employee’s first name?'
    },
    {
        type: 'input',
        name: 'addEmplLast',
        message: 'What is the employee’s last name?'
    },
    {
        type: 'list',
        message: 'What is the employee’s position?',
        name: 'addEmplPosition',
        choices: addEmplPositions
    },
    {
        type: 'list',
        name: 'addEmplManager',
        message: 'Who is the employee’s manager?',
        choices: addEmplManagers
    }
];

var updateEmpl = [
    {
        type: 'list',
        name: 'updateEmplName',
        message: 'Which employee’s position would you like to update?',
        choices: fullNames
    },
    {
        type: 'list',
        name: 'updateEmplNewPosition',
        message: 'Which position do you want to assign the selected employee?',
        choices: positionsTitles
    }
];

const addPosition = [
    {
        type: 'input',
        name: 'addPositionTitle',
        message: 'What is the title of the position?',
    },
    {
        type: 'input',
        name: 'addPositionSalary',
        message: 'What is the salary of the position?',
    },
    {
        type: 'list',
        name: 'addPositionDept',
        message: 'Which department does the position belong to?',
        choices: departmentNames
    }
];

var addDept = [
    {
        type: 'input',
        name: 'addDeptName',
        message: 'What is the name of the department?',
    }
];

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'mysql3312',
      database: 'organization_db'
    },
    console.log(`Connected to the organization_db database.`)
  );

function ask() {

    // Prompt user with menu question
    inquirer.prompt(menu).then((answer) => {
        
        // If user select's 'View All Employees'
        if (answer.menuAnswer == 'View All Employees') {

              // String of raw SQL to show employees, positions, and departments table joined
              db.query(`SELECT employees.id, employees.first_name, employees.last_name, positions.title, departments.department_name, positions.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager_name FROM employees LEFT JOIN employees manager ON employees.manager_id = manager.id JOIN positions ON employees.position_id = positions.id JOIN departments ON positions.department_id = departments.id ORDER BY employees.id;`, function (err, results) {
                if (err) {
                    console.log(err);
                }
                const employeesTable = cTable.getTable(results);
                console.log(employeesTable);

                // Return to menu
                ask();
            });    

        // If user selects 'Add Employee'
        } else if (answer.menuAnswer == 'Add Employee') {

            // Gets all positions for user to select from 
            db.query('SELECT positions.title, positions.id FROM positions', function (err, results) {
                if (err) {
                    console.log(err);
                }
                // Push each position title to addEmplPositions array to be used as choices for Inquirer
                results.forEach(position => {
                    addEmplPositions.push(position.title);

                    // Also push the position_ids to array
                    addEmplPositionIDs.push(position.id);
                });

                // Gets all employees records with new column of first and last name concatenated
                db.query(`SELECT CONCAT(c.first_name, ' ', c.last_name) AS full_name, c.* FROM employees c;`, function (err, results) {
                    if (err) {
                        console.log(err);
                    } 

                    // Check each employee if has a manager ID and pushes their's name and ID to array if truthy
                    results.forEach(employee => {
                        if (employee.manager_id !== null) {
                            addEmplManagers.push(employee.full_name);
                            addEmplManagerIDs.push(employee.id);
                        }
                    });

                    // Ask user to input employee's name, position, and designate their manager
                    inquirer.prompt(addEmpl).then((answers) => {

                        // Find index of the position that the user selected
                        const j = addEmplPositions.indexOf(answers.addEmplPosition);

                        // Find index of the manager that the user selected
                        const k = addEmplManagers.indexOf(answers.addEmplManager);

                        const newEmployee = {

                            firstName: answers.addEmplFirst,
                            lastName: answers.addEmplLast,

                            // Uses index of the selected position to find it's position_id
                            positionID: addEmplPositionIDs[j],

                            // Uses index of the selected manager to find their employee.id
                            managerID: addEmplManagerIDs[k]
                        };
                        // Add new employee record to employees table in db
                        db.query(`INSERT INTO employees (first_name, last_name, position_id, manager_id)
                        VALUES ("${newEmployee.firstName}", "${newEmployee.lastName}", ${newEmployee.positionID}, ${newEmployee.managerID});`, function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(`${newEmployee.firstName} ${newEmployee.lastName} was successsfully added!`);
                            ask();
                        });
                    });
                });
            });
        // If user selects 'Update Employee Position'
        } else if (answer.menuAnswer == 'Update Employee Position') {

            // Gets all employees and their info and concatenates first and last name into full_name
            db.query(`SELECT CONCAT(c.first_name, ' ', c.last_name) AS full_name, c.* FROM employees c;`, function (err, results) {
                if (err) {
                    console.log(err);
                } 
                // Push each employee's name to fullNames array to be used as choices for Inquirer
                results.forEach(employee => {
                    fullNames.push(employee.full_name);

                    // Push each employee's id to employeeIDs array as it will be needed in UPDATE raw sql method
                    employeeIDs.push(employee.id);
                });

                // Gets all positions_title and positions_ids
                db.query('SELECT positions.title, positions.id FROM positions', function (err, results) {
                    if (err) {
                        console.log(err);
                    }

                    // Push each title to positionsTitles array to be used as choices for Inquirer
                    results.forEach(position => {
                        positionsTitles.push(position.title)

                        // Push all position_ids to positionsIDs array as it will be needed in UPDATE raw sql method
                        positionsIDs.push(position.id);
                    });
                
                    // Ask user to pick an employee to update along with a new position
                    inquirer.prompt(updateEmpl).then((answers) => {

                        // Defines index of the employee's name in fullNames array to then find their corresponding employee.id from employeeIDs
                        const j = fullNames.indexOf(answers.updateEmplName);

                        // Defines index of the position selected in positionsTitles array to then find it's corresponding positions.id from positionsIDs
                        const k = positionsTitles.indexOf(answers.updateEmplNewPosition)

                        const updatedEmployee = {
                            name: answers.updateEmplName,

                            // Uses index of the selected employee to find their current position_id
                            employeeID: employeeIDs[j],

                            // Uses index of the selected position to find new position's position_id
                            newPositionID: positionsIDs[k]
                        };

                        // Update employee's position_id in db
                        db.query(`UPDATE employees SET position_id = ${updatedEmployee.newPositionID} WHERE id = ${updatedEmployee.employeeID}`, function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(`${updatedEmployee.name}'s position successfully updated!`);
                            ask();
                        });

                    });
                });
            });
           
        // If user selects 'View All Positions'
        } else if (answer.menuAnswer == 'View All Positions') {

            // String of raw SQL to join positions and departments table
            db.query('SELECT positions.id, positions.title, positions.salary, departments.department_name FROM positions JOIN departments ON positions.department_id = departments.id;', function (err, results) {
                if (err) {
                    console.log(err);
                }
                // Show positions and departments table joined
                const positionsDeptTable = cTable.getTable(results);
                console.log(positionsDeptTable);

                // Return to menu
                ask();
            });    
        
        // If user selects 'Add Position'
        } else if (answer.menuAnswer == 'Add Position') {

            // Retrieve department names and IDs from db
            db.query('SELECT * FROM departments', function (err, results) {
                if (err) {
                    console.log(err);
                }

                // Push each department's name retrieved from departments table into array to be used as choices for inquirer prompt 
                results.forEach(department => {
                    departmentNames.push(department.department_name);
                    departmentIDs.push(department.id);
                });

                // Ask user to select from the departments retrieved
                inquirer.prompt(addPosition).then((answers) => {
                    
                    // Index of user's selected department to find that department's ID
                    const j = departmentNames.indexOf(answers.addPositionDept);

                    // New position answers to be used for raw SQL code
                    const newPosition = {
                        positionTitle: answers.addPositionTitle,
                        positionSalary: answers.addPositionSalary,
                        departmentID: departmentIDs[j]
                    };

                    // Add new position record to positions table in db
                    db.query(`INSERT INTO positions (title, salary, department_id)
                    VALUES ("${newPosition.positionTitle}", "${newPosition.positionSalary}", ${newPosition.departmentID});`, function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        console.log('Position successsfully added!');

                        // Return to menu
                        ask();
                    });
                });
            });  
      
        // If user selects 'View All Departments'
        } else if (answer.menuAnswer == 'View All Departments') {

            // Show all departments table records
            db.query('SELECT * FROM departments', function (err, results) {
                if (err) {
                    console.log(err);
                }
                const deptTable = cTable.getTable(results);
                console.log(deptTable);

                // Ask menu prompt again until 'Quit' is selected
                ask();
              });
        
        // If user selects 'Add Department'
        } else if (answer.menuAnswer == 'Add Department') {

            // Ask for new department name
            inquirer.prompt(addDept).then((answer) => {

                // newDept assigned to user's new department name and inserted into raw SQL
                const newDept = answer.addDeptName;

                // Insert new department into departments table 
                newDeptSQL = `INSERT INTO departments (department_name) VALUES ("${newDept}");`;
                db.query(newDeptSQL, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                });
                console.log('Department successsfully added!');

                // Ask menu prompt again
                ask();
            });      
        // If user selects 'Quit'
        } else {
            return;
        };
    });
};

ask()