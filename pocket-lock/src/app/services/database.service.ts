import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject} from 'rxjs';
import { Router } from '@angular/router';
import { MQTTService } from './mqtt.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private router: Router,
    private mqtt: MQTTService,
    private platform: Platform,
    private sqlite: SQLite,
  ) {

   
    this.platform.ready().then(() => { // if platform is ready the continue else wait.
      // this.sqlite is responsible for creating the database during the installation of the application.
      this.sqlite
        .create({
          name: 'LDB',
          location: 'default',
        })
        .then((LDB: SQLiteObject) => {
          this.database = LDB;
        })
        .then(() => {
          // calls all functions that are responsible for creating tables.
          this.createLockDefaultTable();
          this.createUserTable();
          this.createUsersLockCombinationTable();
          this.setLockDefaultPassword();
          this.createUserSecurityQuestion();
        });
    });
  }


  ngOnInit() {}

  // creates an observer for the database.
  getDatabaseState() {
    return this.dbReady.asObservable();
  }
//This function creates a table the stores the lock default password
  createLockDefaultTable() {
    let query = `CREATE TABLE IF NOT EXISTS lock (pw INTEGER);`;
    this.database
      .executeSql(query, [])
      .then(() => {
        console.log('creating table');
      })
      .catch((e) => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  // This functions creates the user table.
  createUserTable() {
    let query = `CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,userName TEXT NOT NULL,email TEXT NOT NULL UNIQUE);`;

    this.database
      .executeSql(query, [])
      .then(() => {
      })
      .catch((e) => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  // This functions creates the table for the users security questions.
  createUserSecurityQuestion() {
    let query = `CREATE TABLE IF NOT EXISTS securityQ (userID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,email TEXT NOT NULL,question TEXT NOT NULL, answer TEXT NOT NULL);`;

    this.database
      .executeSql(query, [])
      .then(() => {
        //  console.log("creating table");
      })
      .catch((e) => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  // this functions creates a table for users lock PIN
  createUsersLockCombinationTable() {
    this.database
      .executeSql(
        `
    CREATE TABLE IF NOT EXISTS usersPaswrd (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,userID INTEGER NOT NULL UNIQUE,paswrd INTEGER NOT NULL);
    `,
        []
      )
      .then(() => {
        console.log('creating table');
      })
      .catch((e) => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  // This functions adds a user to the user table.
  addUsers(userName, email) {
    let query = `INSERT or IGNORE INTO users (userName,email) VALUES ("${userName}","${email}");`;

    this.database
      .executeSql(query, [])
      .then(() => {})
      .catch((e) => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  // this functions updates the user account password.
  updatePswrd(id, newPswrd) {
    console.log('PSWD: ' + newPswrd);
    let query = `UPDATE usersPaswrd SET paswrd = ${newPswrd} WHERE userID = ${id};`;
    this.database
      .executeSql(query, [])
      .then((res) => {})
      .catch((e) => {
        console.log(JSON.stringify(e));
      });
  }

  // This function adds a new PIN for the user.
  addUsersLockCombination(email, pswrd) {
    let id = 0;
    let query1 = `SELECT id FROM users WHERE email = "${email}";`;

    this.database
      .executeSql(query1, [])
      .then((res) => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            id = JSON.parse(res.rows.item(i).id);
          }
        }

        let query2 = `INSERT or IGNORE INTO usersPaswrd (userID,paswrd) VALUES (${id},${pswrd});`;
        return this.database
          .executeSql(query2, [])
          .then(() => {})
          .catch((e) => {
            console.log('error ' + JSON.stringify(e));
          });
      })
      .catch((err) => {
        alert('no users');
        console.log(JSON.stringify(err));
      });
  }

  // This function stores the security question.
  addSecurityQuestion(userID, email, question, answer) {
    let query = `INSERT or IGNORE INTO securityQ (userID,email,question,answer) VALUES (${userID},"${email}","${question}","${answer}");`;
    this.database
      .executeSql(query, [])
      .then(() => {})
      .catch((e) => {
        alert('error ' + JSON.stringify(e));
      });
  }

  // This functions hard codes the lock default PIN
  setLockDefaultPassword() {
    // This function hardcodes the lock default password into the database
    let query = `INSERT or IGNORE INTO lock (pw) VALUES (${2845});`;
    this.database
      .executeSql(query, [])
      .then(() => {})
      .catch((e) => {
        alert('error ' + JSON.stringify(e));
      });
  }

  // This function gets the user ID
  getID(email) {
    let query = `SELECT id FROM users WHERE email = "${email}"`;
    let id = 0;
    return this.database
      .executeSql(query, [])
      .then((res) => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            id = JSON.parse(res.rows.item(i).id);
          }
        }

        return id;
      })
      .catch((err) => {
        alert('no users');
        console.log(JSON.stringify(err));
      });
  }

  //
  getDefaultLockPW(pw) {
    //This function checks if the default lock password exist in the database
    let getPW;
    let query = `SELECT * FROM lock WHERE pw = ${pw}`;
    return this.database
      .executeSql(query, [])
      .then((res) => {
        getPW = JSON.parse(res.rows.item(0).pw);
        if (pw == getPW) {
          this.router.navigate(['/register']);
        } else {
          console.log('no pass');
          alert('This PIN Does Not Exist');
        }
      })
      .catch((err) => {
        alert('This PIN Does Not Exist');
        console.log(JSON.stringify(err));
      });
  }

  // this function calls the database to check if the PIN combination is correct
  getUserLockCombination(id, passwrd) {
    let userPW;
    let query = `SELECT paswrd FROM usersPaswrd WHERE userID = ${id} AND paswrd = ${passwrd}`;
    return this.database
      .executeSql(query, [])
      .then((res) => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            userPW = res.rows.item(i).paswrd;
          }
        }
        if (userPW == passwrd) {
          this.mqtt.sendMessageToMQTT();
        } else {
          alert('Wrong PIN');
        }
      })
      .catch((err) => {
        alert('This PIN Does Not Exist');
        console.log(JSON.stringify(err));
      });
  }

  // This function get the old PIN code from the user when updating.
  getPW(id, pw) {
    let results = 0;
    let userPW = 0;
    let query = `SELECT paswrd FROM usersPaswrd WHERE userID = ${id} AND paswrd = ${pw}`;
    return this.database
      .executeSql(query, [])
      .then((res) => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            userPW = res.rows.item(i).paswrd;
          }
        }
        if (userPW == pw) {
          alert('PIN Has Been Updated');
          results = 1;
        } else {
          alert('Old Pin Does Not Exist');
          results = 0;
        }
        return results;
      })
      .catch((err) => {
        alert('This PIN Does Not Exist');
        console.log(JSON.stringify(err));
      });
  }

  // This function calls the database to find the answer to the user security question
  getSecurityAnswer(userID, userAnwer: String) {
    let answer = '';
    let query = `SELECT answer FROM securityQ WHERE userID = ${userID} `;
    return this.database
      .executeSql(query, [])
      .then((res) => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            answer = res.rows.item(i).answer;
          }
        }

        if (answer.toLowerCase() == userAnwer.toLocaleLowerCase()) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        alert(err);
        console.log(JSON.stringify(err));
      });
  }

  // this function calls the database to find the users security question.
  getSecurityQuestion(userID) {
    let question = '';
    let query = `SELECT question FROM securityQ WHERE userID = ${userID} `;
    return this.database
      .executeSql(query, [])
      .then((res) => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            question = res.rows.item(i).question;
          }
        }
        return question;
      })
      .catch((err) => {
        alert(err);
        console.log(JSON.stringify(err));
      });
  }
