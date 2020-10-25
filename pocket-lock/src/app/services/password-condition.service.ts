import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordConditionService {

  constructor() { }

  getReg(){
    // returns letters from A to Z
    var passwordCondition = new RegExp("[A-Z]+");
    return passwordCondition;
  }


  checkPasswords(password,confirmPassword){ // This function checks if the password is strong
   let passwordCondition = this.getReg();
    if(password.length < 6){
    alert("Please select a password with at least 6 characters.")  
    }
    else if(password!= confirmPassword){
      alert("Password and Confirm Password do not match!");

    }else if (passwordCondition.test(password) == true) {
      
      passwordCondition = new RegExp("[0-9]+");

      if(passwordCondition.test(password) == true) {

          passwordCondition = new RegExp("[a-z]+");
          if(passwordCondition.test(password) == true) {
            passwordCondition = new RegExp("[!-\/:-@[-`{-~]+");
            if(passwordCondition.test(password) == true){

            }else{alert("Please add one symbol to your password!"); 
            return false;
           }
           
          } else { alert("Please add one lowercase letter!");
          return false;
        }

      } else {alert(alert("Please add one number to your password!"));
      return false;
    }
  } else if(password.length == 0 || confirmPassword.length == 0){
    alert ("Please fill in both password fields!")
    return false;

  }else {alert("Please add one uppercase letter!");} 
  return true;
    }


    checkLockCombination(lockCombination,confirmLockCombination){
      // This function checks if PIN combination is strong.
      let passToString =  lockCombination.toString();

      if(passToString.length != 4){
        alert("The lock combination should be 4 digits!");
        return false;
        }
      else if(lockCombination != confirmLockCombination){
        alert("Combinations do not match!");
        return false;

      }else if(isNaN(lockCombination)){
        alert("Please only use numbers for the lock combination ");
        return false;

      }else if( this.weakCombinations(lockCombination))
      {  alert("Please select a stronger lock combinations")
        return false;
      }else{
        return true;
      }
    }

    checkEmail(email){
      if(email.includes("@") && email.includes(".")){
        return true;
      }else{
        alert("Please insert a valid email address")
        return false;
        
      }
    }
    weakCombinations(lockCombination){ // This functions is called to check if any easy PIN combination is being picked.
      
        let weekCombinations = {
          numberArray: [1111,
                        2222,
                        3333,
                        4444,
                        5555,
                        6666,
                        7777,
                        8888,
                        9999,
                        1234,
                        4321,
                        0o000,
                      
                      ]
                    } 
        
       for(let i =0; i< weekCombinations.numberArray.length; i++){
         if(lockCombination == weekCombinations.numberArray[i] ){
           return true
         }
       }
       return false;
    }
  
    checkSecurityQuestion(qusetion,answer){
          if(qusetion == null || qusetion == "undefined" || qusetion.lenght == 0){
            alert("Please Select A Security Question!");
            return false
          }else if(answer== null || answer== "undefined" || answer.lenght == 0){
            alert("Make Sure You Have Selected a Security Question!");
            return false;
          }else{
            return true;
          }
    }

}

