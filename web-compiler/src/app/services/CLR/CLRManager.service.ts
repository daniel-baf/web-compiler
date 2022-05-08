import { Injectable } from '@angular/core';
import { CLRUtils } from 'src/app/models/CLR/clr-utils.model';
import { parser as Parser } from 'src/scripts/CLR.js';
// declare var CLR: any; // CRL.js
// declare var CLRUtils: any; // CRLUtils.js

@Injectable({
  providedIn: 'root',
})
export class CLRManagerService {
  constructor() {}

  execAnalysis(data: string) {
    // let grm_parser = new Parser(data);
    let output: CLRUtils = Parser.parse(data);
    console.log(output);

    // let clrUtils = new CLRUtils();
    // let msg = '';
    // if (clrUtils.parse(data)) {
    //   msg = 'done!';
    // } else {
    //   msg = 'unable to parse grammar';
    // }
    return 'HERE MUST BE END PARSER';
  }
}
