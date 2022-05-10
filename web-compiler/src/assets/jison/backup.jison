// imports
%{
    const { CLRUtils } = require('src/app/models/CLR/clr-utils.model.ts');
    const { AstNode } = require('src/app/models/tree/ast-node.model.ts');
    let clr_utils = new CLRUtils();

%}

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
    : code_sec 'EOF'
    { 
        console.log($$);
        var backup = clr_utils;
        clr_utils = new CLRUtils();
        return backup;
    }
;


code_sec
    : globals_var_dec funcs_sec     { let result = $1.concat($2); $$ = result; }
    | funcs_sec                     { $$=$1; }
    | globals_var_dec               { $$=$1; }
;

globals_var_dec
    : globals_var_dec global_var    { $1.push($2); $$=$1; }
    | global_var                    { $$ = [$1]; }
;

global_var
    : var_dec 'CR'   { $$=$1; }
;

funcs_sec
    : funcs_sec func_mdl      { if($2!=null) $1.push($2); $$=$1; }
    | func_mdl                { $$=[]; if($1 != null) $$.push($1); }
;

func_mdl
    : func_def 'CR' func_content        { $$ = new AstNode("function", [$1, $3]); console.log('func def'); }
    | func_def 'CR'                     { $$ = new AstNode("function", [$1]); }
    | 'CR'                              { $$ = null; }
;

func_content
    : func_content stmt_tbs       { $1.push($2); $$=$1; console.log('func content'); }
    | stmt_tbs                    { $$=[$1]; console.log('func content'); }
;

stmt_tbs
    : tabs stmt         { $$ = new AstNode(`statement-${$2[1]}`, [$2[0]], $1); }
    // | stmt              { $$ = new AstNode("statement", {left: $1, tabs: 0}); }
;

stmt
    : line 'CR'       { $$=[$1, "line"]; }
    | selection 'CR'  { $$=[$1, "selection"]; }
    | error 'CR'      { clr_utils.add_error(this._$.first_line, this._$.first_column, "Sintactico", yytext); }
;

func_def
    : var_type id '(' param_request ')' ':'     { $$=new AstNode("func", [$1, $2, $4]); }
    | var_type id '(' ')' ':'                   { $$=new AstNode("func", [$1, $2, null]); }
    | 'VOID' 'MAIN' '(' ')' ':'                 { $$=new AstNode("main"); }
;

line
    : var_dec           { $$= $1; }
    | var_assign        { $$= $1; }
    | func_call         { $$= $1; }
    | show_stmt         { $$= $1; }
    | draw_stmt         { $$= $1; }
    | return_stmt       { $$= $1; }
    | 'CONTINUE'        { $$= new AstNode("continue"); }
    | 'BREAK'           { $$= new AstNode("break"); }
;

selection
    : if_stmt          { $$= $1; }
    | for_stmt         { $$= $1; }
    | while_stmt       { $$= $1; }
;

if_stmt
    : 'IF' '(' expr ')' ':'         { $$= new AstNode("if", [$3]); }
    | 'ELSE' ':'                    { $$= new AstNode("else"); }
    | 'ELSE' 'IF' '(' expr ')' ':'  { $$= new AstNode("elseif", [$4]); }
;

for_stmt
    : 'FOR' '(' 'INT' var_assign ';' expr ';' op_sym  ')' ':'     
        {
            var vd = new AstNode("var_dec", [$3, $4]);
            $$= new AstNode("for", [vd, $6, $8]); 
        }
;

while_stmt
    : 'WHILE' '(' expr ')' ':'      { $$= new AstNode("while", [$3]); }    
;

var_dec
    : var_type var_assign      { $$=new AstNode("var_dec", [$1, $2]); }
;

var_assign
    : id '=' expr       { $$=new AstNode('=', [$1, $3]); }
;

show_stmt
    : 'PRINT' '(' 'VAL_COM' ')'                     { $$=new AstNode('print', [$3.replaceAll("\"",""), null]); }
    | 'PRINT' '(' 'VAL_COM' ',' parm_list ')'       { $$=new AstNode('print', [$3.replaceAll("\"",""), $5]); }
