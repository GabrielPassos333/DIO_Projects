# API de Consulta de CEP

Esta é uma API simples que permite consultar informações de endereços a partir de CEPs brasileiros, utilizando o serviço ViaCEP como fonte de dados.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript server-side
- **Express**: Framework web rápido e minimalista para Node.js
- **Axios**: Cliente HTTP baseado em Promises para fazer requisições
- **Dotenv**: Carregamento de variáveis de ambiente a partir de arquivos .env
- **Nodemon**: Utilidade que monitora mudanças nos arquivos e reinicia automaticamente o servidor (ambiente de desenvolvimento)
- **Jest**: Framework de testes para JavaScript
- **Supertest**: Biblioteca para testes de APIs HTTP

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM (gerenciador de pacotes do Node.js)

## 🔧 Instalação

1. Clone o repositório ou baixe os arquivos do projeto
2. Navegue até a pasta do projeto
3. Instale as dependências:

```bash
npm install
```

4. Crie um arquivo `.env` na raiz do projeto (se ainda não existir) e defina a porta:

```
PORT=3000
```

## ⚙️ Executando a API

Para iniciar a API no modo de desenvolvimento com auto-reload:

```bash
npm run dev
```

Para iniciar a API em modo de produção:

```bash
npm start
```

## 🧪 Executando os Testes

O projeto inclui testes automatizados que verificam a funcionalidade da API. Para executar todos os testes:

```bash
npm test
```

Opções adicionais para os testes:

- Modo de observação (reexecuta quando os arquivos mudam):
  ```bash
  npm test -- --watch
  ```

- Executar um teste específico:
  ```bash
  npm test -- -t "nome do teste"
  ```

- Gerar relatório de cobertura de código:
  ```bash
  npm test -- --coverage
  ```

### Casos de Teste Implementados

- Validação de CEP com menos de 8 dígitos
- Validação de CEP com mais de 8 dígitos
- Aceitação de CEP com caracteres não numéricos (como traços e pontos)
- Tratamento quando o CEP não é encontrado
- Tratamento de falhas na API externa
- Resposta com dados quando um CEP válido é fornecido

## 📍 Endpoints Disponíveis

### Página inicial
```
GET /
```
Retorna informações sobre como utilizar a API.

### Consulta de CEP
```
GET /cep/{seu-cep}
```
Substitua `{seu-cep}` pelo CEP que deseja consultar (apenas números).

Exemplo: `GET /cep/01001000`

### Exemplos de resposta

**Sucesso:**
```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "complemento": "lado ímpar",
  "bairro": "Sé",
  "localidade": "São Paulo",
  "uf": "SP",
  "ibge": "3550308",
  "gia": "1004",
  "ddd": "11",
  "siafi": "7107"
}
```

**CEP inválido:**
```json
{
  "erro": true,
  "mensagem": "CEP inválido. O CEP deve conter 8 dígitos."
}
```

**CEP não encontrado:**
```json
{
  "erro": true,
  "mensagem": "CEP não encontrado."
}
```

## 📚 Por que este projeto é importante para iniciantes?

Este projeto é extremamente valioso para desenvolvedores iniciantes pelos seguintes motivos:

### Conceitos fundamentais abordados:

1. **APIs RESTful**: Aprenda a criar e consumir APIs REST, um dos padrões mais utilizados no desenvolvimento web moderno.

2. **Requisições HTTP**: Entenda na prática como funcionam os métodos HTTP e como fazer requisições para serviços externos.

3. **Tratamento de erros**: Implementação de validações e tratamento de exceções para criar uma API robusta.

4. **Middleware em Express**: Uso de middleware para processamento de requisições e tratamento de rotas.

5. **Async/Await**: Utilização de funções assíncronas para lidar com operações que dependem de respostas externas.

6. **Modularização**: Separação de responsabilidades e organização do código em uma estrutura profissional.

7. **Variáveis de ambiente**: Configuração da aplicação usando variáveis de ambiente para maior segurança e flexibilidade.

### Habilidades que você desenvolverá:

- Criação de APIs com Node.js e Express
- Integração entre diferentes serviços web
- Validação de entrada de dados
- Formatação e manipulação de dados JSON
- Gerenciamento de dependências com NPM
- Configuração de ambientes de desenvolvimento e produção

Este projeto serve como uma excelente introdução ao desenvolvimento backend com JavaScript, abordando conceitos que são pré-requisitos para sistemas mais complexos e aplicações corporativas.

## 📝 Ideias para expandir o projeto

- Adicionar cache para reduzir requisições repetidas ao ViaCEP
- ✅ Implementar testes automatizados
- Adicionar documentação com Swagger
- Criar endpoint para busca de endereço por estado/cidade/logradouro
- Implementar limites de requisições (rate limiting)
- Adicionar autenticação por API key
- Configurar integração contínua (CI) para executar testes automaticamente

---

Desenvolvido como parte dos estudos na plataforma DIO.
Última atualização: Abril 2025