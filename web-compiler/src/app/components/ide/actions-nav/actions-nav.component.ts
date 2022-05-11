import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TabFile } from 'src/app/models/tab-file.model';
import { UtilsService } from 'src/app/services/Utils.service';

@Component({
  selector: 'app-actions-nav',
  templateUrl: './actions-nav.component.html',
  styleUrls: ['./actions-nav.component.css'],
})
export class ActionsNavComponent implements OnInit {
  @Output() tabEmiter = new EventEmitter<TabFile[]>();
  @Output() voidEmitter = new EventEmitter<string>();

  newTabName: string;
  errorMessage: string;
  showError: boolean;
  files: File[] = [];

  constructor(private utils: UtilsService) {
    this.newTabName = '';
    this.errorMessage = '';
    this.showError = false;
  }

  ngOnInit(): void {}

  // Create a new tab and send an Output event to parent component
  newTab() {
    if (this.newTabName.trim() === '') {
      // TODO validate the new file name is valid
      this.showErrorMessage('Nombre de archivo invalido');
    } else {
      // send creation
      this.showError = false;
      this.tabEmiter.emit([new TabFile(`${this.newTabName.trim()}.crl`, '')]);
      this.newTabName = '';
    }
  }

  async uploadFiles() {
    // create an array to store in new tabs
    let newTabs: TabFile[] = [];
    // get text into files
    for (let i = 0; i < this.files.length; i++) {
      newTabs.push(
        new TabFile(
          this.files[i].name,
          await this.utils.readFileContent(this.files[i])
        )
      );
    }
    // send new files to ide module
    this.tabEmiter.emit(newTabs);
  }

  voidEvent(e: any, str: string) {
    if (str != 'download') {
      e.preventDefault();
    }
    this.voidEmitter.emit(str);
  }

  private showErrorMessage(message: string): void {
    this.showError = true;
    this.errorMessage = message;
  }

  preSaveFiles(e: any) {
    this.files = e.target.files;
  }
}
