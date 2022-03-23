// Uses the Inquirer package.
// Uses the MySQL2 package to connect to a MySQL database.
// Uses the console.table package to print MySQL rows to the console.
// Uses the Dotenv package to load environmental variables from a .env file into process.env. 
require('dotenv').config();
const inquirer = require('inquirer');
const connection = require('./config');
const consoleTable = require('console.table');

const choices = [
  'View All Departments',
  'View All Roles',
  'View All Employees',
  'Add A Department',
  'Add A Role',
  'Add An Employee',
  'Update An Employee Role',
  'Exit'
];

// TODO: convert to async function
const init = () => {
  inquirer
    .prompt([{
      type: 'list',
      message: 'Which option would you like?',
      name: 'choice',
      choices: choices
    }]).then(async(response) => {
      const userChoice = response.choice;
      switch (userChoice) {
        case choices[7]: // User wishes to exit
          console.log('Exiting...');
          connection.end(); // resolve remaining queries and disconnect from mysql
          process.exit(); // exit the node js program
        case choices[0]: // View All Departments
          // something
          console.log('View All Departments');
          break;
        case choices[1]: // View All Roles
          // something
          console.log('View All Roles');
          break;
        case choices[2]: // View All Employees
          // something
          console.log('View All Employees');
          break;
        case choices[3]: // Add A Department
          // something
          console.log('Add A Department');
          break;
        case choices[4]: // Add A Role
          // something
          console.log('Add A Role');
          break;
        case choices[5]: // Add An Employee
          // something
          console.log('Add An Employee');
          break;
        case choices[6]: // Update An Employee Role
          // something
          console.log('Update An Employee Role');
          break;
        default: // Exit
          console.log('Exiting default...');
          connection.end(); // resolve remaining queries and disconnect from mysql
          process.exit(); // exit the node js program
      }
    })
}

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
init();
