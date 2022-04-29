import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TabFile } from 'src/app/models/tab-file.model';

@Component({
  selector: 'app-actions-nav',
  templateUrl: './actions-nav.component.html',
  styleUrls: ['./actions-nav.component.css'],
})
export class ActionsNavComponent implements OnInit {
  @Output() tabEmiter = new EventEmitter<TabFile>();

  newTabName: string;
  errorMessage: string;
  showError: boolean;

  constructor() {
    this.newTabName = '';
    this.errorMessage = '';
    this.showError = false;
  }

  ngOnInit(): void {}

  newTab() {
    if (this.newTabName.trim() === '') {
      this.showErrorMessage('El archivo no puede tener nombre vacio');
    } else {
      // send creation
      this.showError = false;
      this.tabEmiter.emit(new TabFile(this.newTabName.trim(), ''));
      this.newTabName = '';
    }
  }

  uploadFiles() {
    // TODO upload files
    alert('TODO upload file');
  }

  downloadFIle() {
    // TODO download file
    alert('TODO download file');
  }

  closeTab() {
    // TODO close active tab
    alert('TODO close tab');
  }

  private showErrorMessage(message: string): void {
    this.showError = true;
    this.errorMessage = message;
  }
}
