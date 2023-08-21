const { Router } = require("express");
const { listarConta, criarConta, editarConta, removerConta, depositarNaContaDesejada, sacarDaContaDesejada, transferirDeContaParaConta, mostrarSaldoDaConta, mostrarExtratoDaConta } = require("./controladores/servicos");
const { verificarSenhaDoBanco, verificarSeTodosOsCamposForamInseridos, verificarCamposUnicos } = require("./intermediarios/verificacoes");
const rotas = Router();

rotas.get("/contas", verificarSenhaDoBanco, listarConta);
rotas.post("/contas", verificarSeTodosOsCamposForamInseridos, verificarCamposUnicos, criarConta);
rotas.put("/contas/:id/usuario", verificarCamposUnicos, editarConta);
rotas.delete("/contas/:id", removerConta);
rotas.post("/transacoes/depositar", depositarNaContaDesejada);
rotas.post("/transacoes/sacar", sacarDaContaDesejada);
rotas.post("/transacoes/transferir", transferirDeContaParaConta);
rotas.get("/contas/saldo", mostrarSaldoDaConta);
rotas.get("/contas/extrato", mostrarExtratoDaConta);

module.exports = rotas;