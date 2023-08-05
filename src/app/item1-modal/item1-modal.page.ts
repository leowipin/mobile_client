import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ClienteWAService } from '../login-registro/login-registro.service';
@Component({
  selector: 'app-item1-modal',
  templateUrl: './item1-modal.page.html',
  styleUrls: ['./item1-modal.page.scss'],
})
export class Item1ModalPage implements OnInit {

  policy:any;

  constructor(private navCtrl: NavController, private clienteWAService: ClienteWAService) { }

  ngOnInit() {
    this.getPolicy();
  }
  
  getPolicy(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getPolicy(token).subscribe({
      next: (response) => {
        this.policy = response.policy;
      },
      error: (error) => {
        console.log(error)
      }
    });
  }
}
