import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { OrderData } from '../interfaces/client/orderData';

@Component({
  selector: 'app-pedido-carrito',
  templateUrl: './pedido-carrito.page.html',
  styleUrls: ['./pedido-carrito.page.scss'],
})
export class PedidoCarritoPage implements OnInit {

  orderData:OrderData;
  orderName:string;
  requires_origin_and_destination:boolean;
  formattedDuration:string;
  total:any

  constructor(private route: ActivatedRoute, private clienteWAService: ClienteWAService, private alertController: AlertController) { }

  ngOnInit() {
    
    this.getOrder();
  }

  formattingDuration(){
    let hours = Math.floor(this.orderData.duration);
    let minutes = Math.floor((this.orderData.duration - hours) * 60);
    let seconds = Math.round(((this.orderData.duration - hours) * 60 - minutes) * 60);
    this.formattedDuration = `${hours} horas con ${minutes} minutos y ${seconds} segundos`;
  }

  getOrder(){
    const token = localStorage.getItem('token');
    const id = this.route.snapshot.paramMap.get('id');
    this.orderName = this.route.snapshot.paramMap.get('name');
    this.requires_origin_and_destination = this.stringToBoolean(this.route.snapshot.paramMap.get('booleandest'))
    this.clienteWAService.getOrder(token, id).subscribe({
      next: (response) => {
        this.orderData = response
        this.formattingDuration();
        this.total = this.orderData.total
        if(parseFloat(this.total)===0){
          this.total = "pendiente"
        }
        console.log(this.orderData)
      },
      error: (error) => {
        console.log(error)
        this.alertController.create({
          message: "Error al cargar la solicitud",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

  stringToBoolean(str: string): boolean {
    return str.toLowerCase() === 'true';
}
}
