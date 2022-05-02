import { Component, Input, OnInit } from '@angular/core';
import { TabFile } from 'src/app/models/tab-file.model';

@Component({
  selector: 'app-files-edit',
  templateUrl: './files-edit.component.html',
  styleUrls: ['./files-edit.component.css'],
})
export class FilesEditComponent implements OnInit {
  @Input() activeTab: TabFile = new TabFile('', '');

  constructor() {}

  ngOnInit(): void {}

  checkTab(e: any) {
    if (e.keyCode === 9) {
      e.preventDefault();
      this.activeTab.tabData += '\t';
      $('#console').focus();
    }
  }
}
