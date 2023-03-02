import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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

  constructor(private navCtrl: NavController, 
    public formBuilder: FormBuilder, 
    public alertController: AlertController,
    private clienteWAService: ClienteWAService,
    public authService:AuthService
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

    let email: string = this.ionicForm.value.email
    let password: string = this.ionicForm.value.password
    this.clienteWAService.signin(email, password).subscribe({
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

}

