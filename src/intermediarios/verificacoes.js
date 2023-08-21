const { banco, contas } = require("../bancodedados");

const verificarSenhaDoBanco = (req, res, next) => {
    const { senha_banco } = req.query;
    const senhaCadastrada = banco.senha;

    if (senha_banco === senhaCadastrada) {
        return next();
    }

    if (!senha_banco) {
        return res.status(400).json({ mensagem: "Você precisa inserir a senha!" });
    }

    if (senha_banco !== senhaCadastrada) {
        return res.status(400).json({ mensagem: "A senha inserida está incorreta!" });
    }


}

const verificarCamposUnicos = (req, res, next) => {
    const { cpf, email } = req.body;
    if (cpf) {
        if (cpf.length !== 11) {
            return res.status(400).json({ mensagem: "O número de cpf é invalido, por favor inserir 11 digitos" });
        }

        const verificarCpf = contas.find((elemento) => {
            return elemento.usuario.cpf === cpf;
        });

        if (verificarCpf) {
            return res.status(400).json({ mensagem: "O CPF indicado já está cadastrado!" });
        }

        const verificarEmail = contas.find((elemento) => {
            return elemento.usuario.email === email;
        })

        if (verificarEmail) {
            return res.status(400).json({ mensagem: "O E-Mail indicado já está cadastrado!" });
        }
    }

    return next();

}

const verificarSeTodosOsCamposForamInseridos = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O nome é obrigatório." });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: "O cpf é obrigatório." });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "A data de nascimento é obrigatória." });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "O telefone é obrigatório." });
    }

    if (!email) {
        return res.status(400).json({ mensagem: "O email é obrigatório." });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória." });
    }

    return next();
}

module.exports = { verificarSenhaDoBanco, verificarCamposUnicos, verificarSeTodosOsCamposForamInseridos }