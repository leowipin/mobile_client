import { Component, OnInit, Inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClienteWAService } from '../login-registro/login-registro.service';
import { SignIn } from '../interfaces/client/signin';
import { ModalController, NavParams} from '@ionic/angular';
import { ClientEmail } from '../interfaces/client/clientEmail';
import { ResetPasswordToken } from '../interfaces/client/resetPasswordToken';
import { UserDataService } from '../login-registro/userDataService';
import { NotificationsService } from '../login-registro/notifiactionsService';
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
    this.navCtrl.navigateRoot('/tabs/inicio');
  }
  
  togglePasswordClick() {
    this.showPassword = !this.showPassword;
  }


  guestSignIn(){
    const data: SignIn = {
      email: 'invitado@seproamerica.ec',
      password: 'invitado',
    }
    this.clienteWAService.signin(data).subscribe({
      next: (response) => {
        this.photo = 'assets/img/backcliente.png';
        this.userDataService.updatePhoto(this.photo);
        this.redirigirServicios()
        this.userDataService.updateNombreur('Invitado');
        },
      error: (error) => {
        this.alertController.create({
          message: "Error al ingresar como invitado",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });

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

  async recoveryPassword() {
    this.navCtrl.navigateForward("/recuperar-password")
    /*const modal = await this.modalController.create({
      component: MyModalComponent,
      componentProps: { value: 123 }
    });
    return await modal.present();*/
  }

  
}

