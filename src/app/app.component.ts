import { Component, Inject, Injector } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx'
import { ClienteWAService } from './servicios/login-registro/login-registro.service';
import { UserDataService } from './servicios/login-registro/userDataService';
import { FCM } from '@capacitor-community/fcm';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Subscription } from 'rxjs';
import { NotificationsService } from './servicios/login-registro/notifiactionsService';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

let listenerAdded = false;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  recibido: any;
  nombreur: any;
  apellidour: any;
  private unsubscribe: Subscription;
  isPushNotification:boolean = false;
  uid:any;
  photo:string;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private barcodeScanner: BarcodeScanner, 
    private clienteWAService: ClienteWAService, private userDataService: UserDataService, private db: AngularFirestore, 
    private notificationsService: NotificationsService, private alertController: AlertController, private modalService: NgbModal,
    private injector: Injector, private storage: AngularFireStorage) {
    this.userDataService.nombreur$.subscribe(nombreur => {
      this.nombreur = nombreur;
    });
    this.userDataService.apellidour$.subscribe(apellidour => {
      this.apellidour = apellidour;
    });
    this.userDataService.photo$.subscribe(photo => {
      this.photo = photo;
    });
    this.notificationsService.miObservable.subscribe(() => {
      this.initFirestoreDocument();
    });
   }

  myDate: String = new Date().toISOString();

  listenForNotifications() { //notificaciones in app SOLO PARA 
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    const uid = payload.user_id.toString()
    const userRef: AngularFirestoreDocument<any> = this.db.collection('notificaciones').doc(uid);
    this.createDocumentIfNotExists(userRef);
    this.unsubscribe = userRef.valueChanges().subscribe(data => {
      if (data) {
        if(data.notifications.length > 0 && !this.isPushNotification){
          const notification = data.notifications[data.notifications.length-1];
          this.openModal(notification.title, notification.message, null);
        }
        this.updateDocumentIfItExists(userRef, []);
        this.isPushNotification = false;
      }
    });
  }

  stopListeningForNotifications() {
    // Cuando ya no necesites escuchar los cambios en el documento, puedes llamar a la función unsubscribe para dejar de escuchar los cambios
    if (this.unsubscribe) {
        this.unsubscribe.unsubscribe();
    }
  }

  createDocumentIfNotExists(userRef: AngularFirestoreDocument<any>) {
    userRef.get().subscribe(docSnapshot => {
      if (!docSnapshot.exists) {
        userRef.set({ notifications: [] });
      }
    });
  }
  
  updateDocumentNotifications(userRef: AngularFirestoreDocument<any>, notifications: any[]) {
    console.log("se actualiza")
    userRef.update({ notifications });
  }

  updateDocumentIfItExists(userRef: AngularFirestoreDocument<any>, notifications: any[]) {
    userRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        if (data && data.notifications && data.notifications.length != 0) {
          this.updateDocumentNotifications(userRef, notifications);
          
        }
      } else {}
    });
  }
  
  

  openPage() {
    this.navCtrl.navigateForward(['/homeperfil'], {
      queryParams: {
          photo: this.photo
      }
  });
  }


  ngOnInit() {
    console.log("212")
    this.getProfilePicture();
    const token = localStorage.getItem('token');
    if (token) {
      this.navCtrl.navigateRoot('/servicios-empresa');
    } else{
      this.navCtrl.navigateRoot('/login')
    }
    // Actualizar detalles del usuario en el menú de hamburguesas
    this.initPushNotifications();
    this.actualizarUsuario();
    
    if(token){
      this.initFirestoreDocument();
    }

  }

  initFirestoreDocument(){
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    const uid = payload.user_id.toString()
    const userRef: AngularFirestoreDocument<any> = this.db.collection('notificaciones').doc(uid);
    this.updateDocumentIfItExists(userRef, []);
    this.listenForNotifications();
  }
  
  actualizarUsuario() {
    // Recuperar token del LocalStorage
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    const uid = payload.user_id.toString()
    this.userDataService.updateUid(uid);
    if (token) {
      this.userDataService.updateTokenfcm(token);
      // Hacer una solicitud HTTP para obtener detalles del usuario
      this.clienteWAService.getNames(token).subscribe(
        (response) => {
          // Actualizar detalles del usuario en el menú de hamburguesas
          //this.nombreur = response.first_name;
          this.userDataService.updateNombreur(response.first_name)
          this.userDataService.updateApellidour(response.last_name)
          //this.apellidour = response.last_name;
        },
        (error) => {
          // Manejar el error de la solicitud HTTP
          console.log(error);
        }
      );
    } else {
      // Si el token no está presente en el LocalStorage, mostrar el menú de hamburguesas con el nombre y apellido por defecto
      this.nombreur = "Nombre";
      this.apellidour = "Apellido";
    }
  }

  initPushNotifications(){
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        FCM.subscribeTo({ topic: 'cliente' });
      } else {
        // Show some error
      }
    });
    if(!listenerAdded){
      PushNotifications.addListener('registration', (token: Token) => {
        this.userDataService.updateTokenfcm(token.value);
      });
  
      PushNotifications.addListener('registrationError', (error: any) => {
      });
  
      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
        },
      );
  
      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          this.isPushNotification = true;
          let id = notification.notification.data.noti_id;
          this.navCtrl.navigateForward(['/notificaciones'], {
            queryParams: {
                id: id
            }
        });
        },
      );
      listenerAdded = true;
    }
    
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

  async getProfilePicture(){
    this.getUid();
    const filePath = `profilePictures/${this.uid}`;
    const fileRef = this.storage.ref(filePath);
    try {
      this.photo = await fileRef.getDownloadURL().toPromise();
    } catch (error) {
      this.photo = 'assets/img/backcliente.png';
    }
  }

  getUid(){
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    this.uid = payload.user_id.toString()
  }

// Idealmente con el QR Generado por el BackEnd 
// Se redirecciona a la ventana de calificación

  startScan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Error', err);
    });
  }

  signOut() {
    localStorage.removeItem('token');
    location.reload();
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
    <ion-img src="assets/img/checkmark.png"></ion-img>
  </div>
  <div class="modal-footer justify-content-center" *ngIf="url_img === null">
    <button type="button" class="btn btn-primary rounded-pill border-0" (click)="goToCart()">Ir a carrito</button>
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
    this.navCtrl.navigateRoot(['/carrito']).then(() => {
      this.activeModal.close();
    });
  }

}