// this function calls the data base to check if the default password is correct
  getDefaultPW(defaultPW){
    let pw = 0;
    let query = `SELECT * FROM lock`
    return this.database.executeSql(query,[]).then((res=>{
      pw = JSON.parse(res.rows.item(0).pw)
      if(defaultPW == pw){
          return true;
      }else {
        alert("Incorrect Default PIN");
        return false
      }
    })).catch((e=>{
        alert(e);
    }))
  }

  /************************************test functions************************************/
  getAllSecurityQuestions() {
  
    let query = 'SELECT * FROM securityQ;';
    return this.database
      .executeSql(query, [])
      .then((res) => {
        if (res.rows.length > 0) {
          console.log('------------------------------');
          console.log('Sequrity Questions');
          for (var i = 0; i < res.rows.length; i++) {
            console.log(res.rows.item(i));
          }
        }
        console.log('------------------------------');
      })
      .catch((err) => {
        alert('no users');
        console.log(JSON.stringify(err));
      });
  }

  getAllUsers() {

    let getUser = '';
    let query = `SELECT * FROM users`;

    return this.database
      .executeSql(query, [])
      .then((res) => {
        if (res.rows.length > 0) {
          console.log('------------------------------');
          console.log('Users');
          for (var i = 0; i < res.rows.length; i++) {
            console.log(res.rows.item(i));
          }
        }
        console.log('------------------------------');
      })
      .catch((err) => {
        alert('no users');
        console.log(JSON.stringify(err));
      });
  }

  getAllUserPasswords() {
   
    let getUser = '';
    let query = `SELECT * FROM usersPaswrd;`;

    return this.database
      .executeSql(query, [])
      .then((res) => {
        
        if (res.rows.length > 0) {
          console.log('------------------------------');
        console.log('User Lock Combinations');
          for (var i = 0; i < res.rows.length; i++) {
            console.log(res.rows.item(i));
          }
        }
        console.log('------------------------------');
      })
      .catch((err) => {
        alert('no users');
        console.log(JSON.stringify(err));
      });
  }

  getLockDefaultPW() {
   
    let getUser = '';
    let query = `SELECT * FROM lock;`;

    return this.database
      .executeSql(query, [])
      .then((res) => {
        console.log('------------------------------');
        console.log('Default Lock Password');
            console.log(res.rows.item(0));
          
        
        console.log('------------------------------');
      })
      .catch((err) => {
        alert('no users');
        console.log(JSON.stringify(err));
      });
  }
}
