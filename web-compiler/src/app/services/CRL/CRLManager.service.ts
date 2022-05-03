import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CRLManagerService {
  constructor() {}

  execAnalysis(data: string): string {
    var output = CRL.parse(data + '\n');
    if (output) {
      console.log('done');
    } else {
      console.log('unable to parse');
    }
    // runAnalysis(data);
    // CRLParser.startCRLAnalysis(data);
    return 'done';
  }
}
