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
  //currentCardIndex: number;
  //noSelectedCard: boolean = true;
  //usedCard: number;


  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController, private navCtrl: NavController, private route: ActivatedRoute) { }

  ionViewWillEnter() {
    //this.noSelectedCard = true
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
  /*onSelectionChange(event: any) {
    this.noSelectedCard = false
    this.currentCardIndex = event.target.value
    console.log('Selected index:', this.currentCardIndex);
  }*/
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
        bin:arrayCard[3],
        type:arrayCard[4],
        expiry_month:arrayCard[5]
      };
      this.navCtrl.navigateForward(['/pedido-carrito'], { queryParams: queryParams });
    }
  }

  /*saveDefaultCard(){
    const token = localStorage.getItem('token');
    let selectedCard = this.cardsList.cards[this.currentCardIndex];
    let cardType = this.getCardName(selectedCard.type)
    let number = selectedCard.bin
    let newCurrentNumber:CardNumber = {
      current_card:number
    }
    this.alertController.create({
      header: "Guardar tarjeta",
      message: `¿Desea usar la tarjeta ${cardType} con número ${number}*** como predeterminada?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.clienteWAService.changeCurrentCard(token, newCurrentNumber).subscribe({
              next: (response) => {
                this.usedCard = this.currentCardIndex
                this.noSelectedCard = true
                this.alertController.create({
                  header: "Tarjeta actualizada",
                  message: "Tarjeta actualizada correctamente",
                  buttons: ['Aceptar']
                }).then(alert => alert.present())
              },
              error: (error) => {
                this.alertController.create({
                  header: "Error al actualizar tarjeta",
                  message: "Hubo un error al actualizar la tarjeta",
                  buttons: ['Aceptar']
                }).then(alert => alert.present())
              }
            });
          }
        }
      ]
    }).then(alert => alert.present())
  }*/

  /*getCurrentCard(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getCurrentCard(token).subscribe({
      next: (response) => {
        console.log(response)
        if(response.current_card != null){
          this.currentCardIndex = this.cardsList.cards.findIndex(card => card.bin === response.current_card);
          this.usedCard = this.currentCardIndex
        }
        
      },
      error: (error) => {
        console.log(error)
      }
    });
  }*/

  deleteCard(value) {
    this.presentAlertConfirm(value);
    console.log(value)
    //console.log(this.currentCardIndex)
  }

  async presentAlertConfirm(value) {
    let index = parseInt(value); // Convierte el valor de value a un número
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
            /*if(this.usedCard!= null && this.usedCard.toString() === value && this.cardsList.cards.filter(card => card.status === 'valid').length > 1){
              let index = value;
              let bins = this.cardsList.cards
              .filter((card, i) => i !== parseInt(index) && card.status == 'valid')
              .map(card => card.bin);
              let newBin = bins[Math.floor(Math.random() * bins.length)];
              console.log(newBin);
              console.log(bins);
              let newCurrentNumber:CardNumber = {
                current_card:newBin
              }
              this.clienteWAService.changeCurrentCard(token, newCurrentNumber).subscribe({
                next: (response) => {
                },
                error: (error) => {
                }
              });
            } 
            if(this.cardsList.cards.filter(card => card.status === 'valid').length == 1 && this.usedCard != null){
              let newCurrentNumber:CardNumber = {
                current_card:null
              }
              this.clienteWAService.changeCurrentCard(token, newCurrentNumber).subscribe({
                next: (response) => {
                  console.log(response)
                },
                error: (error) => {
                  console.log(error)
                }
              });
            }*/
            this.clienteWAService.eliminarTarjeta(datos).subscribe({
              next: (response) => {
                console.log(response)
                //this.usedCard = undefined
                //this.currentCardIndex = undefined
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
