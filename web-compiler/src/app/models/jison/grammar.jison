/* imports */

/* lexical grammar */

%lex
%options case-sensitive
%x L_COM // line comment
%s ML_COM // multi line comment
%%

// ignore whitespace && comments
[\s\r\f]+       { /*ignore*/ }
// line comment !! this is a comment
"!!"            { this.begin('L_COM') }
<L_COM>\n       { this.begin('INITIAL') }
<L_COM>.        { /* end */; }
// multi line comment 
"'\""           { this.begin('ML_COM') }
<ML_COM>"'\""   { this.begin('INITIAL') }
<ML_COM>\n      { /* new line */; }
<ML_COM>.       { /* end */; }
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
([a-zA-Z][a-zA-Z0-9_]+) return 'ID';      // identifier: myId
// split line
("\n")                  return 'CR';    // new line

<<EOF>>                 return 'EOF';   // end of file

.                       { ; } // error, not valid char token

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

%start id

%%

// generics
val_expr
    : id            {: $$ = new AstNode('ID', {name: $1}); :}
    | num           {: $$ = new AstNode('NUMBER', {value: $1}); :}
    | charV         {: $$ = new AstNode('ID', {name: $1}); :}
    | stringV       {: $$ = new AstNode('ID', {name: $1}); :}
;

id : 'ID' { $$=yytext;} ;

// values
charV : 'CHAR_VAL' { $$=yytext; } ;
stringV: 'VAL_COM' { $$=yytext; } ;

num 
    : 'INT_VAL' { $$=Number(yytext); } 
    | 'DOUBLE_VAL' { $$=Number(yytext); } 
;
