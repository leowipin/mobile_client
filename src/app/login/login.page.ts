// login.page.ts
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegisterModel } from '../modelos/register.model';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AuthService } from '../servicios/login-registro/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false;

  ionicForm: FormGroup;
  
  isSubmitted = false;

  camposCompletos: boolean = false;
  //Bandera con la que se habilitara el boton de inicio de sesion
  exito = false
  /*Variable para guardar usuario encontrado*/
  usuarioActual: RegisterModel = {
    apellidos: '',
    nombres: '',
    cedula: 0,
    fechaNac: new Date(),
    sexo: '',
    correo: '',
    telefono: 0,
    contrasenia: ''
  };

  constructor(private navCtrl: NavController, 
    public formBuilder: FormBuilder, 
    public alertController: AlertController,
    public clienteWAService: ClienteWAService,
    public authService:AuthService
    ) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      //mobile: ['', [Validators.required, Validators.pattern('^09[0-9]{8}$') ]],
      password: ['', [Validators.required,Validators.minLength(8)]],
      email: ['', [Validators.required,Validators.email]],
      

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
      const usuario_actual= this.ionicForm.value
      // login
      console.log(usuario_actual)

      this.getUsuarioA()
      
      
      /*Si llena todos los datos, y pone cancelar tambien aparece esto: SOLUCIONAR*/
        //this.presentAlertIngresar()
        //this.redirigir()
      
    }
    
  }
  async presentAlertIngresar() {
    const alert = await this.alertController.create({
      header: 'Pin',
      message: 'Se ha enviado un pin de 4 digitos',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Datos guardados!');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  redirigir(){
    this.navCtrl.navigateForward("/pin-login");
    this.ionicForm.reset();
  }
  redirigir_home(){
    this.navCtrl.navigateForward("/servicios");
    this.ionicForm.reset();
  }
  

  togglePasswordClick() {
    console.log("press")
    this.showPassword = !this.showPassword;
  }


  //Funcion que obtiene el objeto de la base de datos y valida el inicio de sesion
  getUsuarioA(): void{
    var correoIngresado = this.ionicForm.value.email;
    console.log(correoIngresado)
    this.camposCompletos = !this.ionicForm.invalid;
    console.log("Campos completos: "+this.camposCompletos)
    if(this.camposCompletos){
      this.clienteWAService.get(correoIngresado)
      .subscribe({
        next: (data) => {
          this.usuarioActual = data;
          console.log(data)
          console.log(this.usuarioActual)
          var contrasenhaValidar = data.contrasenia
          console.log("========================")
          console.log(this.ionicForm.value.password)
          console.log(contrasenhaValidar)
          
          if(this.ionicForm.value.password == contrasenhaValidar){
            this.authService.infoPutUsuario(this.usuarioActual)
            console.log("inicio de sesion exitoso")
            this.alertController.create({
              message:"Inicio de sesion exitoso",
              buttons: ['Dismiss']

            }).then(alert=> alert.present())
            this.exito = true
            this.authService.loginDos()
            this.redirigir_home()
          } else{
            this.alertController.create({
              message:"Usuario o contraseña incorrecto",
              buttons: ['Dismiss']

            }).then(alert=> alert.present())

            //alert("Usuario o contraseña incorrectos")
            console.log("inicio de sesion fallido")
          }
          this.exito = false
        },
        error: (e) => {
          this.alertController.create({
            message:"Usuario no registrado",
            buttons: ['Dismiss']

    
          }).then(alert=> alert.present())
        }//alert("Usuario no registrado")
      });
    }else{
      console.log("Campos no válidos")
    }
  }

}

