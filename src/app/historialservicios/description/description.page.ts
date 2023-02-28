import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController,AlertController } from '@ionic/angular';
import * as moment from 'moment';
@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
export class DescriptionPage implements OnInit {
  value: string;
  datosrecibidos: any;
  fechaInicio: any;
  fechaFinalizacion: any;
  horaInicio: any;
  horaFinalizacion: any;
  direccionOrigen: any;
  direccionDestino: any;
  origen:any;
  destino:any;
  seleccion:any;

  constructor(private route: ActivatedRoute, private router: Router, public navCtrl: NavController,public alertController: AlertController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params); // { order: "popular" }
      this.datosrecibidos = params;
    }
    );
  }
  regresar(){
    this.navCtrl.navigateForward("/historialservicios")
  }
  calificar(){
    this.navCtrl.navigateForward("/calificar-servicio")
  }
  cancelar() {
    this.presentAlertConfirmacion();
  }
  enviar(){
    this.navCtrl.navigateForward("/historialservicios",{
      queryParams: {
        cance:"cancelado",selec:this.datosrecibidos.des
      }
    }); 
  }
  async presentAlertConfirmacion() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: '¿Está seguro de cancelar el servicio?.',

      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sí',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.enviar();
          console.log(this.seleccion);

          }
        }
      ]
    });

    await alert.present();
    
  }
 

}
