import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';


@Component({
  selector: 'app-servicio-detalle',
  templateUrl: './servicio-detalle.page.html',
  styleUrls: ['./servicio-detalle.page.scss'],
})
export class ServicioDetallePage implements OnInit {

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

  serviceData:any;
  staff_price_bool:boolean = false;
  candado_is_optional:boolean = false;
  vehiculo_is_optional:boolean = false;
  choferguardaespalda_is_optional:boolean = false;
  numero_guardia_is_optional:boolean = false;
  candado:boolean;
  vehiculo:boolean;
  guardaespalda:boolean;
  /*origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };*/

  dirOrigen:any;
  dirDestino:any;
  currentNumber = 1;

  increment() {
    this.currentNumber++;
  }

  decrement() {
    if (this.currentNumber > 1) {
      this.currentNumber--;
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


    if (fi== "" || ff== "" || hi== "" || hf== "") { //si hay campos vacios
      this.presentAlert();
      return null
    }else{
        if(difdiahoy==0 && difhorahoy<1){        
          this.mensaje="La hora de Inicio del servicio debe ser mínimo 1 hora después de la hora actual";
          this.presentAlertFechas();
          return null
        }else{
          if(fechafin<fechainicio){
            this.mensaje="La fecha de finalización no puede ser menor a la fecha de inicio.";
            this.presentAlertFechas();
            return null
          }else if(horas<3){
            this.mensaje="El servicio debe durar un mínimo de 3 horas.";
            this.presentAlertFechas();
            return null
          }else{
            // servicio solicitud endpoint
          }
        }
    }
  }
  /*solicitando(){
    this.navCtrl.navigateForward("/servicios/n/solicitud/hola", {
      queryParams: {
        servicio: "Guardia", datos: this.ionicForm.value, cantGuardia: this.currentNumber,
        origen: this.origen, destino: this.destino,duracion:this.duracion
      }
    });
    console.log(this.ionicForm.value);
  }*/

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

  /*async addDirection(tipo: number) {

    if (tipo === 0) {
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
        console.log('Origen -> ', this.origen);
        this.presentAlertDirOrigen();
      }

    }
    else if (tipo === 1) {
      const modalAdd = await this.modalController.create({
        component: UbicacionComponent,
        mode: 'ios',
        swipeToClose: true,
        componentProps: { position: this.destino }
      });

      await modalAdd.present();
      const { data } = await modalAdd.onWillDismiss();
      if (data) {
        this.destino = data.pos;
        console.log('Destino -> ', this.destino);
      }
    }
  }*/
}

function addDaysToDate(date, days){
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}
