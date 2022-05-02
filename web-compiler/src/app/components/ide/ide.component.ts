import { Component, OnInit, ViewChild } from '@angular/core';
import { TabFile } from 'src/app/models/tab-file.model';
import { CRLManagerService } from 'src/app/services/CRLManager.service';
import { UtilsService } from 'src/app/services/Utils.service';
import { ConsoleLogComponent } from './console-log/console-log.component';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css'],
})
export class IdeComponent implements OnInit {
  activeFile = 0;
  tabFiles: TabFile[] = [];
  @ViewChild(ConsoleLogComponent) consoleL: ConsoleLogComponent =
    new ConsoleLogComponent();

  constructor(
    private utils: UtilsService,
    private CRLManager: CRLManagerService
  ) {}

  ngOnInit(): void {
    // create temp file to test
    this.addTab([new TabFile('test.crl', '')]);
  }

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

  // change the file view
  switchTab(tab: TabFile) {
    this.activeFile = this.utils.getIndexFromTab(tab.tabName, this.tabFiles);
  }

  // compile the code into the editor
  compileCode() {
    let toPrint = this.CRLManager.execAnalysis(
      this.tabFiles[this.activeFile].tabData
    );
    this.consoleL.print(toPrint);
  }

  // used to exec multiple void (click) children methods on EventEmitters
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
      case 'compile':
        this.compileCode();
        break;
      default:
        break;
    }
  }
}
