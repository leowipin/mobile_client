import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ClienteWAService } from '../login-registro/login-registro.service';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.page.html',
  styleUrls: ['./politicas.page.scss'],
})
export class PoliticasPage implements OnInit {

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

  backToProfile(){
    this.navCtrl.navigateBack("/tabs/perfil")
  }
}
