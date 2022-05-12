import { Component, OnInit } from '@angular/core';
import { AnalysisError } from 'src/app/models/CRL/anlys_err.model';
import { CRLManagerService } from 'src/app/services/CRL/CRLManager.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  _errors_analysis: Array<AnalysisError>;

  constructor(private _crl_serv: CRLManagerService) {
    this._errors_analysis = new Array<AnalysisError>();
  }

  ngOnInit(): void {
    this._crl_serv._err_emitter.subscribe((data) => {
      this._errors_analysis = data;
    });
  }
}
