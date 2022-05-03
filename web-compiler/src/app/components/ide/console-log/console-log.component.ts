import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-console-log',
  templateUrl: './console-log.component.html',
  styleUrls: ['./console-log.component.css'],
})
export class ConsoleLogComponent implements OnInit {
  consoleData: string = '';

  constructor() {}

  ngOnInit(): void {}

  print(data: any) {
    this.consoleData += `${data}\n`;
  }

  clear() {
    this.consoleData = '';
  }
}
