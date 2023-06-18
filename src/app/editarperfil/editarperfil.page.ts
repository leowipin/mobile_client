import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ModalController } from '@ionic/angular';
import { ProfilePhotoOptionComponent } from '../components/profile-photo-option/profile-photo-option.component';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';

import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import * as moment from 'moment';
import { ClientData } from '../interfaces/client/clientData';
import { ClientEmail } from '../interfaces/client/clientEmail';
import { ClientNewPassword } from '../interfaces/client/clientNewPassword';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UserDataService } from '../servicios/login-registro/userDataService';

@Component({
  selector: 'app-editarperfil',
  templateUrl: './editarperfil.page.html',
  styleUrls: ['./editarperfil.page.scss'],
})
export class EditarperfilPage implements OnInit {

  photo:string;
  

  public validador = true;
  ionicForm: FormGroup;
  defaultDate = "";
  maxFecha: string = (new Date().getFullYear() - 18).toString();
  minFecha: string = (new Date().getFullYear() - 80).toString();
  isSubmitted = false;

  nombreu: null;
  apellidou: null;
  emailu: null;
  fechanacimientou: null;
  celularu: null;
  cedulau: null;
  direccionu: null;
  email: string;

  isProfileInformation: boolean = true;
  orderName:string;
  orderId:any;
  requires_origin_and_destination:string;
  uid:any;

