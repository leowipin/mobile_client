import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { OrderData } from '../interfaces/client/orderData';
import { ModalController } from '@ionic/angular';
import { TrackServicioComponent } from '../servicios/track-servicio/track-servicio.component';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
declare var google: any;


@Component({
  selector: 'app-pedido-carrito',
  templateUrl: './pedido-carrito.page.html',
  styleUrls: ['./pedido-carrito.page.scss'],
})
export class PedidoCarritoPage implements OnInit {

  orderData:OrderData;
  orderName:string;
  orderId:any;
  requires_origin_and_destination:boolean;
  formattedDuration:string;
  total:any;
  iva:any;
  subtotal:any;
  direccionOrigen: any;
  direccionDestino: any;
  googleLoaded = false;
  isPaidProcess = false;

  first_name:string;
  last_name:string;
  dni:string;
  phone_number:string;
  address:string;
  email:string;
  token:string;
  holder_name:string;
  expiry_year:string;
  bin:string;
  type:string;
  expiry_month:string;

  apiKey = environment.googleMapsApiKey;

  origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  constructor(private route: ActivatedRoute, private clienteWAService: ClienteWAService, private alertController: AlertController, private modalController: ModalController, private ubicacionService: UbicacionService, private renderer: Renderer2, private navCtrl: NavController, private router: Router) { 

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['isPaidProcess'] != undefined){
        this.isPaidProcess = params['isPaidProcess'] === 'true';
        this.orderName = params['name']
        this.orderId = params['id']
        this.requires_origin_and_destination = params['booleandest'] === 'true'
        this.first_name = params['first_name'],
        this.last_name = params['last_name'],
        this.dni = params['dni'],
        this.phone_number = params['phone_number'],
        this.address = params['address'],
        this.email = params['email'],
        this.token = params['token'],
        this.holder_name = params['holder_name'],
        this.expiry_year = params['expiry_year'],
        this.bin = params['bin'],
        this.type = params['type'],
        this.expiry_month = params['expiry_month']
      }
    });
    this.ubicacionService.init(this.renderer, document).then(() => {
    });
    this.getOrder();
  }

  formattingDuration(){
    let hours = Math.floor(this.orderData.duration);
    let minutes = Math.floor((this.orderData.duration - hours) * 60);
    let seconds = Math.round(((this.orderData.duration - hours) * 60 - minutes) * 60);
    this.formattedDuration = `${hours} horas ${minutes} min ${seconds} seg`;
  }

  getOrder(){
    const token = localStorage.getItem('token');
    this.route.queryParams.subscribe(params => {
      this.orderName = params['name']
      this.orderId = params['id']
      this.requires_origin_and_destination = params['booleandest']==='true'
      
    });
    this.clienteWAService.getOrder(token, this.orderId).subscribe({
      next: (response) => {
        this.orderData = response
        this.formattingDuration();
        console.log(typeof(this.orderData.total))
        if(response.total==0.00){
          this.total = "pendiente"
        } else{
          this.total = response.total
          let iva:any = this.total / 1.12 * 0.12;
          let subtotal:any = (this.total - iva).toFixed(2);
          iva = (this.total - subtotal).toFixed(2);
          this.iva = iva
          this.subtotal = subtotal

        }
        this.origen.lat = this.orderData.origin_lat
        this.origen.lng = this.orderData.origin_lng
        this.destino.lat = this.orderData.destination_lat
        this.destino.lng = this.orderData.destination_lng

      },
      error: (error) => {
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

  deleteOrder(){
    this.alertController.create({
      message: "¿Está seguro que desea eliminar este servicio?",
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            const token = localStorage.getItem('token');
            const id = this.route.snapshot.paramMap.get('id');
            this.clienteWAService.deleteOrder(token, id).subscribe({
              next: (response) => {
                this.alertController.create({
                  message: "Servicio eliminado correctamente",
                  buttons: [
                    {
                      text: 'Aceptar',
                      handler: () => {
                        this.navCtrl.navigateRoot('/carrito');
                      }
                    }
                  ]
                }).then(alert => alert.present())
              },error: (error) => {
                this.alertController.create({
                  message: "Hubo un error al eliminar el servicio",
                  buttons: ['Aceptar']
                }).then(alert => alert.present())
              }
            });
          }
        }
      ]
    }).then(alert => alert.present())
  }

goToBillingData(){
  let queryParams = {
    isProfileInformation: false,
    name:this.orderName,
    id:this.orderId,
    booleandest:this.requires_origin_and_destination,     
  };
  this.navCtrl.navigateForward(['/editarperfil'], { queryParams: queryParams });
}

/*backToSelectCard(){
  this.navCtrl.navigateForward(['/metododepago'],);
}*/

async goBackToOrder(){
  const alert = await this.alertController.create({
    header: 'Cancelar pago',
    message: '¿Está seguro que desea cancelar el proceso de pago?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Sí',
        handler: () => {
          this.navCtrl.navigateForward(['/carrito']);
        }
      }
    ]
  });
  await alert.present();
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
}
