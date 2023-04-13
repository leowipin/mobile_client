import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController,AlertController } from '@ionic/angular';
import { OrderData } from 'src/app/interfaces/client/orderData';
import { ClienteWAService } from '../login-registro/login-registro.service';
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
    private modalController: ModalController,public alertController: AlertController, private clienteWAService: ClienteWAService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.datosRecibidos = {...params}
      console.log(this.datosRecibidos);
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
      
      if(params.requiresDestination){
        this.datosRecibidos.endDate = null
        this.datosRecibidos.endTime = null
        this.datosRecibidos.duration = null
      } else{
        this.datosRecibidos.destinationLat = null
        this.datosRecibidos.destinationLng = null 
      }

      console.log(this.datosRecibidos);
    }
    );
  }
  cancelar() {
    this.navCtrl.navigateForward(`/servicio-detalle/${this.datosRecibidos.serviceID}`);
  }

  sendOrder(){
    if(this.value !== undefined) {
      this.navCtrl.navigateForward("/estado-solicitud");
      let orderData: OrderData = {
        service: this.datosRecibidos.serviceID,
        phone_account: null,
        date_request: this.datosRecibidos.dateRequest,
        start_date: this.datosRecibidos.startDate,
        start_time: this.datosRecibidos.startTime,
        end_date: this.datosRecibidos.endDate,
        end_time: this.datosRecibidos.endTime,
        duration: this.duration,
        origin_lat: this.datosRecibidos.originLat,
        origin_lng: this.datosRecibidos.originLng,
        destination_lat: this.datosRecibidos.destinationLat,
        destination_lng: this.datosRecibidos.destinationLng,
        total: this.datosRecibidos.total,
        payment_method: this.value,
        status: "aprobado",
        staff: this.datosRecibidos.staff,
        staff_is_optional: this.datosRecibidos.staffIsOptional,
        staff_selected: this.datosRecibidos.staffSelected,
        staff_number_optional: this.datosRecibidos.staffNumberOptional,
        staff_number: this.datosRecibidos.staffNumberRequired,
        equipment: this.datosRecibidos.equipment,
        equipment_is_optional: this.datosRecibidos.equipmentIsOptional,
        equipment_selected: this.datosRecibidos.equipmentSelected,
        equipment_number_optional: this.datosRecibidos.equipmentNumberOptional,
        equipment_number: this.datosRecibidos.equipmentNumberRequired
      };
      console.log(orderData)
      const token = localStorage.getItem('token');
        this.clienteWAService.createOrder(orderData, token).subscribe({
          next: (response) => {
            console.log(response.message)
            /*this.alertController.create({
              header: 'Envio email',
              message: response.message,
              buttons: ['Aceptar']
            }).then(alert=> alert.present())*/
          },
          error: (error) => {
            let keyError: string = Object.keys(error.error)[0]
            console.log(error)
            console.log(error.error[keyError])
            /*this.alertController.create({
              header: 'Error email',
              message: error.error[keyError],
              buttons: ['Aceptar']
            }).then(alert=> alert.present())*/
          }
        });
    }else{
      this.alertController.create({
        header: 'Método de pago',
        message: 'Seleccione el método de pago',
        buttons: ['Aceptar']
      }).then(alert=> alert.present())
    }
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