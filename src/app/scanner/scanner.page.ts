import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { CameraPreview } from '@capacitor-community/camera-preview';
import jsQR from 'jsqr';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit, OnDestroy {

  isNotScanning:boolean = true;
  isShowingQRData:boolean = false;
  private scanTimer: any;

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    //CameraPreview.stop();
    
  }

  ngOnDestroy(): void {
    CameraPreview.stop();
  }
  ionViewWillEnter(){
    this.alertController.create({
      header: 'Escáner QR',
      message: 'Escanea el código QR asignado al empleado que realizará el servicio para verificar su identidad. ¡Asegúrate de recibir el servicio de la persona correcta!',
      buttons: ['Aceptar']
    }).then(alert=> alert.present())
  }
  ionViewWillLeave(){
    this.isNotScanning = true;
    this.isShowingQRData = false;
    clearInterval(this.scanTimer);
    CameraPreview.stop();
  }

  async startScan(){
    this.isNotScanning = false;
    const cameraPreviewElement = document.getElementById('cameraPreview');
    const referenceElement = document.getElementById('camera-row');

    // Obtiene la posición del elemento de referencia
    const top = referenceElement.offsetTop;
     
    const headerElement = document.getElementById('header');
    const headerHeight = headerElement.offsetHeight;

    const height = referenceElement.offsetHeight;
    cameraPreviewElement.style.top = `${top+headerHeight}px`;

    CameraPreview.start({parent: 'cameraPreview',
      // Opciones de configuración
      position: 'rear', // Usa la cámara trasera
      width: window.screen.width, // Ancho de la vista previa
      height: height, // Altura de la vista previa
      disableAudio: true,
      y:headerHeight+top,
    });
    const pictureOptions = {
      quality: 85,
      width: window.screen.width,
      height: window.screen.height,
      resultType: 'jpg'
    };
    this.scanTimer = setInterval(async () => {
      const picture = await CameraPreview.capture(pictureOptions);
      const code = await detectQRCode(picture.value);
      if (code) {
        // Si se detectó un código QR, detiene el temporizador y la cámara
        this.stopScanner();
      }
    }, 1500);

  }

  stopScanner(){
    clearInterval(this.scanTimer);
    CameraPreview.stop();
    this.isNotScanning = true;
  }

}

function base64ToImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = `data:image/jpeg;base64,${base64}`;
  });
}

async function detectQRCode(base64) {
  // Convierte la imagen de base64 a un objeto Image
  const image = await base64ToImage(base64);

  // Crea un canvas y dibuja la imagen en él
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  // Obtiene los datos de imagen del canvas
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  // Utiliza jsQR para detectar códigos QR en la imagen
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (code) {
    console.log(`Código QR detectado: ${code.data}`);
    return code.data;
  } else {
    console.log('No se detectó ningún código QR');
    return null;
  }
}