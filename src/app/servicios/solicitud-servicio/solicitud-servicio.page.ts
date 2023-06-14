import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController,AlertController } from '@ionic/angular';
import { OrderData } from 'src/app/interfaces/client/orderData';
import { RequestOrderNotification } from 'src/app/interfaces/client/requestOrder';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { TrackServicioComponent } from '../track-servicio/track-servicio.component';
import { environment } from 'src/environments/environment';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { UbicacionService } from '../../ubicacion/ubicacion.service';
import firebase from 'firebase/compat/app'
import '@firebase/messaging';

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
  subtotal:any;
  iva:any;
  apiKey = environment.googleMapsApiKey;


  origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };

  constructor(private route: ActivatedRoute, private router: Router, public navCtrl: NavController,
    private modalController: ModalController,public alertController: AlertController, private clienteWAService: ClienteWAService, private ubicacionService: UbicacionService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.datosRecibidos = {...params}
      this.origen.lat = this.datosRecibidos.originLat
      this.origen.lng = this.datosRecibidos.originLng
      this.destino.lat = this.datosRecibidos.destinationLat
      this.destino.lng = this.datosRecibidos.destinationLng
      this.duration = Math.ceil(params.duration);
      if(params.total===0){
        this.total = "pendiente"
      } else{
        this.total = params.total
        let iva:any = this.total / 1.12 * 0.12;
        let subtotal:any = (this.total - iva).toFixed(2);
        iva = (this.total - subtotal).toFixed(2);
        this.iva = iva
        this.subtotal = subtotal
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
        status: "pendiente",
        staff: this.datosRecibidos.staff,
        staff_is_optional: this.datosRecibidos.staffIsOptional,
        staff_selected: this.datosRecibidos.staffSelected,
        staff_number_is_optional: this.datosRecibidos.staffNumberOptional,
        staff_number: this.datosRecibidos.staffNumberRequired,
        equipment: this.datosRecibidos.equipment,
        equipment_is_optional: this.datosRecibidos.equipmentIsOptional,
        equipment_selected: this.datosRecibidos.equipmentSelected,
        equipment_number_is_optional: this.datosRecibidos.equipmentNumberOptional,
        equipment_number: this.datosRecibidos.equipmentNumberRequired
      };
      console.log(orderData)
      const token = localStorage.getItem('token');
        this.clienteWAService.createOrder(orderData, token).subscribe({
          next: (response) => {
            console.log(response.message);
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const payload = JSON.parse(atob(base64));
            const email = payload.user_email;
            let requestOrder:RequestOrderNotification = {
              title:"Solicitud de servicio",
              message:`el cliente ${email} ha solicitado el servicio de  ${this.datosRecibidos.serviceName}`,
              order: response.order_id,
            }
            this.clienteWAService.sendRequestOrderNotification(token, requestOrder).subscribe({
              next: (response) => {
                console.log(requestOrder);
                console.log(response.message)
              },
              error: (error) => {
                let keyError: string = Object.keys(error.error)[0]
                console.log(error)
                console.log(error.error[keyError])
              }
            });
          },
          error: (error) => {
            let keyError: string = Object.keys(error.error)[0]
            console.log(error)
            console.log(error.error[keyError])
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

  async verUbicacion() {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.origen.lat},${this.origen.lng}&key=${this.apiKey}`);
      const data = await response.json();
      console.log(data.results)
      if (data.results && data.results.length > 0) {
        const modalAdd = await this.modalController.create({
          component: UbicacionComponent,
          mode: 'ios',
          swipeToClose: true,
          componentProps: { position: this.origen, onlyView: true }
        });
  
        await modalAdd.present();
    }
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
  }

  /*sendNotificationToTopic(title: string, body: string, topic: string) {
    const message = {
      notification: {
        title: title,
        body: body
      },
      topic: topic
    };
    firebase
      .messaging()
      .send(message)
      .then(response => {
        console.log('Notification sent successfully:', response);
      })
      .catch(error => {
        console.log('Error sending notification:', error);
      });
  }

  sendNotification() {
    const title = 'Título de la notificación';
    const body = 'Cuerpo de la notificación';
    const topic = 'Nombre del tema';
    this.sendNotificationToTopic(title, body, topic);
  }*/

}