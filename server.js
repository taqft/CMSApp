// Uses the Inquirer package.
// Uses the MySQL2 package to connect to a MySQL database.
// Uses the console.table package to print MySQL rows to the console.
const inquirer = require('inquirer');
const connection = require('./config');
require('console.table');

const choices = [
  'View All Departments',
  'View All Roles',
  'View All Employees',
  'Add A Department',
  'Add A Role',
  'Add An Employee',
  'Update An Employee Role',
  'Exit',
]

const greeting = () => {
  console.log(`
$$$$$$$$\\                         $$\\                                                
$$  _____|                        $$ |                                               
$$ |      $$$$$$\\$$$$\\   $$$$$$\\  $$ | $$$$$$\\  $$\\   $$\\  $$$$$$\\   $$$$$$\\         
$$$$$\\    $$  _$$  _$$\\ $$  __$$\\ $$ |$$  __$$\\ $$ |  $$ |$$  __$$\\ $$  __$$\\        
$$  __|   $$ / $$ / $$ |$$ /  $$ |$$ |$$ /  $$ |$$ |  $$ |$$$$$$$$ |$$$$$$$$ |       
$$ |      $$ | $$ | $$ |$$ |  $$ |$$ |$$ |  $$ |$$ |  $$ |$$   ____|$$   ____|       
$$$$$$$$\\ $$ | $$ | $$ |$$$$$$$  |$$ |\\$$$$$$  |\\$$$$$$$ |\\$$$$$$$\\ \\$$$$$$$\\        
\\________|\\__| \\__| \\__|$$  ____/ \\__| \\______/  \\____$$ | \\_______| \\_______|       
                        $$ |                    $$\\   $$ |                           
                        $$ |                    \\$$$$$$  |                           
                        \\__|                     \\______/                            
            $$\\      $$\\                                                             
            $$$\\    $$$ |                                                            
            $$$$\\  $$$$ | $$$$$$\\  $$$$$$$\\   $$$$$$\\   $$$$$$\\   $$$$$$\\   $$$$$$\\  
            $$\\$$\\$$ $$ | \\____$$\\ $$  __$$\\  \\____$$\\ $$  __$$\\ $$  __$$\\ $$  __$$\\ 
            $$ \\$$$  $$ | $$$$$$$ |$$ |  $$ | $$$$$$$ |$$ /  $$ |$$$$$$$$ |$$ |  \\__|
            $$ |\\$  /$$ |$$  __$$ |$$ |  $$ |$$  __$$ |$$ |  $$ |$$   ____|$$ |      
            $$ | \\_/ $$ |\\$$$$$$$ |$$ |  $$ |\\$$$$$$$ |\\$$$$$$$ |\\$$$$$$$\\ $$ |      
            \\__|     \\__| \\_______|\\__|  \\__| \\_______| \\____$$ | \\_______|\\__|      
                                                       $$\\   $$ |                    
                                                       \\$$$$$$  |                    
                                                        \\______/                     
                                                        `);
}

greeting();

const init = async () => {
  await inquirer
    .prompt([{
      type: 'list',
      message: 'Which option would you like?',
      name: 'choice',
      choices: choices,
      default () {
        return 'View All Departments';
      },
    }]).then((response) => {
      let userChoice = response.choice;
      switch (userChoice) {
        case choices[7]: // User wishes to exit
          console.log('Exiting...');
          connection.end(); // resolve remaining queries and disconnect from mysql
          process.exit(); // exit the node js program
        case choices[0]: // View All Departments
          viewAllDepartments();
          break;
        case choices[1]: // View All Roles
          viewAllRoles();
          break;
        case choices[2]: // View All Employees
          viewAllEmployees();
          break;
        case choices[3]: // Add A Department
          addDepartment();
          break;
        case choices[4]: // Add A Role
          addRole();
          break;
        case choices[5]: // Add An Employee
          addEmployee();
          break;
        case choices[6]: // Update An Employee Role
          updateEmployeeRole();
          break;
        default: // Exit
          console.log('Exiting default...');
          connection.end(); // resolve remaining queries and disconnect from mysql
          process.exit(); // exit the node js program
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log(`Error: Prompt couldn't be rendered in the current environment`);
      } else {
        console.log(`Error: ${error}`);
        process.exit(); // exit the node js program
      }
    })
}

const viewAllDepartments = async () => {
  try {
    const departmentSelect = "SELECT * FROM department ORDER BY id;";
    const [departments] = await connection.query(departmentSelect);
    console.log(`
    
    $$$$ All Departments $$$$
    `);
    console.table(departments);
    init();
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(); // exit the node js program
  }
};

const viewAllRoles = async () => {
  try {
    const rolesSelect = `SELECT r.id,
                          r.title AS 'job title',
                          d.name AS department,
                          r.salary
                        FROM role r
                        LEFT JOIN department d 
                        ON r.department_id = d.id;`;
    const [roles] = await connection.query(rolesSelect);
    console.log(`
    
    $$$$ All Roles $$$$
    `);
    console.table(roles);
    init();
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(); // exit the node js program
  }
};

