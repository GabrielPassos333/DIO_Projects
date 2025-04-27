const request = require('supertest');
const axios = require('axios');
const express = require('express');

// Mock axios
jest.mock('axios');

// Import app or recreate routes for testing
const app = express();
app.use(express.json());

// Recreate the route we want to test
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

describe('CEP Validation Tests', () => {
  test('Should return 400 if CEP has less than 8 digits', async () => {
    const response = await request(app).get('/cep/1234567');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      erro: true,
      mensagem: 'CEP inválido. O CEP deve conter 8 dígitos.'
    });
  });

  test('Should return 400 if CEP has more than 8 digits', async () => {
    const response = await request(app).get('/cep/123456789');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      erro: true,
      mensagem: 'CEP inválido. O CEP deve conter 8 dígitos.'
    });
  });

  test('Should accept CEP with non-numeric characters but validate after cleaning', async () => {
    axios.get.mockResolvedValueOnce({ data: { bairro: 'Centro' } });
    const response = await request(app).get('/cep/01001-000');
    expect(response.status).not.toBe(400);
  });

  test('Should return 404 if CEP is not found', async () => {
    axios.get.mockResolvedValueOnce({ data: { erro: true } });
    const response = await request(app).get('/cep/00000000');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      erro: true,
      mensagem: 'CEP não encontrado.'
    });
  });

  test('Should return 500 if external API call fails', async () => {
    // Silenciar console.error temporariamente para este teste
    const originalError = console.error;
    console.error = jest.fn();
    
    // Teste
    axios.get.mockRejectedValueOnce(new Error('API error'));
    const response = await request(app).get('/cep/01001000');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      erro: true,
      mensagem: 'Erro ao consultar o CEP. Tente novamente mais tarde.'
    });
    
    // Restaurar console.error
    console.error = originalError;
  });

  test('Should return data when valid CEP is provided', async () => {
    const mockData = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      bairro: 'Sé'
    };
    axios.get.mockResolvedValueOnce({ data: mockData });
    
    const response = await request(app).get('/cep/01001000');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });
});