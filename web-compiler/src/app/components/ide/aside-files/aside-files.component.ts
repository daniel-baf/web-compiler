import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TabFile } from 'src/app/models/tab-file.model';

@Component({
  selector: 'app-aside-files',
  templateUrl: './aside-files.component.html',
  styleUrls: ['./aside-files.component.css'],
})
export class AsideFilesComponent implements OnInit {
  @Input() fileNames: TabFile[] = [];
  @Output() fileToEdit = new EventEmitter<TabFile>();
  @Input() activeFile: number = 0;

  constructor() {}

  ngOnInit(): void {}

  switchTab(tab: TabFile, id: number) {
    this.activeFile = id;
    this.fileToEdit.emit(tab);
  }
}
