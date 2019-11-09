if (typeof define !== 'function') { var define = require('amdefine')(module);}

define([], function() {

    var analyse = function(code, tokenTypes){
        code += ' ';
        var tokens = [];
        var line = 1;
        var column = 1;
        var erros = [];
        while (code.length > 0 && code !=='0'){ //TODO UNKNOW BUG
            var found = false;
            for (var t in tokenTypes){
                // if (line==7){
                //     let debug=1;
                // }
                if (code.match(tokenTypes[t].regex)){
                    found = true;
                    var m = tokenTypes[t].regex.exec(code);
                    if (tokenTypes[t].store){
                        var token = {
                            "type":tokenTypes[t].type,
                            "value":m[1],
                            "line":line,
                            "column":column
                        };


                        //NEIL added support for constants
                        if (tokenTypes[t].type=="T_CONSTANT")
                        {
                            //remove whitespace between VAR = $50
                            token.value = m[0].replace(/\s/g, "");
                        }
                        tokens.push(token);
                    }
                    if (m[0] === "\n"){
                        line++;
                        column = 1;
                    } else {
                        column += m[0].length;
                    }
                    code = code.substring(m[0].length);
                    break;
                }
            }
            if (!found){
                var invalid = code.match(/^\S+/);
                var erro = {
                    name:"Invalid Token",
                    line: line,
                    column: column,
                    //position: position,
                    value: invalid[0]
                };
                //TODO: better way to deal with message
                erro.message = "Token " + erro.value + " at line " + line + " column " + column + " is invalid";
                column += invalid[0].length;
                code = code.substring(invalid[0].length);
                erros.push(erro);
            }
        }
        if (erros.length > 0){
            var e = new Error();
            e.name = "Lexical Error";
            e.message = "Lexical Error Message";
            e.erros = erros;
            e.tokens = tokens;
            throw e;
        } else {
            return tokens;
        }
    };
    function Analyzer (){
        this.analyse = analyse;
    }
    return new Analyzer();
});
