import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pedido-carrito',
  templateUrl: './pedido-carrito.page.html',
  styleUrls: ['./pedido-carrito.page.scss'],
})
export class PedidoCarritoPage implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id)
  }

}
