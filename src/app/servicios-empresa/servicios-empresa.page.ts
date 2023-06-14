import { Component, OnInit } from '@angular/core';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-servicios-empresa',
  templateUrl: './servicios-empresa.page.html',
  styleUrls: ['./servicios-empresa.page.scss'],
})
export class ServiciosEmpresaPage implements OnInit {

  servicesNamesList:any;
  noti:any;

  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController, private navCtrl: NavController,) {//
    
   }

  ngOnInit() {
    this.getNames()
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

}
