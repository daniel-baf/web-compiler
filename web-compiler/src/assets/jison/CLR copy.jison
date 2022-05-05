// imports

/* lexical grammar */
%lex
%x ML_COM
%s L_COM
%%

// multi line comment 
"'\""           { this.pushState('ML_COM'); }
<ML_COM>"'\""   { this.pushState('INITIAL'); }
<ML_COM>\n      { ; } // new comment line for long commetn
<ML_COM>.       { ; } // end long comment
// line comment !! this is a comment
"!!"            { this.pushState('L_COM'); }
<L_COM>\n       { this.pushState('INITIAL'); }
<L_COM>.        { ; } // end of line comment
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
"Mostrar"             return 'PRINT';
"Retorno"             return 'RETURN';
"Detener"             return 'BREAK';
"Continuar"           return 'CONTINUE';
"Principal"           return 'MAIN';
// custom functions for my own grammar use
"DibujarTS"           return 'DRAW_TS';
"DibujarAST"          return 'DRAW_AST';
"DibujarEXP"          return 'DRAW_EXP';
// arythmetic
"+"                   return '+';     // addition
"-"                   return '-';     // substraction
"*"                   return '*';     // multiplication
"/"                   return '/';     // division
"%"                   return '%';     // module
"^"                   return '^';     // exponent
// relational
"<"                   return '<';     // lower than
">"                   return '>';     // higher than
"~"                   return '~';     // uncertainty operator
"=="                  return '==';    // equal
"!="                  return '!=';    // not equal
"<="                  return '<=';    // lower or equal than
">="                  return '>=';    // higher or equal than
"="                   return '=';     // assignment
// inc operations
"++"                  return '++';    // increment
"--"                  return '--';    // decrement
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
[a-zA-Z][a-zA-Z0-9_]*".clr" return "CLR_FILE";
[a-zA-Z][a-zA-Z0-9_]* return 'ID';      // identifier: myId
// split line
\n                    return 'CR';    // new line
\t                    return 'TAB';   // tab

<<EOF>>               return 'EOF';   // end of file
// lexical errors
.                     return "INVALID_TKN";  // error, not valid char token

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
    : header body 'EOF'
    | body 'EOF'        { $$=new AstNode("body", {left: $1}); console.log($$);}
;

header
    : header head       { $1.push($2); $$=$1; }
    | head              { $$=[$1]; }
;

head
    : 'IMPORT' 'CLR_FILE' 'CR'              { $$=new AstNode("header", {left: $1, right: $2}); }
    | 'UNCERTAINTY' 'DOUBLE_VAL' 'CR'       { $$=new AstNode("header", {left: $1, right: $2}); }
;

body
    : body body_c           { $1.push($2); $$=$1; }
    | body_c                { $$=[$1]; }
;

body_c
    : funcdef           { $$=$1; }
    | var_dec 'CR'      { $$=new AstNode("statement", {value: $1, tabs: 0}); }
    | 'CR'
;

funcdef
    : var_type id '(' param_request ')' func_common       { $$=new AstNode("function", {left: $2, right: $6, params: $4, type: $1}); } // normal function
    | 'VOID' 'MAIN' '(' ')' func_common                   { $$=new AstNode("function-main", {left: $2, right: $5, type: $1}); } // main function
    | var_type id '(' ')' func_common                     { $$=new AstNode("function", {left: $2, right: $5, params: null, type: $1}); } // no params function
;

func_common
    : ':' 'CR' stmt  { $$=$3; }
;

stmt
    : stmt stmt_nt      { $$=new AstNode("statement", {left: $2, tabs: $1}); }
    | 'CR' 
;

stmt_nt
    : line 'CR'         { $$=$1; }
;

// selection
    // if, if else list, if else
    //  for
    // while
// ;

line
    : func_call             { $$=$1; }
    | 'RETURN' expr         { $$=new AstNode("return", {left: $2}); }
    | op_expr               { $$=$1; }
    | 'BREAK'               { $$=new AstNode("break"); }
    | 'CONTINUE'            { $$=new AstNode("continue"); }
    | show_stmt             { $$=$1; }
    | var_assign            { $$=$1; }
    | var_dec               { $$=$1; }
;

var_dec
    : var_type var_assign_list      { $$=new AstNode('var-dec', {left: $1, right: $2}); }
;

draw_stmt
    : 'DRAW_AST' '(' id ')' 'CR'        { $$=new AstNode('draw-ast', {value: $3}); }
    | 'DRAW_EXP' '(' expr ')' 'CR'      { $$=new AstNode('draw-exp', {value: $3}); }
    | 'DRAW_TS' '(' ')' 'CR'            { $$=new AstNode("draw-ts"); }
