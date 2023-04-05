import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  
  apiKey = environment.googleMapsApiKey;

  mapsLoaded = false;

  constructor() { }

  init (renderer: any, document: any): Promise<any> {

    return new Promise((resolve) => {

      if (this.mapsLoaded){
        console.log('google is preview loaded')
        resolve(true);
        return;
      }

      const scriptmaps = renderer.createElement('script');
      scriptmaps.id = 'googleMaps'

      const scriptplaces = renderer.createElement('script');
      scriptplaces.id = 'googlePlaces'

      window['mapInit'] = () => {
        this.mapsLoaded = true;
        if (google) {
          console.log('google is loaded');
        }else{
          console.log('google is not Defined');
        }
        resolve(true);
        return;
      }

      if(this.apiKey){
        scriptmaps.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + this.apiKey + '&callback=mapInit';
    } else {
        scriptmaps.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';       
    }

    renderer.appendChild(document.body, scriptmaps);
      
    });

  }
}
