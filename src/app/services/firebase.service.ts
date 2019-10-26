import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  refUrl = 'SFacturacionGranja/ScriptBackUpY&G.txt';
  constructor(private storage: AngularFireStorage, private toastService: ToastService) {
  }

  uploadScriptBackUp(script: any) {
    let storageRef = this.storage.ref(this.refUrl);
    let task = storageRef.putString(script);
    return task.then(() => {
      this.toastService.presentSuccessToast('El respaldo de la base de datos ha sido subido al servidor correctamente.');
    }, err => {
      this.toastService.presentErrorToast('Ha ocurrido un error subiendo realizando el respaldo de la base de datos, intente de nuevo.')
    })
  }

  downloadScriptBackUp() {
    let storageRef = this.storage.ref(this.refUrl);
    let task = storageRef.getDownloadURL();
    return task.toPromise().then(data => {
     return data;      
    }, err => {
      return alert(err);
    })
  }
}
