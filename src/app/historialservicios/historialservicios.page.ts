import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-historialservicios',
  templateUrl: './historialservicios.page.html',
  styleUrls: ['./historialservicios.page.scss'],
})

export class HistorialserviciosPage implements OnInit {
 

  constructor(private route: ActivatedRoute,private modalController: ModalController, private navCtrl: NavController) { }

  ngOnInit() {

  }  

}
