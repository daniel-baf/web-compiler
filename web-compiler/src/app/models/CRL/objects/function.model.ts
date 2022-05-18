import { SymTable } from '../../analyzer/sym-table.model';
import { EPVN } from '../../tree/ast-node-expected.model';
import { AstNode } from '../../tree/ast-node.model';
import { AnalysisError } from '../anlys_err.model';
import { GlobalVarDec } from './global-var-dec.model';

export class FunctionEvaluator {
  private _sym_table: SymTable;
  private _id: string;
  private _type: EPVN;
  private _params: AstNode;

  constructor(
    private _glb_sym_table: SymTable,
    private _root: AstNode,
    private _func_pool: Map<String, FunctionEvaluator>,
    private _errors: AnalysisError[]
  ) {
    // get data
    let _cast: any = _root.children[0];
    this._type = _cast;
    _cast = _root.children[1].children[0];
    this._id = _cast;
    this._sym_table = new SymTable();
    // get params
    this._params = _root.children[2];
    // update sym_table
    _glb_sym_table.table.forEach((_row) => {
      this._sym_table.add(_row._id, _row._value, _row._line, _row._type);
    });
  }

  public eval(_draw_graphs: AstNode[]) {
    // execute all content nodes
    try {
      this._root.children.forEach((_child) => {
        this.eval_fun(_child, _draw_graphs);
      });
    } catch (error) {}
  }

  private eval_fun(_node: AstNode, _draw_graphs: AstNode[]) {
    let _smt = _node.children[0];
    switch (_node.label) {
      case EPVN.stmt_line:
        switch (_smt.label) {
          case EPVN.var_dec:
            let _gvd = new GlobalVarDec();
            _gvd.eval(_node, this._sym_table, this._errors);
            break;
          case EPVN.draw_ast:
            // get node from function
            let _func = this._func_pool.get(`${_smt.children[0].children[0]}`);
            if (_func != undefined) {
              _draw_graphs.push(_func.root);
            }
            break;
          case EPVN.draw_exp:
            _draw_graphs.push(_smt.children[0]);
            break;
          default:
            break;
        }
        break;
      case EPVN.stmt_selection:
        break;
      default:
        break;
    }
  }

  public get id(): string {
    return this._id;
  }

  public get root(): AstNode {
    return this._root;
  }
}
