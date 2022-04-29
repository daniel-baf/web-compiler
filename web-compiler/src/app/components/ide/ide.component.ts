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

  addTab(tabs: TabFile[]) {
    // search if file already exist
    tabs.forEach((tab) => {
      if (this.getIndexFromTab(tab.tabName) === -1) {
        this.tabFiles.push(tab);
        this.activeFile = this.tabFiles.length - 1;
      }
    });
  }

  getIndexFromTab(name: string) {
    for (let index = 0; index < this.tabFiles.length; index++) {
      if (this.tabFiles[index].tabName === name) {
        return index;
      }
    }
    return -1;
  }

  switchTab(tab: TabFile) {
    this.activeFile = this.getIndexFromTab(tab.tabName);
  }

  execVoidAction(action: string) {
    if (action === 'download' && this.tabFiles.length > 0) {
      this.utils.createDownloadableTextFile(
        this.tabFiles[this.activeFile].tabData,
        this.tabFiles[this.activeFile].tabName
      );
    }
  }
}
