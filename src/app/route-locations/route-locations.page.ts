import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-route-locations',
  templateUrl: './route-locations.page.html',
  styleUrls: ['./route-locations.page.scss'],
})
export class RouteLocationsPage implements OnInit {
  origen = {
    lat: -2.19616,
    lng: -79.88621
  };
  destino = {
    lat: -2.19616,
    lng: -79.88621
  };

  constructor() { }

  ngOnInit() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();

    var mapOptions = {
      zoom: 7,
      center: this.origen
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);

    var request = {
      origin: this.origen,
      destination: this.destino,
      travelMode: 'DRIVING'
    };

    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
  }
}
