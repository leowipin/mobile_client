import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-historialservicios',
  templateUrl: './historialservicios.page.html',
  styleUrls: ['./historialservicios.page.scss'],
})

export class HistorialserviciosPage implements OnInit {
  datosrecibidos: any;
  fechaInicio:string= "";
  fechaFinalizacion: any;
  horaInicio: any;
  horaFinalizacion: any;
  direccionOrigen: any;
  direccionDestino: any;
  cance:string="";
  seleccion:any;
  selec:any;

  mapaServicios = [ {"estado": "en proceso", "servicio": "Guardia", "lugarini": "ceibos", "fechaini": "14/01/2022", "horaini": "09:30pm", "fechafin": "14/01/2022","horafin":"11:00pm", "numeroguardias": "2", "monto": "100", "pago": "efectivo", "ruta": "rutaElegida", "candado":"Si","numerovehiculo": "2", "vehiculo":"Si","guardaespalda":"Si","lugarfin":"Manta"}, 
		  {"estado": "finalizado", "servicio": "Guardia", "lugarini": "Espol", "fechaini": "21/03/2021", "horaini": "09:30pm", "fechafin": "22/03/2021","horafin":"11:00pm", "numeroguardias": "1", "monto": "50", "pago": "efectivo", "ruta": "rutaElegida", "candado":"Si","numerovehiculo": "2", "vehiculo":"Si","guardaespalda":"Si","lugarfin":"Manta"},			
			{"estado": "pendiente", "servicio": "Guardia", "lugarini": "Mall del Sol", "fechaini": "21/03/2022", "horaini": "09:30pm", "fechafin": "22/03/2022","horafin":"11:00pm", "numeroguardias":"2", "monto": "100", "pago": "efectivo", "ruta": "rutaElegida", "candado":"Si","numerovehiculo": "2", "vehiculo":"Si","guardaespalda":"Si","lugarfin":"Manta"} ]

  constructor(private route: ActivatedRoute,private modalController: ModalController, private navCtrl: NavController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      this.datosrecibidos = params;
      this.cance=this.datosrecibidos.cance;
      
      console.log(params);
      console.log(this.datosrecibidos);
      if(!(this.datosrecibidos.descripcion.fechaInicio=="")){
        //console.log("ingresando")
        this.fechaInicio = moment(this.datosrecibidos.descripcion.datos.fechaInicio).format("DD/MM/YYYY");
        this.fechaFinalizacion = moment(this.datosrecibidos.descripcion.datos.fechaFinalizacion).format("DD/MM/YYYY");
        this.horaInicio = moment(this.datosrecibidos.descripcion.datos.horaInicio).format("hh:mma");
        this.horaFinalizacion = moment(this.datosrecibidos.descripcion.datos.horaFinalizacion).format("hh:mma");
        this.direccionOrigen = this.datosrecibidos.origen;
        this.direccionDestino = this.datosrecibidos.destino;
     
     }
      
      
      
    }
    
    );
    console.log(this.datosrecibidos);


    if(!(this.fechaInicio=="")){
      this.mapaServicios.push({"estado": "pendiente", "servicio": this.datosrecibidos.service, "lugarini": this.direccionOrigen, "fechaini": this.fechaInicio, "horaini": this.horaInicio, "fechafin": this.fechaFinalizacion,"horafin":this.horaFinalizacion, "numeroguardias": this.datosrecibidos.cantGuardia, "monto": "Pendiente", "pago": this.datosrecibidos.pago, "ruta": "rutaElegida", "candado":this.datosrecibidos.descripcion.valorcandado,"numerovehiculo": this.datosrecibidos.descripcion.cantVehiculo, "vehiculo":this.datosrecibidos.descripcion.valorvehiculo,"guardaespalda":this.datosrecibidos.descripcion.valorguardaespaldas,"lugarfin":this.direccionDestino});
    }
    if((this.cance=="cancelado")){
      //this.seleccion.estado="Cancelado";
      console.log(this.seleccion)
      console.log("cancelando")
    }
    

  }

  
  verdescripcion(dat: any){
    this.seleccion=dat ;
    this.navCtrl.navigateForward("/historialservicios/description", {
      queryParams: {
        des: this.seleccion
      }
    });   
    console.log(this.seleccion);
  }
  
  
  

}
