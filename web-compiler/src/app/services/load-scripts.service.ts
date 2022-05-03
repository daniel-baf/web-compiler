import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadScriptsService {
  constructor() {}

  load_scripts(files: string[]) {
    for (const file of files) {
      let script = document.createElement('script');
      script.src = `../../assets/js/${file}.js`;
      let body = document.getElementById('master-body');
      if (body != null) {
        body.appendChild(script);
      }
    }
  }
}
