import { Injectable } from '@angular/core';
declare var CLR: any; // CRL.js
declare var CLRUtils: any; // CRLUtils.js

@Injectable({
  providedIn: 'root',
})
export class CLRManagerService {
  constructor() {}

  execAnalysis(data: string): string {
    let clrUtils = new CLRUtils();
    let msg = '';
    if (clrUtils.parse(data)) {
      msg = 'done!';
    } else {
      msg = 'unable to parse grammar';
    }
    return msg;
  }
}
