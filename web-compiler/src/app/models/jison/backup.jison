startproduction
    : stmt {
        finalprogram = $1;
    }
;

stmt
    : stmt line 'CR' {
        $$ = new AstNode('Statement', {left: $1, right: $2});
    }
    | { $$ = new AstNode('NaN'); }
;

line
    : line id '=' expr { // identifier assignment
        let lf = new AstNode('ID', {name: $2});
        $$ = new AstNode('=', {left: lf, right: $4});
    }
    | line id '(' param_list ')' { // function call
        $$ = new AstNode('FunctionCall', {name: $2, parameters: $4.reverse()});
    }
    | line id '=' id '(' param_list ')' { // function call and assignment
        let lf = new AstNode('ID', {name: $2});
        let call = new AstNode('FunctionCall', {name: $4, parameters: $6.reverse()});
        $$ = new AstNode('=', {left: lf, right: call});
    }
    | line id '.' id '(' expr ')' { // method dispatch with args
        $$ = new AstNode('method', {name: $2, method: $4, argument: $6});
    }
    | line id '.' id '(' ')' { // method dispatch with no args
        $$ = new AstNode('method', {name: $2, method: $4});
    }
    | 
;