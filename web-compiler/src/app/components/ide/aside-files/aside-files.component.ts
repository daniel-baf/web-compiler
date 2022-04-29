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

  constructor() {}

  ngOnInit(): void {}

  switchTab(tab: TabFile, id: number) {
    // remove class of all uls
    document.querySelectorAll('.switchableTabBtn').forEach((ul_t) => {
      ul_t.classList.remove('active');
    });
    // add active class to selected file
    document.getElementById(`file-${id}`)?.classList.add('active');
    this.fileToEdit.emit(tab);
  }
}
