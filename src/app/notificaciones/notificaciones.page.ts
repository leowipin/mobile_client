import { Component, OnInit, Inject, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertController, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  constructor(private route: ActivatedRoute, private clienteWAService: ClienteWAService, private modalService: NgbModal, private injector: Injector, private alertController: AlertController) { }

  id:number;
  notifications:any;
  notification:any;

  ionViewWillEnter(){
    
  }
  
  ngOnInit() {
    this.getNotifications();
    this.route.queryParams.subscribe(params => {
      this.id = parseInt(params['id']);
  });
  
  }

  getNotifications(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getNotifications(token).subscribe({
      next: (response) => {
        this.notifications = response
        if(this.id != undefined){
          let index = this.notifications.findIndex(notification => notification.id === this.id);
          let noti = this.notifications[index];
          this.openModal(noti.title, noti.message, noti.url_img)
        }
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  showNotification(value){
    let noti = this.notifications[value];
    this.openModal(noti.title, noti.message, noti.url_img)
  }

  async presentDeleteConfirmation() {
    const alert = await this.alertController.create({
      header: 'Eliminar notificaciones',
      message: '¿Estas seguro que deseas eliminar todas las notificaciones?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteNotifications();
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  deleteNotifications() {
    const token = localStorage.getItem('token');
    this.clienteWAService.deleteNotifications(token).subscribe({
      next: async (response) => {
        const alert = await this.alertController.create({
          header: 'Eliminar notificaciones',
          message: 'Las notificaciones se han eliminado correctamente',
          buttons: [ {
            text: 'Aceptar',
            handler: () => {
              this.getNotifications();
            }
          }]
        });
        await alert.present();
      },
      error: async (error) => {
        console.log(error);
        const alert = await this.alertController.create({
          header: 'Eliminar notificaciones',
          message: 'Las notificaciones no han podido ser eliminadas',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    });
  }

  openModal(title:string, message:string, url_img:string|null) { //bootstrap modal
    const modalRef = this.modalService.open(MyModalComponent, {
      centered: true,
      injector: Injector.create({
        providers: [
          { provide: 'title', useValue: title },
          { provide: 'message', useValue: message },
          { provide: 'url_img', useValue: url_img },
        ],
        parent: this.injector
      })
    });
  }

}

@Component({ //bootstrap modal
  selector: 'my-modal',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">{{title}}</h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" (click)="activeModal.close('Close click')"></button>
  </div>
  <div class="modal-body">
    <p>{{message}}</p>
    <ng-container *ngIf="url_img === null">
      <ion-img *ngIf="message.includes('aceptado') && message.includes('Guardia de seguridad')" src="assets/img/Guardia de seguridad verde.png"></ion-img>
      <ion-img *ngIf="message.includes('aceptado') && message.includes('Transporter')" src="assets/img/Transporter verde.png"></ion-img>
      <ion-img *ngIf="message.includes('aceptado') && message.includes('Chofer seguro')" src="assets/img/Chofer seguro verde.png"></ion-img>
      <ion-img *ngIf="message.includes('aceptado') && message.includes('Custodia armada')" src="assets/img/Custodia armada verde.png"></ion-img>
      <ion-img *ngIf="message.includes('rechazado') && message.includes('Guardia de seguridad')" src="assets/img/Guardia de seguridad rojo.png"></ion-img>
      <ion-img *ngIf="message.includes('rechazado') && message.includes('Transporter')" src="assets/img/Transporter rojo.png"></ion-img>
      <ion-img *ngIf="message.includes('rechazado') && message.includes('Chofer seguro')" src="assets/img/Chofer seguro rojo.png"></ion-img>
      <ion-img *ngIf="message.includes('rechazado') && message.includes('Custodia armada')" src="assets/img/Custodia armada rojo.png"></ion-img>
      <ion-img *ngIf="(message.includes('aceptado') && !message.includes('Guardia de seguridad') && !message.includes('Transporter') && !message.includes('Chofer seguro') && !message.includes('Custodia armada'))" src="assets/img/checkmark.png"></ion-img>
      <ion-img *ngIf="(message.includes('rechazado') && !message.includes('Guardia de seguridad') && !message.includes('Transporter') && !message.includes('Chofer seguro') && !message.includes('Custodia armada'))" src="assets/img/x.png"></ion-img>
    </ng-container>
  </div>
  <div class="modal-footer justify-content-center" *ngIf="url_img === null">
    <button type="button" class="green-button" (click)="goToCart()">Ir a carrito</button>
  </div>
`,
  styleUrls: ['mymodal.scss']
})
export class MyModalComponent{

  constructor(private clienteWAService: ClienteWAService, public activeModal: NgbActiveModal, private alertController: AlertController, private navCtrl: NavController, private modalController: ModalController,
    @Inject('title') public title: string,
    @Inject('message') public message: string,
    @Inject('url_img') public url_img: string|null) {
  }


  ngOnInit() {
  }

  goToCart() {
    this.navCtrl.navigateRoot(['/tabs/carrito']).then(() => {
      this.activeModal.close();
    });
  }

}
