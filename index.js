// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Inquirer prompts
var menu = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'menu',
    choices: [
          'View All Employees', 
          'Add Employee', 
          'Update Employee Role',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
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
        message: 'What is the employee’s role?',
        name: 'addEmplRole',
        // TO DO: Can this be dynamic and insert role table title data? 
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
        message: 'Which employee’s role would you like to update?',
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
        message: 'Which role do you want to assign the selected employee?',
        // TO DO: Make dynamic and insert list of roles from Roles Table
        choices: [
            'Sales Person', 
            'Leader engineer',
            '...'
            ],
    },
];

var addRole = [
    {
        type: 'input',
        name: 'addRoleName',
        message: 'What is the name of the role?',
    },
    {
        type: 'input',
        name: 'addRoleSalary ',
        message: 'What is the salary of the role?',
    },
    {
        type: 'list',
        name: 'addRoleDept',
        message: 'Which employee’s role would you like to update?',
        // TO DO: Make dynamic and insert list of roles from Roles Table
        choices: [
            'Sales Person', 
            'Leader engineer',
            '...'
            ],
    },
];

var addDept = [
    {
        type: 'input',
        name: 'addDeptName',
        message: 'What is the name of the department?',
    },
];
