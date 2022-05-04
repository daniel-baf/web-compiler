var finalprogram;

class AstNode {
  constructor(type, params, tabs = 0) {
    this.type = type;
    this.tabs = tabs;
    for (var key in params) {
      this[key] = params[key];
    }
    return this;
  }

  setTabs(tabs) {
    this.tabs = tabs;
  }
}

function pushToAST(ast_node, index = 0) {}
