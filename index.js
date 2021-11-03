// Dependencies used
const mysql = require("mysql2");
const inquirer = require("inquirer");
const Table = require("cli-table");

let departmentList = [];
let roleList = [];

// Connection to MySQL
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Password123.",
  database: "employees_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  getTableData();
  queryTable();
});

const queryTable = () => {
  console.clear();
  let query = `SELECT employee_id, first_name, last_name, role_title, salary, department_name FROM employee_table AS tOne
  LEFT JOIN role_table AS tTwo
  ON tOne.role_id = tTwo.role_id
  LEFT JOIN department_table AS tThree
  ON tTwo.department_id = tThree.id`;

  let table = new Table({
    style: { "padding-left": 2, "padding-right": 2 },
    head: [
      "ID",
      "First Name",
      "Last Name",
      "Role Title",
      "Salary",
      "Department",
    ],
    border: [],
  });

  connection.query(query, (err, res) => {
    if (err) throw err;

    res.forEach((e) => {
      table.push([
        e.employee_id,
        e.first_name,
        e.last_name,
        e.role_title,
        e.salary,
        e.department_name,
      ]);
      if (departmentList.indexOf(e.department_name) === -1)
        departmentList.push(e.department_name);
      if (roleList.indexOf(e.role_title) === -1) roleList.push(e.role_title);
    });

    console.log(table.toString());
    promptUser();
  });
};
const filterTable = (filterBy, keyword) => {
  console.clear();
  let table = new Table({
    style: { "padding-left": 2, "padding-right": 2 },
    head: [
      "ID",
      "First Name",
      "Last Name",
      "Role Title",
      "Salary",
      "Department",
    ],
    border: [],
  });

  connection.query(
    `SELECT employee_id, first_name, last_name, role_title, salary, department_name FROM employee_table AS tOne
    LEFT JOIN role_table AS tTwo
    ON tOne.role_id = tTwo.role_id
    LEFT JOIN department_table AS tThree
    ON tTwo.department_id = tThree.id
    WHERE ?? = ?`,
    [filterBy, keyword],
    (err, res) => {
      if (err) throw err;

      res.forEach((e) => {
        table.push([
          e.employee_id,
          e.first_name,
          e.last_name,
          e.role_title,
          e.salary,
          e.department_name,
        ]);
      });

      console.log(table.toString());
      promptUser();
    }
  );
};

const insertTable = (firstName, lastName, roleID, managerID) => {
  // Insert employee_table(first_name, last_name, role_id, manager_id) VALUES ('Rick', 'Ross', 4, 4);
  connection.query(
    `INSERT INTO employee_table(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
    [firstName, lastName, roleID, managerID],
    (err, res) => {
      if (err) throw err;
    }
  );
};

const deleteEmployee = (keyword) => {
  // Delete employee_table WHERE employee_id = 13;
  connection.query(
    `DELETE FROM employee_table WHERE employee_id = ?`,
    [keyword],
    (err, res) => {
      if (err) throw err;
    }
  );
};

const updateEmployeeRole = (roleID, employeeID) => {
  // Update employee_table SET role_id = 3 WHERE employee_id = 2;
  connection.query(
    `UPDATE employee_table SET role_id = ? WHERE employee_id = ?`,
    [roleID, employeeID],
    (err, res) => {
      if (err) throw err;
    }
  );
};

const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Role",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
        ],
      },
    ])
    .then((ans) => {
      // console.log(JSON.stringify(ans, null, ' '));
      switch (ans.choice) {
        case "View All Employees":
          queryTable();
          break;

        case "View All Employees By Department":
          promptDepartment();
          break;

        case "View All Employees By Role":
          promptEmployeeRole();
          break;

        case "Add Employee":
          promptAddEmployee();
          break;

        case "Remove Employee":
          promptEmployeeRemoval();
          break;

        case "Update Employee Role":
          promptUpdateEmployee();
          break;

        default:
          break;
      }
    });
};

const promptDepartment = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: departmentList,
      },
    ])
    .then((ans) => {
      // console.log(JSON.stringify(ans, null, ' '));
      filterTable("department_name", ans.choice);
    });
};

const promptEmployeeRole = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: roleList,
      },
    ])
    .then((ans) => {
      // console.log(JSON.stringify(ans, null, ' '));
      filterTable("role_title", ans.choice);
    });
};

let employeeList = [];
let employeeData = [];
let rolesData = [];
const getTableData = () => {
  connection.query("select * from employee_table", (err, res) => {
    if (err) throw err;
    res.forEach((item) => {
      employeeData.push(item);
      employeeList.push(item.first_name);
    });
    // console.log(employeeData);
  });
  connection.query("select * from role_table", (err, res) => {
    if (err) throw err;
    res.forEach((item) => {
      rolesData.push(item);
    });
    // console.log(rolesData);
  });
};

const promptAddEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name",
      },
      {
        type: "list",
        name: "selectRole",
        message: "Select role title of the employee",
        choices: roleList,
      },
      {
        type: "list",
        name: "selectManager",
        message: "Select employee's Manager",
        choices: employeeList,
      },
    ])
    .then((ans) => {
      // console.log(JSON.stringify(ans, null, ' '));
      let selectRoleID;
      let selectManagerID;
      rolesData.forEach((item) => {
        if (ans.selectRole == item.role_title) {
          selectRoleID = item.role_id;
          // console.log(selectRoleID);
        }
      });
      employeeData.forEach((item) => {
        if (ans.selectManager == item.first_name) {
          selectManagerID = item.employee_id;
          // console.log(selectManagerID);
        }
      });
      insertTable(ans.firstName, ans.lastName, selectRoleID, selectManagerID);
      queryTable();
    });
};

const promptEmployeeRemoval = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selectEmployee",
        message: "Which employee would like to remove?",
        choices: employeeList,
      },
    ])
    .then((ans) => {
      // console.log(JSON.stringify(ans, null, ' '));

      let selectEmployeeID;
      employeeData.forEach((item) => {
        if (ans.selectEmployee == item.first_name) {
          selectEmployeeID = item.employee_id;
          // console.log(selectManagerID);
        }
      });
      deleteEmployee(selectEmployeeID);
      queryTable();
    });
};

const promptUpdateEmployee = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selectEmployee",
        message: "Which employee would like to update?",
        choices: employeeList,
      },
      {
        type: "list",
        name: "selectRole",
        message: "Select new role title of the employee",
        choices: roleList,
      },
    ])
    .then((ans) => {
      // console.log(JSON.stringify(ans, null, ' '));
      let updateRoleID;
      let updateEmployeeID;
      employeeData.forEach((item) => {
        if (ans.selectEmployee == item.first_name) {
          updateEmployeeID = item.employee_id;
          // console.log(selectManagerID);
        }
      });
      rolesData.forEach((item) => {
        if (ans.selectRole == item.role_title) {
          updateRoleID = item.role_id;
          // console.log(selectRoleID);
        }
      });
      updateEmployeeRole(updateRoleID, updateEmployeeID);
      queryTable();
    });
};
