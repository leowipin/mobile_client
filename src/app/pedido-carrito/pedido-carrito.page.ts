import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { OrderData } from '../interfaces/client/orderData';
import { ModalController } from '@ionic/angular';
import { TrackServicioComponent } from '../servicios/track-servicio/track-servicio.component';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { Renderer2 } from '@angular/core';
declare var google: any;


@Component({
  selector: 'app-pedido-carrito',
  templateUrl: './pedido-carrito.page.html',
  styleUrls: ['./pedido-carrito.page.scss'],
})
export class PedidoCarritoPage implements OnInit {

  orderData:OrderData;
  orderName:string;
  requires_origin_and_destination:boolean;
  formattedDuration:string;
  total:any;
  direccionOrigen: any;
  direccionDestino: any;
  googleLoaded = false;

  origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  constructor(private route: ActivatedRoute, private clienteWAService: ClienteWAService, private alertController: AlertController, private modalController: ModalController, private ubicacionService: UbicacionService, private renderer: Renderer2) { 

  }

  ngOnInit() {
    this.ubicacionService.init(this.renderer, document).then(() => {
    });
    this.getOrder();
  }

  formattingDuration(){
    let hours = Math.floor(this.orderData.duration);
    let minutes = Math.floor((this.orderData.duration - hours) * 60);
    let seconds = Math.round(((this.orderData.duration - hours) * 60 - minutes) * 60);
    this.formattedDuration = `${hours} horas con ${minutes} minutos y ${seconds} segundos`;
  }

  getOrder(){
    const token = localStorage.getItem('token');
    const id = this.route.snapshot.paramMap.get('id');
    this.orderName = this.route.snapshot.paramMap.get('name');
    this.requires_origin_and_destination = this.stringToBoolean(this.route.snapshot.paramMap.get('booleandest'))
    this.clienteWAService.getOrder(token, id).subscribe({
      next: (response) => {
        this.orderData = response
        this.formattingDuration();
        this.total = this.orderData.total
        if(parseFloat(this.total)===0){
          this.total = "pendiente"
        }
        this.origen.lat = this.orderData.origin_lat
        this.origen.lng = this.orderData.origin_lng
        this.destino.lat = this.orderData.destination_lat
        this.destino.lng = this.orderData.destination_lng

      },
      error: (error) => {
        console.log(error)
        this.alertController.create({
          message: "Error al cargar la solicitud",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

  stringToBoolean(str: string): boolean {
    return str.toLowerCase() === 'true';
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
}
}
