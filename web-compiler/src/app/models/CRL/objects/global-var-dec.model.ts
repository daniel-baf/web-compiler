import { SymTable } from '../../analyzer/sym-table.model';
import { EPVN } from '../../tree/ast-node-expected.model';
import { AstNode } from '../../tree/ast-node.model';
import { AnalysisError } from '../anlys_err.model';
import { ExprCaster } from './expr/expr-caster.model';

export class GlobalVarDec {
  constructor() {}

  public eval(
    _node: AstNode,
    _sym_table: SymTable,
    _errors: Array<AnalysisError>
  ) {
    let _type: any = _node.children[0];
    let _caster: ExprCaster = new ExprCaster();
    let _vars: AstNode[] = [];
    // get vars
    for (let i = 1; i < _node.children.length; i++) {
      _vars.push(_node.children[i]);
    }
    // get values of _vars and compare with _type, if true, add to _sym_table, otherwise, add error
    _vars.forEach((_var) => {
      // get result
      let _id: any; // this node is a string
      if (_var.children[1] != undefined) {
        // exist expression
        _id = _var.children[0].children[0]; // get element
        let _res: AstNode = _caster.get_final_cast(
          _var.children[1],
          _sym_table
        );
        if (_caster.itemCaster.is_assignable(_type, _res.label)) {
          _sym_table.add(_id, _res.children[0], 0, _type);
        } else {
          _errors.push(
            new AnalysisError(
              0,
              0,
              'Semantico',
              `Tipo no coincidente para ${_id}, esperado ${
                EPVN[_type]
              }  pero se obtuvo ${EPVN[_res.label]}`
            )
          );
        }
      } else {
        // no expresion, value null
        _id = _var.children[0];
        _sym_table.add(_id, null, 0, _type); // TODO fix, custom line
      }
    });
  }
}
