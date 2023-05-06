import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { environment } from 'src/environments/environment';
import { CardData } from '../interfaces/client/cardData';
import { NavController } from '@ionic/angular';

declare var PaymentGateway: any;


@Component({
  selector: 'app-agregar-tarjeta',
  templateUrl: './agregar-tarjeta.page.html',
  styleUrls: ['./agregar-tarjeta.page.scss'],
})
export class AgregarTarjetaPage implements OnInit {
  creditCardForm: FormGroup;
  environment = 'stg';
  application_code = environment.paymentez.app_code_client; // Provided by Payment Gateway
  application_key = environment.paymentez.app_key_client; // Provided by Payment Gateway

  constructor(private clienteWAService: ClienteWAService, private formBuilder: FormBuilder, private navCtrl: NavController){
    this.creditCardForm = this.formBuilder.group({
      otpNumber: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }
  
  ionViewWillEnter() {
    
  }

  initPaymentez() {
    let submitButton = document.querySelector('#tokenize_btn') as HTMLButtonElement;
    let retryButton = document.querySelector('#retry_btn') as HTMLButtonElement;
    let submitInitialText = submitButton.textContent;

    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));

    let get_tokenize_data = () => {
      let data = {
        locale: 'en',
        user: {
          id:payload.user_id.toString(),
          email:payload.user_email
        },
        configuration: {
          default_country: 'COL',
        },
      };
      return data;
    };

    let notCompletedFormCallback = (message) => {
      document.getElementById('tokenize_btn').style.display = 'block';
      let responseElement = document.getElementById('response');
      responseElement.style.display = 'flex'
      responseElement.innerHTML =
        `Por favor complete todos los campos`;
      responseElement.style.color = '#b01902';
      responseElement.style.marginTop = '0px';

      submitButton.innerText = submitInitialText;
      submitButton.removeAttribute('disabled');
    };

    let responseCallback = (response) => {
      document.getElementById('tokenize_btn').style.display = 'block';
      let responseElement = document.getElementById('response');
      responseElement.style.display = 'flex'
      if (response.card.status === 'valid') {
        //cardauth endpoint
        const token = localStorage.getItem('token');
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const payload = JSON.parse(atob(base64));
        const uid = payload.user_id.toString()
        let tokenCard = response.card.token
        let card_number = response.card.bin 
        let card:CardData = {
          token:tokenCard,
          card_number: card_number
        }
        let datos = {
          "card": {
          "token": tokenCard
          },
          "user": {
          "id": uid
          }
        }
        console.log(card)
        this.clienteWAService.addCard(card, token).subscribe({
          next: (response) => {
            console.log(response)
            responseElement.innerHTML = 'Tarjeta agregada correctamente';
            responseElement.style.color = '#0e7a00';
            },
          error: (error) => {
            console.log(error)
          }
        });      
      } else if (response.card.status === 'rejected') {
        responseElement.innerHTML = 'Hubo un error, tarjeta no agregada';
        responseElement.style.color = '#b01902';
      } else if (response.card.status === 'review') {
        responseElement.innerHTML = 'En revisión, tarjeta no agregada';
        responseElement.style.color = '#b01902';
      }
      responseElement.style.marginTop = '25px';

      retryButton.style.display = 'block';
      submitButton.style.display = 'none';
      
    };
    

    let pg_sdk = new PaymentGateway(
      this.environment,
      this.application_code,
      this.application_key
    );

    pg_sdk.generate_tokenize(
      get_tokenize_data(),
      '#tokenize_example',
      responseCallback,
      notCompletedFormCallback
    );

    submitButton.addEventListener('click', (event) => {
      document.getElementById('tokenize_btn').style.display = 'none';
      document.getElementById('response').innerHTML = '';
      submitButton.innerText = 'Procesando...';
      submitButton.setAttribute('disabled', 'disabled');
      pg_sdk.tokenize();
      event.preventDefault();
    });

    retryButton.addEventListener('click', (event) => {
      this.navCtrl.navigateForward(['/metododepago']);
    });

  }

  onSubmit(){
    const otpNumber = this.creditCardForm.get('otpNumber').value
    console.log(otpNumber)
  }

  ngOnInit() {
    this.initPaymentez();
  }
  
  
  
  /*constructor(private formBuilder: FormBuilder, private clienteWAService: ClienteWAService,) {
    this.creditCardForm = this.formBuilder.group({
      number: ['', [Validators.required, Validators.pattern(/^\d{8,19}$/)]],
      holder_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s'-]+$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }

  onSubmit() {
    if (this.creditCardForm.valid) {
      const token = localStorage.getItem('token');
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(atob(base64));
      const expiry = this.creditCardForm.get('expiry').value.split('/');
      let userCard = {
        "user": {
          "id":payload.user_id.toString(),
          "email":payload.user_email
        },
        "card": {
          number: this.creditCardForm.get('number').value,
          holder_name: this.creditCardForm.get('holder_name').value,
          cvc: this.creditCardForm.get('cvc').value,
          expiry_month: Number(expiry[0]),
          expiry_year: Number("20"+expiry[1])
        }
      }
        
      this.clienteWAService.nuevaTarjeta(userCard).subscribe({
        next: (response) => {
          console.log(response)
          //this.redirigirServicios()
          },
        error: (error) => {
          console.log(error)
        }
      });
      console.log(userCard)
    }
  }*/

}
