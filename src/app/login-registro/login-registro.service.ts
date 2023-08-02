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
import { ServicesName, ServicesNameList } from "src/app/interfaces/client/servicesName";
import { ServiceData } from "src/app/interfaces/client/serviceData";
import { OrderData } from "src/app/interfaces/client/orderData";
import { Cart } from "src/app/interfaces/client/cart";
import { environment } from "src/environments/environment";
import * as CryptoJS from 'crypto-js';
import { HttpParams } from '@angular/common/http';
import { CardData } from "src/app/interfaces/client/cardData";
import { CardNumber } from "src/app/interfaces/client/cardNumber";
import { BillingData } from "src/app/interfaces/client/billingData";
import { Notifications } from "src/app/interfaces/client/notification";
import { RequestOrderNotification } from "src/app/interfaces/client/requestOrder";
import { MessageOrderResponse } from "src/app/interfaces/response/messageOrder";
import { LeaderStaffData } from "src/app/interfaces/client/leaderStaff";



@Injectable({
  providedIn: 'root'
})
export class ClienteWAService {
  /*Url del servidor */
  DJANGO_DOMAIN_NAME:string = 'https://seproamerica2022.pythonanywhere.com/'; //https://seproamerica2022.pythonanywhere.com/
  //DJANGO_TEST_DOMAIN_NAME:string = 'http://127.0.0.1:8000/'
  PAYMENTEZ_PROD_URL:string = "https://ccapi.paymentez.com/v2/"
  PAYMENTEZ_DEV_URL:string =  "https://ccapi-stg.paymentez.com/v2/";
  paymentez = environment.paymentez

  constructor(private http: HttpClient) { }

  signin(data: SignIn): Observable<SignInResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/clientSignin/';
    return this.http.post<SignInResponse>(endpoint, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('firebase_token', response.firebase_token);
        //location.reload();
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

  getServicesName(token:string): Observable<ServicesNameList>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'services/serviceNames/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<ServicesNameList>(endpoint, { headers: headers })
  }

  getServiceData(token:string, id:string):Observable<ServiceData>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`services/serviceByID/?id=${id}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<ServiceData>(endpoint, { headers: headers })
  }

  createOrder(data:OrderData, token:string): Observable<MessageOrderResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'services/orderClient/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageOrderResponse>(endpoint, data, { headers: headers })
  }

  getCart(token:string): Observable<Cart>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'services/orderClientNames/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<Cart>(endpoint, { headers: headers })
  }

  getOrder(token:string, id:string): Observable<OrderData>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`services/orderClient/?id=${id}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<OrderData>(endpoint, { headers: headers })
  }

  deleteOrder(token:string, id:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`services/orderClient/?id=${id}`
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.delete<MessageResponse>(endpoint, { headers: headers })
  }

  addCard(data:CardData, token:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'cardauth/card/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageResponse>(endpoint, data, { headers: headers })
  }

  deleteCard(token:string, cardToken:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`cardauth/card/?cardToken=${cardToken}`
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.delete<MessageResponse>(endpoint, { headers: headers })
  }

  changeOrderStatus(token:string, status:string, id:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`services/statusChange/?id=${id}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.put<MessageResponse>(endpoint, {status:status}, { headers: headers })
  }

  sendBillingData(token:string, data:BillingData): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'services/billing/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageResponse>(endpoint, data, { headers: headers })
  }

  getBillingData(token:string, order:string): Observable<BillingData>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`services/billing/?order=${order}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<BillingData>(endpoint, { headers: headers })
  }

  registerToken(token:string, fcmToken:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'notifications/fcmToken/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageResponse>(endpoint, {token:fcmToken}, { headers: headers })
  }

  getNotifications(token:string): Observable<Notifications>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`notifications/clientNoti/`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<Notifications>(endpoint, { headers: headers })
  }
  
  deleteNotifications(token:string): Observable<Notifications>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`notifications/clientNoti/`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.delete<Notifications>(endpoint, { headers: headers })
  }

  sendRequestOrderNotification(token:string, data:RequestOrderNotification): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'notifications/orderAdminNoti/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageResponse>(endpoint, data, { headers: headers })
  }

  saveProfilePic(token:string, url_img:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'users/userPicture/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageResponse>(endpoint, {url_img:url_img}, { headers: headers })
  }

  deleteProfilePic(token:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`users/userPicture/`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.delete<MessageResponse>(endpoint, { headers: headers })
  }

  getLeaderStaff(token:string, order:string): Observable<LeaderStaffData>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`services/leaderStaff/?id=${order}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<LeaderStaffData>(endpoint, { headers: headers })
  }

  sendMessage(token:string, message:string): Observable<MessageResponse>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+'messaging/sendMessage/';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<MessageResponse>(endpoint, {message:message}, { headers: headers })
  }

  /*getSpecificNotification(token:string, id:string): Observable<SpecificNotification>{
    const endpoint:string = this.DJANGO_DOMAIN_NAME+`notifications/getSpecificClientNoti/?id=${id}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<SpecificNotification>(endpoint, { headers: headers })
  }*/

  //PAYMENTEZ

  private getAuthToken(appCode: string, appKey: string): string {
    const unix_timestamp=Math.round(new Date().getTime() / 1000);
    const uniq_token_string= appKey + unix_timestamp;
    const uniq_token_hash = CryptoJS.SHA256(uniq_token_string).toString(CryptoJS.enc.Hex);
    const auth_token = btoa(appCode+";"+unix_timestamp+";"+uniq_token_hash);
    return auth_token;
  }

  nuevaTarjeta(tarjeta: any):Observable<any>{
    const headers = {
    'Content-Type': 'application/json',
    'Auth-Token': this.getAuthToken(this.paymentez.app_code_client,this.paymentez.app_key_client)
    }
    const body = JSON.stringify(tarjeta);
    return this.http.post(this.PAYMENTEZ_DEV_URL + 'card/add/', body, { 'headers':headers });
  }

