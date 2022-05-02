echo "LEXER AND PARSER (.jison file)"
echo "  Removing old files"
rm -rf CRL.js
echo "  Compiling"
jison CRL.jison
echo "  Moving js file to new directory"
mv CRL.js ../../app/models/jison/
echo "      Done, js file created"