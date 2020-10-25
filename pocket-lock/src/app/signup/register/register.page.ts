import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import {DatabaseService} from "../../services/database.service"
import {PasswordConditionService} from "../../services/password-condition.service";
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
// user object
    user = {
    userName: "",
    email: "",
    password: "",
    confirmPassword : "",
      lock: {
        lockCombination: "",
         confirmLockCombination: ""
      },
     securityQuestion: {
       answer: ""
     }
    }
  
  question: any;

  constructor(
    private pswrdCondition: PasswordConditionService,
    private database: DatabaseService,
    private router: Router, 
    public ngFireAuth: AngularFireAuth,
    private menu: MenuController) { }

  ngOnInit() {
    this.database.getDatabaseState().subscribe();
  }

  async signUp(){ // this function allows the  user to register 
     let lockCom = 0;
    let lockConfirm = 0;
    lockCom = parseInt(this.user.lock.lockCombination);
    lockConfirm = parseInt(this.user.lock.confirmLockCombination);
    if(this.pswrdCondition.checkLockCombination(lockCom,lockConfirm) &&  // this if statement calls the password condition functions
       this.pswrdCondition.checkPasswords(this.user.password,this.user.confirmPassword) && 
       this.pswrdCondition.checkEmail(this.user.email) &&
       this.pswrdCondition.checkSecurityQuestion(this.question,this.user.securityQuestion.answer)){
 
  await this.database.addUsers(this.user.userName, this.user.email); // the data base is called to register data.
  await this.database.addUsersLockCombination(this.user.email, lockCom);
  await this.database.getID(this.user.email).then((id)=>{
    this.database.addSecurityQuestion(id,this.user.email,this.question,this.user.securityQuestion.answer);
  })

  try{ 
    const newUser = await this.ngFireAuth.createUserWithEmailAndPassword(this.user.email,this.user.password); // firebase is used to register authentication 
    
    if(newUser.user.email){
      alert("success!, A confirmation regarding your registration has been sent to your email! Please confirm to be able to login.");
      this.router.navigate(["/login"]);
    }else{
      alert("Sign Up failed!");
    } 
  }
  catch(e){alert(e)}

 try{
   var user = firebase.auth().currentUser; // checks if user is created

  user.sendEmailVerification().then(function() { // sends verification to email
    }).catch(function(error) {
  });

  
}catch{alert("Error has occurred during the registration process")} 
}
}


howToRegesterAccount(){ // instructions on how to create account
alert("Username: You Can Select Any Username\n"+
        "\n"+
      "Email: Please Enter Your Email Address \n"+
      "\n"+
      "Password: \n-At Least Six Characters \n-One Uppercase Letter\n-One Lowercase Letter \n-One Number \n-One Symbol " )
}

howToCreatePIN(){
  alert("Please Make Sure You Choose A Strong PIN\n"+
  "\n"+
         "Example of Weak PINS: 1234, 4321, 1111")
       
  }

  howToCreateSecurityQ(){

    alert("Please Select One Security Question\nMake Sure To Remember Your Answer!")
  }
  openMenu(){
    this.menu.enable(true, "register");
  this.menu.open("register")
  }
}

