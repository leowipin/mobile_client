import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-homeperfil',
  templateUrl: './homeperfil.page.html',
  styleUrls: ['./homeperfil.page.scss'],
})
export class HomeperfilPage implements OnInit {
  recibido: any;
  nombreur: any;
  apellidour: any;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, public alertController: AlertController){
    
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

}
