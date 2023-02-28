import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild, Inject } from '@angular/core';
import { UbicacionService } from 'src/app/ubicacion/ubicacion.service';
import { ModalController } from '@ionic/angular';
import { NgZone } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

@Component({
  selector: 'app-track-servicio',
  templateUrl: './track-servicio.component.html',
  styleUrls: ['./track-servicio.component.scss'],
})
export class TrackServicioComponent implements OnInit {

  origen = { lat: 4.6583, lng: -74.0939 };
  destino = { lat: 4.6768, lng: -74.0482 };

  @Input() position = {
    lat: -2.1676746,
    lng: -79.8956897
  };

  label = {
    titulo: 'Ubicación',
    subtitulo: 'Seleccione la ubicación'
  }

  map: any;
  marker: any;
  infowindow: any;
  positionSet: any;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();


  @ViewChild('map') divMap: ElementRef;

  constructor(private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
    private ubicacionService: UbicacionService,
    public modalController: ModalController,
    public zone: NgZone) {
  }

  ngOnInit(): void {
    this.init();
  }


  async init() {
    this.ubicacionService.init(this.renderer, this.document).then(() => {
      this.initMap();
    }).catch((err) => { console.log(err) })
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
    this.addMarker(position);
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
