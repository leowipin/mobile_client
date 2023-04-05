import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { ServiceData } from '../interfaces/client/serviceData';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-servicio-detalle',
  templateUrl: './servicio-detalle.page.html',
  styleUrls: ['./servicio-detalle.page.scss'],
})
export class ServicioDetallePage implements OnInit {

  apiKey = environment.googleMapsApiKey;
  
  ionicForm: FormGroup;
  defaultDate = "1970-12-16";
  //maxFecha: string = (new Date().getFullYear() + 1).toString();
  min=new Date().toJSON().split('T')[0];
  ho=(moment(new Date).format("YYYY-MM-DD")).toString();
  minFecha=this.ho;
  maxFecha: string = (new Date().getFullYear()+1).toString();
  maxiFecha2= addDaysToDate(new Date(), 1);
  minFecha2: string= (this.maxiFecha2.getFullYear()).toString()+"-"+(this.maxiFecha2.getMonth()+1).toString()+"-"+(this.maxiFecha2.getDate()).toString() ;
  maxFecha2: string = (new Date().getFullYear() + 2).toString();
  fechaInicio: any;
  horaInicio: any;
  fechaFinalizacion: any;
  horaFinalizacion: any;
  mensaje: any;
  haydirOrigen: boolean=false;
  haydirDestino: boolean=false;
  duracion:any;

  serviceData:ServiceData;
  staff_price_bool:boolean = false;
  candado_is_optional:boolean = false;
  vehiculo_is_optional:boolean = false;
  choferguardaespalda_is_optional:boolean = false;
  numero_guardia_is_optional:boolean = false;
  candado:boolean;
  vehiculo:boolean;
  guardaespalda:boolean;
  origen = {
    lat: -2.19616,
    lng: -79.88621
  };
  destino = {
    lat: -2.19616,
    lng: -79.88621
  };

  dirOrigen:any;
  dirDestino:any;
  currentNumber = 1;
  currentNumber2 = 1;
  increment(numero:number) {
    if(numero === 1){
      this.currentNumber++;
    }
    else{
      this.currentNumber2++;
    }
  }

  decrement(numero:number) {
    if (this.currentNumber > 1) {
      if(numero === 1){
        this.currentNumber--;
      }
    }
    if (this.currentNumber2 > 1){
      if(numero === 2){
        this.currentNumber2--;
      }
    }
  }

