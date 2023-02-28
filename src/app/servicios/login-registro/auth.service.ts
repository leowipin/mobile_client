import { Injectable } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { RegisterModel } from "src/app/modelos/register.model";


@Injectable({
  providedIn: 'root'
})
export class AuthService{
  [x: string]: any;

  usuario: RegisterModel = {
    apellidos: '',
    nombres: '',
    cedula: 0,
    fechaNac: new Date(),
    sexo: '',
    correo: '',
    telefono: 0,
    contrasenia: ''
  };

  constructor() { }


  //log
  //sesionIniciada: boolean = false;
  sesionIniciada = new Subject<boolean>()

  //Este valor pasa al guard y de manera muy rapida. La solucion deberia enfocarse en hacer que esta parte corra luego de los if de la linea 111 de inicio sesion componente
  sesionValidada: boolean = true;

  //Para el registro (validacion)
  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    apellidos: new FormControl(''),
    nombres: new FormControl(''),
    cedula: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    sexo: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    contrasenia: new FormControl(''),
    esPermanente: new FormControl(false)
  });


  //Metodo usado para indicar que se ha iniciado sesion y dicha variable enviarla al guard
  loginDos(){
    this.sesionIniciada.next(true)
    console.log(this.sesionIniciada)
  }

  logout(){
    this.sesionIniciada.next(false)
  }

  estaAutenticado(){
    return this.sesionIniciada;
  }

  //Método para probar paso de datos a componente principal
  getUsuario(){
    return this.usuario;
  }

  /*Metodo para obtener el usuario del inicio de sesion */
  infoPutUsuario(usuarioIS: RegisterModel){
    this.usuario = usuarioIS;
  }

  /*Metodo para enviar datos de usuario a distintos componentes */
  enviarUsuario(){
    return this.usuario;
  }

  //Metodo para resetear usuario
  reseteoUsuario(){
    this.usuario = {
      apellidos: '',
      nombres: '',
      cedula: 0,
      fechaNac: new Date(),
      sexo: '',
      correo: '',
      telefono: 0,
      contrasenia: ''
    };
    this.sesionIniciada.next(false)
  }


}
