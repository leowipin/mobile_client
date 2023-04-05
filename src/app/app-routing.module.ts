import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from './resolver/data-resolver.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
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
    path: 'servicios',
    loadChildren: () => import('./servicios/servicios.module').then( m => m.ServiciosPageModule),

  },
  {
    path: 'servicios/n',
    children: [
      {
        path: 'solicitud/:id',
        loadChildren: () => import('./servicios/solicitud-servicio/solicitud-servicio.module').then( m => m.SolicitudServicioPageModule)
      },
    ]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
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
    path: 'historialservicios/:id',
    loadChildren: () => import('./historialservicios/description/description.module').then( m => m.DescriptionPageModule)
  },
  {
    path: 'detallesservicio',
    loadChildren: () => import('./detallesservicio/detallesservicio.module').then( m => m.DetallesservicioPageModule)
  },

  {
    path: 'detallesservicio/:id',
    resolve: {
      special: DataResolverService
    },
    loadChildren: () => import('./detallesservicio/detallesservicio.module').then( m => m.DetallesservicioPageModule)
  },
  {
    path: 'menuprueba',
    loadChildren: () => import('./menuprueba/menuprueba.module').then( m => m.MenupruebaPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
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
    path: 'detallesservicio',
    loadChildren: () => import('./detallesservicio/detallesservicio.module').then( m => m.DetallesservicioPageModule)
  },

  {
    path: 'detallesservicio/:id',
    resolve: {
      special: DataResolverService
    },
    loadChildren: () => import('./detallesservicio/detallesservicio.module').then( m => m.DetallesservicioPageModule)
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








];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
