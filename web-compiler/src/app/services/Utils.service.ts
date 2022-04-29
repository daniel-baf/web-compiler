import { Injectable } from '@angular/core';

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
}
