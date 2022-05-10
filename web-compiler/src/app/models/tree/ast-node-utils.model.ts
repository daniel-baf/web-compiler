export class AstNodeUtils {
  constructor() {}

  public is_scope_switch(node_type: String): Boolean {
    switch (node_type) {
      case 'main':
      case 'statement-selection':
      case 'func':
        return true;
      default:
        return false;
    }
  }
}
