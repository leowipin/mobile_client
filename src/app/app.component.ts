import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { saveConfig } from '@ionic/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  recibido: any;
  nombreur: any;
  apellidour: any;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private barcodeScanner: BarcodeScanner) { }

  myDate: String = new Date().toISOString();

  openPage() {
    this.navCtrl.navigateForward("/homeperfil");
  }


  ngOnInit() {
/*
    this.route.queryParams.subscribe(params => {
      console.log(params); // { order: "popular" 
      this.recibido = params;
      this.nombreur = this.recibido.datos.name;
      this.apellidour = this.recibido.datos.lastname;
    }
    );
  */
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


}
