import { EPVN, ValidPrevNodeChecker } from '../tree/ast-node-expected.model';
import { AstNode } from '../tree/ast-node.model';

export class CLRUtils {
  constructor(
    private _errors_analysis: Array<Object> = new Array<String>(),
    private _cur_scope = new AstNode(EPVN.BODY, [], -1, null),
    private _prv_ast: ValidPrevNodeChecker = new ValidPrevNodeChecker(),
    private _final_program = _cur_scope
  ) {}

  public add_error(
    line: Number,
    col: Number,
    type: String,
    lexem: String
  ): void {
    // TODO show on html table
    this._errors_analysis.push({
      line: line,
      col: col,
      type: type,
      lexem: lexem,
    });
  }

  public push_pipe(new_node: AstNode): void {
    // check prev node is valid
    try {
      if (new_node.tabs === this._cur_scope.tabs + 1) {
        this.insert_child_node(new_node);
      } else if (new_node.tabs === this._cur_scope.tabs) {
        this.insert_sister_node(new_node);
      } else if (new_node.tabs < this._cur_scope.tabs) {
        this.insert_parent_node(new_node);
      } else {
        // TODO valid error
        console.log('invalid tabs');
      }
    } catch (error) {
      // TODO valid error
      console.log('error inserting node: ' + error);
    }
  }

  private insert_child_node(ast_node: AstNode) {
    // check is valid for insert
    if (this._prv_ast.check_prev(ast_node, this.get_stacked())) {
      ast_node.parent = this._cur_scope;
      this._cur_scope.add_child(ast_node);
      // update current scope
      this._cur_scope = this._prv_ast.is_parent(ast_node.label)
        ? ast_node
        : this._cur_scope;
    } else {
      // TODO show error html
      console.log(
        `invalid for child insert ${EPVN[ast_node.label]} && ${
          EPVN[this.get_stacked().label]
        }`
      );
      console.log(this._cur_scope);
    }
  }

  private insert_parent_node(ast_node: AstNode) {
    // update paretn
    if (this._cur_scope.parent != null) {
      this._cur_scope = this._cur_scope.parent;
      this.push_pipe(ast_node);
    } else {
      // TODO valid error html
      console.log('error with tabs, parent is null');
    }
  }

  private insert_sister_node(ast_node: AstNode) {
    // update current_scope
    if (this._cur_scope.parent != null) {
      this._cur_scope = this._cur_scope.parent;
      this.push_pipe(ast_node);
    } else {
      // TODO valid error html
      console.log('error with tabs, parent is null');
    }
  }

  get_stacked(): AstNode {
    return this._cur_scope.get_last_child_type();
  }
}
