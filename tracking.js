var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runTracking();
});

function runTracking() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View the departments, roles and employees",
        "Update employee roles",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Add department":
        addDepartment();
        break;

      case "Add role":
        addRole();
        break;

      case "Add employee":
        addEmployee();
        break;

      case "View the departments, roles and employees":
        view();
        break;

      case "Update employee roles":
        update();
        break;

      case "Exit":
        connection.end();
        break;
      }
    });
}

// function to handle new department
function addDepartment() {
   inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the name of the department?"
      }
      ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        function(err) {
          if (err) throw err;
          console.log("Your department was successfully added!");
          // re-prompt the user for input
          runTracking();
        }
      );
    });
}

// function to handle new role
function addRole() {
  inquirer
   .prompt([
     {
       name: "role",
       type: "input",
       message: "What is the name of the role?"
     },
     {
      name: "salary",
      type: "input",
      message: "What is the salary of the role?"
    },
    {
      name: "department",
      type: "input",
      message: "What is the department ID of the role?"
    }
     ])
   .then(function(answer) {
     // when finished prompting, insert a new item into the db with that info
     connection.query(
       "INSERT INTO role SET ?",
       {
         title: answer.role,
         salary: answer.salary,
         department_id: answer.department
       },
       function(err) {
         if (err) throw err;
         console.log("Your role was successfully added!");
         // re-prompt the user for input
         runTracking();
       }
     );
   });
}

// function to handle new role
function addEmployee() {
  inquirer
   .prompt([
     {
       name: "first",
       type: "input",
       message: "What is the employee's first name?"
     },
     {
      name: "last",
      type: "input",
      message: "What is the employee's last name?"
    },
    {
      name: "roleid",
      type: "input",
      message: "What is the employee's role ID?"
    },
    {
     name: "managerid",
     type: "input",
     message: "What is the employee's manager ID?"
   }
     ])
   .then(function(answer) {
     // when finished prompting, insert a new item into the db with that info
     connection.query(
       "INSERT INTO employee SET ?",
       {
         first_name: answer.first,
         last_name: answer.last,
         role_id: answer.roleid,
         manager_id: answer.managerid
       },
       function(err) {
         if (err) throw err;
         console.log("Your employee was successfully added!");
         // re-prompt the user for input
         runTracking();
       }
     );
   });
}

function view() {
  connection.query("SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee INNER JOIN department ON employee.id=department.id;", function(err, res) {
    if (err) throw err;
    console.log(res);
    runTracking();
  });
}