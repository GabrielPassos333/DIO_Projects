const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Carregando variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para análise de JSON
app.use(express.json());

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de consulta de CEP',
    usage: 'Faça uma requisição GET para /cep/{seu-cep}',
    example: '/cep/01001000'
  });
});

// Rota principal para consulta de CEP
app.get('/cep/:cep', async (req, res) => {
  try {
    const cep = req.params.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    
    // Validação básica de CEP
    if (cep.length !== 8) {
      return res.status(400).json({ 
        erro: true, 
        mensagem: 'CEP inválido. O CEP deve conter 8 dígitos.' 
      });
    }
    
    // Consulta à API ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    
    // Verifica se a API retornou erro
    if (response.data.erro) {
      return res.status(404).json({ 
        erro: true, 
        mensagem: 'CEP não encontrado.' 
      });
    }
    
    // Retorna os dados formatados
    return res.json(response.data);
    
  } catch (error) {
    console.error('Erro ao consultar o CEP:', error);
    return res.status(500).json({ 
      erro: true, 
      mensagem: 'Erro ao consultar o CEP. Tente novamente mais tarde.' 
    });
  }
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ 
    erro: true, 
    mensagem: 'Rota não encontrada.' 
  });
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});