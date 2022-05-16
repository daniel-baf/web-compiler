import { SymTable } from '../../analyzer/sym-table.model';
import { EPVN } from '../../tree/ast-node-expected.model';
import { AstNode } from '../../tree/ast-node.model';

export class FunctionEvaluator {
  private _sym_table: SymTable;
  private _id: string;
  private _type: EPVN;
  private _params: AstNode;

  constructor(private _glb_sym_table: SymTable, private _root: AstNode) {
    // get data
    let _cast: any = _root.children[0];
    this._type = _cast;
    _cast = _root.children[1].children[0];
    this._id = _cast;
    this._sym_table = new SymTable();
    // get params
    this._params = _root.children[2];
  }

  public eval() {
    alert('eval func');
  }

  public get id(): string {
    return this._id;
  }
}
