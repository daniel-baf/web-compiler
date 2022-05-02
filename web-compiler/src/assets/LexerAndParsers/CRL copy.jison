// imports
%{
    const { AstNode } = require('../tree/AstNode');
    const error_1 = require('../tree/error');
    const errors_1 = requiere('../tree/errors');
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
[\s\r\f]+       { /*ignore*/; }
// var value
("true"|"false")        return 'BOOL_VAL';
// var types
("Int")                 return 'INT';
("Char")                return 'CHAR';
("Void")                return 'VOID';
("Double")              return 'DOUBLE';
("String")              return 'STRING';
("Boolean")             return 'BOOL';
// headers
("Importar")            return 'IMPORT';
("Incerteza")           return 'UNCERTAINTY';
// function expressions
("Si")                  return 'IF';
("Sino")                return 'ELSE';
("Para")                return 'FOR';
("Mostrar")             return 'PRINT';
("Retorno")             return 'RETURN';
("Detener")             return 'BREAK';
("Continuar")           return 'CONTINUE';
("Principal")           return 'MAIN';
// custom functions for my own grammar use
("DibujarTS")           return 'DRAW_TS';
("DibujarATS")          return 'DRAW_ATS';
("DibujarEXP")          return 'DRAW_EXP';
// arythmetic
("+")                   return '+';     // addition
("-")                   return '-';     // substraction
("*")                   return '*';     // multiplication
("/")                   return '/';     // division
("%")                   return '%';     // module
("^")                   return '^';     // exponent
// relational
("<")                   return '<';     // lower than
(">")                   return '>';     // higher than
("~")                   return '~';     // uncertainty operator
("==")                  return '==';    // equal
("!=")                  return '!=';    // not equal
("<=")                  return '<=';    // lower or equal than
(">=")                  return '>=';    // higher or equal than
// inc operations
("++")                  return '++';    // increment
("--")                  return '--';    // decrement
// logical
("&&")                  return '&&';    // and
("||")                  return '||';    // or
("!")                   return '!';     // not
("|&")                  return '|&';    // xor
// concatenation
(",")                   return ',';     // comma
(":")                   return ':';     // colon
("(")                   return '(';     // left parenthesis
(")")                   return ')';     // right parenthesis
("{")                   return '{';     // left curly bracket
("}")                   return '}';     // right curly bracket
// custom with regex
[0-9]+\b                return 'INT_VAL';    // number: 1
("\""(.)"\"")           return 'CHAR_VAL';   // char value: 'a'
[0-9]+("."[0-9]+)?\b    return 'DOUBLE_VAL'; // decimal: 0.23
("\""[^"\""\n\r]*"\"")  return 'VAL_COM';    // value into comillas: "hi"
([a-zA-Z][a-zA-Z0-9_]*) return 'ID';      // identifier: myId
// split line
("\n")                  return 'CR';    // new line

<<EOF>>                 return 'EOF';   // end of file
// lexical errors
.                       {
    const er = new error_1.Error({ type: 'lexico', row: `${yylineno + 1}`, col:`${yylloc.first_column + 1}`, lexeme: `${yytext}`,  description: `El valor "${yytext}" no es reconocido por la gramatica` });
} // error, not valid char token

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

%nonassoc IF_WITHOUT_ELSE
%nonassoc ELSE

%start mp

%%

 /* language grammar */

mp // <PROGRAM> <EOF>
    : instructions 'EOF'              { 
        finalprogram =  new ASTNode({label: 'mp', left:$1, line: yylineno}); 
        console.log(finalprogram);
        return finalprogram;
    }
;

instructions  // <SENTENCE> ... <SENTENCE>
    : instructions instruction      { $1.push($3); $$ = $1; }
    | instruction                   { $$ = []; $$.push($1);}
;

instruction
    : console_log               { $$= $1; }
    | var_actions               { $$= $1 }
;

console_log
    : 'PRINT' '(' 'VAL_COM' ',' param_send ')'  { $$= new ASTNode({label: 'console_log', text: $3, params: $5, line: yylineno}); }
    | 'PRINT' '(' 'VAL_COM' ')'                 { $$= new ASTNode({label: 'console_log', text: $3, params: [], line: yylineno}); }
;

var_actions
    : var_dec              { $$=$1; }
    | var_assign           { $$=$1; }
    | var_dec_assign       { $$=$1; }
;

var_dec
    : var_type id               { $$= new ASTNode({label: 'var_dec', left: $1, right:$2, line: yylineno}); }
;

var_dec_assign
    : var_type var_assign       { $$= new ASTNode({label: 'var_dec_assign', left: $1, right:$2, line: yylineno}); }
;

var_assign
    : id '=' expr               { $$= new ASTNode({label: '=', left: $1, right:$3, line: yylineno}); }
;

expr
    : '-' expr %prec UMINUS      { $$= new ASTNode({label: 'uminus', children: [$2], line: yylineno}); }
    // arithm expresssion
    | expr '+' expr              { $$= new ASTNode({label: '+', left: $1, right:$3, line: yylineno}); }
    | expr '-' expr              { $$= new ASTNode({label: '-', left: $1, right:$3, line: yylineno}); }
    | expr '*' expr              { $$= new ASTNode({label: '*', left: $1, right:$3, line: yylineno}); }
    | expr '/' expr              { $$= new ASTNode({label: '/', left: $1, right:$3, line: yylineno}); }
    | expr '%' expr              { $$= new ASTNode({label: '%', left: $1, right:$3, line: yylineno}); }
    | expr '^' expr              { $$= new ASTNode({label: '^', left: $1, right:$3, line: yylineno}); }
    | '(' expr ')'               { $$= new ASTNode({label: '(exp)', left: $2, line: yylineno}); }
    // increase and decrease
    | id '++'                    { $$= new ASTNode({label: '++', left: $1, line: yylineno}); }
    | id '--'                    { $$= new ASTNode({label: '--', left: $1, line: yylineno}); }
    // compare expresssions
    | exp '>' exp                { $$= new ASTNode({label: '>', left: $1, right:$3, line: yylineno}); }
    | exp '<' exp                { $$= new ASTNode({label: '<', left: $1, right:$3, line: yylineno}); }
    | exp '==' exp               { $$= new ASTNode({label: '==', left: $1, right:$3, line: yylineno}); }
    | exp '!=' exp               { $$= new ASTNode({label: '!=', left: $1, right:$3, line: yylineno}); }
    | exp '<=' exp               { $$= new ASTNode({label: '<=', left: $1, right:$3, line: yylineno}); }
    | exp '>=' exp               { $$= new ASTNode({label: '>=', left: $1, right:$3, line: yylineno}); }
    // locial expresssions
    | exp '|&' exp               { $$= new ASTNode({label: '|&', left: $1, right:$3, line: yylineno}); }
    | exp '&&' exp               { $$= new ASTNode({label: '&&', left: $1, right:$3, line: yylineno}); }
    | exp '||' exp               { $$= new ASTNode({label: '||', left: $1, right:$3, line: yylineno}); }
    | '!' exp                    { $$= new ASTNode({label: '!', left: $2, line: yylineno}); }
    // allowed values
    | element                    { $$= $1; }
    // function call
    | func_call                  { $$= $1; }
;

func_call
    : id '(' param_send ')'      { $$= new ASTNode({label: 'func_call', left: $1, params:$3.reverse(), line: yylineno}); }
    | id '(' ')'                 { $$= new ASTNode({label: 'func_call', left: $1, params:[], line: yylineno}); }
;

param_send
    : param_send ',' expr        { $1.push({param: $3}); $$= $1; }
    | expr                       { $$= []; $$.push({param: $1}); }
;

var_type
    : 'INT'                     { $$= new ASTNode({label: 'var_type', data: $1, line: yylineno}); }
    | 'CHAR'                    { $$= new ASTNode({label: 'var_type', data: $1, line: yylineno}); }
    | 'BOOL'                    { $$= new ASTNode({label: 'var_type', data: $1, line: yylineno}); }
    | 'DOUBLE'                  { $$= new ASTNode({label: 'var_type', data: $1, line: yylineno}); }
    | 'STRING'                  { $$= new ASTNode({label: 'var_type', data: $1, line: yylineno}); }
;

element
    : id                        { $$= $1; }
    | 'INT_VAL'                 { $$= new ASTNode({label: 'INT_VAL', data: $1, line: yylineno}); }
    | 'CHAR_VAL'                { $$= new ASTNode({label: 'CHAR_VAL', data: $1, line: yylineno}); }
    | 'DOUBLE_VAL'              { $$= new ASTNode({label: 'DOUBLE_VAL', data: $1, line: yylineno}); }
    | 'VAL_COM'                 { $$= new ASTNode({label: 'VAL_COM', data: $1, line: yylineno}); }
    | 'BOOL_VAL'                { $$= new ASTNode({label: 'BOOL_VAL', data: $1, line: yylineno}); }
;

id
    : 'ID'                      { $$= new ASTNode({label: 'id', data: $1, line: yylineno}); }
;
