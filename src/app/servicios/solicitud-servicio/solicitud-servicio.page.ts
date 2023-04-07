import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController,AlertController } from '@ionic/angular';
import { TrackServicioComponent } from '../track-servicio/track-servicio.component';
import * as moment from 'moment';

declare var google: any;

@Component({
  selector: 'app-solicitud-servicio',
  templateUrl: './solicitud-servicio.page.html',
  styleUrls: ['./solicitud-servicio.page.scss'],
})
export class SolicitudServicioPage implements OnInit {
  value: string;
  datosRecibidos: any;
  fechaInicio: any;
  fechaFinalizacion: any;
  horaInicio: any;
  horaFinalizacion: any;
  direccionOrigen: any;
  direccionDestino: any;
  seleccion: any;
  haymetodopago: boolean=false;
  duration:number;
  formattedDuration:string;
  total:any;
  

  origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };

  constructor(private route: ActivatedRoute, private router: Router, public navCtrl: NavController,
    private modalController: ModalController,public alertController: AlertController) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params); // { order: "popular" }
      this.datosRecibidos = params
      this.duration = Math.ceil(params.duration);
      if(params.total===0){
        this.total = "pendiente"
      } else{
        this.total = params.total
      }
      let hours = Math.floor(params.duration);
      let minutes = Math.floor((params.duration - hours) * 60);
      let seconds = Math.round(((params.duration - hours) * 60 - minutes) * 60);
      this.formattedDuration = `${hours} horas con ${minutes} minutos y ${seconds} segundos`;

      console.log(this.formattedDuration);
      console.log(this.duration);
      /*this.datosrecibidos = params;
      console.log(this.datosrecibidos); // popular
      this.fechaInicio = moment(this.datosrecibidos.datos.fechaInicio).format("DD/MM/YYYY");
      this.fechaFinalizacion = moment(this.datosrecibidos.datos.fechaFinalizacion).format("DD/MM/YYYY");
      this.horaInicio = moment(this.datosrecibidos.datos.horaInicio).format("hh:mma");
      this.horaFinalizacion = moment(this.datosrecibidos.datos.horaFinalizacion).format("hh:mma");
      this.origen = this.datosrecibidos.origen;
      this.destino = this.datosrecibidos.destino;
      this.findPlaces(this.origen,this.destino);*/
    }
    );
  }
  cancelar() {
    this.navCtrl.navigateForward(`/servicio-detalle/${this.datosRecibidos.serviceID}`);
  }
  /*regresar() {
    if (this.datosrecibidos.servicio == 'Chofer') {
      this.navCtrl.navigateForward("/servicios/n/chofer");
    }
    if (this.datosrecibidos.servicio == 'Guardia') {
      this.navCtrl.navigateForward("/servicios/n/guardia");
    }
    if (this.datosrecibidos.servicio == 'Transporte') {
      this.navCtrl.navigateForward("/servicios/n/transporte");
    }
    if (this.datosrecibidos.servicio == 'Custodia') {
      this.navCtrl.navigateForward("/servicios/n/custodia");
    }
  }
  async presentAlertConfirmacion() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación del servicio',
      message: 'La solicitud ha sido enviada.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.navCtrl.navigateForward("/historialservicios", {
              queryParams: {
                descripcion: this.datosrecibidos, origen:this.direccionOrigen, destino:this.direccionDestino, service:this.datosrecibidos.servicio, pago:this.seleccion,cance:""
              }
            });

          }
        }
      ]
    });

    await alert.present();
    
  }
  async presentAlertPago() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sin ubicación.',
      //subHeader: 'Subtitle',
      message: "No ha seleccionado un método de pago.",
      buttons: ['OK']
    });

    await alert.present();
    
  }
  cancelar() {
    this.navCtrl.navigateForward("/servicios");
  }
  confirmar() {
    if(this.haymetodopago){
      this.presentAlertConfirmacion();
    }else{
      this.presentAlertPago()
    }
  }
  obtenermetodo(sel: any) {
    this.seleccion= sel;
    this.haymetodopago=true;
    console.log(this.seleccion);
  }

  async dibujarRuta() {

    const modalAdd = await this.modalController.create({
      component: TrackServicioComponent,
      mode: 'ios',
      swipeToClose: true,
      componentProps: { origen: this.origen, destino: this.destino }
    });
    modalAdd.setAttribute('style', '--background: transparent; --backdrop-opacity: 0.0');

    await modalAdd.present();
  }

  findPlaces(salida: any, llegada: any) {

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: salida })
      .then(({ results }) => {
        if (results[0]) {
          this.direccionOrigen =  results[0].formatted_address;
        }
        else {
          this.direccionOrigen =  "Dirección Imprecisa"
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));

    geocoder.geocode({ location: llegada })
      .then(({ results }) => {
        if (results[0]) {
          this.direccionDestino =  results[0].formatted_address;
        }
        else {
          this.direccionDestino =  "Dirección Imprecisa"
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }*/
}