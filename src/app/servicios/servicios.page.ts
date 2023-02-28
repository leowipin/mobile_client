import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { FulltrackComponent } from '../fulltrack/fulltrack.component';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  origen = {
    lat: 0,
    lng: 0
  };
  destino = {
    lat: 0,
    lng: 0
  };

  
  constructor(private navCtrl: NavController, private menu: MenuController,public alertController: AlertController, private modalController: ModalController){
  }
  irPaginaChofer(){
    this.presentAlertChofer();
    this.navCtrl.navigateForward("/servicios/n/chofer");
  }
  irPaginaGuardia(){
    this.presentAlertGuardia();
    this.navCtrl.navigateForward("/servicios/n/guardia");
  }
  irPaginaCustodia(){
    this.presentAlertCustodia();
    this.navCtrl.navigateForward("/servicios/n/custodia");
  }

  
  irPaginaTransporte(){
    this.presentAlertTransporte();
    this.navCtrl.navigateForward("/servicios/n/transporte");
  }
  ngOnInit() {
  }
  async presentAlertGuardia() {
    const alert = await this.alertController.create({
      header: 'GUARDIA PARA EVENTO',
      message: ' En Guardia para Eventos, usted podrá solicitar uno o más agentes, que resguarden un evento, reunión o grupo de personas, en el lugar que usted solicite y por el tiempo que necesite.',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Servicio guardia');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
  async presentAlertTransporte() {
    const alert = await this.alertController.create({
      header: 'TRANSPORTER',
      message: ' En el servicio de transporter, usted podrá solicitar, el traslado de objetos personales o empresariales, de un punto a otro. \n Toda unidad (vehículo), consta con un candado satelital, que el cliente coloca al despachar la carga, junto a una clave de seguridad, la cual hace imposible su apertura, hasta que el objeto llegue a su destino y el cliente abra el candado de manera remota, por medio de este sistema.',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Servicio transporte');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
  async presentAlertChofer() {
    const alert = await this.alertController.create({
      header: 'CHOFER DESIGNADO',
      message: 'En el servicio de Chofer designado, podrá solicitar un agente con o sin vehículo, que lo lleve a los destinos que usted requiera, en el lapso de tiempo contratado. Al seleccionar la opción de Chofer Guardaespaldas, usted solicitará un agente con entrenamiento especial, en el resguardo y protección de personas.',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Servicio chofer');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
  async presentAlertCustodia() {
    const alert = await this.alertController.create({
      header: 'CUSTODIA',
      message: 'El servicio de custodia, usted lo podrá solicitar para el resguardo personal, empresarial o carga (contenedores). Cada unidad (vehículo) que usted solicite, estará conformado por 3 agentes altamente entrenados y equipados, para brindarle seguridad hasta su lugar de destino.',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Servicio custodia');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  async dibujarRuta() {
    if (this.origen.lat==0 && this.origen.lng==0 && this.destino.lat==0 && this.destino.lng==0){
      this.origen = { lat: 4.6583, lng: -74.0939 };
      this.destino = { lat: 4.6568, lng: -74.0982 };    
      this.presentAlertNoServicio();
    }
    else{
    const modalAdd = await this.modalController.create({
      component: FulltrackComponent,
      mode: 'ios',
      swipeToClose: true,
      componentProps: { origen: this.origen, destino: this.destino }
    });
    modalAdd.setAttribute('style', '--background: transparent; --backdrop-opacity: 0.0');

    await modalAdd.present();
  }}

  async presentAlertNoServicio() {
    const alert = await this.alertController.create({
      header: 'No tiene un servicio en ejecución',
      message: 'Para realizar un seguimiento de su servicio debe tener un servicio activo',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('No tiene servicio activo');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
}
