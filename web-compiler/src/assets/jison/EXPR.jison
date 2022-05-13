parm_list
    : parm_list ',' expr    { $1.push(new AstNode(EPVN.param, [$3])); $$=$1; }
    | expr                  { $$=[new AstNode(EPVN.param, [$1])]; }
;

expr
    : arythmetic_expr       { $$=$1; }
    | op_expr               { $$=$1; }
    | compare_expr          { $$=$1; }
    | logical_expr          { $$=$1; }
    // allowed values
    | element               { $$=$1; }
    | func_call             { $$=$1; }
;

arythmetic_expr
    : '-' expr %prec UMINUS         { $$ = new AstNode(EPVN.UMINUS, [$2]); }
    | expr '+' expr                 { $$ = new AstNode(EPVN.ADD, [$1, $3]); }
    | expr '-' expr                 { $$ = new AstNode(EPVN.SUB, [$1, $3]); }
    | expr '*' expr                 { $$ = new AstNode(EPVN.MULT, [$1, $3]); }
    | expr '/' expr                 { $$ = new AstNode(EPVN.DIV, [$1, $3]); }
    | expr '%' expr                 { $$ = new AstNode(EPVN.MOD, [$1, $3]); }
    | expr '^' expr                 { $$ = new AstNode(EPVN.POUND, [$1, $3]); }
    | '(' expr ')'                  { $$ = new AstNode(EPVN.PARENTHESIS, [$2]); }
;

op_expr
    : id op_sym       { $$ = new AstNode($2, [$1]); }
;

op_sym
    : '++'          { $$=EPVN.PP; }
    | '--'          { $$=EPVN.LL; }
;

compare_expr
    : expr '>' expr         { $$ = new AstNode(EPVN.GT, [$1, $3]); }
    | expr '<' expr         { $$ = new AstNode(EPVN.LT, [$1, $3]); }
    | expr '==' expr        { $$ = new AstNode(EPVN.EQQ, [$1, $3]); }
    | expr '!=' expr        { $$ = new AstNode(EPVN.NE, [$1, $3]); }
    | expr '<=' expr        { $$ = new AstNode(EPVN.LET, [$1, $3]); }
    | expr '>=' expr        { $$ = new AstNode(EPVN.HET, [$1, $3]); }
;

logical_expr
    // : expr '|&' expr        { $$ = new AstNode("&&", [$1, $3]); }
    : expr '&&' expr        { $$ = new AstNode(EPVN.and, [$1, $3]);  }
    | expr '||' expr        { $$ = new AstNode(EPVN.or, [$1, $3]);  }
    | '!' expr              { $$ = new AstNode(EPVN.not, [$2]);  }
;

func_call
    : id '(' parm_list ')'      { $$=new AstNode(EPVN.func_call, [$1, $3]); }
    | id '(' ')'                { $$=new AstNode(EPVN.func_call, [$1, null]); }
;