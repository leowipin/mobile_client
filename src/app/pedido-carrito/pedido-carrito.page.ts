import { Component, OnInit,ViewChild, ElementRef, OnDestroy  } from '@angular/core';
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
  isPaidProcess:boolean;
  isHistoryOrder:boolean;
  status:string;
  transaction_id:string;

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
  constructor(private route: ActivatedRoute, private clienteWAService: ClienteWAService, private alertController: AlertController, private modalController: ModalController, private ubicacionService: UbicacionService, private renderer: Renderer2, private navCtrl: NavController, private router: Router, private modalService: NgbModal, private injector: Injector) { 

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
      if(this.isHistoryOrder){
        const token = localStorage.getItem('token');
        this.clienteWAService.getLeaderStaff(token, this.orderId).subscribe({
          next: (response) => {
            this.leaderData = response
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
    this.formattedDuration = `${hours} horas ${minutes} min ${seconds} seg`;
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
                          this.navCtrl.navigateRoot('/historialservicios');
                        }else{
                          this.navCtrl.navigateRoot('/carrito');
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
  this.navCtrl.navigateForward(['/editarperfil'], { queryParams: queryParams });
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

paid(){
  this.alertController.create({
    header: "Pago Servicio",
    message: "¿Está seguro que desea realizar el pago del servicio?",
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Sí',
        handler: () => {
          this.paidOrder()
        }
      }
    ]
  }).then(alert => alert.present())
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
      let bData: BillingData = {
        first_name: this.first_name,
        last_name:this.last_name,
        dni:this.dni,
        email:this.email,
        phone_number:this.phone_number,
        address:this.address,
        pedido:this.orderId,
        card_num:this.card_num,
        transaction_id:response.transaction.id
      }
      if (response.transaction.status == 'success') {
        
        this.clienteWAService.sendBillingData(token, bData).subscribe({
          next: (response) => {
          },error: (error) => {
          }
        });
        this.clienteWAService.changeOrderStatus(token, 'pagado', this.orderId).subscribe({
          next: (response) => {
          },
          error: (error) => {
            this.alertController.create({
              header: 'Pago Servicio',
              message: 'El pago se ha realizado con éxito, pero nuestros servidores aún no se han actualizado. Por favor, contáctenos para obtener más información y asistencia. ¡Gracias por su comprensión!',
              buttons: [{
                text: 'Aceptar',
                handler: () => {
                  this.navCtrl.navigateRoot(['/carrito']);
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
              this.navCtrl.navigateRoot(['/historialservicios']);
            }
          }]
        }).then(alert => alert.present());
      } else if(response.transaction.status == 'pending'){
        this.openModal(uid, response.transaction.id, "BY_OTP", token, bData, this.orderId) //bootstrap modal
      } else {
        this.alertController.create({
          header: 'Pago Servicio',
          message: 'Hubo un error. La transacción NO se ha realizado',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.navCtrl.navigateRoot(['/carrito']);
            }
          }]
        }).then(alert => alert.present());
      }
    },
    error: (error) => {
      this.alertController.create({
        header: 'Pago Servicio',
        message: 'Hubo un error. La transacción NO se ha realizado',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.navigateRoot(['/carrito']);
          }
        }]
      }).then(alert => alert.present());
    }
  });
    
  
}

openModal(userid: string, transactionid: string, type: string, token:string, bData:BillingData, orderId:any) { //bootstrap modal
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
              this.navCtrl.navigateRoot(['/historialservicios']);
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
              this.navCtrl.navigateRoot(['/historialservicios']);
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
              this.navCtrl.navigateRoot(['/historialservicios']);
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

@Component({ //bootstrap modal
  selector: 'my-modal',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">Código OTP</h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" (click)="activeModal.close('Close click')"></button>
  </div>
  <div class="modal-body">
    <p>Ingrese el código OTP que ha recibido de su banco para continuar con el proceso.</p>
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
    this.clienteWAService.dinersVerify(this.userid, this.transactionid, this.type, this.otpCode).subscribe({
      next: (response) => {
        let alertMessage = this.getAlertMessage(response.status);
        if(response.status === 1){
          this.clienteWAService.sendBillingData(this.token, this.bData).subscribe({
            next: (response) => {
            },error: (error) => {
            }
          });
          this.clienteWAService.changeOrderStatus(this.token, 'pagado', this.orderId).subscribe({
            next: (response) => {
              this.alertController.create({
                header:"Pago servicio",
                message: alertMessage,
                buttons: [
                  {
                    text: 'Aceptar',
                    handler: () => {
                      this.navCtrl.navigateRoot('/historialservicios');
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
        this.alertController.create({
          header: "Pago servicio",
          message: 'Hubo un error. La transacción NO se ha realizado',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.navCtrl.navigateRoot(['/carrito']);
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

