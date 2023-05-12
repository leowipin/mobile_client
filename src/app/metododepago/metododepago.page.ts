import { Component, OnInit} from '@angular/core';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CardNumber } from '../interfaces/client/cardNumber';

@Component({
  selector: 'app-metododepago',
  templateUrl: './metododepago.page.html',
  styleUrls: ['./metododepago.page.scss'],
})
export class MetododepagoPage implements OnInit {

  cardsList:any;
  isPaidProcess:boolean =false;
  orderName:string;
  orderId: any;
  requires_origin_and_destination:boolean;
  first_name:string;
  last_name:string;
  dni:string;
  phone_number:string;
  address:string;
  email:string;


  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController, private navCtrl: NavController, private route: ActivatedRoute) { }

  ionViewWillEnter() {
    this.getCards();
    
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['isPaidProcess'] != undefined){
        this.isPaidProcess = params['isPaidProcess'] === 'true';
        this.orderName = params['name']
        this.orderId = params['id']
        this.requires_origin_and_destination = params['booleandest']
        this.first_name = params['first_name'],
        this.last_name = params['last_name'],
        this.dni = params['dni'],
        this.phone_number = params['phone_number'],
        this.address = params['address'],
        this.email = params['email']
      }
    });
    console.log();
  }

  getCards(){
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    const uid = payload.user_id.toString()
    this.clienteWAService.getTarjetas(uid).subscribe({
      next: (response) => {
        this.cardsList = response
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  getCardName(type: string): string {
    switch (type) {
      case 'vi':
        return 'Visa';
      case 'mc':
        return 'Mastercard';
      case 'ax':
        return 'American Express';
      case 'dc':
        return 'Discover';
      case 'di':
        return 'Diners';
      case 'ms':
        return 'Maestro';
      case 'cs':
        return 'Credisensa';
      case 'so':
          return 'Solidario';
      case 'up':
        return 'Union Pay';
      default:
        return type;
    }
  }

  backToProfile(value:boolean){
    let queryParams = {
      isProfileInformation: value
    };
    this.navCtrl.navigateForward(['/editarperfil'],);
  }

  goToDetail(value){
    let arrayCard = value.split('-')
    if(this.isPaidProcess){
      let queryParams = {
        isPaidProcess:this.isPaidProcess,
        name:this.orderName,
        id:this.orderId,
        booleandest:this.requires_origin_and_destination,
        first_name:this.first_name,
        last_name:this.last_name,
        dni:this.dni,
        phone_number:this.phone_number,
        address:this.address,
        email:this.email,
        token:arrayCard[0],
        holder_name:arrayCard[1],
        expiry_year:arrayCard[2],
        card_num:arrayCard[3],
        type:arrayCard[4],
        expiry_month:arrayCard[5]
      };
      this.navCtrl.navigateForward(['/pedido-carrito'], { queryParams: queryParams });
    }
  }

  deleteCard(value) {
    this.presentAlertConfirm(value);
    console.log(value)
  }

  async presentAlertConfirm(value) {
    let index = parseInt(value);
    let typeCard = this.getCardName(this.cardsList.cards[index].type);
    let bin = this.cardsList.cards[index].bin;
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar la tarjeta ${typeCard} con número ${bin} permanentemente?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Sí',
          handler: () => {
            console.log('Confirm clicked');
            const token = localStorage.getItem('token');
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const payload = JSON.parse(atob(base64));
            const uid = payload.user_id.toString()
            console.log(uid)
            let tokenCard = this.cardsList.cards[value].token;
            console.log(tokenCard)
            let datos = {
              "card": {
              "token": tokenCard
              },
              "user": {
              "id": uid
              }
            }
            this.clienteWAService.deleteCard(token, tokenCard).subscribe({
              next: (response) => {
                console.log(response)
                },
              error: (error) => {
                console.log(error)
              }
            }); 

            this.clienteWAService.eliminarTarjeta(datos).subscribe({
              next: (response) => {
                console.log(response)
                this.presentAlertDeleted();
              },
              error: (error) => {
                console.log(error)
              }
            });
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async presentAlertDeleted() {
    const alert = await this.alertController.create({
      header: 'Tarjeta eliminada',
      message: 'La tarjeta ha sido eliminada correctamente.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.getCards();
          }
        }
      ]
    });
  
    await alert.present();
  }
}
