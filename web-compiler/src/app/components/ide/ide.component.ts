import { Component, OnInit, ViewChild } from '@angular/core';
import { AnalysisError } from 'src/app/models/CRL/anlys_err.model';
import { TabFile } from 'src/app/models/tab-file.model';
import { CRLManagerService } from 'src/app/services/CRL/CRLManager.service';
import { UtilsService } from 'src/app/services/Utils.service';
import { ConsoleLogComponent } from './console-log/console-log.component';
// import { LoadScriptsService } from 'src/app/services/load-scripts.service';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css'],
})
export class IdeComponent implements OnInit {
  public activeFile = 0;
  public tabFiles: TabFile[] = [];
  public _view: number = 0;
  public _errors: Array<AnalysisError>;

  @ViewChild(ConsoleLogComponent) consoleL: ConsoleLogComponent =
    new ConsoleLogComponent();

  constructor(
    private _utils: UtilsService,
    private CRLManager: CRLManagerService
  ) {
    this._errors = [];
  }

  ngOnInit(): void {
    // create temp file to test
    this.addTab([
      new TabFile(
        'test.crl',
        'Boolean glb_bool = false, bool2 = !glb_bool\nInt glbInt = 2+ false \n\nInt get_max(Int n1, Int n2):\n\tSi(n1 > n2):\n\t\tRetorno n1\n\tSino Si(n2 > n1):\n\t\tRetorno n2\n\tSino:\n\n\nVoid func_no_data():\n\tDouble k = -12\n\tMientras ( k < 2 ^ 3 - 10):\n\t\tPara(Int k1 = 0; k < 2; ++):\n\t\t\tSi ( k %2 == 0):\n\t\t\t\tMostrar("Es par")\n\t\t\tSino:\n\t\t\t\tMostrar("Es impar")\n\t\tMostrar("Fin de para")\n\tMostrar("Fin de mientras")\n\nVoid pring_msg(String msg):\n\tMostrar("Mensaje: {1}",msg)\n\nString print_msg_mas(Int n1, Int n2):\n\tInt result = get_max(n1,n2)\n\tString msgRst = "El resultado de sumar " + n1 + " con " + n2 + " es: " + get_max(n1,n2)\n\tpring_msg(msgRst)\n\nVoid Principal():\n\tBoolean valid = !(2 > 3)\n\tSi(valid):\n\tChar c_char = \'b\'\n\tSi ( c_char != \'z\'):\n\t\tInt tmp1 = 2 * 3 /1\n\t\tInt lck = tmp1 % 2\n\t\tprint_msg_mas(tmp1, lck)\n\tSino:\n\t\tPara(Int k = 1; k< 12; ++):\n\t\t\tMostrar("hola h1")\'" adios pato 2 \'"\n\t\tMostrar("adios")   \'"hola pato\'"\n\tDibujarAST(func_no_data)\n\tDibujarEXP(2+1/3^(-1+2))\n\tMostrar("FIN DE MAIN")\n'
      ),
    ]);
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
      let toPrint = this.CRLManager.execAnalysis(
        // service update error table automatically
        this.tabFiles[this.activeFile].tabData
      );
      // trigger errors
      this._errors = toPrint.err;
      this.consoleL.print(toPrint.msg);
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
      case 'get-reports':
        this._view = 1;
        break;
      case 'close-reports':
        this._view = 0;
        break;
      default:
        alert('invalid action');
        break;
    }
  }
}
