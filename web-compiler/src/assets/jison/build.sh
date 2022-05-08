echo "LEXER AND PARSER (.jison file)"
echo "  Removing old files"
rm -rf CLR.js
echo "  Compiling"
jison CLR.jison
echo "  Moving js file to new directory"
mv CLR.js ../../scripts/
echo "      Done, js file created"