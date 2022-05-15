// imports
%{
    const { CRLUtils } = require('src/app/models/CRL/crl-utils.model.ts');
    const { AstNode } = require('src/app/models/tree/ast-node.model.ts');
    const { EPVN } = require('src/app/models/tree/ast-node-expected.model.ts');
    const { ItmCaster } = require('src/app/models/CRL/objects/expr/item-caster.model.ts');
    let crl_utils = new CRLUtils();
    let _caster = new ItmCaster();
%}

/* lexical grammar */
%lex
%x ML_COM
%s L_COM
%%

// line comment !! this is a comment
"!!"            { this.pushState('L_COM'); }
<L_COM>\n       { this.pushState('INITIAL'); }
<L_COM>.        { ; } // end of line comment
// multi line comment '" long ... comment '"
"'\""           { this.pushState('ML_COM'); }
<ML_COM>"'\""   { this.pushState('INITIAL'); }
<ML_COM>\n      { ; } // new comment line for long commetn
<ML_COM>.       { ; } // end long comment
// ignore whitespace && comments
[ \r]+       { /*ignore*/; }
// var value
"true"|"false"        return 'BOOL_VAL';
// var types
"Int"                 return 'INT';
"Char"                return 'CHAR';
"Void"                return 'VOID';
"Double"              return 'DOUBLE';
"String"              return 'STRING';
"Boolean"             return 'BOOL';
// headers
"Importar"            return 'IMPORT';
"Incerteza"           return 'UNCERTAINTY';
// function expressions
"Si"                  return 'IF';
"Sino"                return 'ELSE';
"Para"                return 'FOR';
"Mientras"            return 'WHILE';
"Mostrar"             return 'PRINT';
"Retorno"             return 'RETURN';
"Detener"             return 'BREAK';
"Continuar"           return 'CONTINUE';
"Principal"           return 'MAIN';
// custom functions for my own grammar use
"DibujarTS"           return 'DRAW_TS';
"DibujarAST"          return 'DRAW_AST';
"DibujarEXP"          return 'DRAW_EXP';
// inc operations
"++"                  return '++';    // increment
"--"                  return '--';    // decrement
// arythmetic
"+"                   return '+';     // addition
"-"                   return '-';     // substraction
"*"                   return '*';     // multiplication
"/"                   return '/';     // division
"%"                   return '%';     // module
"^"                   return '^';     // exponent
// relational
"=="                  return '==';    // equal
"!="                  return '!=';    // not equal
"<="                  return '<=';    // lower or equal than
">="                  return '>=';    // higher or equal than
"<"                   return '<';     // lower than
">"                   return '>';     // higher than
"~"                   return '~';     // uncertainty operator
"="                   return '=';     // assignment
// logical
"&&"                  return '&&';    // and
"||"                  return '||';    // or
"!"                   return '!';     // not
"|&"                  return '|&';    // xor
// concatenation
","                   return ',';     // comma
":"                   return ':';     // colon
";"                   return ';';     // semi colon
"("                   return '(';     // left parenthesis
")"                   return ')';     // right parenthesis
"{"                   return '{';     // left curly bracket
"}"                   return '}';     // right curly bracket
// custom with regex
[0-9]+("."[0-9]+)\b   return 'DOUBLE_VAL'; // decimal: 0.23
[0-9]+\b              return 'INT_VAL';    // number: 1
"'"(.)"'"             return 'CHAR_VAL';   // char value: 'a'
'"'[^'"'\n\r]*'"'     return 'VAL_COM';    // value into comillas: "hi"
[a-zA-Z][a-zA-Z0-9_]*".crl" return "CRL_FILE";
[a-zA-Z][a-zA-Z0-9_]* return 'ID';      // identifier: myId
// split line
\n                    return 'CR';    // new line
\t                    return 'TAB';   // tab

<<EOF>>               return 'EOF';   // end of file
// lexical errors
.                     {crl_utils.add_error(yylineno + 1, yylloc.first_column + 1, "Lexico", yytext); return "INVALID_TKN";}  // error, not valid char token

/lex

// syntax rules
/* operator associations and precedence */
%left '+', '-'
%left '*', '/', '%'
%right '^'
%left UMINUS
%left '==', '!=', '<', '>', '<=', '>=', '~'
%left '||', '!&', '&&', '!'
%left '(', ')'

%nonassoc if
%nonassoc else

%start mp

%%
// Language grammar

mp
    : body 'EOF'
    { 
        var backup = crl_utils;
        crl_utils = new CRLUtils();
        return backup;
    }
;

body
    : body body_sec
    | body_sec
;

body_sec
    : global_var        { crl_utils.push_pipe($1, this._$.first_line); }
    | func_mdl          { crl_utils.push_pipe($1, this._$.first_line); }
    | stmt_tbs          { crl_utils.push_pipe($1, this._$.first_line); }
    | 'CR'
    | error 'CR'      { crl_utils.add_error(this._$.first_line, this._$.first_column, "Sintactico", yytext); }
;

global_var
    : var_dec 'CR'   {  $1.label=EPVN.global_var_dec; $$=$1; }
;

func_mdl
    : func_def 'CR'                     { $$ =$1; }
;

stmt_tbs
    : tabs stmt         { $$ = new AstNode($2[1], [$2[0]], $1);}
;

stmt
    : line 'CR'       { $$=[$1, EPVN.stmt_line]; }
    | selection 'CR'  { $$=[$1, EPVN.stmt_selection]; }
