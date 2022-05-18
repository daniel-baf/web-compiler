import { SymTable } from '../analyzer/sym-table.model';
import { EPVN } from '../tree/ast-node-expected.model';
import { AstNode } from '../tree/ast-node.model';
import { AnalysisError } from './anlys_err.model';
import { FunctionEvaluator } from './objects/function.model';
import { GlobalVarDec } from './objects/global-var-dec.model';

export class CRLEvaluator {
  private _sym_table: SymTable;
  private _func_map: Map<String, FunctionEvaluator>;
  private _main_func?: FunctionEvaluator = undefined;

  constructor() {
    this._sym_table = new SymTable();
    this._func_map = new Map<String, FunctionEvaluator>();
  }

  public eval(
    _root: AstNode,
    _errors: Array<AnalysisError>,
    _drawable_graphs: AstNode[]
  ): void {
    this.sub_eval(_root, _errors);
    // run main eval
    if (this._main_func != undefined) {
      this._main_func.eval(_drawable_graphs);
    }
    // console.log(this._sym_table);
    // console.log(this._func_map);
    // console.log(_errors);
  }

  private sub_eval(_cur_node: AstNode, _errors: Array<AnalysisError>): void {
    // eval node
    this.eval_node(_cur_node, _errors);
    // recursively
    if (_cur_node != null && _cur_node.children != null) {
      _cur_node.children.forEach((_child) => {
        try {
          if (this.is_evaluable(_child)) {
            this.sub_eval(_child, _errors);
          }
        } catch (error) {}
      });
    }
  }

  // execute node evaluation
  private eval_node(_node: AstNode, _errors: Array<AnalysisError>): void {
    // normal execution
    switch (_node.label) {
      case EPVN.global_var_dec:
        let _gvd = new GlobalVarDec();
        _gvd.eval(_node, this._sym_table, _errors);
        break;
      case EPVN.func:
        // add function
        let _func: FunctionEvaluator = new FunctionEvaluator(
          this._sym_table,
          _node,
          this._func_map,
          _errors
        );
        this._func_map.set(_func.id, _func);
        break;
      case EPVN.func_main: // execute
        if (this._main_func === undefined) {
          this._main_func = new FunctionEvaluator(
            this._sym_table,
            _node,
            this._func_map,
            _errors
          );
        } else {
          _errors.push(
            new AnalysisError(
              0,
              0,
              'Semantico',
              'Solo puede haber una funcion main'
            )
          );
        }
        break;
      default:
      // ignore
    }
  }

  // check if actual node is evaluable, as line declr, statement selection, functions...
  private is_evaluable(_node: AstNode) {
    try {
      return (
        _node.label === EPVN.global_var_dec ||
        _node.label === EPVN.func ||
        _node.label === EPVN.func_main
      );
    } catch (error) {
      return false;
    }
  }
}
