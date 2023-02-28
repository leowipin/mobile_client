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
    this.navCtrl.navigateForward("/perfil");
  }

  ngOnInit() {
    // aqui se debe llamar al endpoint que tra los datos de un cliente dado un id
    this.route.queryParams.subscribe(params => {
      console.log(params); // { order: "popular" 
      this.recibido= params;
      this.nombreur = this.recibido.datos.name;
      this.apellidour = this.recibido.datos.lastname;
    }
    );
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
