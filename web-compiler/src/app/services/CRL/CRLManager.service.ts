import { EventEmitter, Injectable, Output } from '@angular/core';
import { AnalysisError } from 'src/app/models/CRL/anlys_err.model';
import { CRLEvaluator } from 'src/app/models/CRL/crl-eval.model';
import { CRLUtils } from 'src/app/models/CRL/crl-utils.model';
import { EPVN } from 'src/app/models/tree/ast-node-expected.model';
import { AstNode } from 'src/app/models/tree/ast-node.model';
import { parser as Parser } from 'src/scripts/CRL.js';

@Injectable({
  providedIn: 'root',
})
export class CRLManagerService {
  private _analysis_errs: Array<AnalysisError>;
  @Output() _err_emitter: EventEmitter<Array<AnalysisError>> =
    new EventEmitter();

  constructor() {
    this._analysis_errs = new Array<AnalysisError>();
  }

  execAnalysis(data: string) {
    // let grm_parser = new Parser(data);
    let output: CRLUtils = Parser.parse(data);
    if (output.error_analysis.length === 0) {
      // UPDATE ERRORS
      this._analysis_errs = output.error_analysis;
      // TODO run eval function
      let _evaler = new CRLEvaluator();
      _evaler.eval(output.final_program, this.analysis_errs);
      // check no errors while evaluating
      if (this.analysis_errs.length === 0) {
        return {
          msg: 'Gramatica correcta',
          err: output.error_analysis,
          fp: output.final_program,
        };
      }
    }
    return {
      msg: 'Hay errores en la gramatica, puedes ver los resultados en Acciones -> ver reportes',
      err: output.error_analysis,
    };
  }

  public get analysis_errs(): Array<AnalysisError> {
    return this._analysis_errs;
  }
}
