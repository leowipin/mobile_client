import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegisterModel } from '../modelos/register.model';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { SignUp } from '../interfaces/client/signup';
import * as moment from 'moment';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  condiciones: boolean;
  ionicForm: FormGroup;

  defaultDate = "1990-12-16";
  maxFecha: string = (new Date().getFullYear() - 18).toString();
  minFecha: string = (new Date().getFullYear() - 80).toString();


  user: RegisterModel = new RegisterModel();
  camposCompletos: boolean = false;
  submitted = false;

  showPassword = false;

  
  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public loaderCtrl: LoadingController,
    private clienteWAService:ClienteWAService

  ) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      bday: ['', [Validators.required, Validators.pattern('(?:19[0-9]{2}|20[01][0-9]|2020)[-](?:0[1-9]|1[012])[-](?:0[1-9]|[12][0-9]|3[01])')]],
      //f2_edudetail: ['', [Validators.required]],
      mobile: ['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password:['', [Validators.required, Validators.minLength(4)]],
      //address: ['', [Validators.required, Validators.minLength(10)]]

    }
    );

  }
  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);

    console.log(date);
    this.ionicForm.get('dob').setValue(date, {
      onlyself: true
    })


  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  submitForm() {
    let today = moment(new Date());
    let test = moment(new Date(this.ionicForm.value.bday)).format("YYYY-MM-DD");
    let difference = today.diff(test, "y") < 18;

    if (!this.condiciones) {
      this.presentTerms();
    } else if (difference) {
        this.presentUnderAge();
        return false;
    } else if (!this.ionicForm.valid) {
        this.presentFields();
        return false;
    } 
    else {
      this.signUp() 
    }
  }

  async presentUnderAge() {
    const alert = await this.alertController.create({
      header: 'Menor de edad',
      message: 'Para hacer uso de nuestra aplicación y de nuestros servicios debes ser mayor de 18 años',
      buttons: [
        {
          text: 'Aceptar',
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

  async presentTerms() {
    const alert = await this.alertController.create({
      header: 'Términos y condiciones',
      message: 'Para hacer uso de nuestra aplicación asegúrate de aceptar los términos y condiciones',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async presentFields() {
    const alert = await this.alertController.create({
      header: 'Campos incompletos',
      message: 'Asegúrate de completar todos los campos correctamente',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async presentSuccess() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: 'Felicidades, has completado satisfactoriamente tu registro. Bienvenido, estamos para servirte.',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  redirigirSignin() {
    this.navCtrl.navigateForward("/login");
    this.ionicForm.reset()
  }

  onClick() {
    this.navCtrl.navigateForward("/item1-modal");
  }


  ingresoCedula() {
    return this.ionicForm.hasError('CedulaNoValida') && this.ionicForm.get('cedula').dirty;
  }

  
  togglePasswordClick() {
    this.showPassword = !this.showPassword;
  }

signUp(){
  const data: SignUp = {
    first_name: this.ionicForm.value.name,
    last_name: this.ionicForm.value.lastname,
    email: this.ionicForm.value.email,
    password: this.ionicForm.value.password,
    phone_number: this.ionicForm.value.mobile,
    dni: this.ionicForm.value.cedula,
  }
  this.clienteWAService.signup(data).subscribe({
    next: (response) => {
      console.log(response)
      console.log(response.message)
      this.alertController.create({
        header: 'Verificación',
        message: response.message,
        buttons: ['Aceptar']
      }).then(alert=> alert.present())
      this.redirigirSignin()
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


}

