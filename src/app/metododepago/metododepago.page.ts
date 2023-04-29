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
  usedCard: number;


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
        console.log(response)
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
        this.usedCard = this.currentCardIndex
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  deleteCard(value) {
    this.presentAlertConfirm(value);
    console.log(value)
    console.log(this.currentCardIndex)
    console.log(this.usedCard)
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
            if(this.usedCard.toString() === value){
              let index = value; // El índice de la tarjeta que quieres excluir
              let bins = this.cardsList.cards
              .filter((card, i) => i !== parseInt(index))
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
