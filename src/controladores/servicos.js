const bancodedados = require("../bancodedados")
let { contas } = require("../bancodedados");
const { format } = require("date-fns");

const listarConta = (req, res) => {
    res.status(200).json(contas);
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    let idConta = (bancodedados.contas.length + 1).toString();

    let contaCriada = {
        numero: idConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        },
    }

    bancodedados.contas.push(contaCriada);

    return res.status(201).json(contaCriada)
}

const editarConta = (req, res) => {
    const { id } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = contas.find((conta) => {
        return conta.numero === id;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Usuário não encontrado!" });
    }

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: "Para editar um usuário pelo menos uma informação deve ser alterada!" });
    }

    conta.usuario.nome = nome ?? conta.usuario.nome;
    conta.usuario.cpf = cpf ?? conta.usuario.cpf;
    conta.usuario.data_nascimento = data_nascimento ?? conta.usuario.data_nascimento;
    conta.usuario.telefone = telefone ?? conta.usuario.telefone;
    conta.usuario.email = email ?? conta.usuario.email;
    conta.usuario.senha = senha ?? conta.usuario.senha;


    return res.status(200).json({ mensagem: "Usuário atualizado!" });
}

const removerConta = (req, res) => {
    const { id } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero === id;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Usuário não encontrado!" });
    }

    if (conta.saldo !== 0) {
        return res.status(404).json({ mensagem: "Para remover a conta o saldo precisa ser zerado!" });
    }

    contas = contas.filter((elemento) => {
        return elemento.numero !== id;
    })
    return res.status(200).json({ mensagem: "Conta removida!" });
}

const depositarNaContaDesejada = (req, res) => {
    const { numero, valor } = req.body;

    if (!numero || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor para deposito precisam ser inseridos obrigatoriamente!" });
    }

    let conta = contas.find((conta) => {
        return conta.numero === numero;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrado!" });
    }


    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor precisa ser maior do que zero!" });
    }

    conta.saldo += Number(valor);

    bancodedados.depositos.push({
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numeroDaConta: numero,
        valor: Number(valor)
    });

    return res.status(200).json({ mensagem: "Valor depositado!" });
}

const sacarDaContaDesejada = (req, res) => {
    const { numero, senha, valor } = req.body;

    if (!numero || !senha || !valor) {
        return res.status(400).json({ mensagem: "O número da conta, a senha e o valor para deposito precisam ser inseridos obrigatoriamente!" });
    }

    let conta = contas.find((conta) => {
        return conta.numero === numero;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrado!" });
    }

    const senhaDaConta = conta.usuario.senha;
    let saldoDaConta = conta.saldo

    if (senha === senhaDaConta) {
        if (saldoDaConta > 0 && valor <= saldoDaConta && valor > 0) {
            conta.saldo -= Number(valor);
            bancodedados.saques.push({
                data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                numeroDaConta: numero,
                valor: Number(valor)
            });
            return res.status(200).json({ mensagem: "Saque realizado!" });
        } else {
            return res.status(400).json({ mensagem: "Valor de saque inválido!" });
        }
    } else {
        return res.status(400).json({ mensagem: "Senha informada está incorreta!" });
    }

}

const transferirDeContaParaConta = (req, res) => {
    const { numeroOrigem, numeroDestino, senhaOrigem, valor } = req.body;

    if (!numeroOrigem || !numeroDestino || !senhaOrigem || valor <= 0) {
        return res.status(400).json({ mensagem: "Numero da conta de origem e destino, senha da conta de origem e o valor desejado, devem ser informados!" });
    }

    const contaDeOrigem = contas.find((conta) => {
        return conta.numero === numeroOrigem;
    });

    if (!contaDeOrigem) {
        return res.status(404).json({ mensagem: "Conta de origem não encontrada!" });
    }

    const contaDeDestino = contas.find((conta) => {
        return conta.numero === numeroDestino;
    });

    if (!contaDeDestino) {
        return res.status(404).json({ mensagem: "Conta de Destino não encontrada!" });
    }

    if (contaDeOrigem.usuario.senha !== senhaOrigem) {
        return res.status(404).json({ mensagem: "Senha invalida" });
    }

    if (contaDeOrigem.saldo <= 0 || contaDeOrigem.saldo < valor) {
        return res.status(404).json({ mensagem: "Saldo insuficiente para fazer transferências!" });
    }

    contaDeOrigem.saldo -= Number(valor);
    contaDeDestino.saldo += Number(valor);

    bancodedados.transferencias.push({
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numeroOrigem,
        numeroDestino,
        valor: Number(valor)
    });

    return res.status(200).json({ mensagem: "Transferência realizada!" });

}

const mostrarSaldoDaConta = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: "Precisa informar numero da conta e senha!" });
    }

    let conta = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrado!" });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: "Senha da conta inválida!" });
    }

    return res.status(200).json({ mensagem: `Saldo: ${conta.saldo}` });

}

const mostrarExtratoDaConta = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: "Precisa informar numero da conta e senha!" });
    }

    let conta = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrado!" });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: "Senha da conta inválida!" });
    }

    const transferenciasFeitas = [];
    const transferenciasRecebidas = [];
    const saquesRealizados = [];
    const depositosRealizados = [];
    const transferencias = bancodedados.transferencias;
    const saques = bancodedados.saques;
    const depositos = bancodedados.depositos;

    for (let transferencia of transferencias) {
        if (transferencia.numeroOrigem === numero_conta) {
            transferenciasFeitas.push(transferencia);
        }
    }

    for (let transferencia of transferencias) {
        if (transferencia.numeroDestino === numero_conta) {
            transferenciasRecebidas.push(transferencia);
        }
    }

    for (let deposito of depositos) {
        if (deposito.numeroDaConta === numero_conta) {
            depositosRealizados.push(deposito);
        }
    }

    for (let saque of saques) {
        if (saque.numeroDaConta === numero_conta) {
            saquesRealizados.push(saque);
        }
    }

    return res.status(200).json({
        depositos: depositosRealizados,
        saque: saquesRealizados,
        transferenciasRecebidas,
        transferenciasFeitas
    });
}




module.exports = { listarConta, criarConta, editarConta, removerConta, depositarNaContaDesejada, sacarDaContaDesejada, transferirDeContaParaConta, mostrarSaldoDaConta, mostrarExtratoDaConta }
