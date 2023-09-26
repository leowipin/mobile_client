import { Component, OnInit } from '@angular/core';
import { ClienteWAService } from '../login-registro/login-registro.service';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.page.html',
  styleUrls: ['./contactanos.page.scss'],
})
export class ContactanosPage implements OnInit {

  info:any;

  constructor(private clienteWAService:ClienteWAService) { }

  ngOnInit() {
    this.getInfo();
  }

  getInfo(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getInfo(token).subscribe({
      next: (response) => {
        this.info = response;
        console.log(this.info)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

}
