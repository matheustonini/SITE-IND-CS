var database = require("../database/config");

function votar(idFuncao, limite_linhas){
    instrucaoSql = `INSERT INTO
    votacao (fkFuncao) 
    VALUES (${idFuncao})`;
    console.log('Executando a instrucao Sql: \n' + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUltimasMedidas(idFuncao, limite_linhas) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top ${limite_linhas}
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        momento,
                        CONVERT(varchar, momento, 108) as momento_grafico
                    from medida
                    where fkFuncao == ${idFuncao}
                    order by id desc`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select nome, count(fkFuncao) as id 
        from Funcao
        join votacao
        on fkFuncao = idFuncao
        group by fkFuncao
        order by fkFuncao`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(idFuncao) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top 1
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        CONVERT(varchar, momento, 108) as momento_grafico, 
                        fk_aquario 
                        from medida where fk_aquario = ${idFuncao} 
                    order by id desc`;

                } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
                    instrucaoSql = `select nome, count(fkFuncao) as id from Funcao
                    join votacao
                    on fkFuncao = idFuncao
                    group by fkFuncao
                    order by fkFuncao`;
                } else {
                    console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
                    return
                }
            
                console.log("Executando a instrução SQL: \n" + instrucaoSql);
                return database.executar(instrucaoSql);
            }
            
            
            module.exports = {
                votar,
                buscarUltimasMedidas,
                buscarMedidasEmTempoReal
            }
            