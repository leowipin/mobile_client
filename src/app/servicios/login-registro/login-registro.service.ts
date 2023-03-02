import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

interface SignInResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteWAService {
  /*Url del servidor */
  DJANGO_DOMAIN_NAME:string = 'https://seproamerica2022.pythonanywhere.com/';

  constructor(private http: HttpClient) { }

  signin(email: string, password:string): Observable<SignInResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/clientSignin/';
    const body = {email: email, password: password};
    return this.http.post<SignInResponse>(endpoint, body).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      }),
    );
  }
}
