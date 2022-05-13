import { SymTable } from '../analyzer/sym-table.model';
import { EPVN } from '../tree/ast-node-expected.model';
import { AstNode } from '../tree/ast-node.model';
import { ExprCaster } from './objects/expr/expr-caster.model';
import { GlobalVarDec } from './objects/global-var-dec.model';

export class CRLEvaluator {
  private _sym_table: SymTable;
  private _func_map: Map<String, AstNode>;

  constructor() {
    this._sym_table = new SymTable();
    this._func_map = new Map<String, AstNode>();
  }

  public eval(_root: AstNode): void {
    this.sub_eval(_root);
    console.log(this._sym_table);
  }

  private sub_eval(_cur_node: AstNode): void {
    // eval node
    this.eval_node(_cur_node);
    // recursively
    if (_cur_node != null && _cur_node.children != null) {
      _cur_node.children.forEach((_child) => {
        try {
          if (this.is_evaluable(_child)) {
            this.sub_eval(_child);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  private eval_node(_node: AstNode): void {
    // normal execution
    switch (_node.label) {
      case EPVN.global_var_dec:
        let _gvd = new GlobalVarDec();
        _gvd.eval(_node, this._sym_table);
        break;
        // case EPVN.func_main: // execute
        //   console.log('func main, EXECUTE');
        //   break;
        // case EPVN.func:
        //   // add function
        //   console.log('func');
        //   break;
        // case EPVN.stmt_line:
        //   console.log('stmt line');
        //   break;
        // case EPVN.stmt_selection:
        //   console.log('stmt selection');
        break;
      default:
      // console.log('invalid, add error');
    }
  }

  private is_evaluable(_node: AstNode) {
    try {
      return (
        _node.label === EPVN.global_var_dec ||
        _node.label === EPVN.func ||
        _node.label === EPVN.func_main ||
        _node.label === EPVN.stmt_line ||
        _node.label === EPVN.stmt_selection
      );
    } catch (error) {
      return false;
    }
  }
}
