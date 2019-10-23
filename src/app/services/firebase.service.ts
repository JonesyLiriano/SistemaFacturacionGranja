import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastService } from './toast.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private storage: AngularFireStorage, private toastService: ToastService) {     
  }

  uploadScriptBackUp(script: any) {
    let storageRef = this.storage.ref('SFacturacionGranja/ScriptBackUpY&G.txt');
    let task = storageRef.putString(script);
    return task.then(() => {
      this.toastService.presentSuccessToast('El respaldo de la base de datos ha sido subido al servidor correctamente.');
    }, err => {
      this.toastService.presentErrorToast('Ha ocurrido un error subiendo realizando el respaldo de la base de datos, intente de nuevo.')
    })      
      }
  }
