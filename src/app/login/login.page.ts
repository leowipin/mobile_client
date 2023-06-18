import { Component, OnInit, Inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { SignIn } from '../interfaces/client/signin';
import { ModalController, NavParams} from '@ionic/angular';
import { ClientEmail } from '../interfaces/client/clientEmail';
import { ResetPasswordToken } from '../interfaces/client/resetPasswordToken';
import { UserDataService } from '../servicios/login-registro/userDataService';
import { NotificationsService } from '../servicios/login-registro/notifiactionsService';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false;

  ionicForm: FormGroup;
  
  isSubmitted = false;

  nombreur:string;
  apellidour:string;
  tokenfcm:string;
  uid:any;
  photo:string;

  constructor(private navCtrl: NavController, 
    public formBuilder: FormBuilder, 
    private alertController: AlertController,
    private clienteWAService: ClienteWAService,
    public modalController: ModalController,
    private userDataService: UserDataService,
    private notificationsService: NotificationsService,
    private storage: AngularFireStorage,
    ) {
      this.userDataService.tokenfcm$.subscribe(tokenfcm => {
        this.tokenfcm = tokenfcm;
      });
     }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required,   Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
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

  /*redirigir_home(){
    this.navCtrl.navigateForward("/servicios");
    this.ionicForm.reset();
  }*/

  redirigirRegistrar() {
    this.navCtrl.navigateForward('/registrar');
    this.ionicForm.reset();
  }
  
  redirigirServicios() {
    this.navCtrl.navigateForward('/servicios-empresa');
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
        this.getProfilePicture();
        const token = localStorage.getItem('token');
        if(this.tokenfcm !== ""){
          this.clienteWAService.registerToken(token, this.tokenfcm).subscribe(
            (response) => {
              console.log(response)
            },
            (error) => {
              console.log(error)
            }
          );
        }
        this.clienteWAService.getNames(token).subscribe(
          (response) => {
            // Actualizar detalles del usuario en el menú de hamburguesas
            this.userDataService.updateNombreur(response.first_name);
            this.userDataService.updateApellidour(response.last_name);
          },
          (error) => {
            // Manejar el error de la solicitud HTTP
            console.log(error);
          }
        );
        this.notificationsService.executeInitFirestoreDocument();
        this.redirigirServicios()
        },
      error: (error) => {
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          message: "Correo o contraseña incorrectos.",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
    
  }

  async getProfilePicture(){
    this.getUid();
    const filePath = `profilePictures/${this.uid}`;
    const fileRef = this.storage.ref(filePath);
    try {
      this.photo = await fileRef.getDownloadURL().toPromise();
      this.userDataService.updatePhoto(this.photo);
    } catch (error) {
      this.photo = 'assets/img/backcliente.png';
      this.userDataService.updatePhoto(this.photo);
    }
  }

  getUid(){
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    this.uid = payload.user_id.toString()
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
    <ion-title>Restablecer</ion-title>
    <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
      </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form [formGroup]="sendEmailForm" (ngSubmit)="submitForm()">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Ingresa tu correo</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>Te llegará un correo de restablecimiento de contraseña con un código adjunto el cual debes de usar para cambiar tu contraseña.</p>
        <ion-item>
          <ion-label position="floating">Correo electrónico</ion-label>
          <ion-input type="email" formControlName="email"></ion-input>
        </ion-item>
        <div *ngIf="sendEmailForm.get('email').invalid && (sendEmailForm.get('email').dirty || sendEmailForm.get('email').touched)" class="error-message">
          <div *ngIf="sendEmailForm.get('email').hasError('required')">Ingrese un correo electrónico</div>
          <div *ngIf="sendEmailForm.get('email').hasError('pattern')">Ingrese un correo electrónico válido</div>
        </div>
        <ion-button expand="block" type="submit" [disabled]="!sendEmailForm.valid">Enviar</ion-button>
      </ion-card-content>
    </ion-card>
  </form>
  <form [formGroup]="resetPasswordForm" (ngSubmit)="submitForm2()">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Cambia tu contraseña</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="floating">Código</ion-label>
          <ion-input type="text" formControlName="token"  maxlength="6"></ion-input>
        </ion-item>
        <div *ngIf="resetPasswordForm.get('token').invalid && (resetPasswordForm.get('token').dirty || resetPasswordForm.get('token').touched)" class="error-message">
          <div *ngIf="resetPasswordForm.get('token').hasError('required')">Ingrese el código</div>
          <div *ngIf="resetPasswordForm.get('token').hasError('pattern')">El código debe contener 6 caracteres alfanuméricos</div>
        </div>
        <ion-item>
          <ion-label position="floating">Nueva contraseña</ion-label>
          <ion-input type="{{showPassword ? 'text' : 'password'}}" formControlName="password" minlength="4"></ion-input>
          <ion-icon slot="end" [name]="showPassword ? 'eye-outline' : 'eye-off-outline'" (click)="togglePassword()"></ion-icon>
        </ion-item>
        <div *ngIf="resetPasswordForm.get('password').invalid && (resetPasswordForm.get('password').dirty || resetPasswordForm.get('password').touched)" class="error-message">
          <div *ngIf="resetPasswordForm.get('password').hasError('required')">Ingrese una contraseña</div>
          <div *ngIf="resetPasswordForm.get('password').hasError('minlength')">La contraseña debe contener mínimo 4 caracteres</div>
        </div>
        <ion-button expand="block" type="submit" [disabled]="!resetPasswordForm.valid">Cambiar</ion-button>
    </ion-card-content>
  </ion-card>
</form>
  `,
  styleUrls: ['./my-modal.scss']
})
export class MyModalComponent {
  sendEmailForm: FormGroup;
  resetPasswordForm: FormGroup;
  showPassword = false;
  email:string;
  token:string;
  password:string;

  constructor(private modalController: ModalController, private clienteWAService: ClienteWAService, private alertController: AlertController,public formBuilder: FormBuilder) {
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

  dismiss() {
    this.modalController.dismiss();
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
          message: response.message,
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
        },
      error: (error) => {
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
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
          message: response.message,
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      },
      error: (error) =>{
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
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
