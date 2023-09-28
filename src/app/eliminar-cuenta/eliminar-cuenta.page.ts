import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-eliminar-cuenta',
  templateUrl: './eliminar-cuenta.page.html',
  styleUrls: ['./eliminar-cuenta.page.scss'],
})
export class EliminarCuentaPage implements OnInit {

  deleteAccountForm: FormGroup;
  showPassword = false;
  password:string;

  constructor(public formBuilder: FormBuilder, private clienteWAService: ClienteWAService, private alertController: AlertController, 
    private navCtrl: NavController) { }

  ngOnInit() {
    this.deleteAccountForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  submitForm(){
    if (!this.deleteAccountForm.valid) {  
      return false;
    } else {
      this.confirmDeleteAccount();
    }
  }

  confirmDeleteAccount(){
    this.alertController.create({
      header: 'Eliminar cuenta',
      message: '¿Está seguro que desea eliminar su cuenta?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteAccount();
          }
        }
      ]
    }).then(alert => alert.present());
  }

  deleteAccount(){
    const token = localStorage.getItem('token');
    this.password = this.deleteAccountForm.value.password;
    console.log(this.password);
    this.clienteWAService.deleteAccount(this.password, token).subscribe({
      next: (response) => {
        this.alertController.create({
          header: 'Eliminar cuenta',
          message: 'Cuenta eliminada exitosamente',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              localStorage.removeItem('token');
              localStorage.removeItem('guest');
              localStorage.removeItem('firebase_token');
              this.navCtrl.navigateRoot('/login');
            }
          }]
        }).then(alert=> alert.present())
      },
      error: (error) => {
        this.alertController.create({
          header: 'Eliminar cuenta',
          message: 'La cuenta no pudo ser eliminada',
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
