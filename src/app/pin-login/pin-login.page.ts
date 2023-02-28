import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: 'app-pin-login',
  templateUrl: './pin-login.page.html',
  styleUrls: ['./pin-login.page.scss'],
})
export class PinLoginPage implements OnInit {

  ionicForm: FormGroup;
  
  isSubmitted = false;
  constructor(private navCtrl: NavController, public formBuilder: FormBuilder, public alertController: AlertController) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{4}$') ]],
    })
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
  
      return false;
    } else {
      console.log(this.ionicForm.value)
        this.redirigir()
      
    }
    
  }
  
  redirigir(){
    this.navCtrl.navigateForward("/registrar");
    this.ionicForm.reset()
  }


}
