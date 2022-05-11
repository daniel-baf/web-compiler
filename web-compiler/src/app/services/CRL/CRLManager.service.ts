import { Injectable, Input } from '@angular/core';
import { CRLUtils } from 'src/app/models/CRL/crl-utils.model';
import { parser as Parser } from 'src/scripts/CRL.js';

@Injectable({
  providedIn: 'root',
})
export class CRLManagerService {
  @Input() _analysis_errs: Array<Object> = new Array<Object>();

  constructor() {}

  execAnalysis(data: string) {
    // let grm_parser = new Parser(data);
    let output: CRLUtils = Parser.parse(data);
    console.log(output);

    if (output.error_analysis.length === 0) {
      this._analysis_errs = output.error_analysis;
      // TODO run eval function

      // TODO return eval result
      return 'Gramatica correcta';
    } else {
      return 'Hay errores en la gramatica, puedes ver los resultados en Acciones -> ver reportes';
    }
  }
}
