import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private miSubject = new Subject<void>();
  public miObservable = this.miSubject.asObservable();

  executeInitFirestoreDocument() {
    this.miSubject.next();
  }
  
}