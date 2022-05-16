import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnalysisError } from 'src/app/models/CRL/anlys_err.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  @Output() voidEmitter = new EventEmitter<string>();
  @Input() _errors_analysis: Array<AnalysisError>;

  constructor() {
    this._errors_analysis = new Array<AnalysisError>();
  }

  ngOnInit(): void {
    // this._crl_serv._err_emitter.subscribe((data) => {
    //   this._errors_analysis = data;
    // });
  }

  voidEvent(e: any, str: string) {
    e.preventDefault();
    this.voidEmitter.emit(str);
  }
}
