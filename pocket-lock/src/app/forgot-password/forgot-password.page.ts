import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
//import * as firebase from 'firebase';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PasswordConditionService } from '../services/password-condition.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  // User object
  user = {
    id: '',
    email: '',
    account: false,
    pin: false,
    securityQuestion: '',
    securityAnswer: '',
    newPIN: {
      defaultPin: '',
      newPIN: '',
      confirmPIN: '',
    },
  };

  account: SafeHtml;
  pin: String;

  constructor(
    public ngFireAuth: AngularFireAuth,
    private menu: MenuController,
    private database: DatabaseService,
    private password: PasswordConditionService
  ) {}

  ngOnInit() { // blocks html 
    document.getElementById('account').style.display = 'none';
    document.getElementById('PIN').style.display = 'none';
  }
  async sendEmail() { // this function send email with new password 
    await this.database
      .getSecurityAnswer(parseInt(this.user.id), this.user.securityAnswer)
      .then(async (res) => {
        console.log(res);
        if (res == true) {
          let email = this.user.email;
          const user = await this.ngFireAuth
            .sendPasswordResetEmail(this.user.email)
            .then(function () {
              alert(`Email Has Been Sent to: ${email}`);
            })
            .catch(function () {
              alert(`Email Has Been Sent to: ${email}`);
            });
        } else {
          alert('Your Answer Is Not Correct!');
        }
      });
  }

  checkBox() { // this function makes sure that not both check boxes can be selected at the same time.
    if (this.user.account == true) {
      this.user.account = false;
    } else if (this.user.pin == true) {
      this.user.pin = false;
    }
  }

  getQuestion(question) { // function that uses keywords from the data base to find question using a switch statement
    switch (question) {
      case 'food':
        this.user.securityQuestion = 'What Is Your Favorite Food?';
        break;

      case 'animal':
        this.user.securityQuestion = 'What Is Your Favorite Animal?';
        break;

      case 'restaurant':
        this.user.securityQuestion = 'What Is Your Favorite Restaurant?';
        break;

      case 'country':
        this.user.securityQuestion = 'What Is Your Favorite Country?';
        break;

      case 'movie':
        this.user.securityQuestion = 'What Is Your Favorite Movie?';
        break;
    }
  }
  async getInfo() { /**  this function gets information about the user and the displays either 
                          HTML for the account password or the PIN option**/
    if (this.user.email == '') {
      alert('Please Enter Your Email Address!');
    }

    if (this.user.account == true) {
      document.getElementById('PIN').style.display = 'none';
      this.pin = '';

      await this.database.getID(this.user.email).then(async (id) => {
        this.user.id = '';
        if (id == 1) {
          this.user.id += id;

          await this.database.getSecurityQuestion(id).then((answer) => {
            this.getQuestion(answer);

            this.account = this.user.securityQuestion;
            document.getElementById('account').style.display = 'block';
          });
        } else {
          alert('This Email Address Does Not Exist!');
        }
      });
    } else if (this.user.pin == true) {
      this.account = '';
      await this.database.getID(this.user.email).then(async (id) => {
        this.user.id = '';
        this.user.id += id;
        document.getElementById('account').style.display = 'none';
      });
      document.getElementById('PIN').style.display = 'block';
    }
  }

  async updatePIN() { // This section allows the user to update the forgotten PIN
    let newPin = parseInt(this.user.newPIN.newPIN);
    let confirmPIN = parseInt(this.user.newPIN.confirmPIN);
    let defultPin = parseInt(this.user.newPIN.defaultPin);

    if (this.password.checkLockCombination(newPin, confirmPIN)) {
      await this.database.getDefaultPW(defultPin).then(async (res) => {
        if (res) {
          console.log("here");
          await this.database.updatePswrd(parseInt(this.user.id), newPin);
          alert("Your PIN has been changed!")
        } else {
          alert('Please Make Sure You Have The Right Default PIN!');
        }
      });
    } else {
      alert('Please Select One Option!');
    }
  }

  openMenu() { // side menu 
    this.menu.enable(true, 'fPswrd');
    this.menu.open('pin');
  }
}
