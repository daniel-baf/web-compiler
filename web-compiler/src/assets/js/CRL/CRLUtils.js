var finalprogram;

class AstNode {
  constructor(type, params) {
    this.type = type;
    for (var key in params) {
      this[key] = params[key];
    }
    return this;
  }
}

function pushToAST(ast_node, index = 0) {
    
}