import { Component, OnInit } from '@angular/core';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  cart:any;

  constructor(private clienteWAService: ClienteWAService, private alertController: AlertController,) { }

  ngOnInit() {
    this.getCart();
  }

  getCart(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getCart(token).subscribe({
      next: (response) => {
        this.cart = response;
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

}
