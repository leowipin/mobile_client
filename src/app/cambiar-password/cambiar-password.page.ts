import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientNewPassword } from '../interfaces/client/clientNewPassword';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
})
export class CambiarPasswordPage implements OnInit {

  changePasswordForm: FormGroup;
  showPassword = false;
  showNewPassword = false;
  email:string;
  newPassword:string;
  password:string;

  constructor(private modalController: ModalController, private clienteWAService: ClienteWAService, private alertController: AlertController,public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  submitForm(){
    if (!this.changePasswordForm.valid) {  
      return false;
    } else {
      this.changePassword()
    }
  }

  changePassword(){
    const data: ClientNewPassword = {
      password:this.changePasswordForm.value.password,
      new_password:this.changePasswordForm.value.newPassword,
    }
    const token = localStorage.getItem('token');
    this.clienteWAService.sendNewPasswordEmail(data, token).subscribe({
      next: (response) => {
        this.alertController.create({
          header: 'Envio email',
          message: response.message,
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      },
      error: (error) => {
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          header: 'Error email',
          message: error.error[keyError],
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }


}
