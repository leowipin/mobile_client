import { Component, OnInit, Inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AuthService } from '../servicios/login-registro/auth.service';
import { SignIn } from '../interfaces/client/signin';
import { ModalController, NavParams} from '@ionic/angular';
import { ResetPasswordEmail } from '../interfaces/client/resetPassword';
import { ResetPasswordToken } from '../interfaces/client/resetPasswordToken';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false;

  ionicForm: FormGroup;
  
  isSubmitted = false;


  constructor(private navCtrl: NavController, 
    public formBuilder: FormBuilder, 
    private alertController: AlertController,
    private clienteWAService: ClienteWAService,
    public authService:AuthService,
    public modalController: ModalController
    ) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      email: ['', [Validators.required,  Validators.email]],
    })
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {  
      return false;
    } else {
      this.signIn()
      
    }
  }

  redirigir_home(){
    this.navCtrl.navigateForward("/servicios");
    this.ionicForm.reset();
  }

  redirigirRegistrar() {
    this.navCtrl.navigateForward('/registrar');
    this.ionicForm.reset();
  }
  
  redirigirServicios() {
    this.navCtrl.navigateForward('/servicios');
    this.ionicForm.reset();
  }
  
  togglePasswordClick() {
    this.showPassword = !this.showPassword;
  }



  signIn(): void{
    const data: SignIn = {
      email: this.ionicForm.value.email,
      password: this.ionicForm.value.password,
    }
    
    this.clienteWAService.signin(data).subscribe({
      next: (response) => {
        this.alertController.create({
          message:"Inicio de sesion exitoso",
          buttons: ['Dismiss']
        }).then(alert=> alert.present())
        this.redirigir_home()
        },
      error: (error) => {
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          message: error.error[keyError],
          buttons: ['Dismiss']
        }).then(alert=> alert.present())
      }
    });
    
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: MyModalComponent,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  
}

@Component({
  selector: 'my-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Restablecimiento
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="item-datos">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Ingresa tu correo</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>Te llegará un correo de restablecimiento de contraseña con un token adjunto el cual debes de usar para cambiar tu contraseña.</p>
          <ion-item>
            <ion-label position="floating">Correo electrónico</ion-label>
            <ion-input type="email" [(ngModel)]="email"></ion-input>
          </ion-item>
          <ion-button expand="block" (click)="sendResetPasswordEmail()">Enviar</ion-button>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Cambia tu contraseña</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Token</ion-label>
            <ion-input type="text" [(ngModel)]="token"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Nueva contraseña</ion-label>
            <ion-input type="{{showPassword ? 'text' : 'password'}}" [(ngModel)]="password"></ion-input>
            <ion-icon slot="end" [name]="showPassword ? 'eye-outline' : 'eye-off-outline'" (click)="togglePassword()"></ion-icon>
          </ion-item>
          <ion-button expand="block" (click)="changePassword()">Cambiar</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styleUrls: ['./my-modal.scss']
})
export class MyModalComponent {
  email: string;
  password:string;
  token:string;
  showPassword: boolean = false;

  constructor(private modalController: ModalController, private clienteWAService: ClienteWAService, private alertController: AlertController) {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  sendResetPasswordEmail(){
    const data: ResetPasswordEmail = {
      email: this.email,
    }
    
    this.clienteWAService.sendResetPasswordEmail(data).subscribe({
      next: (response) => {
        this.alertController.create({
          message: response.message,
          buttons: ['Ok']
        }).then(alert=> alert.present())
        //this.redirigir_home()
        },
      error: (error) => {
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          message: error.error[keyError],
          buttons: ['Ok']
        }).then(alert=> alert.present())
      }
    });

  }

  changePassword(){
    const data: ResetPasswordToken = {
      token: this.token,
      password: this.password
    }
    this.clienteWAService.changePassword(data).subscribe({
      next: (response) =>{
        this.alertController.create({
          message: response.message,
          buttons: ['Ok']
        }).then(alert=> alert.present())
      },
      error: (error) =>{
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          message: error.error[keyError],
          buttons: ['Ok']
        }).then(alert=> alert.present())
      }
    })
  }

  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  
}
