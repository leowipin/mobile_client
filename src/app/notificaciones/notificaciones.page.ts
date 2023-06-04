import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  constructor(private route: ActivatedRoute) { }

  id:string;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      // Use the id as needed
  });
  }

}