eliminarTarjeta(tarjeta): Observable<any>{
    const headers = {
        'Content-Type': 'application/json',
        'Auth-Token': this.getAuthToken(this.paymentez.app_code_server, this.paymentez.app_key_server)
    };
    const body = JSON.stringify(tarjeta);
    return this.http.post(this.PAYMENTEZ_DEV_URL + 'card/delete/', body, { headers });
}

pagar(tarjeta): Observable<any>{
    const headers = {
        'Content-Type': 'application/json',
        'Auth-Token': this.getAuthToken(this.paymentez.app_code_server, this.paymentez.app_key_server)
    };
    const body = JSON.stringify(tarjeta);
    return this.http.post(this.PAYMENTEZ_DEV_URL + 'transaction/debit/', body, { headers });
}

dinersVerify(user_id: string, transaction_id: string, type:string, value: string): Observable<any> {
  const headers = {
    'Content-Type': 'application/json',
    'Auth-Token': this.getAuthToken(this.paymentez.app_code_client, this.paymentez.app_key_client)
  }
  const body = JSON.stringify({
    user: { id: user_id },
    transaction: { id: transaction_id },
    type: type,
    value: value
  });
  return this.http.post(this.PAYMENTEZ_DEV_URL +'transaction/verify', body, { headers });
}

devolver(tarjeta): Observable<any>{
    const headers = {
        'Content-Type': 'application/json',
        'Auth-Token': this.getAuthToken(this.paymentez.app_code_server, this.paymentez.app_key_server)
    };
    const body = JSON.stringify(tarjeta);
    return this.http.post(this.PAYMENTEZ_DEV_URL + 'transaction/refund/', body, { headers });
}

getTarjetas(id: string): Observable<any>{
    const headers = {
        'Content-Type': 'application/json',
        'Auth-Token': this.getAuthToken(this.paymentez.app_code_server, this.paymentez.app_key_server)
    };
    let parametro= new HttpParams().set('uid', id);
    return this.http.get(this.PAYMENTEZ_DEV_URL + 'card/list', { params: parametro, headers: headers });
}
}
