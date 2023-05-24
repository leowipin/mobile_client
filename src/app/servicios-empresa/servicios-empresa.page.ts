import { Component, OnInit } from '@angular/core';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController, NavController } from '@ionic/angular';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

let listenerAdded = false;

@Component({
  selector: 'app-servicios-empresa',
  templateUrl: './servicios-empresa.page.html',
  styleUrls: ['./servicios-empresa.page.scss'],
})
export class ServiciosEmpresaPage implements OnInit {

  servicesNamesList:any;

  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController, private navCtrl: NavController,) { }

  ngOnInit() {
    this.getNames()
    this.initPushNotifications()
  }

  getNames(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getServicesName(token).subscribe({
      next: (response) => {
        this.servicesNamesList = response;
      },
      error: (error) => {
        this.alertController.create({
          message: "Error al cargar servicios",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
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
      } else {
        // Show some error
      }
    });
    if(!listenerAdded){
      PushNotifications.addListener('registration', (token: Token) => {
        alert('Push registration success, token: ' + token.value);
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
          this.navCtrl.navigateForward('/notificaciones');
        },
      );
      listenerAdded = true;
    }
    
  }
}
