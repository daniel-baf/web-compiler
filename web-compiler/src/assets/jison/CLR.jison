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
"Mientras"            return 'WHILE';
"Mostrar"             return 'PRINT';
"Retorno"             return 'RETURN';
"Detener"             return 'BREAK';
"Continuar"           return 'CONTINUE';
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
    : func_content 'EOF' { console.log($$); }
;

func_content
    : func_content stmt_tbs       { $1.push($2); $$=$1; }
    | stmt_tbs                    { $$=[$1]; }
;

stmt_tbs
    : tabs stmt         { $$ = new AstNode("statement", {left: $2, tabs: $1}); }
    | stmt              { $$ = new AstNode("statement", {left: $1, tabs: 0}); }
;

stmt
    : line 'CR'      { $$=$1; }
    | selection 'CR' { $$=$1; }
    | 'CR'           { $$=new AstNode("no-op"); }               // do not add to pile
;

line
    : var_dec           { $$= $1; }
    | var_assign        { $$= $1; }
    | func_call         { $$= $1; }
    | show_stmt         { $$= $1; }
    | draw_stmt         { $$= $1; }
    | return_stmt       { $$= $1; }
;

selection
    : if_stmt          { $$= $1; }
    | for_stmt         { $$= $1; }
    | while_stmt       { $$= $1; }
;

if_stmt
    : 'IF' '(' expr ')' ':'         { $$= new AstNode("if", {left: $3}); }
    | 'ELSE' ':'                    { $$= new AstNode("else"); }
    | 'ELSE' 'IF' '(' expr ')' ':'  { $$= new AstNode("elseif", {left: $4}); }
;

for_stmt
    : 'FOR' '(' 'INT' var_assign ';' expr ';' op_sym  ')' ':'     
        {
            var vd = new AstNode("var_dec", { left: $3, right: $4});
            $$= new AstNode("for", {left: vd, expr: $6, inc: $8}); 
        }
;

while_stmt
    : 'WHILE' '(' expr ')' ':'      { $$= new AstNode("while", {left: $3}); }    
;

var_dec
    : var_type var_assign      { $$=new AstNode("var_dec", {left: $1, right: $2}); }
;

var_assign
    : id '=' expr       { $$=new AstNode('=', {left: $1, right: $3}); }
;

show_stmt
    : 'PRINT' '(' 'VAL_COM' ')'                     { $$=new AstNode('print', {value: $3.replaceAll("\"","")}); }
    | 'PRINT' '(' 'VAL_COM' ',' parm_list ')'       { $$=new AstNode('print', {value: $3.replaceAll("\"",""), params: $5}); }
;

draw_stmt
    : 'DRAW_AST' '(' id ')'                  { $$=new AstNode('draw_ast', {value: $3}); }
    | 'DRAW_TS' '(' ')'                      { $$=new AstNode('draw_ts'); }
    | 'DRAW_EXP' '(' expr ')'                { $$=new AstNode('draw_exp', {value: $3}); }
;

return_stmt
    : 'RETURN' expr                          { $$=new AstNode('return', {value: $2}); }
    | 'RETURN'                               { $$=new AstNode('return'); }
;

parm_list
    : parm_list ',' expr    { $1.push(new AstNode("param", {left: $3})); $$=$1; }
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
    : '-' expr %prec UMINUS         { $$ = new AstNode("uminus", {left: $2}); }
    | expr '+' expr                 { $$ = new AstNode("+", {left: $1, right: $3}); }
    | expr '-' expr                 { $$ = new AstNode("-", {left: $1, right: $3}); }
    | expr '*' expr                 { $$ = new AstNode("*", {left: $1, right: $3}); }
    | expr '/' expr                 { $$ = new AstNode("/", {left: $1, right: $3}); }
    | expr '%' expr                 { $$ = new AstNode("%", {left: $1, right: $3}); }
    | expr '^' expr                 { $$ = new AstNode("^", {left: $1, right: $3}); }
    | '(' expr ')'                  { $$ = new AstNode("()", {left: $2}); }
;

op_expr
    : id op_sym       { $$ = new AstNode($2, {left: $1}); }
;

op_sym
    : '++'          { $$="++"; }
    | '--'          { $$="--"; }
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
    | '!' expr              { $$ = new AstNode('!', {left: $2}); }
;

func_call
    : id '(' parm_list ')'      { $$=new AstNode("func_call", {left: $1, params: $3}); }
    | id '(' ')'                { $$=new AstNode("func_call", {left: $1}); }
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
    | 'INT_VAL'         { $$=new AstNode('INT_VAL', {value: Number(yytext)}); }
    | 'DOUBLE_VAL'      { $$=new AstNode('DOUBLE_VAL', {value: Number(yytext)}); }
    | 'CHAR_VAL'        { $$=new AstNode('CHAR_VAL', {value: yytext.replaceAll("'","")}); }
    | 'VAL_COM'         { $$=new AstNode('VAL_COM', {value: yytext.replaceAll("\"","")}); }
    | 'BOOL_VAL'        { $$=new AstNode('BOOL_VAL', {value: yytext=="true"}); }
;

id
    : 'ID'      { $$=new AstNode('ID', {id: yytext}); }
;