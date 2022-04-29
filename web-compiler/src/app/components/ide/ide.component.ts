import { Component, OnInit } from '@angular/core';
import { TabFile } from 'src/app/models/tab-file.model';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css'],
})
export class IdeComponent implements OnInit {
  activeFile = 0;
  tabFiles: TabFile[] = [];

  constructor() {}

  ngOnInit(): void {}

  addTab(tab: TabFile) {
    // search if file already exist
    if (this.getIndexFromTab(tab.tabName) === -1) {
      this.tabFiles.push(tab);
      this.activeFile = this.tabFiles.length - 1;
    }
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
}
