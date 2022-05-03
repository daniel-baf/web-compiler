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
[a-zA-Z][a-zA-Z0-9_]* return 'ID';      // identifier: myId
[a-zA-Z][a-zA-Z0-9_]*".clr"     return "CLR_FILE";
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

// %nonassoc IF_WITHOUT_ELSE
// %nonassoc ELSE

%start mp

%%

/* language grammar */

mp
    : body_ak 'EOF'
;

body_ak
    : body_ak body_content
    | body_content
;

body_content
    : instructions
    | func_dec
;

instructions
    : tabs instructions_sub
    | instructions_sub
    | 'CR'
;

instructions_sub
    : var_actions
    | func_call
;

// TODO return and continue productions

func_dec
    : var_type id '(' param_request ')' ':' 'CR' instructions
    | 'VOID' 'MAIN' '(' ')' ':' 'CR'
;

var_actions
    : var_dec 'CR'
    | var_assign 'CR'
;

var_dec
    : var_type var_assign_list
;

var_assign_list
    : var_assign_list ',' var_assign_custom
    | var_assign_custom
;

var_assign_custom
    : var_assign
    | id
;

var_assign
    : id '=' expr
;

expr
    : arythmetic_expr
    | op_expr
    | compare_expr
    | logical_expr
    // allowed values
    | element
    | func_call
;

arythmetic_expr
    : '-' expr %prec UMINUS
    | expr '+' expr
    | expr '-' expr
    | expr '*' expr
    | expr '/' expr
    | expr '%' expr
    | expr '^' expr
    | '(' expr ')'
;

op_expr
    : id '++'
    | id '--'
;

compare_expr
    : expr '>' expr                
    | expr '<' expr
    | expr '==' expr
    | expr '!=' expr
    | expr '<=' expr
    | expr '>=' expr
;

logical_expr
    // : expr '|&' expr
    : expr '&&' expr
    | expr '||' expr
    | '!' expr
;

func_call
    : id '(' param_send ')'
    | id '(' ')'
;

param_send
    : param_send ',' expr
    | expr
;

param_request
    : param_request ',' var_type id
    | var_type id
;

element
    : id                { $$=$1; }
    | 'INT_VAL'         { $$=Number(yytext); }        
    | 'CHAR_VAL'        { $$=yytext.replaceAll("'", ""); }
    | 'DOUBLE_VAL'      { $$=Number(yytext); }
    | 'VAL_COM'         { $$=yytext.replaceAll("\"", ""); }
    | 'BOOL_VAL'        { $$=yytext==="true"; }
;

var_type
    : 'INT'             { $$=yytext; }
    | 'CHAR'            { $$=yytext; }
    | 'BOOL'            { $$=yytext; }
    | 'DOUBLE'          { $$=yytext; }
    | 'STRING'          { $$=yytext; }
    | 'VOID'            { $$=yytext; }
;

tabs
    : tabs 'TAB'
    | 'TAB'
;

id
    : 'ID'      { $$ =  new AstNode(value = yytext);;}
;