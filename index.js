// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Will store retrieved departments from db for user to select when adding a new position 
const newPositionDepartments = [];

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
        // TO DO: Make dynamic and insert list of employees from Employee Table
        choices: [
            'John Smith', 
            'Jane Doe',
            '...'
            ],
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
        name: 'addPositionSalary ',
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
            newPositionSQL = ``;

            // Retrieve department names and IDs from db
            db.query('SELECT * FROM departments', function (err, results) {
                if (err) {
                    console.log(err);
                }
                console.log(results);

                // Push each department retrieved from departments table, into the empty array 
                results.forEach(department => newPositionDepartments.push(department.department_name));
                console.log(newPositionDepartments);

                // Ask user to select from the departments retrieved
                inquirer.prompt(addPosition).then((answers) => {
                    console.log(answers);

                    // New position answers to be used for SQL method
                    const newPositionTitle = answer.addPositionTitle;
                    const newPositionSalary = answer.addPositionSalary;
                    const newPositionDept = answer.addPositionDept
                    const newPositionDeptID = 

                    // TO DO: Picking department gets their Department ID, which will be used in raw code 
                   
                });
            });  
            return;
                              
                // // Insert new position record into positions table 
                
                // db.query(newDeptSQL, function (err, results) {
                //     if (err) {
                //         console.log(err);
                //     }
                //     console.log('Department successsfully added!');
                // });

                // Ask menu prompt again
                ask();
            // });                
            

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