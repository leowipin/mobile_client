import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../servicios/login-registro/userDataService';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-homeperfil',
  templateUrl: './homeperfil.page.html',
  styleUrls: ['./homeperfil.page.scss'],
})
export class HomeperfilPage implements OnInit {
  recibido: any;
  nombreur: any;
  apellidour: any;
  uid:any;
  photo:any = "assets/img/perfilcliente.png";

  constructor(private route: ActivatedRoute, private navCtrl: NavController, public alertController: AlertController, 
    private userDataService: UserDataService, private storage: AngularFireStorage){
    this.userDataService.nombreur$.subscribe(nombreur => {
      this.nombreur = nombreur;
    });
    this.userDataService.apellidour$.subscribe(apellidour => {
      this.apellidour = apellidour;
    });
    
  }
  perfil(){
    let queryParams = {
      isProfileInformation: true
    };
    this.navCtrl.navigateForward(['/editarperfil'], { queryParams: queryParams });
  }

  goToNoti(){
    this.navCtrl.navigateForward(['/notificaciones']);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['photo']=="assets/img/backcliente.png"){
        this.photo = "assets/img/perfilcliente.png"
      } else{
        console.log("ELSE")
        this.photo = params['photo'];
      }
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Cancelar Servicio',
      message: '¿Está seguro de cancelar el servicio?',
      buttons: [
        {
          text: 'Sí',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'No',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
  async getProfilePicture(){
    this.getUid();
    const filePath = `profilePictures/${this.uid}`;
    const fileRef = this.storage.ref(filePath);
    try {
      this.photo = await fileRef.getDownloadURL().toPromise();
      console.log(this.photo)
    } catch (error) {
      this.photo = "assets/img/perfilcliente.png";
    }
  }

  getUid(){
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    this.uid = payload.user_id.toString()
  }

}
