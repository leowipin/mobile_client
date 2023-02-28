import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarCedulaAlg: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    
    let cedula = control.get("cedula").value;
    //console.log(cedula);
    if (typeof(cedula) == 'string' && cedula.length == 10 && /^\d+$/.test(cedula)) {
      var digitos = cedula.split('').map(Number);
      var codigo_provincia = digitos[0] * 10 + digitos[1];
  
      //if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30) && digitos[2] < 6) {
  
      if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30)) {
        var digito_verificador = digitos.pop();
  
        var digito_calculado = digitos.reduce(
          function (valorPrevio, valorActual, indice) {
            //console.log(typeof valorPrevio);
            return valorPrevio - (valorActual * (2 - indice % 2)) % 9 - +(valorActual == 9) * 9;
          }, 1000) % 10;
        //console.log(digito_calculado === digito_verificador);
        return digito_calculado === digito_verificador ? { 'CedulaNoValida': false } : { 'CedulaNoValida': true };
        }
    }

};
