// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase:{
    apiKey: 'AIzaSyCK9zogf6RmlzfESGR8muH4tDbAGwAZ4G4',
    authDomain: 'seproamerica-cliente-login.firebaseapp.com',
    projectId: 'seproamerica-cliente-login',
    storageBucket: 'seproamerica-cliente-login.appspot.com',
    messagingSenderId: '366576104208',
    appId: '1:366576104208:web:891bbf6e7b0970e02feb95',
    measurementId: 'G-3XEQP35CCG'
  },
  countryJson:  [
      { name: 'Ecuador', dialCode: '+593', code: 'ECU' }
      ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
