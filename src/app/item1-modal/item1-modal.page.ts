import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-item1-modal',
  templateUrl: './item1-modal.page.html',
  styleUrls: ['./item1-modal.page.scss'],
})
export class Item1ModalPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  regresar() {
    //this.navCtrl.navigateForward("/registrar");
    this.navCtrl.navigateBack("/registrar");
    }
}
