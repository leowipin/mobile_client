import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  service:any;
  constructor() { 
    this.service= ""; 
  } 
  setService(value) { 
    this.service = value; 
    }
    
    getService() { 
    return this.service; 
    } 
}
