import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild, Inject } from '@angular/core';
import { UbicacionService } from './ubicacion.service';
import { ModalController } from '@ionic/angular';
import { NgZone } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss'],
})
export class UbicacionComponent implements OnInit {

  autocomplete: { input: string; };
  GoogleAutocomplete: any;
  autocompleteItems: any[];

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
  direction: any;

  @ViewChild('map') divMap: ElementRef;

  constructor(private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
    private ubicacionService: UbicacionService,
    public modalController: ModalController,
    public zone: NgZone) {
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
  }

  ngOnInit(): void {
    this.init();
  }

  UpdateSearchResults() {
    console.log(this.autocomplete.input)
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (status === 'OK') {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              //console.log(prediction)
              this.autocompleteItems.push(prediction);
            });
          });
        } else {
          // Handle the case where status is not 'OK'
          console.error('Error retrieving place predictions:', status);
        }
      });
  }

  async SelectSearchResult(item) {
    console.log(item.place_id)
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ placeId: item.place_id })
    .then(({ results }) => {
      if (results[0]) {
        console.log(results[0].geometry.location.lat());
        console.log(results[0].geometry.location.lng());
        this.position.lat = results[0].geometry.location.lat();
        this.position.lng = results[0].geometry.location.lng();
        this.addMarker(this.position);
        
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
  }

  ClearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

  async init() {
    this.ubicacionService.init(this.renderer, this.document).then(() => {
      this.initMap();
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    }).catch((err) => { console.log(err) })
  }

  initMap() {

    const position = this.position;

    let latLng = new google.maps.LatLng(position.lat, position.lng);

    let mapOptions = {
      center: latLng,
      zoom: 20,
      disableDefaultUI: false,
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
    //this.setInfoWindow(this.marker, this.label.titulo, this.label.subtitulo);

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
    this.findPlaces(this.positionSet);

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

  findPlaces(direction: any) {

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: direction })
      .then(({ results }) => {
        if (results[0]) {
          this.direction = results[0].formatted_address;
        }
        else {
          this.direction = this.position;
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }

  aceptar() {
    //console.log('click aceptar -> ', this.positionSet);
    this.modalController.dismiss({ pos: this.positionSet, dir: this.direction })
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
