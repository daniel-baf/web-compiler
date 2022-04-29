import { Component, OnInit } from '@angular/core';
import { TabFile } from 'src/app/models/tab-file.model';
import { UtilsService } from 'src/app/services/Utils.service';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css'],
})
export class IdeComponent implements OnInit {
  activeFile = 0;
  tabFiles: TabFile[] = [];

  constructor(private utils: UtilsService) {}

  ngOnInit(): void {}

  // add a tab to the editable files
  addTab(tabs: TabFile[]) {
    // search if file already exist
    tabs.forEach((tab) => {
      if (this.utils.getIndexFromTab(tab.tabName, this.tabFiles) === -1) {
        this.tabFiles.push(tab);
        this.activeFile = this.tabFiles.length - 1;
      }
    });
  }

  // remove a tab from array
  private closeTab() {
    // show popup asking if user want to save changes before closing
    if (
      this.tabFiles.length > 0 &&
      this.utils.getConfirmation(
        'Seguro que deseas cerrar la pestaña? todos los cambios no guardados se perderán'
      )
    ) {
      this.tabFiles.splice(this.activeFile, 1);
      this.activeFile = this.tabFiles.length - 1;
    }
  }

  switchTab(tab: TabFile) {
    this.activeFile = this.utils.getIndexFromTab(tab.tabName, this.tabFiles);
  }

  execVoidAction(action: string) {
    switch (action) {
      case 'download':
        if (this.tabFiles.length > 0) {
          this.utils.createDownloadableTextFile(
            this.tabFiles[this.activeFile].tabData,
            this.tabFiles[this.activeFile].tabName
          );
        }
        break;
      case 'close-tab':
        this.closeTab();
        break;
      default:
        break;
    }
  }
}
