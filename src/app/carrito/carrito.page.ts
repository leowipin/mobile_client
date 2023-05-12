import { Component, OnInit } from '@angular/core';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  cart:any;

  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController, private navCtrl: NavController) { }

  ionViewWillEnter() {
    this.getCart();
  }
  ngOnInit(): void {
    
  }

  getCart(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getCart(token).subscribe({
      next: (response) => {
        this.cart = response;
        this.cart.sort((a, b) => new Date(b.date_request).getTime() - new Date(a.date_request).getTime());
        console.log(this.cart)
      },
      error: (error) => {
        this.alertController.create({
          message: "Error al cargar el carrito",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

  goToPedido(id, name, requires_origin_and_destination, status){
    let queryParams = {
      id: id,
      name: name,
      booleandest: requires_origin_and_destination,
      status: status,
      isHistoryOrder:false,
      isPaidProcess:false
    };
    console.log(queryParams)
    this.navCtrl.navigateForward(['/pedido-carrito'], { queryParams: queryParams });
  }

}
