import { Component, OnInit} from '@angular/core';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { CardNumber } from '../interfaces/client/cardNumber';

@Component({
  selector: 'app-metododepago',
  templateUrl: './metododepago.page.html',
  styleUrls: ['./metododepago.page.scss'],
})
export class MetododepagoPage implements OnInit {

  cardsList:any;
  currentCardIndex: number;
  noSelectedCard: boolean = true;


  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController) { }

  ionViewWillEnter() {
    this.noSelectedCard = true
    this.getCards();
    
  }


  ngOnInit() {
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
        this.getCurrentCard();
        console.log(this.cardsList)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }
  onSelectionChange(event: any) {
    this.noSelectedCard = false
    this.currentCardIndex = event.target.value
    console.log('Selected index:', this.currentCardIndex);
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

  saveDefaultCard(){
    console.log('Selected index:', this.currentCardIndex);
    const token = localStorage.getItem('token');
    let selectedCard = this.cardsList.cards[this.currentCardIndex];
    let cardType = this.getCardName(selectedCard.type)
    let number = selectedCard.bin
    let newCurrentNumber:CardNumber = {
      current_card:number
    }
    this.alertController.create({
      header: "Guardar tarjeta",
      message: `¿Desea usar la tarjeta ${cardType} con número ${number}*** como pretedeterminada?`,
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
  }

  getCurrentCard(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getCurrentCard(token).subscribe({
      next: (response) => {
        this.currentCardIndex = this.cardsList.cards.findIndex(card => card.bin === response.current_card);
      },
      error: (error) => {
        console.log(error)
      }
    });
  }
}
