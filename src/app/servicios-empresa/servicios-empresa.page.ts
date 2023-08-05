import { Component, OnInit } from '@angular/core';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { AlertController, NavController } from '@ionic/angular';
import { UserDataService } from '../login-registro/userDataService';

@Component({
  selector: 'app-servicios-empresa',
  templateUrl: './servicios-empresa.page.html',
  styleUrls: ['./servicios-empresa.page.scss'],
})
export class ServiciosEmpresaPage implements OnInit {

  servicesNamesList:any;
  noti:any;
  photo:string;

  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController, 
    private userDataService: UserDataService,) {
      this.userDataService.photo$.subscribe(photo => {
        this.photo = photo;
      });
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
          header:'Servicios',
          message: "Error al cargar servicios",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

}
