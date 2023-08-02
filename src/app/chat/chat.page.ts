import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { UserDataService } from '../login-registro/userDataService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  adminChat:any;
  formattedDate:string;
  formattedTime:string;
  isToday:boolean;

  constructor(private db: AngularFirestore, private navCtrl: NavController, private userDataService: UserDataService) { }

  ngOnInit() {
    this.initChat();
  }

  initChat(){
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(atob(base64));
    const uid = payload.user_id.toString()
    const userRef: AngularFirestoreDocument<any> = this.db.collection('mensajeria').doc(uid);
    userRef.valueChanges().subscribe(doc => {
      if (doc) {
        const data = doc;
        const timestamp = data.fecha_ultimo_mensaje;
        const date = timestamp.toDate();
        date.setHours(date.getHours() + 5);
        this.formattedDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
        this.formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        this.adminChat = doc
        const currentDate = new Date();
        const currentFormattedDate = currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
        this.isToday = (this.formattedDate === currentFormattedDate);        
      } else {
          console.log("No se encontró el documento");
      }
   });
}



  goToChat(rol: string){
    this.navCtrl.navigateForward(['/tabs/chat/chat-especifico', { rol: rol }]);
  }


}
