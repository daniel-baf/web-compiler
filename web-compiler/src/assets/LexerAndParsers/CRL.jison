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
[ \t\r]+       { /*ignore*/; }
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
"Incerteza"           return 'UNCERTAINTY';return 'CR';
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
[0-9]+\b              return 'INT_VAL';    // number: 1
"'"(.)"'"             return 'CHAR_VAL';   // char value: 'a'
[0-9]+("."[0-9]+)?\b  return 'DOUBLE_VAL'; // decimal: 0.23
'"'[^'"'\n\r]*'"'     return 'VAL_COM';    // value into comillas: "hi"
[a-zA-Z][a-zA-Z0-9_]* return 'ID';      // identifier: myId
// split line
\n                  return 'CR';    // new line

<<EOF>>               return 'EOF';   // end of file
// lexical errors
.                       { console.log("lexical error: " + this.yytext); } // error, not valid char token

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
    : instructions 'EOF'
    | 'EOF'
;

instructions
    : instructions line
    | line
;

line
    : 'ID' 'CR'
    | 'CR'
;