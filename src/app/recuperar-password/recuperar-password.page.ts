import { Component, OnInit } from '@angular/core';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClientEmail } from '../interfaces/client/clientEmail';
import { ResetPasswordToken } from '../interfaces/client/resetPasswordToken';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage implements OnInit {

  sendEmailForm: FormGroup;
  resetPasswordForm: FormGroup;
  showPassword = false;
  email:string;
  token:string;
  password:string;

  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController,public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.sendEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
    });
    this.resetPasswordForm = this.formBuilder.group({
      token: ['', [Validators.required, Validators.pattern(/^\w{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  submitForm() {
    if (!this.sendEmailForm.valid) {  
      return false;
    } else {
      this.sendResetPasswordEmail()
    }
    
  }

  submitForm2(){
    if (!this.resetPasswordForm.valid) {  
      return false;
    } else {
      this.changePassword()
    }
  }

  sendResetPasswordEmail(){
    const data: ClientEmail = {
      email: this.sendEmailForm.value.email,
    }
    this.clienteWAService.sendResetPasswordEmail(data).subscribe({
      next: (response) => {
        this.alertController.create({
          header: 'Restablecimiento',
          message: response.message,
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
        },
      error: (error) => {
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          header: 'Restablecimiento',
          message: error.error[keyError],
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });

  }

  changePassword(){
    const data: ResetPasswordToken = {
      token: this.resetPasswordForm.value.token,
      password: this.resetPasswordForm.value.password
    }
    this.clienteWAService.changePassword(data).subscribe({
      next: (response) =>{
        this.alertController.create({
          header: 'Restablecimiento',
          message: response.message,
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      },
      error: (error) =>{
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          header: 'Restablecimiento',
          message: error.error[keyError],
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


}
