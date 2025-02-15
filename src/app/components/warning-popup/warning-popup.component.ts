import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileWarning, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-warning-popup',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './warning-popup.component.html',
  styleUrl: './warning-popup.component.css'
})
export class WarningPopupComponent {
 readonly FileWarning = FileWarning
  
@Input() title = ''
@Output() onClose = new EventEmitter()
@Output()  onDelete = new EventEmitter()



close(){
  this.onClose.emit()
}

handleDelete(){
  this.onDelete.emit()
}




}