;

draw_stmt
    : 'DRAW_AST' '(' id ')'                  { $$=new AstNode('draw_ast', [$3]); }
    | 'DRAW_TS' '(' ')'                      { $$=new AstNode('draw_ts'); }
    | 'DRAW_EXP' '(' expr ')'                { $$=new AstNode('draw_exp', [$3]); }
;

return_stmt
    : 'RETURN' expr                          { $$=new AstNode('return', [$2]); }
    | 'RETURN'                               { $$=new AstNode('return'); }
;

param_request
    : param_request ',' var_type id     { $1.push(new AstNode("var_dec", [$3, $4])); $$=$1; }
    | var_type id                       { $$ = [new AstNode("var_dec", [$1, $2])]; }
;

parm_list
    : parm_list ',' expr    { $1.push(new AstNode("param", [$3])); $$=$1; }
    | expr                  { $$=[new AstNode("param", [$1])]; }
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
    : '-' expr %prec UMINUS         { $$ = new AstNode("uminus", [$2]); }
    | expr '+' expr                 { $$ = new AstNode("+", [$1, $3]); }
    | expr '-' expr                 { $$ = new AstNode("-", [$1, $3]); }
    | expr '*' expr                 { $$ = new AstNode("*", [$1, $3]); }
    | expr '/' expr                 { $$ = new AstNode("/", [$1, $3]); }
    | expr '%' expr                 { $$ = new AstNode("%", [$1, $3]); }
    | expr '^' expr                 { $$ = new AstNode("^", [$1, $3]); }
    | '(' expr ')'                  { $$ = new AstNode("()", [$2]); }
;

op_expr
    : id op_sym       { $$ = new AstNode($2, [$1]); }
;

op_sym
    : '++'          { $$="++"; }
    | '--'          { $$="--"; }
;

compare_expr
    : expr '>' expr         { $$ = new AstNode(">", [$1, $3]); }
    | expr '<' expr         { $$ = new AstNode("<", [$1, $3]); }
    | expr '==' expr        { $$ = new AstNode("==", [$1, $3]); }
    | expr '!=' expr        { $$ = new AstNode("!=", [$1, $3]); }
    | expr '<=' expr        { $$ = new AstNode("<=", [$1, $3]); }
    | expr '>=' expr        { $$ = new AstNode(">=", [$1, $3]); }
;

logical_expr
    // : expr '|&' expr
    : expr '&&' expr        { $$ = new AstNode("&&", [$1, $3]); }
    | expr '||' expr        { $$ = new AstNode("||", [$1, $3]); }
    | '!' expr              { $$ = new AstNode('!', [$2]); }
;

func_call
    : id '(' parm_list ')'      { $$=new AstNode("func_call", [$1, $3]); }
    | id '(' ')'                { $$=new AstNode("func_call", [$1, null]); }
;

var_type
    : 'INT'             { $$ = 'INT'; }
    | 'CHAR'            { $$ = 'CHAR'; }
    | 'BOOL'            { $$ = 'BOOL'; }
    | 'DOUBLE'          { $$ = 'DOUBLE'; }
    | 'STRING'          { $$ = 'STRING'; }
    | 'VOID'            { $$ = 'VOID'; }
;

tabs
    : tabs 'TAB'        { $$=$1+1; }
    | 'TAB'             { $$=1; }
;

element
    : id                { $$=$1; }
    | 'INT_VAL'         { $$=new AstNode('INT_VAL', [$1]); }
    | 'DOUBLE_VAL'      { $$=new AstNode('DOUBLE_VAL', [Number(yytext)]); }
    | 'CHAR_VAL'        { $$=new AstNode('CHAR_VAL', [yytext.replaceAll("'","")]); }
    | 'VAL_COM'         { $$=new AstNode('VAL_COM', [yytext.replaceAll("\"","")]); }
    | 'BOOL_VAL'        { $$=new AstNode('BOOL_VAL', [yytext=="true"]); }
;

id
    : 'ID'      { $$=new AstNode('ID', [$1]); }
;