#!/usr/bin/env node

/**
 * Script para testar os endpoints da API
 */

const http = require('http');

// Configuração
const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = [
  { method: 'GET', path: '/api/status', name: 'Status da API' },
  { method: 'GET', path: '/api/fornecedores', name: 'Listar fornecedores' },
  { method: 'GET', path: '/api/filiais', name: 'Listar filiais' },
  { method: 'GET', path: '/api/senhas', name: 'Listar senhas' },
  { method: 'GET', path: '/api/senhas/gerar/nova', name: 'Gerar nova senha' },
  { method: 'GET', path: '/api/filiais-por-fornecedor', name: 'Filiais por fornecedor' }
];

// Função para fazer requisição HTTP
function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(`${BASE_URL}${path}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Função principal para testar endpoints
async function testEndpoints() {
  console.log('Iniciando testes de endpoints da API...\n');
  
  for (const endpoint of ENDPOINTS) {
    try {
      console.log(`Testando: ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
      const response = await makeRequest(endpoint.method, endpoint.path);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        console.log(`✅ Sucesso! Status: ${response.statusCode}`);
        // Mostrar apenas um resumo da resposta para não poluir o console
        try {
          const data = JSON.parse(response.data);
          if (Array.isArray(data)) {
            console.log(`   Resposta: Array com ${data.length} item(s)`);
          } else {
            console.log(`   Resposta: Objeto JSON válido`);
          }
        } catch (e) {
          console.log(`   Resposta: ${response.data.substring(0, 50)}...`);
        }
      } else {
        console.log(`❌ Falha! Status: ${response.statusCode}`);
        console.log(`   Resposta: ${response.data}`);
      }
    } catch (error) {
      console.log(`❌ Erro ao testar ${endpoint.path}: ${error.message}`);
    }
    console.log('-----------------------------------');
  }
  
  console.log('\nTestes de endpoints concluídos!');
}

// Executar testes
console.log('Este script testa os endpoints da API quando o servidor estiver rodando.');
console.log('Para executar os testes, inicie o servidor em outro terminal com: npm start\n');
console.log('Pressione Ctrl+C para cancelar os testes a qualquer momento.\n');

setTimeout(() => {
  testEndpoints().catch(console.error);
}, 1000);
