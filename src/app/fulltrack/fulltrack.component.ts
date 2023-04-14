import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild, Inject } from '@angular/core';
import { UbicacionService } from 'src/app/ubicacion/ubicacion.service';
import { AlertController, ModalController } from '@ionic/angular';
import { NgZone } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

// La diferencia entre fulltrack y track-servicio es que
// track servicio se encarga de mostrar la ruta al inicio en la solicitud
// mientras que el objetivo de fulltrack es realizar el seguimiento gps
// del vehículo que presta el servicio.

@Component({
  selector: 'app-fulltrack',
  templateUrl: './fulltrack.component.html',
  styleUrls: ['./fulltrack.component.scss'],
})
export class FulltrackComponent implements OnInit {

  origen : { lat: 0, lng: 0 };
  destino = { lat: 0, lng: 0 };
 
  map: any;
  marker: any;
  infowindow: any;
  positionSet: any;
  directionsService: any;
  directionsDisplay: any;
  


  @ViewChild('map') divMap: ElementRef;

  constructor(private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
    private ubicacionService: UbicacionService,
    public modalController: ModalController,
    public zone: NgZone, private alertController: AlertController) {
  }

  ngOnInit(): void {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.init();
  }


  async init() {
    this.ubicacionService.init(this.renderer, this.document).then(() => {
      this.initMap();
    }).catch((err) => {
      console.log(err); })
  }

  initMap() {
    const position = this.origen;

    let latLng = new google.maps.LatLng(position.lat, position.lng);

    let mapOptions = {
      center: latLng,
      zoom: 20,
      disableDefaultUI: true,
      clickableIcons: true,
    };

    this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
    });
    this.clickHandleEvent();
    this.infowindow = new google.maps.InfoWindow();
    //this.addMarker(position);
    this.directionsDisplay.setMap(this.map);
    this.calculateRoute();
    //this.setInfoWindow(this.marker, this.label.titulo, this.label.subtitulo);
  }

  public calculateRoute() {
    this.directionsService.route({
      origin: this.origen,
      destination: this.destino,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert("No se pudo calcular la ruta: " + status);
      }
    });
  }

  clickHandleEvent() {

    this.map.addListener('click', (event: any) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.addMarker(position);
    });

  }

  addMarker(position: any): void {

    let latLng = new google.maps.LatLng(position.lat, position.lng);

    this.marker.setPosition(latLng);
    this.map.panTo(position);
    this.positionSet = position;

  }


  setInfoWindow(marker: any, titulo: string, subtitulo: string) {

    const contentString = '<div id="contentInsideMap">' +
      '<div>' +
      '</div>' +
      '<p style="font-weight: bold; margin-bottom: 5px;">' + titulo + '</p>' +
      '<div id="bodyContent">' +
      '<p class"normal m-0">'
      + subtitulo + '</p>' +
      '</div>' +
      '</div>';
    this.infowindow.setContent(contentString);
    this.infowindow.open(this.map, marker);

  }

  async mylocation() {

    console.log('mylocation() click')

    Geolocation.getCurrentPosition().then((res) => {

      console.log('mylocation() -> get ', res);

      const position = {
        lat: res.coords.latitude,
        lng: res.coords.longitude,
      }
      this.addMarker(position);

    });

  }

  aceptar() {  
    this.modalController.dismiss({ pos: this.positionSet })
  }


}