  constructor(public alertController: AlertController, private navCtrl: NavController,
    private modalController: ModalController, public formBuilder: FormBuilder, private clienteWAService: ClienteWAService, private route: ActivatedRoute) {

  }
  cancelar() {
    this.navCtrl.navigateForward("/servicios-empresa");
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Campos vacíos',
      //subHeader: 'Subtitle',
      message: 'Existen campos sin completar en la solicitud',
      buttons: ['OK']
    });

    await alert.present();

  }

  async presentAlertFechas() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Fechas no válidas',
      //subHeader: 'Subtitle',
      message: this.mensaje,
      buttons: ['OK']
    });

    await alert.present();
    
  }
  async presentAlertUbicacion() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sin ubicación.',
      //subHeader: 'Subtitle',
      message: this.mensaje,
      buttons: ['OK']
    });

    await alert.present();
    
  }
  daydiff(first, second): Number {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }
  submitForm() {
    
    var finicio=moment(this.ionicForm.value.fechaInicio).format("YYYY-MM-DD");
    var ffin=moment(this.ionicForm.value.fechaFinalizacion).format("YYYY-MM-DD");
    var hini=moment(this.ionicForm.value.horaInicio).format("HH:mm:ss");
    var hfin=moment(this.ionicForm.value.horaFinalizacion).format("HH:mm:ss");
    var fechainicio=moment(finicio+" "+hini,"YYYY-MM-DD HH:mm:ss");
    var fechafin=moment(ffin+" "+hfin,"YYYY-MM-DD HH:mm:ss");
    var fi=this.ionicForm.value.fechaInicio;
    var ff=this.ionicForm.value.fechaFinalizacion;
    var hi=this.ionicForm.value.horaInicio;
    var hf=this.ionicForm.value.horaFinalizacion;
    var dias=fechafin.diff(fechainicio,"d")
    var horas=fechafin.diff(fechainicio,"h")
    var minutos=fechafin.diff(fechainicio,"m")
    this.duracion=" "+dias+" días, "+(horas-(dias*24))+" horas y "+(minutos-(horas*60))+" minutos";
    //this.duracion=" "+(horas-(dias*24))+" horas y "+(minutos-(horas*60))+" minutos";
    var hoy=moment(new Date());
    var difdiahoy=fechainicio.diff(hoy,"d");
    var difhorahoy=fechainicio.diff(hoy,"h");
    

    if (this.serviceData.requires_origin_and_destination) {
      if (fi== "" || hi== "" || (this.origen.lat == -2.19616 && this.origen.lng == -79.88621) || (this.destino.lat == -2.19616 && this.destino.lng == -79.88621)) {
        this.presentAlert();
        return null
      } else{
        if(difdiahoy==0 && difhorahoy<1){        
          this.mensaje="La hora de Inicio del servicio debe ser mínimo 1 hora después de la hora actual";
          this.presentAlertFechas();
          return null
        }
      }
    } else{
        if(fi== "" || hi== "" || ff== "" || hf== "" || (this.origen.lat == -2.19616 && this.origen.lng == -79.88621)){
          this.presentAlert();
          return null
        } else{
            if(fechafin<fechainicio){
              this.mensaje="La fecha de finalización no puede ser menor a la fecha de inicio.";
              this.presentAlertFechas();
              return null
            } else if(horas<3){
                this.mensaje="El servicio debe durar un mínimo de 3 horas.";
                this.presentAlertFechas();
                return null
            }
        }
    }
    this.solicitando();
  }
  solicitando(){ // ENDPOINT HERE this queriparams are necessary
    this.navCtrl.navigateForward("/servicios/n/solicitud/hola", {
      queryParams: {
        servicio: "Guardia", datos: this.ionicForm.value, cantGuardia: this.currentNumber,
        origen: this.origen, destino: this.destino,duracion:this.duracion
      }
    });
    console.log(this.ionicForm.value);
  }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      fechaInicio: [""],
      horaInicio: [""],
      fechaFinalizacion: [""],
      horaFinalizacion: [""],
    })
    this.getServiceData();
  }

  getServiceData(){
    const token = localStorage.getItem('token');
    const id = this.route.snapshot.paramMap.get('id');
    this.clienteWAService.getServiceData(token, id).subscribe({
      next: (response) => {
        this.serviceData = response;
        // si todos los elementos del arreglo response.staff_price_per_hour significa que es un servicio que no debe tener fecha y hora de finalizacion
        // es por ello que se usa un ngIf con la variable staff_price_bool
        for (let staff_price of response.staff_price_per_hour) {
          if (staff_price !== 0) {
            this.staff_price_bool = true;
            break
          }
        }
        for (let i = 0; i < response.equipment.length; i++) {
          if (response.equipment[i] === 'candado') {
              this.candado_is_optional = response.equipment_is_optional[i];
          }
          if (response.equipment[i] === 'vehiculo') {
            this.vehiculo_is_optional = response.equipment_is_optional[i];
        }
      }
        for (let i = 0; i < response.staff.length; i++) {
          if (response.staff[i] === 'chofer guardaespaldas') {
              this.choferguardaespalda_is_optional = response.staff_is_optional[i];
          } 
          if(response.staff[i] === 'guardia'){
            this.numero_guardia_is_optional = response.staff_number_is_optional[i]
          }
      }
      this.presentAlertInfoService(response.name, response.description)
      },
      error: (error) => {
        this.alertController.create({
          message: "Error al cargar el servicio",
          buttons: ['Aceptar']
        }).then(alert=> alert.present())
      }
    });
  }

  async presentAlertInfoService(name, description) {
    const alert = await this.alertController.create({
      header: name,
      message: description,
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async presentAlertOrigen() {
    const alert = await this.alertController.create({
      header: 'Ubicación',
      message: 'Seleccione con el puntero la ubicación donde necesita el servicio y luego de click en el botón de Aceptar. También puede usar el buscador de lugares o activar su ubicación mediante GPS',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async presentAlertDestino() {
    const alert = await this.alertController.create({
      header: 'Ubicación de Destino',
      message: 'Seleccione con el puntero su ubicación de destino y luego de click en el botón de Aceptar. También puede usar el buscador de lugares o activar su ubicación mediante GPS',
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('ORIGEN');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
  async presentAlertDirOrigen() {
    const alert = await this.alertController.create({
      header: 'Ubicación de Origen',
      message: 'Su servicio inicia en: ' + this.dirOrigen,
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.haydirOrigen=true;
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async presentAlertDirDestino() {
    const alert = await this.alertController.create({
      header: 'Ubicación de Destino',
      message: 'Su servicio termina en: '+ this.dirDestino,
      buttons: [
        {
          text: 'ACEPTAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('ORIGEN');
            this.haydirDestino=true;
            console.log(this.haydirDestino);
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  

  async addDirection(tipo: number) {

    if (tipo === 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          if(!this.haydirOrigen){
            this.origen.lat = position.coords.latitude;
            this.origen.lng = position.coords.longitude;
          }
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.origen.lat},${this.origen.lng}&key=${this.apiKey}`);
          const data = await response.json();
          console.log(data.results)
          if (data.results && data.results.length > 0) {
            const modalAdd = await this.modalController.create({
              component: UbicacionComponent,
              mode: 'ios',
              swipeToClose: true,
              componentProps: { position: this.origen }
            });
      
            await modalAdd.present();
            this.presentAlertOrigen();
            const { data } = await modalAdd.onWillDismiss();
            if (data) {
              this.origen = data.pos;
              this.dirOrigen = data.dir;
              this.presentAlertDirOrigen();
            }
          }
        });
      }
    } else if (tipo === 1) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
          if(!this.haydirDestino){
            this.destino.lat = position.coords.latitude;
            this.destino.lng = position.coords.longitude;
          }
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.destino.lat},${ this.destino.lng}&key=${this.apiKey}`);
          const data = await response.json();
          console.log(data.results)
          if (data.results && data.results.length > 0) {
            const modalAdd = await this.modalController.create({
              component: UbicacionComponent,
              mode: 'ios',
              swipeToClose: true,
              componentProps: { position: this.destino }
            });
      
            await modalAdd.present();
            this.presentAlertDestino();
            const { data } = await modalAdd.onWillDismiss();
            if (data) {
              this.destino = data.pos;
              this.dirDestino = data.dir;
              this.presentAlertDirDestino();
            }
          }
        });
      }
    }
  }
}

function addDaysToDate(date, days){
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}
