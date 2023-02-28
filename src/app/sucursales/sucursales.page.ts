import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.page.html',
  styleUrls: ['./sucursales.page.scss'],
})
export class SucursalesPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  irPaginaSucursal(){
    this.navCtrl.navigateForward("/sucursal");
  }

}
