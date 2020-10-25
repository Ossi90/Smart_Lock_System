import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MenuController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    public ngFireAuth: AngularFireAuth,
    private menu: MenuController,
  ) {}

  ngOnInit() {}

  async logIn() { // this function calls the Firebase to authenticate the user. 
    try {
      const user = await this.ngFireAuth.signInWithEmailAndPassword(
        this.user.email.trim(),
        this.user.password.trim()
      );
      if (user.user.email && firebase.auth().currentUser.emailVerified) {
        this.home();
      } else {
        alert('Please Verify your account!');
      }
    } catch (err) {
          alert(err);
    }
  }

  home() { // routs the user to the Home Page
    this.router.navigate(['/home']);
  }


  openMenu() { // side menu 
    this.menu.enable(true, 'login');
    this.menu.open('login');
  }
}
