import { Component, OnInit } from '@angular/core';
import { PasswordConditionService } from '../services/password-condition.service';
import * as firebase from 'firebase';
import { DatabaseService } from '../services/database.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  // user object
  user = {
    password: '',
    oldPassword: '',
    confirmPassword: '',
    lock: {
      oldPIN: '',
      newPIN: '',
      confirmLockPIN: '',
    },
  };

  constructor(
    private pswrdCondition: PasswordConditionService,
    private database: DatabaseService,
    public ngFireAuth: AngularFireAuth,
    private menu: MenuController
  ) {}

  ngOnInit() {}

  async changeLockCombination() { // this function updates the PIN combination.
    let oldPIN = parseInt(this.user.lock.oldPIN);
    let newPIN = parseInt(this.user.lock.newPIN);
    let ConfPIN = parseInt(this.user.lock.confirmLockPIN);

    if (
      this.pswrdCondition.checkLockCombination(newPIN, ConfPIN) &&
      this.user.lock.oldPIN.length > 1
    ) {
      await this.database
        .getID(firebase.auth().currentUser.email)
        .then((id) => {
          this.database.getPW(id, oldPIN).then((res) => {
            if (res == 1) {
              this.database.updatePswrd(id, newPIN);
            } else {
              alert('Please Check if Your PIN Is Correct');
            }
          });
        });
    } else {
      alert('Old Pin Does Not Exist!');
    }
    this.changePinFields();
  }

  async changeAccountPassword() { // this Function updates the user password
    if (
      this.pswrdCondition.checkPasswords(
        this.user.password,
        this.user.confirmPassword
      )
    ) {
      firebase // uses firebase to update password.
        .auth()
        .currentUser.updatePassword(this.user.password)
        .then((res) => {
          alert('Password Updated!');
        })
        .catch((err) => {
          alert(err);
        });
    }
    this.changePasswordFields();
  }

  changePinFields() {
    this.user.lock.confirmLockPIN = '';
    this.user.lock.oldPIN = '';
    this.user.lock.newPIN = '';
  }
  changePasswordFields() {
    this.user.password = '';
    this.user.confirmPassword = '';
    this.user.oldPassword = '';
  }
  openMenu() { // side menu
    this.menu.enable(true, 'settings');
    this.menu.open('settings');
  }
}