  constructor(private modalController: ModalController, private navCtrl: NavController, public formBuilder: FormBuilder, 
    public alertController: AlertController, private clienteWAService: ClienteWAService, private route: ActivatedRoute,
    private storage: AngularFireStorage, private userDataService: UserDataService,) {

     }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    this.uid = payload.user_id.toString()
    this.route.queryParams.subscribe(params => {
      if(params['isProfileInformation'] != undefined){
        this.isProfileInformation = params['isProfileInformation'] === 'true';
        this.orderName = params['name']
        this.orderId = params['id']
        this.requires_origin_and_destination = params['booleandest']
      }
    });
    console.log(this.isProfileInformation);
    this.initForm();
    this.getClientData();
    this.getProfilePicture();
  }

  getClientData() {
    const token = localStorage.getItem('token');
      
    this.clienteWAService.getClientData(token).subscribe({
      next: (response) => {
        this.ionicForm.patchValue({
          name: response.first_name,
          lastname: response.last_name,
          cedula: response.dni,
          mobile: response.phone_number,
          bday: response.birthdate,
          direccion: response.address,
          gender: response.gender,
          email: response.email,
        });
        this.email = response.email;
        },
      error: (error) => {
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          header: 'Error al mostrar datos',
          message: error.error[keyError],
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

  async modifyData(){
    try {
      const data: ClientData = {
        first_name: this.ionicForm.value.name,
        last_name: this.ionicForm.value.lastname,
        dni: this.ionicForm.value.cedula,
        phone_number: this.ionicForm.value.mobile,
        birthdate: this.ionicForm.value.bday,
        address: this.ionicForm.value.direccion,
        gender: this.ionicForm.value.gender,
        email: this.ionicForm.value.email
      }
      const token = localStorage.getItem('token');
      const response = await this.clienteWAService.modifyClientData(token, data).toPromise();
      // Obtener la imagen de this.photo
      try {
        const photo = this.photo;
        const filePath = `profilePictures/${this.uid}`;
        const fileRef = this.storage.ref(filePath);
        const task = fileRef.putString(photo, 'data_url');
        await task.then();
        console.log(filePath)
        this.clienteWAService.saveProfilePic(token, filePath).subscribe({
          next: (response) => {
          },
          error: (error) => {
          }
        });
      } catch (error) {
        this.presentAlert("Error", "Error al guardar la imagen")
      }
      this.presentAlert('Guardar datos', response.message);
    } catch (error) {
      const keyError = Object.keys(error.error)[0];
      this.presentAlert('Error al guardar', error.error[keyError]);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  initForm() {
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],
      email: ['', !this.isProfileInformation ? [Validators.required, Validators.pattern('[a-z/.0-9_-]+@[a-z0-9]+[.{1}][a-z]{2,}([.{1}][a-z]{2,})?')] : []],
      bday: ['', this.isProfileInformation ? [Validators.required, Validators.pattern('(?:19[0-9]{2}|20[01][0-9]|2020)[-](?:0[1-9]|1[012])[-](?:0[1-9]|[12][0-9]|3[01])')] : []],
      mobile: ['', [Validators.required, Validators.pattern('^09[0-9]{8}$')]],
      cedula: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      gender: ['', this.isProfileInformation ? [Validators.required] : []],
      direccion: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z0-9- .#]*')]],
    });
  }

  ingresoCedula() {
    return this.ionicForm.hasError('CedulaNoValida') && this.ionicForm.get('cedula').dirty;
  }

  async getProfilePicture(){
    const filePath = `profilePictures/${this.uid}`;
    const fileRef = this.storage.ref(filePath);
    try {
      this.photo = await fileRef.getDownloadURL().toPromise();
    } catch (error) {
      this.photo = 'assets/img/perfilcliente.png';
    }
  }

  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.ionicForm.get('fechanacimiento').setValue(date, {
      onlyself: true
    })
  }

  get errorControl() {
    return this.ionicForm.controls;
  }


  submitForm(boton:string) {
    //!this.ionicForm.valid
    console.log(boton)
    if(boton === 'guardar'){
      var today = moment(new Date());
      var test = moment(new Date(this.ionicForm.value.bday)).format("YYYY-MM-DD");
      var difference = today.diff(test, "y") < 18;
      this.isSubmitted = true;
      if (difference) { 
        this.presentUnderAge();
        return false;
      } else if(!this.ionicForm.valid){      
        this.presentAlertIncompleto();
        return false;
      } else {
        this.modifyData()
      }
    } else{
      this.isSubmitted = true;
      if(!this.ionicForm.valid){      
        this.presentAlertPaidProcess();
        return false;
      } else {
        let queryParams = {
          isPaidProcess: true,
          name:this.orderName,
          id:this.orderId,
          booleandest:this.requires_origin_and_destination,
          first_name: this.ionicForm.value.name,
          last_name: this.ionicForm.value.lastname,
          dni: this.ionicForm.value.cedula,
          phone_number: this.ionicForm.value.mobile,
          address: this.ionicForm.value.direccion,
          email: this.ionicForm.value.email
        };
        this.navCtrl.navigateForward(['/metododepago'], { queryParams: queryParams });
      }
    }
    
  }

  async presentUnderAge() {
    const alert = await this.alertController.create({
      header: 'Menor de edad',
      message: 'Para hacer uso de nuestra aplicación y de nuestros servicios debes ser mayor de 18 años',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('ORIGEN');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }


  async presentAlertEditar() {
    const alert = await this.alertController.create({
      header: 'Perfil',
      message: '¿Está seguro de salir?',
      buttons: [
        {
          text: 'Sí',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.finEdicion()
          }
        }, {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async presentAlertGuardar() {
    const alert = await this.alertController.create({
      header: 'Guardar datos',
      message: 'Sus datos han sido guardados correctamente.',
      buttons: [
        {
          text: 'Sí',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Datos guardados!');
          }
        }
      ]
    })
    this.finEdicion();
    ;

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async presentAlertIncompleto() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Guardar datos',
      //subHeader: 'Subtitle',
      message: 'Para que sus datos sean guardados debe completar los campos solicitados correctamente',
      buttons: ['OK']
    });

    await alert.present();

  }

  async presentAlertPaidProcess() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Datos facturación',
      //subHeader: 'Subtitle',
      message: 'Para proceder con el pago debe completar los campos solicitados correctamente',
      buttons: ['OK']
    });

    await alert.present();

  }


  finEdicion() {
    this.navCtrl.navigateForward("/homeperfil", {
      queryParams: {
        datos: this.ionicForm.value, nombreusua: this.nombreu, apellidousua: this.apellidou,
        emailusua: this.emailu, fechanacimientousua: this.fechanacimientou, celularusua: this.celularu, cedulausua: this.cedulau,
        direccionusua: this.direccionu, perfil: this.photo
      }
    });

    this.ionicForm.reset()
  }

  backToOrder() {
    let queryParams = {
      id: this.orderId,
      name: this.orderName,
      booleandest: this.requires_origin_and_destination
    };
    console.log(queryParams)
    this.navCtrl.navigateForward("/pedido-carrito", { queryParams: queryParams })
    //this.ionicForm.reset()
  }

  /*
  cambiarNombreUserMenu(){
    this.navCtrl.navigateForward("/homeperfil",{
      queryParams: {
        datos: this.ionicForm.value, nameus: this.nombreu, apells: this.apellidou
      }
    });
  }*/

  validacionCed() {
    let cedula = this.ionicForm.get("cedula").value;
    //console.log(cedula);
    if (typeof (cedula) == 'string' && cedula.length == 10 && /^\d+$/.test(cedula)) {
      var digitos = cedula.split('').map(Number);
      var codigo_provincia = digitos[0] * 10 + digitos[1];

      //if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30) && digitos[2] < 6) {

      if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30)) {
        var digito_verificador = digitos.pop();

        var digito_calculado = digitos.reduce(
          function (valorPrevio, valorActual, indice) {
            //console.log(typeof valorPrevio);
            return valorPrevio - (valorActual * (2 - indice % 2)) % 9 - +(valorActual == 9) * 9;
          }, 1000) % 10;
        //console.log(digito_calculado === digito_verificador);
        return digito_calculado === digito_verificador;
      } else {
        alert("Ingrese una cédula válida");
        return false;
      }
    }


  }

  async takePicture(type:string) {
    let sourceType: CameraSource;
    if (type === 'Camera') {
      sourceType = CameraSource.Camera;
    } else {
      console.log("else")
      sourceType = CameraSource.Photos;
    }
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: sourceType
    });
    this.photo = 'data:image/jpeg;base64,' + image.base64String;
    console.log(this.photo);
  }

  async openOptionSelection() {
    const modal = await this.modalController.create({
      component: ProfilePhotoOptionComponent,
      cssClass: 'transparent-modal'
    });
    modal.onDidDismiss()
      .then(res => {
        console.log(res);
        if (res.role == 'select') {
          this.takePicture(res.data);
        } else if(res.data == 'delete'){
          this.deletePic();
        }
      });
    return await modal.present();
  }

  async deletePic(){
    const filePath = `profilePictures/${this.uid}`;
    const fileRef = this.storage.ref(filePath);
    await fileRef.delete().toPromise();
    const token = localStorage.getItem('token');
    this.presentAlert("Eliminar imagen", "La imagen de perfil ha sido eliminada correctamente.")
    this.clienteWAService.deleteProfilePic(token).subscribe({
      next: (response) => {
      },
      error: (error) => {
      }
    });
    //llamar al endpoint
  }

  async changeEmailModal() {
    const modal = await this.modalController.create({
      component: MyEmailModalComponent,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  async changePasswordModal() {
    const modal = await this.modalController.create({
      component: MyPasswordModalComponent,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  async deleteAccountModal() {
    const modal = await this.modalController.create({
      component: MyDeleteModalComponent,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

}

@Component({
  selector: 'my-modal-email',
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Cambiar correo</ion-title>
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
        <p>Recibirás un correo de confirmación a la nueva dirección de correo que ingreses. Por favor, revisa tu bandeja de entrada y en caso de no encontrarlo, verifica también la carpeta de correo no deseado. Es importante que confirmes el correo correspondiente para completar el cambio de correo. Cierra sesión cuando el cambio esté hecho.</p>
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
  </form>`,
  styleUrls: ['./my-modal.scss']
})
export class MyEmailModalComponent implements OnInit {
  sendEmailForm: FormGroup;
  showPassword = false;
  email:string;

  constructor(private modalController: ModalController, private clienteWAService: ClienteWAService, private alertController: AlertController,public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.sendEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  submitForm() {
    if (!this.sendEmailForm.valid) {  
      return false;
    } else {
      this.sendEmail()
    }
  }
  sendEmail(){
    const data: ClientEmail = {
      email:this.email = this.sendEmailForm.value.email
    }
    const token = localStorage.getItem('token');
    this.clienteWAService.sendChangeEmail(data, token).subscribe({
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

}

@Component({
  selector: 'my-modal-password',
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Cambiar contraseña</ion-title>
    <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
      </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form [formGroup]="changePasswordForm" (ngSubmit)="submitForm()">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Cambia tu contraseña</ion-card-title>
      </ion-card-header>
      <ion-card-content>
      <p>Recibirás un correo de confirmación a la dirección de correo asociada a tu cuenta. Por favor, revisa tu bandeja de entrada y en caso de no encontrarlo, verifica también la carpeta de correo no deseado. Es importante que confirmes el correo correspondiente para completar el cambio de contraseña.</p>
        <ion-item>
          <ion-label position="floating">Contraseña actual</ion-label>
          <ion-input type="{{showPassword ? 'text' : 'password'}}" formControlName="password" minlength="4"></ion-input>
          <ion-icon slot="end" [name]="showPassword ? 'eye-outline' : 'eye-off-outline'" (click)="togglePassword()"></ion-icon>
        </ion-item>
        <div *ngIf="changePasswordForm.get('password').invalid && (changePasswordForm.get('password').dirty || changePasswordForm.get('password').touched)" class="error-message">
          <div *ngIf="changePasswordForm.get('password').hasError('required')">Ingrese una contraseña</div>
          <div *ngIf="changePasswordForm.get('password').hasError('minlength')">La contraseña debe contener mínimo 4 caracteres</div>
        </div>
        <ion-item>
          <ion-label position="floating">Contraseña nueva</ion-label>
          <ion-input type="{{showNewPassword ? 'text' : 'password'}}" formControlName="newPassword" minlength="4"></ion-input>
          <ion-icon slot="end" [name]="showNewPassword ? 'eye-outline' : 'eye-off-outline'" (click)="toggleNewPassword()"></ion-icon>
        </ion-item>
        <div *ngIf="changePasswordForm.get('newPassword').invalid && (changePasswordForm.get('newPassword').dirty || changePasswordForm.get('newPassword').touched)" class="error-message">
          <div *ngIf="changePasswordForm.get('newPassword').hasError('required')">Ingrese una contraseña</div>
          <div *ngIf="changePasswordForm.get('newPassword').hasError('minlength')">La contraseña debe contener mínimo 4 caracteres</div>
        </div>
        <ion-button expand="block" type="submit" [disabled]="!changePasswordForm.valid">Enviar</ion-button>
    </ion-card-content>
  </ion-card>
</form>
  `,
  styleUrls: ['./my-modal.scss']
})
export class MyPasswordModalComponent {
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

@Component({
  selector: 'my-modal-delete',
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Eliminar cuenta</ion-title>
    <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
      </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form [formGroup]="deleteAccountForm" (ngSubmit)="submitForm()">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Ingresa tu contraseña</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>Al presionar el botón de eliminar, se procederá a la eliminación de tu cuenta. Por favor, ten en cuenta que esta acción no se puede deshacer</p>
        <ion-item>
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input type="{{showPassword ? 'text' : 'password'}}" formControlName="password" minlength="4"></ion-input>
          <ion-icon slot="end" [name]="showPassword ? 'eye-outline' : 'eye-off-outline'" (click)="togglePassword()"></ion-icon>
        </ion-item>
        <div *ngIf="deleteAccountForm.get('password').invalid && (deleteAccountForm.get('password').dirty || deleteAccountForm.get('password').touched)" class="error-message">
          <div *ngIf="deleteAccountForm.get('password').hasError('required')">Ingrese una contraseña</div>
          <div *ngIf="deleteAccountForm.get('password').hasError('minlength')">La contraseña debe contener mínimo 4 caracteres</div>
        </div>
        <ion-button expand="block" type="submit" [disabled]="!deleteAccountForm.valid">Eliminar</ion-button>
      </ion-card-content>
    </ion-card>
  </form>`,
  styleUrls: ['./my-modal.scss']
})
export class MyDeleteModalComponent implements OnInit {
  deleteAccountForm: FormGroup;
  showPassword = false;
  password:string;

  constructor(private modalController: ModalController, private clienteWAService: ClienteWAService, private alertController: AlertController,public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.deleteAccountForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  submitForm() {
    if (!this.deleteAccountForm.valid) {  
      return false;
    } else {
      this.deleteAccount()
    }
  }
  deleteAccount(){
    const password = this.deleteAccountForm.value.password
    const token = localStorage.getItem('token');
    this.clienteWAService.deleteAccount(password, token).subscribe({
      next: (response) => {
        this.alertController.create({
          header: 'Eliminar cuenta',
          message: response.message,
          buttons: [
            {
              text: 'Aceptar',
              handler: () => {
                localStorage.removeItem('token');
                location.reload();
              }
            }
          ]
        }).then(alert=> alert.present())
      },
      error: (error) => {
        let keyError: string = Object.keys(error.error)[0]
        this.alertController.create({
          header: 'Error eliminar cuenta',
          message: error.error[keyError],
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}