;

func_def
    : var_type id '(' param_request ')' ':'     { $$=new AstNode(EPVN.func, [$1, $2, new AstNode(EPVN.param, $4)]); }
    | var_type id '(' ')' ':'                   { $$=new AstNode(EPVN.func, [$1, $2, new AstNode(EPVN.param, [null])]); }
    | 'VOID' 'MAIN' '(' ')' ':'                 { $$=new AstNode(EPVN.func_main); }
;

line
    : var_dec           { $$= $1; }
    | var_assign        { $$= $1; }
    | func_call         { $$= $1; }
    | show_stmt         { $$= $1; }
    | draw_stmt         { $$= $1; }
    | return_stmt       { $$= $1; }
    | 'CONTINUE'        { $$= new AstNode(EPVN.continue); }
    | 'BREAK'           { $$= new AstNode(EPVN.break); }
;

selection
    : if_stmt          { $$= $1; }
    | for_stmt         { $$= $1; }
    | while_stmt       { $$= $1; }
;

if_stmt
    : 'IF' '(' expr ')' ':'         { $$= new AstNode(EPVN.if, [$3]); }
    | 'ELSE' ':'                    { $$= new AstNode(EPVN.else); }
    | 'ELSE' 'IF' '(' expr ')' ':'  { $$= new AstNode(EPVN.else_if, [$4]); }
;

for_stmt
    : 'FOR' '(' 'INT' var_assign ';' expr ';' op_sym  ')' ':'     
        {
            var vd = new AstNode(EPVN.var_dec, [$3, $4]);
            $$= new AstNode(EPVN.for, [vd, $6, $8]); 
        }
;

while_stmt
    : 'WHILE' '(' expr ')' ':'      { $$= new AstNode(EPVN.while, [$3]); }    
;

var_dec
    : var_type var_assign_list      { $$=new AstNode(EPVN.var_dec, [$1].concat($2)); }
;

var_assign_list
    : var_assign_list ',' var_assign    { $1.push($3); $$=$1; }
    | var_assign                        { $$ = [$1]; }
;

var_assign
    : id '=' expr       { $$=new AstNode(EPVN.EQ, [$1, $3]); }
    | id                { $$=$1; }
;

show_stmt
    : 'PRINT' '(' 'VAL_COM' ')'                     { $$=new AstNode(EPVN.print_stmt, [$3.replaceAll("\"",""), null]); }
    | 'PRINT' '(' 'VAL_COM' ',' parm_list ')'       { $$=new AstNode(EPVN.print_stmt, [$3.replaceAll("\"",""), $5]); }
;

draw_stmt
    : 'DRAW_AST' '(' id ')'                  { $$=new AstNode(EPVN.draw_ast, [$3]); }
    | 'DRAW_TS' '(' ')'                      { $$=new AstNode(EPVN.draw_ts); }
    | 'DRAW_EXP' '(' expr ')'                { $$=new AstNode(EPVN.draw_exp, [$3]); }
;

return_stmt
    : 'RETURN' expr                          { $$=new AstNode(EPVN.return, [$2]); }
    | 'RETURN'                               { $$=new AstNode(EPVN.return); }
;

param_request
    : param_request ',' var_type id     { $1.push(new AstNode(EPVN.var_dec, [$3, $4])); $$=$1; }
    | var_type id                       { $$ = [new AstNode(EPVN.var_dec, [$1, $2])]; }
;

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
    | '(' expr ')'          { $$ = new AstNode(EPVN.PARENTHESIS, [$2]); }
;

arythmetic_expr
    : '-' expr %prec UMINUS         { $$ = new AstNode(EPVN.UMINUS, [$2]); }
    | expr '+' expr                 { $$ = new AstNode(EPVN.ADD, [$1, $3]); }
    | expr '-' expr                 { $$ = new AstNode(EPVN.SUB, [$1, $3]); }
    | expr '*' expr                 { $$ = new AstNode(EPVN.MULT, [$1, $3]); }
    | expr '/' expr                 { $$ = new AstNode(EPVN.DIV, [$1, $3]); }
    | expr '%' expr                 { $$ = new AstNode(EPVN.MOD, [$1, $3]); }
    | expr '^' expr                 { $$ = new AstNode(EPVN.POUND, [$1, $3]); }
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

var_type
    : 'INT'             { $$ = EPVN.int; }
    | 'CHAR'            { $$ = EPVN.char; }
    | 'BOOL'            { $$ = EPVN.bool; }
    | 'DOUBLE'          { $$ = EPVN.double; }
    | 'STRING'          { $$ = EPVN.string; }
    | 'VOID'            { $$ = EPVN.void; }
;

tabs
    : tabs 'TAB'        { $$=$1+1; }
    | 'TAB'             { $$=1; }
;

element
    : id                { $$=$1; }
    | 'INT_VAL'         { $$=new AstNode(EPVN.int_val, [$1]); }
    | 'DOUBLE_VAL'      { $$=new AstNode(EPVN.double_val, [Number(yytext)]); }
    | 'CHAR_VAL'        { $$=new AstNode(EPVN.char_val, [yytext.replaceAll("'","")]); }
    | 'VAL_COM'         { $$=new AstNode(EPVN.val_com, [yytext.replaceAll("\"","")]); }
    | 'BOOL_VAL'        { $$=new AstNode(EPVN.bool_val, [yytext=="true"]); }
;

id
    : 'ID'      { $$=new AstNode(EPVN.id, [$1]); }
;