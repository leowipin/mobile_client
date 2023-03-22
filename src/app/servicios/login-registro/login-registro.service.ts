import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { SignIn } from "src/app/interfaces/client/signin";
import { SignUp } from "src/app/interfaces/client/signup";
import { SignInResponse } from "src/app/interfaces/response/signin";
import { SignUpResponse } from "src/app/interfaces/response/signup";
import { ClientEmail } from "src/app/interfaces/client/clientEmail";
import { MessageResponse } from "src/app/interfaces/response/message";
import { ResetPasswordToken } from "src/app/interfaces/client/resetPasswordToken";
import { Names } from "src/app/interfaces/client/name";
import { ClientData } from "src/app/interfaces/client/clientData";
import { ClientNewPassword } from "src/app/interfaces/client/clientNewPassword";

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
        location.reload();
      }),
    );
  }

  signup(data:SignUp): Observable<SignUpResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/signup/';
    return this.http.post<SignUpResponse>(endpoint, data)
  }

  sendResetPasswordEmail(data:ClientEmail): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/passwordReset/';
    return this.http.post<MessageResponse>(endpoint, data)
  }

  changePassword(data:ResetPasswordToken): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/changePassword/';
    return this.http.post<MessageResponse>(endpoint, data)
  }

  getNames(token:string): Observable<Names>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/clientNames/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<Names>(endpoint, { headers: headers })
  }

  getClientData(token:string): Observable<ClientData>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/client/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<ClientData>(endpoint, { headers: headers })
  }

  modifyClientData(token:string, data:ClientData): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/client/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.put<MessageResponse>(endpoint, data, { headers: headers })
  }

  sendChangeEmail(data:ClientEmail, token:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/changeEmail/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageResponse>(endpoint, data, { headers: headers })
  }

  sendNewPasswordEmail(data:ClientNewPassword, token:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/changeNewPassword/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageResponse>(endpoint, data, { headers: headers })
  }

  deleteAccount(password:string, token:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`users/client/?password=${password}`
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.delete<MessageResponse>(endpoint, { headers: headers })
  }

}
