import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CLRManagerService {
  constructor() {}

  execAnalysis(data: string): string {
    var output = CLR.parse(data);
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
