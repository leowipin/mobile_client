import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { SignIn } from "src/app/interfaces/client/signin";
import { SignUp } from "src/app/interfaces/client/signup";
import { SignInResponse } from "src/app/interfaces/response/signin";
import { SignUpResponse } from "src/app/interfaces/response/signup";

@Injectable({
  providedIn: 'root'
})
export class ClienteWAService {
  /*Url del servidor */
  DJANGO_DOMAIN_NAME:string = 'https://seproamerica2022.pythonanywhere.com/';

  constructor(private http: HttpClient) { }

  signin(data: SignIn): Observable<SignInResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/clientSignin/';
    return this.http.post<SignInResponse>(endpoint, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  signup(data:SignUp): Observable<SignUpResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/signup/';
    return this.http.post<SignUpResponse>(endpoint, data)
  }
}