;

var_assign_list
    : var_assign_list ',' var_assign_custom     { $1.push($3); $$=$1; }
    | var_assign_custom                         { $$=[$1]; }
;

var_assign_custom
    : var_assign        { $$=$1; }
    | id                { $$=new AstNode('=', {left: $1, right: null}); }
;

var_assign
    : id '=' expr       { $$=new AstNode('=', {left: $1, right: $3}); }
;

show_stmt
    : 'PRINT' '(' 'VAL_COM' ')'                     { $$=new AstNode('print', {value: $3, params: null}); }
    | 'PRINT' '(' 'VAL_COM' ',' parm_list ')'       { $$=new AstNode('print', {value: $3, params: $5}); }
;

parm_list
    : parm_list ',' expr    { $1.push($3); $$=$1; }
    | expr                  { $$=[new AstNode("param", {left: $1})]; }
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
    : '-' expr %prec UMINUS         { $$ = new AstNode("uminus", {left: $1, right: $3}); }
    | expr '+' expr                 { $$ = new AstNode("+", {left: $1, right: $3}); }
    | expr '-' expr                 { $$ = new AstNode("-", {left: $1, right: $3}); }
    | expr '*' expr                 { $$ = new AstNode("*", {left: $1, right: $3}); }
    | expr '/' expr                 { $$ = new AstNode("/", {left: $1, right: $3}); }
    | expr '%' expr                 { $$ = new AstNode("%", {left: $1, right: $3}); }
    | expr '^' expr                 { $$ = new AstNode("^", {left: $1, right: $3}); }
    | '(' expr ')'                  { $$ = new AstNode("()", {left: $1}); }
;

op_expr
    : id '++'       { $$ = new AstNode("++", {left: $1}); }
    | id '--'       { $$ = new AstNode("--", {left: $1}); }
;

compare_expr
    : expr '>' expr         { $$ = new AstNode(">", {left: $1, right: $3}); }
    | expr '<' expr         { $$ = new AstNode("<", {left: $1, right: $3}); }
    | expr '==' expr        { $$ = new AstNode("==", {left: $1, right: $3}); }
    | expr '!=' expr        { $$ = new AstNode("!=", {left: $1, right: $3}); }
    | expr '<=' expr        { $$ = new AstNode("<=", {left: $1, right: $3}); }
    | expr '>=' expr        { $$ = new AstNode(">=", {left: $1, right: $3}); }
;

logical_expr
    // : expr '|&' expr
    : expr '&&' expr        { $$ = new AstNode("&&", {left: $1, right: $3}); }
    | expr '||' expr        { $$ = new AstNode("||", {left: $1, right: $3}); }
    | '!' expr              { $$ = new AstNode('!', {left: $1}); }
;

func_call
    : id '(' parm_list ')'      { $$=new AstNode("func-call", {left: $1, params: $3}); }
    | id '(' ')'                { $$=new AstNode("func-call", {left: $1, params: null}); }
;

tabs
    : tabs 'TAB'    { $$=$1+1; }
    | 'TAB'         { $$=1; }
;

param_request
    : param_request ',' var_type id     { $1.push(new AstNode("var-decl", {left: $3, right: $4})); $$=$1; }
    | var_type id                       { $$ = [new AstNode("var-decl", {left: $1, right: $2})]; }
;

var_type
    : 'INT'             { $$ = 'INT'; }
    | 'CHAR'            { $$ = 'CHAR'; }
    | 'BOOL'            { $$ = 'BOOL'; }
    | 'DOUBLE'          { $$ = 'DOUBLE'; }
    | 'STRING'          { $$ = 'STRING'; }
    | 'VOID'            { $$ = 'VOID'; }
;

element
    : id                { $$=$1; }
    | 'INT_VAL'         { $$=new AstNode('INT_VAL', {value: yytext}); }
    | 'CHAR_VAL'        { $$=new AstNode('CHAR_VAL', {value: Number(yytext)}); }
    | 'DOUBLE_VAL'      { $$=new AstNode('DOUBLE_VAL', {value: Number(yytext)}); }
    | 'VAL_COM'         { $$=new AstNode('VAL_COM', {value: yytext.replaceAll("\"","")}); }
    | 'BOOL_VAL'        { $$=new AstNode('BOOL_VAL', {value: yytext=="true"}); }
;

id
    : 'ID'      { $$=new AstNode('ID', {id: yytext, value:null}); }
;