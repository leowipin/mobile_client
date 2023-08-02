import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from './resolver/data-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'servicio-solicitud',
    loadChildren: () => import('./solicitud-servicio/solicitud-servicio.module').then( m => m.SolicitudServicioPageModule)
  },
  {
    path: 'metododepago',
    loadChildren: () => import('./metododepago/metododepago.module').then( m => m.MetododepagoPageModule)
  },
  {
    path: 'historialservicios',
    loadChildren: () => import('./historialservicios/historialservicios.module').then( m => m.HistorialserviciosPageModule)
  },

  {
    path: 'menuprueba',
    loadChildren: () => import('./menuprueba/menuprueba.module').then( m => m.MenupruebaPageModule)
  },

  {
    path: 'editarperfil',
    loadChildren: () => import('./editarperfil/editarperfil.module').then( m => m.EditarperfilPageModule)
  },
  {
    path: 'metododepago',
    loadChildren: () => import('./metododepago/metododepago.module').then( m => m.MetododepagoPageModule)
  },
  {
    path: 'historialservicios',
    loadChildren: () => import('./historialservicios/historialservicios.module').then( m => m.HistorialserviciosPageModule)
  },

  {
    path: 'menuprueba',
    loadChildren: () => import('./menuprueba/menuprueba.module').then( m => m.MenupruebaPageModule)
  },
  {
    path: 'ubicacion',
    loadChildren: () => import('./ubicacion/ubicacion.module').then( m => m.UbicacionModule)
  },
  {
    path: 'homeperfil',
    loadChildren: () => import('./homeperfil/homeperfil.module').then( m => m.HomeperfilPageModule)
  },
  {
    path: 'pin-login',
    loadChildren: () => import('./pin-login/pin-login.module').then( m => m.PinLoginPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'sucursales',
    loadChildren: () => import('./sucursales/sucursales.module').then( m => m.SucursalesPageModule)
  },
  {
    path: 'item1-modal',
    loadChildren: () => import('./item1-modal/item1-modal.module').then( m => m.Item1ModalPageModule)
    
  },
  {
    path: 'sucursal',
    loadChildren: () => import('./sucursal/sucursal.module').then( m => m.SucursalPageModule)
  },
  {
    path: 'calificar-servicio',
    loadChildren: () => import('./calificar-servicio/calificar-servicio.module').then( m => m.CalificarServicioPageModule)
  },
  {
    path: 'servicios-empresa',
    loadChildren: () => import('./servicios-empresa/servicios-empresa.module').then( m => m.ServiciosEmpresaPageModule)
  },
  {
    path: 'servicio-detalle',
    loadChildren: () => import('./servicio-detalle/servicio-detalle.module').then( m => m.ServicioDetallePageModule)
  },
  {
    path: 'estado-solicitud',
    loadChildren: () => import('./estado-solicitud/estado-solicitud.module').then( m => m.EstadoSolicitudPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'pedido-carrito',
    loadChildren: () => import('./pedido-carrito/pedido-carrito.module').then( m => m.PedidoCarritoPageModule)
  },
  {
    path: 'agregar-tarjeta',
    loadChildren: () => import('./agregar-tarjeta/agregar-tarjeta.module').then( m => m.AgregarTarjetaPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },  {
    path: 'pedido-detalle',
    loadChildren: () => import('./pedido-detalle/pedido-detalle.module').then( m => m.PedidoDetallePageModule)
  },
  {
    path: 'header',
    loadChildren: () => import('./header/header.module').then( m => m.HeaderPageModule)
  },
  {
    path: 'pedido-historial',
    loadChildren: () => import('./pedido-historial/pedido-historial.module').then( m => m.PedidoHistorialPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'chat-especifico',
    loadChildren: () => import('./chat-especifico/chat-especifico.module').then( m => m.ChatEspecificoPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
