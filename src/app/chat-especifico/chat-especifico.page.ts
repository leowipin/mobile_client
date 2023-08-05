import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '../login-registro/userDataService';
import { AlertController, IonContent } from '@ionic/angular';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';


@Component({
  selector: 'app-chat-especifico',
  templateUrl: './chat-especifico.page.html',
  styleUrls: ['./chat-especifico.page.scss'],
})
export class ChatEspecificoPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  rol:string;
  messages: any[];
  msg: string;
  dataLoaded: boolean = false;

  scroll: boolean = false;
  disable:boolean = false;

  private subscription:Subscription;

  constructor(private route: ActivatedRoute,  private userDataService: UserDataService, private clienteWAService: ClienteWAService, private alertController: AlertController, private db: AngularFirestore, private changeDetector: ChangeDetectorRef) {
    
   }//

  ngOnInit() {
    this.rol = this.route.snapshot.paramMap.get('rol');
    this.initChat();  
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    if(this.scroll){
      this.content.scrollToBottom(200);
    }
    this.scroll = true;
  }

  //se hace el detach para poder usar DOM con el objetivo de que se actualize solo el ultimo mensaje
  //y no se cargue nuevamente toda la vista
  ngDoCheck() {
    if (this.dataLoaded) {
      this.changeDetector.detach();
    }
  }

  addMessage(message) {
    let messagesContainer = document.querySelector('.messages-grid');
    let newRow = document.createElement('ion-row');
    
    if (message.remitente === 'cliente') {
      newRow.classList.add('my-message');
      newRow.innerHTML = `
        <div class="card" style="background-color: rgb(202, 252, 199); display: flex; justify-content: center; max-width: 75%; align-items: flex-end; padding: 5px 8px; margin-bottom: 2%;">
          <ion-label class="light12">${message.contenido}</ion-label>
          <ion-label class="light12 time">${message.hora_envio}</ion-label>
        </div>
      `;
    } else {
      newRow.classList.add('other-message');
      newRow.innerHTML = `
        <div class="card" style="display: flex; justify-content: center; max-width: 75%; align-items: flex-end; padding: 5px 8px; margin-bottom: 2%;">
          <ion-label class="light12">${message.contenido}</ion-label>
          <ion-label class="light12 time">${message.hora_envio}</ion-label>
        </div>
      `;
    }
  
  messagesContainer.appendChild(newRow);
}

  sendMessage(msg:string){
    let inputElement = document.querySelector('ion-input') as HTMLIonInputElement;; 
    let sendButton = document.querySelector('#send-button') as HTMLElement;;
    if((inputElement.value as string).trim().length > 0){
      inputElement.value = '';
      sendButton.style.color = '#a7a7a7';
    //this.msg = '';
    const token = localStorage.getItem('token');
    this.clienteWAService.sendMessage(token, msg).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        this.alertController.create({
          header: 'Chat',
          message: "No se pudo enviar el mensaje",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
    }
  }

  onInputFocus(){
    if(this.disable){
      let inputElement = document.querySelector('ion-input') as HTMLIonInputElement;
      let sendButton = document.querySelector('#send-button') as HTMLElement;
      // agregar un evento de escucha para el evento input en el ion-input
      inputElement.addEventListener('input', (event) => {
        // cambiar el color del botón de envío en función del contenido del ion-input
        sendButton.style.color = (event.target as HTMLInputElement).value.trim().length > 0 ? 'black' : '#a7a7a7';
      });
    }
    this.disable = false;
    
  }

  initChat(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    const uid = payload.user_id.toString()
    const userRef: AngularFirestoreDocument<any> = this.db.collection('mensajeria').doc(uid);
    this.subscription = userRef.valueChanges().subscribe(doc => {
      if (doc) {
        let allMessages = [];
        userRef.collection('mensajes').get().subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
              // Convertir el valor del campo fecha_envio a un objeto Date
              let fechaEnvio = doc.data().fecha_envio.toDate();
              // Agregar 5 horas a la fecha de envío
              fechaEnvio.setHours(fechaEnvio.getHours() + 5);
              // Formatear la fecha y la hora en el formato deseado
              let fechaEnvioFormatted = fechaEnvio.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
              let horaEnvioFormatted = fechaEnvio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
              // Obtener la fecha actual y formatearla en el mismo formato que fechaEnvioFormatted
              let currentDate = new Date();
              let currentFormattedDate = currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });

              // Si la fecha de envío es igual a la fecha actual, guardar el valor de fecha_envio como "hoy"
              if (fechaEnvioFormatted === currentFormattedDate) {
                  fechaEnvioFormatted = "Hoy";
              }
              // Crear un objeto con la información del documento
              let message = {
                  contenido: doc.data().contenido,
                  fecha_envio: fechaEnvioFormatted, // Modificar el valor del campo fecha_envio
                  hora_envio: horaEnvioFormatted, // Agregar un nuevo campo hora_envio
                  remitente: doc.data().remitente,
                  seconds: doc.data().fecha_envio.seconds // Agregar un nuevo campo seconds para ordenar los mensajes por fecha de envío
              };
              allMessages.push(message);
              
          });
          // Ordenar la lista de mensajes por fecha de envío en orden ascendente
          allMessages.sort((a, b) => a.seconds - b.seconds);
          // Mantener solo los últimos 20 mensajes
          //allMessages = allMessages.slice(-20);

          if(!this.dataLoaded){
            this.messages = allMessages;
            setTimeout(() => {
              this.dataLoaded = true;
              this.disable = true;
            }, 2000);
          }

          if(this.dataLoaded){
            this.scroll = true;
            let lastMessage = allMessages[allMessages.length - 1];
            this.addMessage(lastMessage);
          }
      });
      
      } else {
          console.log("No se encontró el documento");
      }
   });
}

}