const viewAllEmployees = async () => {
  try {
    const employeeSelect = `SELECT e.id,
                              e.first_name, 
                              e.last_name, 
                              r.title AS 'job title',
                              d.name AS department,
                              r.salary AS salary,
                              CONCAT (m.first_name, " ", m.last_name) AS manager
                            FROM employee e
                            LEFT JOIN role r ON e.role_id = r.id 
                            LEFT JOIN department d ON r.department_id = d.id
                            LEFT JOIN employee m ON e.manager_id = m.id;`;
    const [employees] = await connection.query(employeeSelect);
    console.log(`
    
    $$$$ All Employees $$$$
    `);
    console.table(employees);
    init();
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(); // exit the node js program
  }
};

const addDepartment = () => {
  inquirer
    .prompt([{
      type: 'input',
      name: 'newDepartmentName',
      message: "What is the name of the new department?",
    }])
    .then(async (response) => {
      try {
        const departmentInsert = 'INSERT INTO department(name) VALUES(?);';
        await connection.query(departmentInsert, [response.newDepartmentName]);
        console.log(`
        ${response.newDepartmentName} was added successfully.`);
        viewAllDepartments();
      } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(); // exit the node js program
      }
    });
};

const getDepartments = async () => {
  try {
    const departmentSelect = 'SELECT name, id FROM department;';
    let [departments] = await connection.query(departmentSelect);
    departments = departments.map(({
      name,
      id
    }) => ({
      name,
      value: id
    }));
    return departments;
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(); // exit the node js program
  }
};

const addRole = () => {
  inquirer
    .prompt([{
        type: 'input',
        name: 'newRoleName',
        message: 'What is the name of the new role?',
      },
      {
        type: 'input',
        name: 'salaryAmount',
        message: 'What is the salary for this role?',
      },
      {
        type: 'list',
        message: 'Which department does the role belong to?',
        name: 'department',
        choices: getDepartments,
      },
    ]).then(async (response) => {
      try {
        const roleData = [response.newRoleName, Number(response.salaryAmount), response.department];
        const roleInsert = `INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?);`;
        await connection.query(roleInsert, roleData);
        console.log(`
        ${response.newRoleName} was added successfully.`);
        viewAllRoles();
      } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(); // exit the node js program
      }
    })
};

const getRoles = async () => {
  try {
    const rolesSelect = `SELECT title, id FROM role;`;
    let [roles] = await connection.query(rolesSelect);
    roles = roles.map(({
      title,
      id
    }) => ({
      name: title,
      value: id
    }));
    return roles;
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(); // exit the node js program
  }
};

const getManagers = async () => {
  try {
    const managersSelect = `SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employee;`;
    let [managers] = await connection.query(managersSelect);
    managers = managers.map(({
      name,
      id
    }) => ({
      name,
      value: id
    }));
    return managers;
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(); // exit the node js program
  }
};

const addEmployee = () => {
  inquirer
    .prompt([{
        type: 'input',
        name: 'first_name',
        message: `Please enter the new employee's first name:`,
      },
      {
        type: 'input',
        name: 'last_name',
        message: `Please enter the new employee's last name:`,
      },
      {
        type: 'list',
        name: 'role',
        message: `What is the new employee's role?`,
        choices: getRoles,
      },
      {
        type: 'list',
        name: 'manager',
        message: `Who is the new employee's manager?`,
        choices: getManagers,
      },
    ]).then(async (response) => {
      try {
        const employeeData = [response.first_name, response.last_name, response.role, response.manager];
        const employeeInsert = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);`;
        await connection.query(employeeInsert, employeeData);
        console.log(`
        ${response.first_name} ${response.last_name} was added successfully.`);
        viewAllEmployees();
      } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(); // exit the node js program
      }
    })
};

const getEmployees = async () => {
  try {
    const employeesSelect = `SELECT e.id, CONCAT(e.first_name, " ", e.last_name, " - ", r.title) AS name
                            FROM employee e
                            LEFT JOIN role r ON e.role_id = r.id;`;
    let [employees] = await connection.query(employeesSelect);
    employees = employees.map(({
      name,
      id
    }) => ({
      name,
      value: id
    }));
    return employees;
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(); // exit the node js program
  }
};

const updateEmployeeRole = async () => {
  inquirer
    .prompt([{
        type: 'list',
        name: 'employee',
        message: `Which employee needs a role update?`,
        choices: getEmployees,
      },
      {
        type: 'list',
        name: 'newRole',
        message: `What should the new employee's role be?`,
        choices: getRoles,
      },
    ]).then(async (response) => {
      try {
        const employeeRoleData = [response.newRole, response.employee];
        const employeeRoleUpdate = 'UPDATE employee SET role_id = ? WHERE id = ?;';
        connection.query(employeeRoleUpdate, employeeRoleData);
        console.log(`
        Employee's role was updated successfully.`);
        viewAllEmployees();
      } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(); // exit the node js program
      }
    })
};

init();
