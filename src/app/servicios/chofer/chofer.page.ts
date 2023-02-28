import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-chofer',
  templateUrl: './chofer.page.html',
  styleUrls: ['./chofer.page.scss'],
})
export class ChoferPage implements OnInit {
  ionicForm: FormGroup;
  defaultDate = "1970-12-16";
  //maxFecha: string = (new Date().getFullYear() + 1).toString();
  min=new Date().toJSON().split('T')[0];
  ho=(moment(new Date).format("YYYY-MM-DD")).toString();
  minFecha=this.ho;
  duracion:any;

  maxFecha: string = (new Date().getFullYear() + 1).toString();
  maxiFecha2 = addDaysToDate(new Date(), 1);
  minFecha2: string = (this.maxiFecha2.getFullYear()).toString() + "-" + (this.maxiFecha2.getMonth() + 1).toString() + "-" + (this.maxiFecha2.getDate()).toString();
  maxFecha2: string = (new Date().getFullYear() + 2).toString();
  minhour: String = new Date().toISOString();
  fechaInicio: null;
  horaInicio: any;
  fechaFinalizacion: any;
  horaFinalizacion: any;
  vehiculo: boolean;
  mensaje:any;
  haydirOrigen: boolean=false;
  haydirDestino: boolean=false;



  update() {
    console.log('Esta habilitado' + this.vehiculo);
  }
  guardaespalda: boolean;
  update2() {
    console.log('Esta habilitado' + this.vehiculo);
  }
  origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };

  dirOrigen:any;
  dirDestino:any;

  constructor(private navCtrl: NavController, private modalController: ModalController,
    public formBuilder: FormBuilder, public alertController: AlertController) {
  }
  cancelar() {
    this.navCtrl.navigateForward("/servicios");
  }
  async presentAlert() {
    //console.log(this.minFecha2);
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
  

  solicitud() {
    var finicio=moment(this.ionicForm.value.fechaInicio).format("YYYY-MM-DD");
    var ffin=moment(this.ionicForm.value.fechaFinalizacion).format("YYYY-MM-DD");
    var hini=moment(this.ionicForm.value.horaInicio).format("HH:mm:ss");
    var hfin=moment(this.ionicForm.value.horaFinalizacion).format("HH:mm:ss");
    var fechainicio=moment(finicio+" "+hini,"YYYY-MM-DD HH:mm:ss");
    var fechafin=moment(ffin+" "+hfin,"YYYY-MM-DD HH:mm:ss");

    var dias=fechafin.diff(fechainicio,"d")
    var horas=fechafin.diff(fechainicio,"h")
    var minutos=fechafin.diff(fechainicio,"m")
    this.duracion=" "+dias+" días, "+(horas-(dias*24))+" horas y "+(minutos-(horas*60))+" minutos";
    //this.duracion=" "+(horas-(dias*24))+" horas y "+(minutos-(horas*60))+" minutos";
    var hoy=moment(new Date());
    var difdiahoy=fechainicio.diff(hoy,"d");
    var difhorahoy=fechainicio.diff(hoy,"h");
    var fi=this.ionicForm.value.fechaInicio;
    var ff=this.ionicForm.value.fechaFinalizacion;
    var hi=this.ionicForm.value.horaInicio;
    var hf=this.ionicForm.value.horaFinalizacion;



    console.log("dias"+dias);
    console.log("horas"+horas);
    console.log("minutos"+minutos);
    console.log("diff"+this.duracion);
    if (fi== "" || ff== "" || hi== "" || hf== "") { //si hay campos vacios
      this.presentAlert();
    }else{
      console.log(difdiahoy);
      console.log(difhorahoy);
        if(difdiahoy==0 && difhorahoy<1){        
          console.log("La hora de Inicio del servicio debe ser mínimo 1 hora después de la hora actual");
          this.mensaje="La hora de Inicio del servicio debe ser mínimo 1 hora después de la hora actual";
          this.presentAlertFechas();
        }else{
          if(fechafin<fechainicio){
            console.log("La fecha de finalización no puede ser menor a la fecha de inicio");
            this.mensaje="La fecha de finalización no puede ser menor a la fecha de inicio.";
            this.presentAlertFechas();
          }else if(horas<3){
            console.log("El servicio debe durar un mínimo de 3 horas.");
            this.mensaje="El servicio debe durar un mínimo de 3 horas.";
            this.presentAlertFechas();

          }else{
            if(this.haydirOrigen){
              this.solicitando();
            }else{
              this.mensaje="No ha seleccionado una ubicación."
              this.presentAlertUbicacion();
            }
          }
        }
    }

  }
  solicitando(){
    this.navCtrl.navigateForward("/servicios/n/solicitud/hola", {
      queryParams: {
        servicio: "Chofer", datos: this.ionicForm.value, valorvehiculo: this.vehiculo,
        valorguardaespaldas: this.guardaespalda, origen: this.origen, destino: this.destino,duracion:this.duracion
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
    console.log(this.haydirOrigen)
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
            console.log('ORIGEN');
            this.haydirOrigen=true;
            console.log(this.haydirOrigen);
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
  }

}

function addDaysToDate(date, days) {
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}