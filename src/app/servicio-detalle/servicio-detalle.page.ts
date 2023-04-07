import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { ServiceData } from '../interfaces/client/serviceData';
import { environment } from 'src/environments/environment';

declare var google: any;

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
  requires_origin_and_destination:boolean;
  staff_optional:string[];
  duration:number = 1;
  staff_number_required:number[];
  include_staff:boolean=false;
  equipment_number_required:number[];
  include_equipment:boolean=false
  totalDistancePrice:number;
  total:number = 0;

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
    private modalController: ModalController, public formBuilder: FormBuilder, private clienteWAService: ClienteWAService, private route: ActivatedRoute, private ubicacionService: UbicacionService) {

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

  validations(){
    var finicio=moment(this.ionicForm.value.fechaInicio).format("YYYY-MM-DD");
    this.fechaInicio = finicio
    var ffin=moment(this.ionicForm.value.fechaFinalizacion).format("YYYY-MM-DD");
    this.fechaFinalizacion = ffin
    var hini=moment(this.ionicForm.value.horaInicio).format("HH:mm:ss");
    this.horaInicio = hini
    var hfin=moment(this.ionicForm.value.horaFinalizacion).format("HH:mm:ss");
    this.horaFinalizacion = hfin
    var fechainicio=moment(finicio+" "+hini,"YYYY-MM-DD HH:mm:ss");
    var fechafin=moment(ffin+" "+hfin,"YYYY-MM-DD HH:mm:ss");
    this.duration = fechafin.diff(fechainicio, 'hours', true);
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
        return false
      } else{
        if(difdiahoy==0 && difhorahoy<1){        
          this.mensaje="La hora de Inicio del servicio debe ser mínimo 1 hora después de la hora actual";
          this.presentAlertFechas();
          return false
        }
      }
    } else{
        if(fi== "" || hi== "" || ff== "" || hf== "" || (this.origen.lat == -2.19616 && this.origen.lng == -79.88621)){
          this.presentAlert();
          return false
        } else{
            if(fechafin<fechainicio){
              this.mensaje="La fecha de finalización no puede ser menor a la fecha de inicio.";
              this.presentAlertFechas();
              return false
            } else if(horas<3){
                this.mensaje="El servicio debe durar un mínimo de 3 horas.";
                this.presentAlertFechas();
                return false
            }
        }
    }
    return true
  }

  submitForm() {
    let validationValue = this.validations();
    
    //staff lists
    this.staff_number_required = new Array(this.serviceData.staff.length);
    let staff_selected = new Array(this.serviceData.staff.length);
    for (let i = 0; i < this.serviceData.staff.length; i++) {
      if (this.serviceData.staff_is_optional[i]) {
        this.staff_number_required[i] = this.include_staff ? 1 : 0;
      } else {
        this.staff_number_required[i] = this.serviceData.staff_number_is_optional[i] ? this.currentNumber : 1;
      }
      staff_selected[i] = this.staff_number_required[i] === 1
    }
    let choferIndex = this.serviceData.staff.indexOf('chofer');
    let choferGuardaespaldasIndex = this.serviceData.staff.indexOf('chofer guardaespaldas');
    if (choferIndex !== -1 && choferGuardaespaldasIndex !== -1) { 
      if (this.staff_number_required[choferIndex] === 1 && this.staff_number_required[choferGuardaespaldasIndex] === 1) {
          this.staff_number_required[choferIndex] = 0;
          staff_selected[choferIndex] = false;
      }
    }

    //equipment lists
    this.equipment_number_required = new Array(this.serviceData.equipment.length);
    let equipment_selected = new Array(this.serviceData.equipment.length);
    for (let i = 0; i < this.serviceData.equipment.length; i++) {
        if (this.serviceData.equipment_is_optional[i]) {
            this.equipment_number_required[i] = this.include_equipment ? 1 : 0;
        } else {
            this.equipment_number_required[i] = this.serviceData.equipment_number_is_optional[i] ? this.currentNumber2 : 1;
        }
        equipment_selected[i] = this.equipment_number_required[i] === 1
    }

    // staff total price
    let totalStaff:number = 0;
    for (let i = 0; i < this.staff_number_required.length; i++) {
      let baseHours = this.serviceData.staff_base_hours[i] * this.duration;
      let pricePerHour = this.serviceData.staff_price_per_hour[i];
      let staffNumber = this.staff_number_required[i];
      totalStaff += baseHours * pricePerHour * staffNumber;
    }

    //equipment total price
    let totalEquipment:number = 0;
    for (let i = 0; i < this.equipment_number_required.length; i++) {
      let price = this.serviceData.equipment_price[i];
      let equipmentNumber = this.equipment_number_required[i];
      totalEquipment +=price * equipmentNumber;
    }

    let queryParams = {
      serviceID: this.serviceData.id,
      serviceName: this.serviceData.name,
      requiresDestination: this.serviceData.requires_origin_and_destination,
      startDate: this.fechaInicio,
      endDate: this.fechaFinalizacion,
      startTime: this.horaInicio,
      endTime: this.horaFinalizacion,
      duration: this.duration,
      originLat: this.origen.lat,
      originLng: this.origen.lng,
      destinationLat: this.destino.lat,
      destinationLng: this.destino.lng,
      dirOrigin: this.dirOrigen,
      dirDestination: this.dirDestino,
      staff: this.serviceData.staff,
      staffIsOptional: this.serviceData.staff_is_optional,
      staffSelected: staff_selected,
      staffNumberOptional: this.serviceData.staff_number_is_optional,
      staffBaseHours: this.serviceData.staff_base_hours,
      staffPricePerHour: this.serviceData.staff_price_per_hour,
      staffNumberRequired: this.staff_number_required,
      equipment: this.serviceData.equipment,
      equipmentIsOptional: this.serviceData.equipment_is_optional,
      equipmentSelected: equipment_selected,
      equipmentNumberOptional: this.serviceData.equipment_number_is_optional,
      equipmentPrice: this.serviceData.equipment_price,
      equipmentNumberRequired: this.equipment_number_required,
      total: 0
    };

    //distance traveled
    let distanceTraveled:number=0;
    if(this.serviceData.requires_origin_and_destination && this.serviceData.set_price){
      this.ubicacionService.calculateDistance(this.origen, this.destino)
      .then(distance => { 
        distanceTraveled = distance/1000 //km
        let total:number = 0;
        if (distanceTraveled >= this.serviceData.lower_limit1 && distanceTraveled <= this.serviceData.upper_limit1) {
            total = distanceTraveled * this.serviceData.price_range1;
        } else if (distanceTraveled >= this.serviceData.lower_limit2 && distanceTraveled <= this.serviceData.upper_limit2) {
            total = distanceTraveled * this.serviceData.price_range2;
        } else if (distanceTraveled >= this.serviceData.lower_limit3) {
            total = distanceTraveled * this.serviceData.price_range3;
        }
        let base_price = parseFloat(this.serviceData.base_price)
        if (total < base_price) {
          total = base_price;
        }
        if(distanceTraveled != 0){
          queryParams.total = parseFloat(total.toFixed(2));
          if(validationValue){
            this.navCtrl.navigateForward("/servicio-solicitud", { queryParams });
          }
        }
      })
      .catch(error => {
          console.error(error);
      });
    }

    if(this.serviceData.set_price && !this.serviceData.requires_origin_and_destination){
      let total = totalStaff + totalEquipment
      queryParams.total = parseFloat(total.toFixed(2));
    }else if(!this.serviceData.set_price){
      let total = 0
      queryParams.total = parseFloat(total.toFixed(2));
    }

    if(validationValue){
      this.navCtrl.navigateForward("/servicio-solicitud", { queryParams });
    }

  }
  solicitando(){ // ENDPOINT HERE this queriparams are necessary
    this.navCtrl.navigateForward(`/servicio-solicitud/solicitud`, {
      queryParams: {
        servicio: "Guardia", datos: this.ionicForm.value, cantGuardia: this.currentNumber,
        origen: this.origen, destino: this.destino,duracion:this.duracion
      }
    });
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
        this.requires_origin_and_destination = response.requires_origin_and_destination
        this.staff_number_required = new Array(this.serviceData.staff.length).fill(1);
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

  updateIncludeStaff(event) {
    this.include_staff = event.detail.checked;
  }

  updateIncludeEquipment(event) {
    this.include_equipment = event.detail.checked;
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
