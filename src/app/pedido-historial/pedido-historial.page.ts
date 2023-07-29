import { Component, OnInit,ViewChild, ElementRef, OnDestroy  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { OrderData } from '../interfaces/client/orderData';
import { ModalController } from '@ionic/angular';
import { TrackServicioComponent } from '../track-servicio/track-servicio.component';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { NavController } from '@ionic/angular';
import { Renderer2} from '@angular/core';
import { environment } from 'src/environments/environment';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';

declare var google: any;

@Component({
  selector: 'app-pedido-historial',
  templateUrl: './pedido-historial.page.html',
  styleUrls: ['./pedido-historial.page.scss'],
})
export class PedidoHistorialPage implements OnInit {

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
  isPaidProcess:boolean;
  isHistoryOrder:boolean;
  status:string;
  transaction_id:string;
  isNotPendiente:boolean;

  first_name:string;
  last_name:string;
  dni:string;
  phone_number:string;
  address:string;
  email:string;
  token:string;
  holder_name:string;
  expiry_year:string;
  card_num:string;
  type:string;
  expiry_month:string;
  photo:string;

  isPaidBtnDisabled:boolean = false;
  modalElement: ElementRef;
  apiKey = environment.googleMapsApiKey;

  leaderData:any;

  origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  constructor(private route: ActivatedRoute, private clienteWAService: ClienteWAService, private alertController: AlertController, private modalController: ModalController, private ubicacionService: UbicacionService, private renderer: Renderer2, private navCtrl: NavController,) { 

  }

  ngOnInit(): void {
    
  }

  ionViewWillEnter() {
    this.ubicacionService.init(this.renderer, document).then(() => {
    });
    this.route.queryParams.subscribe(params => {
      if(params['isPaidProcess'] === 'true'){
        this.isPaidProcess = params['isPaidProcess'] ==='true';
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
        this.card_num = params['card_num'],
        this.type = params['type'],
        this.expiry_month = params['expiry_month']
        this.isHistoryOrder = false;
        this.status = "no status"
        this.getOrder();
      } else{

        this.getOrder();
      }
      if(this.isNotPendiente){
        console.log(this.isNotPendiente)
        const token = localStorage.getItem('token');
        this.clienteWAService.getLeaderStaff(token, this.orderId).subscribe({
          next: (response) => {
            this.leaderData = response
            if(response.url_img == null){
              this.photo = 'assets/img/backcliente.png';
            } else{
              this.photo = response.url_img
            }
          },error: (error) => {
          }
        });
      }
    });
    
  }

  formattingDuration(){
    let hours = Math.floor(this.orderData.duration);
    let minutes = Math.floor((this.orderData.duration - hours) * 60);
    let seconds = Math.round(((this.orderData.duration - hours) * 60 - minutes) * 60);
    this.formattedDuration = `${hours} horas ${minutes} min`;
  }

  getOrder(){
    const token = localStorage.getItem('token');
    this.route.queryParams.subscribe(params => {
      this.orderName = this.orderName || params['name'];
      this.orderId = this.orderId || params['id'];
      this.requires_origin_and_destination = this.requires_origin_and_destination || params['booleandest'] === 'true';
      this.isPaidProcess = this.isPaidProcess || params['isPaidProcess'] === 'true';
      this.status = this.status || params['status'];
      this.isHistoryOrder = this.isHistoryOrder || params['isHistoryOrder'] === 'true';
      this.isNotPendiente = params['status'] != 'pendiente'
    });
    if(this.isHistoryOrder){
      this.getBillingData(token, this.orderId)
    }
    this.clienteWAService.getOrder(token, this.orderId).subscribe({
      next: (response) => {
        this.orderData = response
        this.formattingDuration();
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
      header: "Eliminar Servicio",
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
            this.clienteWAService.deleteOrder(token, this.orderId).subscribe({
              next: (response) => {
                this.alertController.create({
                  header: "Eliminar Servicio",
                  message: "Servicio eliminado correctamente",
                  buttons: [
                    {
                      text: 'Aceptar',
                      handler: () => {
                        if(this.isHistoryOrder){
                          this.navCtrl.navigateRoot('/tabs/historialservicios');
                        }else{
                          this.navCtrl.navigateRoot('/tabs/carrito');
                        }
                      }
                    }
                  ]
                }).then(alert => alert.present())
              },error: (error) => {
                this.alertController.create({
                  header: "Eliminar Servicio",
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
  this.navCtrl.navigateForward(['/tabs/carrito/pedido-carrito/editarperfil'], { queryParams: queryParams });
}

getBillingData(token:string, order:string){
  //const token = localStorage.getItem('token');
  this.clienteWAService.getBillingData(token, order).subscribe({
    next: (response) => {
      this.first_name = response.first_name
      this.last_name = response.last_name
      this.dni = response.dni
      this.phone_number = response.phone_number
      this.address = response.address
      this.email = response.email
      this.card_num = response.card_num
      this.transaction_id = response.transaction_id
    },error: (error) => {
    }
  });
}

refund(){
  this.alertController.create({
    header: "Reembolso Servicio",
    message: "¿Está seguro que desea reembolsar este servicio?",
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Sí',
        handler: () => {
          this.refundOrder()
        }
      }
    ]
  }).then(alert => alert.present())
}
refundOrder(){
  let card: any = {
    transaction:{
      id:this.transaction_id
    }
  }
  this.clienteWAService.devolver(card).subscribe({
    next: (response) => {
      if(response.status==='success'){
        const token = localStorage.getItem('token');
        this.clienteWAService.changeOrderStatus(token, "reembolsado" ,this.orderId).subscribe({
          next: (response) => {
          },error: (error) => {
          }
        });
        this.alertController.create({
          header: 'Reembolso Servicio',
          message: '¡El reembolso del servicio se ha realizado con éxito!',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.navCtrl.navigateRoot(['/tabs/historialservicios']);
            }
          }]
        }).then(alert => alert.present());

      } else if(response.status === 'pending'){
        this.alertController.create({
          header: 'Reembolso servicio',
          message: 'Reembolso pendiente',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.navCtrl.navigateRoot(['/tabs/historialservicios']);
            }
          }]
        }).then(alert => alert.present());
      } else{
        this.alertController.create({
          header: 'Reembolso servicio',
          message: 'Reembolso fallido',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.navCtrl.navigateRoot(['/tabs/historialservicios']);
            }
          }]
        }).then(alert => alert.present());
      }
    },error: (error) => {
    }
  });
}

resetParams(){
  this.route.queryParams.subscribe(params => {
    this.isPaidProcess = null
    this.orderName =null
    this.orderId = null
    this.requires_origin_and_destination = null
    this.first_name = null
    this.last_name = null
    this.dni = null
    this.phone_number = null
    this.address = null
    this.email = null
    this.token = null
    this.holder_name = null
    this.expiry_year = null
    this.card_num = null
    this.type = null
    this.expiry_month = null
    this.isHistoryOrder = null;
    this.status = null
    
  });
}

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
          this.navCtrl.navigateForward(['/tabs/carrito']);
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
