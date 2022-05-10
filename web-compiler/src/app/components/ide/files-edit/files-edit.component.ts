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
      let _console = $('#console');
      let _cursor_pos = _console.prop('selectionStart');
      this.activeTab.tabData =
        this.activeTab.tabData.substring(0, _cursor_pos) +
        '\t' +
        this.activeTab.tabData.substring(
          _cursor_pos,
          this.activeTab.tabData.length
        );
      _console.focus();
    }
  }

  setCursor(pos: any, _console: any) {
    // TODO fix, set cursor position
  }
}
