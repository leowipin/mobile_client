import { Component, OnInit,ViewChild, ElementRef, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { OrderData } from '../interfaces/client/orderData';
import { ModalController } from '@ionic/angular';
import { TrackServicioComponent } from '../servicios/track-servicio/track-servicio.component';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Renderer2, Injector, Inject} from '@angular/core';
import { environment } from 'src/environments/environment';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { CardData } from '../interfaces/client/cardData';
import { BillingData } from '../interfaces/client/billingData';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  isPaidBtnDisabled:boolean = false;
  modalElement: ElementRef;
  apiKey = environment.googleMapsApiKey;

  origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  constructor(private route: ActivatedRoute, private clienteWAService: ClienteWAService, private alertController: AlertController, private modalController: ModalController, private ubicacionService: UbicacionService, private renderer: Renderer2, private navCtrl: NavController, private router: Router, private modalService: NgbModal, private injector: Injector) { 

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

paidOrder(){
  this.isPaidBtnDisabled = true
  const token = localStorage.getItem('token');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const payload = JSON.parse(atob(base64));
  const uid = payload.user_id.toString()
  const email = payload.user_email
  let datos = {
    "card": {
    "token": this.token
    },
    "user": {
    "id": uid,
    "email": email
    },
    "order":{
      "amount":parseFloat(this.total),
      "description":"servicio de seproamerica",
      "dev_reference":`${uid}-${this.orderId}`,
      "vat":parseFloat(this.iva)
    }
  }
  
  this.clienteWAService.pagar(datos).subscribe({
    next: (response) => {
      console.log(response);
      let bData: BillingData = {
        first_name: this.first_name,
        last_name:this.last_name,
        dni:this.dni,
        email:this.email,
        phone_number:this.phone_number,
        address:this.address,
        pedido:this.orderId
      }
      if (response.transaction.status == 'success') {
        
        this.clienteWAService.sendBillingData(token, bData).subscribe({
          next: (response) => {
            console.log(response)
          },error: (error) => {
            console.log(error)
          }
        });
        this.clienteWAService.changeOrderStatus(token, 'pagado', this.orderId).subscribe({
          next: (response) => {
            console.log(response)
          },
          error: (error) => {
            console.log(error)
            this.alertController.create({
              header: 'Pago Servicio',
              message: 'El pago se ha realizado con éxito, pero nuestros servidores aún no se han actualizado. Por favor, contáctenos para obtener más información y asistencia. ¡Gracias por su comprensión!',
              buttons: [{
                text: 'Aceptar',
                handler: () => {
                  this.navCtrl.navigateForward(['/carrito']);
                }
              }]
            }).then(alert => alert.present());
          }
        });
        this.alertController.create({
          header: 'Pago servicio',
          message: '¡Transacción realizada exitosamente!',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.navCtrl.navigateForward(['/carrito']);
            }
          }]
        }).then(alert => alert.present());
      } else if(response.transaction.status == 'pending'){
        this.openModal(uid, response.transaction.id, "BY_OTP", token, bData, this.orderId)
      } else {
        this.alertController.create({
          header: 'Pago Servicio',
          message: 'Hubo un error. La transacción NO se ha realizado',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.navCtrl.navigateForward(['/carrito']);
            }
          }]
        }).then(alert => alert.present());
      }
    },
    error: (error) => {
      console.log(error);
      this.alertController.create({
        header: 'Pago Servicio',
        message: 'Hubo un error. La transacción NO se ha realizado',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.navigateForward(['/carrito']);
          }
        }]
      }).then(alert => alert.present());
    }
  });
    
  
}

