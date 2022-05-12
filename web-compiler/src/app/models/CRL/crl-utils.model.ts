import { EPVN, ValidPrevNodeChecker } from '../tree/ast-node-expected.model';
import { AstNode } from '../tree/ast-node.model';
import { AnalysisError } from './anlys_err.model';

export class CRLUtils {
  constructor(
    private _errors_analysis: Array<AnalysisError> = new Array<AnalysisError>(),
    private _cur_scope = new AstNode(EPVN.BODY, [], -1, null),
    private _prv_ast: ValidPrevNodeChecker = new ValidPrevNodeChecker(),
    private _final_program = _cur_scope
  ) {}

  public add_error(
    line: number,
    col: number,
    type: String,
    lexem: String
  ): void {
    // TODO show on html table
    this._errors_analysis.push(new AnalysisError(line, col, type, lexem));
  }

  public push_pipe(new_node: AstNode, line: number): void {
    // check prev node is valid
    try {
      if (new_node.tabs === this._cur_scope.tabs + 1) {
        this.insert_child_node(new_node, line);
      } else if (new_node.tabs === this._cur_scope.tabs) {
        this.insert_sister_node(new_node, line);
      } else if (new_node.tabs < this._cur_scope.tabs) {
        this.insert_parent_node(new_node, line);
      } else {
        this.add_error(line, 0, 'Semantico', 'Tabulaciòn invalida');
      }
    } catch (error) {
      this.add_error(line, 0, 'Programa', 'Error en el programa, ' + error);
    }
  }

  private insert_child_node(ast_node: AstNode, line: number) {
    // check is valid for insert
    if (this._prv_ast.check_prev(ast_node, this.get_stacked())) {
      ast_node.parent = this._cur_scope;
      this._cur_scope.add_child(ast_node);
      // update current scope
      this._cur_scope = this._prv_ast.is_parent(ast_node.label)
        ? ast_node
        : this._cur_scope;
    } else {
      this.add_error(
        line,
        0,
        'Semantico',
        'Instruccion no valida con el valor anterior '
      );
    }
  }

  private insert_parent_node(ast_node: AstNode, line: number) {
    // update paretn
    if (this._cur_scope.parent != null) {
      this._cur_scope = this._cur_scope.parent;
      this.push_pipe(ast_node, line);
    } else {
      this.add_error(
        line,
        0,
        'Semantico',
        'La instruccioón no es un hijo valido para el scope actual'
      );
    }
  }

  private insert_sister_node(ast_node: AstNode, line: number) {
    // update current_scope
    if (this._cur_scope.parent != null) {
      this._cur_scope = this._cur_scope.parent;
      this.push_pipe(ast_node, line);
    } else {
      this.add_error(
        line,
        0,
        'Semantico',
        'La instruccioón no es un hijo valido para el scope actual'
      );
    }
  }

  get_stacked(): AstNode {
    return this._cur_scope.get_last_child_type();
  }

  get error_analysis(): Array<AnalysisError> {
    return this._errors_analysis;
  }

  get final_program(): AstNode {
    return this._final_program;
  }
}
