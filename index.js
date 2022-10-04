// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Will store retrieved departments from db for user to select when adding a new position 
const newPositionDepartments = [];
var fullNames = '';

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
          ],
};

var addEmpl = [
    {
        type: 'input',
        name: 'addEmplFirst',
        message: 'What is the employee’s first name?',
    },
    {
        type: 'input',
        name: 'addEmplLast',
        message: 'What is the employee’s last name?',
    },
    {
        type: 'list',
        message: 'What is the employee’s position?',
        name: 'addEmplPosition',
        // TO DO: Can this be dynamic and insert positions table title data? 
        choices: [
              'Sales Lead', 
              'Sales Person',
              'Lead Engineer',
              '...'
              ],
    },
    {
        type: 'list',
        name: 'addEmplManager',
        message: 'Who is the employee’s manager?',
        // TO DO: Make dynamic and insert list of managers from Employee Table
        choices: [
            'Jeff Bezos', 
            'Mark Zuckerberg',
            '...'
            ],
    },
];

var updateEmpl = [
    {
        type: 'list',
        name: 'updateEmpl',
        message: 'Which employee’s position would you like to update?',
        // Pulls list of employees from db's employees table
        choices: fullNames
    },
    {
        type: 'list',
        name: 'updateEmpl',
        message: 'Which position do you want to assign the selected employee?',
        // TO DO: Make dynamic and insert list of positions from positions Table
        choices: [
            'Sales Person', 
            'Leader engineer',
            '...'
            ],
    },
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
        choices: newPositionDepartments
    },
];

var addDept = [
    {
        type: 'input',
        name: 'addDeptName',
        message: 'What is the name of the department?',
    },
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

        // If user selects 'Add Employee'
        } else if (answer.menuAnswer == 'Add Employee') {

        // If user selects 'Update Employee Position'
        } else if (answer.menuAnswer == 'Update Employee Position') {

            // Retrieve first and last employees names from db
            db.query('SELECT employees.first_name, employees.last_name FROM employees', function (err, results) {
                if (err) {
                    console.log(err);
                } 
                console.log(results);
                
                // Iterate through employees retrieved and form array that joins employee's first_name and last_name
                fullNames = results.map(employee => {
                    return [employee.first_name,employee.last_name].join(" ");
                });
                console.log(fullNames);

                inquirer.prompt(updateEmpl).then((answers) => {
                    console.log(answers);
                })
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
                results.forEach(department => newPositionDepartments.push(department.department_name));

                // Ask user to select from the departments retrieved
                inquirer.prompt(addPosition).then((answers) => {
                    
                    // New position answers to be used for raw SQL code
                    const newPositionTitle = answers.addPositionTitle.trim();
                    const newPositionSalary = answers.addPositionSalary;

                    // Index of user's selected department plus one to get department_id value 
                    const newPositionDeptID = newPositionDepartments.indexOf(answers.addPositionDept) + 1;

                    // Raw SQL to be used for adding new record to positions table
                    newPositionSQL = `INSERT INTO positions (title, salary, department_id)
                    VALUES ("${newPositionTitle}", "${newPositionSalary}", ${newPositionDeptID});`;

                    // Send new position to positions table in db
                    db.query(newPositionSQL, function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        console.log('Position successsfully added!');
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
                const newDept = answer.addDeptName.trim();

                // Insert new department into departments table 
                newDeptSQL = `INSERT INTO departments (department_name) VALUES ("${newDept}");`;
                db.query(newDeptSQL, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Department successsfully added!');
                });

                // Ask menu prompt again
                ask();
            });      
        // If user selects 'Quit'
        } else {
            return;
        }
    })
}

ask()