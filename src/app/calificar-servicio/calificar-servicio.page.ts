import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-calificar-servicio',
  templateUrl: './calificar-servicio.page.html',
  styleUrls: ['./calificar-servicio.page.scss'],
})
export class CalificarServicioPage implements OnInit {

  currentRate = 5;
  boolClick = false;

  constructor(private navCtrl: NavController) { }



  ngOnInit() {
  }

  regresar() {
    this.navCtrl.navigateForward("/historialservicios");
  }

  star(numero: number) {
    this.currentRate = numero;
    if (!this.boolClick) {
      this.boolClick = true;
      for (var i = 1; i <= numero; i++) {
        var id = i.toString();
        document.getElementById(id).setAttribute("name", "star");
        document.getElementById(id).setAttribute("style", "color:#00B7FF");
        
      }
    }
    else {
      this.reset();
      this.star(numero);
    }
  }

  reset() {
    for (var i = 1; i <= 5; i++) {
      var id = i.toString();
      document.getElementById(id).setAttribute("name", "star-outline");
    }
    this.boolClick = false
  }

  seleccionar() {
    console.log("Calificación: " + this.currentRate + " estrellas")
    alert("Calificación recibida: " + this.currentRate + " estrellas")
    this.navCtrl.navigateForward("/historialservicios");

  }

}
