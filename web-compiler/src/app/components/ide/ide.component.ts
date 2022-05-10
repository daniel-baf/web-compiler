import { Component, OnInit, ViewChild } from '@angular/core';
import { TabFile } from 'src/app/models/tab-file.model';
import { CLRManagerService } from 'src/app/services/CLR/CLRManager.service';
import { UtilsService } from 'src/app/services/Utils.service';
import { ConsoleLogComponent } from './console-log/console-log.component';
// import { LoadScriptsService } from 'src/app/services/load-scripts.service';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css'],
})
export class IdeComponent implements OnInit {
  activeFile = 0;
  tabFiles: TabFile[] = [];
  @ViewChild(ConsoleLogComponent) consoleL: ConsoleLogComponent =
    new ConsoleLogComponent();

  constructor(
    private _utils: UtilsService,
    private CLRManager: CLRManagerService // private _scriptLoader: LoadScriptsService
  ) {
    // load scripts for parser
    // _scriptLoader.load_scripts(['CLR/CLRUtils', 'CLR/CLR']);
  }

  ngOnInit(): void {
    // create temp file to test
    this.addTab([
      new TabFile(
        'test.clr',
        'Boolean glb_bool\nInt glbInt = 2+ (1 / 2)\n\nInt get_max(Int n1, Int n2):\n\tSi(n1 > n2):\n\t\tRetorno n1\n\tSino Si(n2 > n1):\n\t\tRetorno n2\n\tSino:\n\n\nVoid func_no_data():\n\n' +
          'Void pring_msg(String msg):\n\tMostrar("Mensaje: {1}",msg)\n\nString print_msg_mas(Int n1, Int n2):\n\tInt result = get_max(n1,n2)\n\t' +
          'String msgRst = "El resultado de sumar " + n1 + " con " + n2 + " es: " + get_max(n1,n2)\n\tpring_msg(msgRst)\n\n' +
          "Void Principal():\n\tBoolean valid = !(2 > 3)\n\tSi(valid):\n\tChar c_char = 'b'\n\tSi ( c_char != 'z'):\n\t\tInt tmp1 = 2 * 3 /1\n" +
          '\t\tInt lck = tmp1 % 2\n\t\tprint_msg_mas(tmp1, lck)\n\tSino:\n\t\tPara(Int k = 1; k< 12; ++):\n\t\t\tMostrar("hola h1")\'" adios pato 2 \'"\n' +
          '\t\tMostrar("adios")   \'"hola pato\'"\n\n\n'
      ),
    ]);

    // this.addTab([
    //   new TabFile(
    //     'test.clr',
    //     'Boolean glb_bool\nInt glbInt = 2+ (1 / 2)\n\nInt get_max(Int n1, Int n2):\n\tSi(n1 > n2):\n\t\tRetorno n1\n\tSino Si(n2 > n1):\n\t\tRetorno n2\n\tSino:\n'
    //   ),
    // ]);
  }

  // add a tab to the editable files
  addTab(tabs: TabFile[]) {
    // search if file already exist
    tabs.forEach((tab) => {
      if (this._utils.getIndexFromTab(tab.tabName, this.tabFiles) === -1) {
        this.tabFiles.push(tab);
        this.activeFile = this.tabFiles.length - 1;
      }
    });
  }

  // remove a tab from array
  private closeTab() {
    // show popup asking if user want to save changes before closing
    if (
      this.tabFiles.length > 0 &&
      this._utils.getConfirmation(
        'Seguro que deseas cerrar la pestaña? todos los cambios no guardados se perderán'
      )
    ) {
      this.tabFiles.splice(this.activeFile, 1);
      this.activeFile = this.tabFiles.length - 1;
    }
  }

  // change the file view
  switchTab(tab: TabFile) {
    this.activeFile = this._utils.getIndexFromTab(tab.tabName, this.tabFiles);
  }

  // compile the code into the editor
  compileCode() {
    this.consoleL.clear();
    try {
      let toPrint = this.CLRManager.execAnalysis(
        this.tabFiles[this.activeFile].tabData
      );
      this.consoleL.print(toPrint);
    } catch (error) {
      this.consoleL.print(error);
    }
  }

  // used to exec multiple void (click) children methods on EventEmitters
  execVoidAction(action: string) {
    switch (action) {
      case 'download':
        if (this.tabFiles.length > 0) {
          this._utils.createDownloadableTextFile(
            this.tabFiles[this.activeFile].tabData,
            this.tabFiles[this.activeFile].tabName
          );
        }
        break;
      case 'close-tab':
        this.closeTab();
        break;
      case 'compile':
        this.compileCode();
        break;
      default:
        break;
    }
  }
}
