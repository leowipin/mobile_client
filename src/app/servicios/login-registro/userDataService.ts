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

  nombreur$ = this.nombreurSource.asObservable();
  apellidour$ = this.apellidourSource.asObservable();
  uid$ = this.uid.asObservable();
  tokenfcm$ = this.tokenfcmSource.asObservable();

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
}