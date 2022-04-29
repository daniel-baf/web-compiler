import { Injectable } from '@angular/core';
import { TabFile } from '../models/tab-file.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  // Return the string of a File, this method use PRomises, so any method
  // who implements this, must be async
  public readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = reader.result != null ? reader.result.toString() : '';
        resolve(text);
      };

      reader.readAsText(file);
    });
  }

  // create a downloadable file with the data string, and name (name includes the extension)
  public createDownloadableTextFile(data: string, name: string) {
    // create object temp downloadable
    let downloadable = document.createElement('a'); // create a tmp link
    downloadable.download = name; // set a downloadable name by default
    let tmpFile = new Blob([data], {
      // set data
      type: 'text/plain',
    });
    downloadable.href = window.URL.createObjectURL(tmpFile);
    downloadable.click();
  }

  // utilities
  getIndexFromTab(name: string, tabArray: TabFile[]) {
    for (let index = 0; index < tabArray.length; index++) {
      if (tabArray[index].tabName === name) {
        return index;
      }
    }
    return -1;
  }

  // get confirmation before continue something
  getConfirmation(message: string) {
    let retVal = confirm(message);
    if ((retVal = true)) {
      return true;
    } else {
      return false;
    }
  }
}
