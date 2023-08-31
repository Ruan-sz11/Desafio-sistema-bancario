# API de Banco Digital

Esta é uma API para um banco digital que permite a gestão de contas bancárias, depósitos, saques, transferências e consulta de saldo. A API foi construída usando Node.js e Express.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

## Tecnologias Utilizadas

- Node.js: Ambiente de execução JavaScript.
- Express: Framework web para construir APIs.

## Funções Principais

1. Gerenciamento de Contas Bancárias: Criação, atualização e consulta de contas bancárias.
2. Depósitos: Realização de depósitos em contas.
3. Saques: Processamento de saques em contas.
4. Transferências: Transferências de fundos entre contas.
5. Consulta de Saldo: Verificação dos saldos das contas.

## Rotas da API

### Contas Bancárias

**Criar Conta Bancária**
```http
POST /contas
```
Exemplo de requisição:
```json
{
    "nome": "Pedro Santos",
    "cpf": 12345678900,
    "data_nascimento": "1999-01-04",
    "telefone": "(71) 912345678",
    "email": "pedro@email.com",
    "senha": "123456"
}
```

**Excluir Conta Bancária**
```http
DELETE /contas/:id
```
Exemplo de requisição:
```http
DELETE /contas/1
```

**Listar Conta**
```http
GET /contas
```
Exemplo de requisição:
```http
GET /contas
```
Exemplo de resposta:
```json
[
    {
		"numero": "1",
		"saldo": 0,
		"usuario": {
			"nome": "Pedro Santos",
			"cpf": "12345678900",
			"data_nascimento": "1989-01-04",
			"telefone": "(75)912345678",
			"email": "pedro@email.com",
			"senha": "123456"
		}
]
```

### Transações

**Realizar Depósito**
```http
POST /transacoes/depositar
```
Exemplo de requisição:
```json
{
   "numero": "1",
	"valor": "3500"
}
```

**Realizar Saque**
```http
POST /transacoes/sacar
```
Exemplo de requisição:
```json
{
   "numero": "1",
	"senha": "123",
	"valor": "400"
}
```

**Realizar Transferência**
```http
POST /transacoes/transferir
```
Exemplo de requisição:
```json
{
    "numeroOrigem": "2",
	"senhaOrigem": "123456",
	"numeroDestino": "1",
	"valor": "1500"
}
```

### Saldo

**Informar Saldo**
```http
GET /contas/saldo
```
Exemplo de requisição:
```http
GET /contas/saldo?numero_conta=1&&senha=123456
```
Exemplo de resposta:
```json
    {
       "mensagem": "Saldo: 3500"
    }
```

### Extrato

**Informar Extrato**
```http
GET /contas/extrato
```
Exemplo de requisição:
```http
GET /contas/extrato?numero_conta=1&&senha=123456
```
Exemplo de resposta:
```json
    {
	"depositos": [
		{
			"data": "2023-08-31 12:46:08",
			"numeroDaConta": "1",
			"valor": 3500
		}
	],
	"saque": [
		{
			"data": "2023-08-31 12:48:07",
			"numeroDaConta": "1",
			"valor": 400
		},
		{
			"data": "2023-08-31 12:48:43",
			"numeroDaConta": "1",
			"valor": 400
		}
	],
	"transferenciasRecebidas": [
		{
			"data": "2023-08-31 12:48:38",
			"numeroOrigem": "2",
			"numeroDestino": "1",
			"valor": 1500
		},
		{
			"data": "2023-08-31 12:48:40",
			"numeroOrigem": "2",
			"numeroDestino": "1",
			"valor": 1500
		}
	],
	"transferenciasFeitas": [
		{
			"data": "2023-08-31 12:48:59",
			"numeroOrigem": "1",
			"numeroDestino": "2",
			"valor": 1500
		}
	]
}
```

## Como Usar

1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Inicie o servidor com `npm run dev`.
