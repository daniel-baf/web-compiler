import { SymTable } from 'src/app/models/analyzer/sym-table.model';
import { EPVN } from '../../../tree/ast-node-expected.model';
import { AstNode } from '../../../tree/ast-node.model';
import { ItmCaster } from './item-caster.model';

export class ExprCaster {
  private _caster: ItmCaster;

  constructor() {
    this._caster = new ItmCaster();
  }

  public get_final_cast(_expr: AstNode, _sym_table: SymTable): AstNode {
    // print expr tree
    if (_expr.label === EPVN.id) {
      let _id: any = _expr.children[0];
      return _sym_table.find_as_node(_id);
    } else if (_expr.label < 6 && _expr.label > 0) {
      // TODO find when ID
      return _expr;
    } else if (_expr.label === EPVN.PARENTHESIS) {
      return this.get_final_cast(_expr.children[0], _sym_table);
    } else if (this._caster.is_evaluable(_expr.label)) {
      return this._caster.cast(
        _expr.label,
        this.get_final_cast(_expr.children[0], _sym_table),
        this.get_final_cast(_expr.children[1], _sym_table)
      );
    } else {
      return new AstNode(EPVN.invalid_cast);
    }
  }

  public get itemCaster(): ItmCaster {
    return this._caster;
  }
}
1;
