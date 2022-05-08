import { AstNode } from '../tree/ast-node.model';

export class CLRUtils {
  private errors_analysis: Array<Object>;
  private pool: Array<AstNode>;
  // private final_program: Array<AstNode>;

  constructor() {
    this.errors_analysis = new Array<String>();
    this.pool = new Array<AstNode>();
    // this.final_program = new Array<AstNode>();
  }

  public add_error(
    line: Number,
    col: Number,
    type: String,
    lexem: String
  ): void {
    // TODO show on html table
    this.errors_analysis.push({
      line: line,
      col: col,
      type: type,
      lexem: lexem,
    });
  }

  public push_pipe(cur_node_title: String, children: AstNode[]): void {
    try {
      //  TODO check is valid before push
      // this.final_program.push(new AstNode(cur_node_title, children));
    } catch (error) {
      alert(error);
    }
  }
}
