const AstNode = class AstNode {
  constructor(type, params) {
    this.type = type;
    for (var key in params) {
      this[key] = params[key];
    }
    return this;
  }
};

var CLRUtils = class CLRUtils {
  constructor() {}

  parse(input) {
    let output = CLR.parse(input);
    console.log(output);
    return true;
  }

  printk() {
    alert("k");
  }

};
