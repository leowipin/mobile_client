import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx'
import { ClienteWAService } from './servicios/login-registro/login-registro.service';
import { UserDataService } from './servicios/login-registro/userDataService';
import { FCM } from '@capacitor-community/fcm';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

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

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private barcodeScanner: BarcodeScanner, private clienteWAService: ClienteWAService, private userDataService: UserDataService) {
    this.userDataService.nombreur$.subscribe(nombreur => {
      this.nombreur = nombreur;
    });
    this.userDataService.apellidour$.subscribe(apellidour => {
      this.apellidour = apellidour;
    });
   }

  myDate: String = new Date().toISOString();

  openPage() {
    this.navCtrl.navigateForward("/homeperfil");
  }


  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.navCtrl.navigateRoot('/servicios-empresa');
    } else{
      this.navCtrl.navigateRoot('/login')
    }
    // Actualizar detalles del usuario en el menú de hamburguesas
    this.initPushNotifications();
    this.actualizarUsuario();
  }
  
  actualizarUsuario() {
    // Recuperar token del LocalStorage
    const token = localStorage.getItem('token');
  
    if (token) {
      // Hacer una solicitud HTTP para obtener detalles del usuario
      this.clienteWAService.getNames(token).subscribe(
        (response) => {
          // Actualizar detalles del usuario en el menú de hamburguesas
          this.nombreur = response.first_name;
          this.apellidour = response.last_name;
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
    console.log('Initializing HomePage');

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
        alert('Push registration success, token: ' + token.value);
        this.userDataService.updateTokenfcm(token.value);
      });
  
      PushNotifications.addListener('registrationError', (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      });
  
      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          alert('Push received: ' + JSON.stringify(notification));
        },
      );
  
      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          alert('Push action performed: ' + JSON.stringify(notification));
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
