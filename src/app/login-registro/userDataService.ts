import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private nombreurSource = new BehaviorSubject<string>('');
  private apellidourSource = new BehaviorSubject<string>('');
  private uid = new BehaviorSubject<string>('');
  private tokenfcmSource = new BehaviorSubject<string>('');
  private photoSource = new BehaviorSubject<string>('');
  private messagesSource = new BehaviorSubject<any[]>([]);

  nombreur$ = this.nombreurSource.asObservable();
  apellidour$ = this.apellidourSource.asObservable();
  uid$ = this.uid.asObservable();
  tokenfcm$ = this.tokenfcmSource.asObservable();
  photo$ = this.photoSource.asObservable();
  messages$ = this.messagesSource.asObservable();

  updateNombreur(nombreur: string) {
    this.nombreurSource.next(nombreur);
  }

  updateApellidour(apellidour: string) {
    this.apellidourSource.next(apellidour);
  }

  updateUid(uid: string) {
    this.uid.next(uid);
  }

  updateTokenfcm(tokenfcm: string) {
    this.tokenfcmSource.next(tokenfcm);
  }

  updatePhoto(photo: string) {
    this.photoSource.next(photo);
  }

  updateMessages(messages: any[]) {
    this.messagesSource.next(messages);
  }
}