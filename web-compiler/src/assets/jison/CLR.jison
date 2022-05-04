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
"DibujarATS"          return 'DRAW_ATS';
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

/* language grammar */
mp
    // : headers 'EOF'     
    // : header 'EOF'
    : stmt 'EOF'                            { finalprogram = $$; console.log($$); }
    // | header stmt 'EOF'
;

stmt
    // : stmt line 'CR'
    // | stmt selection 'CR'
    : stmt funcdef 'CR'                     { $$=new AstNode("statement", {left: $1, right: new AstNode('no-op')}); }
    | stmt line 'CR'                        { $$=new AstNode("statement", {left: $1, right: $2}); }
    | { $$ = new AstNode('no-op'); }
;

line
    : line var_assign           { $$ = $2; }
    | var_type var_assign_list  { $$ = new AstNode("vars-assing", {left: $1, right: $2}); }
    | line func_call            { $$=$1; }
    | { $$ = new AstNode('no-op'); }
    // return statement
    // continue statement
    // show function
    // draw functions
;

// selection
    // : if_stmt
    // | while_stmt
    // | for_stmt
// ;

var_assign_list
    : var_assign_list ',' var_assign_custom         { $1.push($3); $$=$1; }
    | var_assign_custom                             { $$=[$1]; }
;

var_assign_custom
    : var_assign        { $$=$1; }
    | id                { $$=$1; }
;

var_assign
    : id '=' expr       { $$=new AstNode("=", {left: $1, right: $3}); }
;

funcdef
    : var_type id '(' param_request ')' ':' // normal function
    | var_type id '(' ')' ':' // no params function
    | 'VOID' 'MAIN' '(' ')' ':' // main function
;

expr
    : arythmetic_expr           { $$=$1; }
    | op_expr                   { $$=$1; }
    | compare_expr              { $$=$1; }
    | logical_expr              { $$=$1; }
    // allowed values
    | element                   { $$=$1; }
    | func_call                 { $$=$1; }
;

arythmetic_expr
    : '-' expr %prec UMINUS         { $$ = new AstNode('uminus', {left: $2}); }
    | expr '+' expr                 { $$ = new AstNode('+', {left: $1, right: $3}); }
    | expr '-' expr                 { $$ = new AstNode('-', {left: $1, right: $3}); }
    | expr '*' expr                 { $$ = new AstNode('*', {left: $1, right: $3}); }
    | expr '/' expr                 { $$ = new AstNode('/', {left: $1, right: $3}); }
    | expr '%' expr                 { $$ = new AstNode('%', {left: $1, right: $3}); }
    | expr '^' expr                 { $$ = new AstNode('^', {left: $1, right: $3}); }
    | '(' expr ')'                  { $$ = new AstNode('()',{left: $1}); }
;

op_expr
    : id '++'     { $$ = new AstNode('++', {left: $1}); }
    | id '--'     { $$ = new AstNode('++', {left: $1}); }
;

compare_expr
    : expr '>' expr         { $$ = new AstNode('>', {left: $1, right: $3}); }          
    | expr '<' expr         { $$ = new AstNode('<', {left: $1, right: $3}); }
    | expr '==' expr        { $$ = new AstNode('==', {left: $1, right: $3}); }
    | expr '!=' expr        { $$ = new AstNode('!=', {left: $1, right: $3}); }
    | expr '<=' expr        { $$ = new AstNode('<=', {left: $1, right: $3}); }
    | expr '>=' expr        { $$ = new AstNode('>=', {left: $1, right: $3}); }
;

logical_expr
    // : expr '|&' expr
    : expr '&&' expr        { $$ = new AstNode('&&', {left: $1, right: $3}); }
    | expr '||' expr        { $$ = new AstNode('||', {left: $1, right: $3}); }
    | '!' expr              { $$ = new AstNode('!', {left: $2}); }
;

func_call
    : id '(' parm_list ')'            { $$ = new AstNode('func-call', {id:$1, params: $3.reverse()}); }
    | id '(' ')'                      { $$ = new AstNode('func-call', {id:$1, params: null}); }
;

parm_list
    : parm_list ',' expr            { $1.push($3); $$=$1; }
    | expr                          { $$ = [$1]; }
;

param_request
    : param_request ',' var_type id       { $1.push({id:$4, type:$3, value: null}); $$=$1;}
    | var_type id                         { $$=[{id:$2, type:$1, value: null}]; }
;

var_type
    : 'INT'             { $$ = new AstNode('var_type', {value: yytext}); }
    | 'CHAR'            { $$ = new AstNode('var_type', {value: yytext}); }
    | 'BOOL'            { $$ = new AstNode('var_type', {value: yytext}); }
    | 'DOUBLE'          { $$ = new AstNode('var_type', {value: yytext}); }
    | 'STRING'          { $$ = new AstNode('var_type', {value: yytext}); }
    | 'VOID'            { $$ = new AstNode('var_type', {value: yytext}); }
;

element
    : id                { $$=$1; }
    | 'INT_VAL'         { $$ = new AstNode('INT_VAL', {value: Number(yytext)}); }        
    | 'CHAR_VAL'        { $$ = new AstNode('CHAR_VAL', {value: yytext.replaceAll("'", "")}); }
    | 'DOUBLE_VAL'      { $$ = new AstNode('DOUBLE_VAL', {value: Number(yytext)}); }
    | 'VAL_COM'         { $$ = new AstNode('VAL_COM', {value: yytext.replaceAll("\"", "")}); }
    | 'BOOL_VAL'        { $$ = new AstNode('ID', {value: yytext==="true"}); }
;

id
    : 'ID'              { $$ = new AstNode('ID', {value: yytext}); }
;