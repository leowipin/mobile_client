import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
import { validarCedulaAlg } from '../editarperfil/cedula.validator';
import { RegisterModel } from '../modelos/register.model';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
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

  isSubmitted = false;


  user: RegisterModel = new RegisterModel();
  camposCompletos: boolean = false;
  //Indicador si registro fue guardado en la base de datos o no
  submitted = false;

  showPassword = false;

  
  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public loaderCtrl: LoadingController,
    public clienteWAService:ClienteWAService

  ) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.pattern('[a-z/.0-9_-]+@[a-z0-9]+[.{1}][a-z]{2,}([.{1}][a-z]{2,})?')]],
      bday: ['', [Validators.required, Validators.pattern('(?:19[0-9]{2}|20[01][0-9]|2020)[-](?:0[1-9]|1[012])[-](?:0[1-9]|[12][0-9]|3[01])')]],
      f2_edudetail: ['', [Validators.required]],
      mobile: ['', [Validators.required,Validators.pattern('^[0-9]{0,7}$')]],
      cedula: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      contrasenha:['', [Validators.required, Validators.minLength(8)]],
    }
     /* ,
      {
        validators: validarCedulaAlg
      }*/
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
    var today = moment(new Date());
    var test = moment(new Date(this.ionicForm.value.bday)).format("YYYY-MM-DD");
    var resul = test.toString();
    var difference = today.diff(test, "y") < 18;

    this.isSubmitted = true;
    if (!this.condiciones) {
      this.presentTerms();
    }
    if (difference) {
      this.presentUnderAge();
    }
    else if (!this.ionicForm.valid) {
      this.presentFields();
      console.log(this.ionicForm.value)
      console.log('Please provide all the required values!')

      return false;
    } else {
      console.log(this.ionicForm.value)
      this.guardarUsuario()
        
      

      

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
            console.log('ORIGEN');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async presentFields() {
    const alert = await this.alertController.create({
      header: 'Campos incompletos',
      message: 'Para hacer uso de nuestra aplicación asegúrate de completar todos los campos correctamente',
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
            console.log('ORIGEN');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  redirigir() {
    this.navCtrl.navigateForward("/servicios");
    this.ionicForm.reset()
  }

  onClick() {
    this.navCtrl.navigateForward("/item1-modal");
  }


  ingresoCedula() {
    return this.ionicForm.hasError('CedulaNoValida') && this.ionicForm.get('cedula').dirty;
  }

  
  togglePasswordClick() {
    console.log("press")
    this.showPassword = !this.showPassword;
  }

/*Función para guardar usuario nuevo que se registre */
guardarUsuario(){
  
  this.camposCompletos = !this.ionicForm.invalid;
  const data = {
    apellidos : this.ionicForm.value.lastname,
    nombres : this.ionicForm.value.name,
    cedula : this.ionicForm.value.cedula,
    fechaNac : this.ionicForm.value.bday,
    sexo : this.ionicForm.value.f2_edudetail,
    correo : this.ionicForm.value.email,
    telefono : this.ionicForm.value.mobile,
    contrasenia : this.ionicForm.value.contrasenha,
    direccion : this.ionicForm.value.email,
    rol : '2'
  };
  console.log("entra")
  console.log(data)
  console.log("Fecha valida:" )
  console.log("Campos completos: "+this.camposCompletos)
  console.log("Terminos aceptados:")
  //Se han completado los campos y se han aceptado los términos de la empresa
  if(this.camposCompletos){
    this.clienteWAService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          window.localStorage.setItem('usuario_actual',data.correo)
          console.log("=======================")
          console.log(window.localStorage.getItem('usuario_actual'))
          this.ionicForm.reset()
          this.presentSuccess();
          this.redirigir()
        },
        error: (e) => console.error(e)
      });
  } else{
    alert("Debe completar los campos y aceptar los términos y condiciones")
  }
  if(this.submitted){
    console.log("Datos guardados")
  } else {
    console.log("Datos no guardados")
  }
}


}