openModal(userid: string, transactionid: string, type: string, token:string, bData:BillingData, orderId:any) {
  const modalRef = this.modalService.open(MyModalComponent, {
    injector: Injector.create({
      providers: [
        { provide: 'userid', useValue: userid },
        { provide: 'transactionid', useValue: transactionid },
        { provide: 'type', useValue: type },
        { provide: 'token', useValue: token },
        { provide: 'bData', useValue: bData },
        { provide: 'orderId', useValue: orderId },
      ],
      parent: this.injector
    })
  });
  this.isPaidBtnDisabled = false;
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

async abrirModal() {
  const modal = await this.modalController.create({
    component: MyModalComponent
  });
  return await modal.present();
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

@Component({
  selector: 'my-modal',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">Código OTP</h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" (click)="activeModal.close('Close click')"></button>
  </div>
  <div class="modal-body">
    <p>Por favor, ingrese el código OTP que ha recibido de su banco para continuar con el proceso.</p>
    <input type="text" class="form-control" [(ngModel)]="otpCode" placeholder="Código OTP">
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-danger" (click)="activeModal.close('Close click')">Cerrar</button>
    <button type="button" class="btn btn-primary" (click)="sendOtp()" [disabled]="isButtonDisabled()">Enviar</button>
  </div>
`,
  styleUrls: ['mymodal.scss']
})
export class MyModalComponent{

  otpCode:string


  constructor(private clienteWAService: ClienteWAService, public activeModal: NgbActiveModal, private alertController: AlertController, private navCtrl: NavController,
    @Inject('userid') public userid: string,
    @Inject('transactionid') public transactionid: string,
    @Inject('type') public type: string,
    @Inject('token') public token: string,
    @Inject('bData') public bData: BillingData,
    @Inject('orderId') public orderId: any,) {
  }


  ngOnInit() {

  }

  sendOtp(){
    console.log(this.otpCode)
    console.log(this.userid)
    console.log(this.transactionid)
    console.log(this.type)
    console.log(this.token)
    console.log(this.bData)
    console.log(this.orderId)
    this.clienteWAService.dinersVerify(this.userid, this.transactionid, this.type, this.otpCode).subscribe({
      next: (response) => {
        console.log(response)
        let alertMessage = this.getAlertMessage(response.status);
        if(response.status === 1){
          this.clienteWAService.sendBillingData(this.token, this.bData).subscribe({
            next: (response) => {
              console.log(response)
            },error: (error) => {
              console.log(error)
            }
          });
          this.clienteWAService.changeOrderStatus(this.token, 'pagado', this.orderId).subscribe({
            next: (response) => {
              console.log(response)
              this.alertController.create({
                header:"Pago servicio",
                message: alertMessage,
                buttons: [
                  {
                    text: 'Aceptar',
                    handler: () => {
                      this.navCtrl.navigateRoot('/carrito');
                    }
                  }
                ]
              }).then(alert => alert.present())
            },
            error: (error) => {
              this.alertController.create({
                header:"Pago servicio",
                message: 'El pago se ha realizado con éxito, pero nuestros servidores aún no se han actualizado. Por favor, contáctenos para obtener más información y asistencia. ¡Gracias por su comprensión!',
                buttons: [
                  {
                    text: 'Aceptar',
                    handler: () => {
                      this.navCtrl.navigateRoot('/carrito');
                    }
                  }
                ]
              }).then(alert => alert.present())
              console.log(error)
            }
          });
        } else {
          this.alertController.create({
            header:"Pago servicio",
            message: alertMessage,
            buttons: [
              {
                text: 'Aceptar',
                handler: () => {
                  this.navCtrl.navigateRoot('/carrito');
                }
              }
            ]
          }).then(alert => alert.present())
        }
        
      },error: (error) => {
        console.log(error)
        this.alertController.create({
          header: "Pago servicio",
          message: 'Hubo un error. La transacción NO se ha realizado',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.navCtrl.navigateForward(['/carrito']);
            }
          }]
        }).then(alert => alert.present());
      }
    });
    this.activeModal.close('Close click');
  }

  isButtonDisabled(): boolean {
    if(this.otpCode == undefined){
      return true
    } else{
      return this.otpCode.length < 6;
    }
    
  }

  getAlertMessage(status: number): string {
    switch (status) {
      case 0:
        return 'Transacción pendiente.';
      case 1:
        return '¡Transacción realizada exitosamente!';
      case 2:
        return 'Transacción cancelada.';
      case 4:
        return 'Transacción rechazada.';
      case 5:
        return 'Transacción expirada.';
      default:
        return 'Estado de transacción desconocido.';
    }
  }
  
}

