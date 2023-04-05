import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
declare var google: any;


@Component({
  selector: 'app-custodia',
  templateUrl: './custodia.page.html',
  styleUrls: ['./custodia.page.scss'],
})
export class CustodiaPage implements OnInit {
  ionicForm: FormGroup;
  defaultDate = "1970-12-16";
  ho=(moment(new Date).format("YYYY-MM-DD")).toString();
  minFecha=this.ho;
  fechaInicio: any;
  horaInicio: any;
  candado: boolean;
  direccionOrigen: any;
  direccionDestino: any;
  mensaje: any;
  haydirOrigen: boolean=false;
  haydirDestino: boolean=false;
  duracion:any;


  update() {
    console.log('Esta habilitado' + this.candado);
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
    private modalController: ModalController, public formBuilder: FormBuilder) {

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
  solicitud() {
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
          if(this.haydirOrigen){
            if(this.haydirDestino){
              this.solicitando();
            }else{
              this.mensaje="No ha seleccionado una ubicación de destino."
              this.presentAlertUbicacion();
            }
          }else{
            this.mensaje="No ha seleccionado una ubicación de origen."
            this.presentAlertUbicacion();
          }
          
        }
    }
  
  }
  solicitando(){
    this.navCtrl.navigateForward("/servicios/n/solicitud/hola", {
      queryParams: {
        servicio: "Custodia", datos: this.ionicForm.value, cantVehiculo: this.currentNumber,
        valorcandado: this.candado, origen: this.origen, destino: this.destino, duracion:this.duracion
      }
    });
    console.log(this.ionicForm.value);
  }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      fechaInicio: [""],
      horaInicio: [""],

    })

  }
  cancelar() {
    this.navCtrl.navigateForward("/servicios");
  }

  async presentAlertOrigen() {
    const alert = await this.alertController.create({
      header: 'Ubicación de Origen',
      message: 'Seleccione con el puntero su ubicación de origen y luego de click en el botón de Aceptar. También puede usar el buscador de lugares o activar su ubicación mediante GPS',
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
      this.presentAlertDestino();
      const { data } = await modalAdd.onWillDismiss();
      if (data) {
        this.destino = data.pos;
        this.dirDestino = data.dir;
        console.log('Destino -> ', this.destino);
        this.presentAlertDirDestino();
      }
    }
  }


}
