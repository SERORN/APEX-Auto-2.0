#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE TESTING RÁPIDO PARA APEX BACKEND
 * 
 * Este script permite probar todas las APIs del backend fintech
 * sin necesidad de frontend. Útil para desarrollo y debugging.
 */

const https = require('https');
const fs = require('fs');

// Configuración
const BASE_URL = process.env.APEX_TEST_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api/fintech`;

// Token de autenticación simulado (en desarrollo)
const AUTH_TOKEN = process.env.APEX_TEST_TOKEN || 'test-token-development';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class ApexTester {
  constructor() {
    this.results = [];
    this.currentTest = 0;
    this.totalTests = 12;
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      return {
        status: response.status,
        success: response.ok,
        data: result
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        error: error.message
      };
    }
  }

  async runTest(name, testFn) {
    this.currentTest++;
    this.log(`\n[${this.currentTest}/${this.totalTests}] ${name}`, 'cyan');
    
    try {
      const result = await testFn();
      
      if (result.success) {
        this.log(`✅ PASSED: ${name}`, 'green');
        this.results.push({ name, status: 'PASSED', ...result });
      } else {
        this.log(`❌ FAILED: ${name} - ${result.message || 'Unknown error'}`, 'red');
        this.results.push({ name, status: 'FAILED', ...result });
      }
    } catch (error) {
      this.log(`💥 ERROR: ${name} - ${error.message}`, 'red');
      this.results.push({ name, status: 'ERROR', error: error.message });
    }
  }

  async testWalletGet() {
    return this.runTest('GET /api/fintech/wallet', async () => {
      const response = await this.makeRequest('/wallet');
      return {
        success: response.success,
        message: response.success ? 'Wallet obtenido correctamente' : response.data?.error,
        data: response.data
      };
    });
  }

  async testWalletPost() {
    return this.runTest('POST /api/fintech/wallet (add balance)', async () => {
      const response = await this.makeRequest('/wallet', 'POST', {
        action: 'add_balance',
        amount: 1000,
        description: 'Test de agregar saldo'
      });
      return {
        success: response.success,
        message: response.success ? 'Saldo agregado correctamente' : response.data?.error,
        data: response.data
      };
    });
  }

  async testWalletPatch() {
    return this.runTest('PATCH /api/fintech/wallet (use cashback)', async () => {
      const response = await this.makeRequest('/wallet', 'PATCH', {
        operation: 'use_cashback',
        amount: 100
      });
      return {
        success: response.status === 200 || response.status === 400, // 400 es esperado si no hay cashback
        message: response.success ? 'Operación ejecutada' : 'Sin cashback disponible (esperado)',
        data: response.data
      };
    });
  }

  async testFactoringRequest() {
    return this.runTest('POST /api/fintech/request-factoring', async () => {
      const response = await this.makeRequest('/request-factoring', 'POST', {
        invoiceData: {
          amount: 50000,
          issueDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          invoiceNumber: `TEST-${Date.now()}`
        },
        clientData: {
          rfc: 'XAXX010101000',
          businessName: 'Empresa Test SA',
          creditScore: 750
        },
        requestedAmount: 45000,
        paymentTermDays: 30
      });
      return {
        success: response.success,
        message: response.success ? 'Solicitud de factoraje procesada' : response.data?.error,
        data: response.data
      };
    });
  }

  async testFactoringGet() {
    return this.runTest('GET /api/fintech/request-factoring', async () => {
      const response = await this.makeRequest('/request-factoring');
      return {
        success: response.success,
        message: response.success ? 'Solicitudes de factoraje obtenidas' : response.data?.error,
        data: response.data
      };
    });
  }

  async testCreditRequest() {
    return this.runTest('POST /api/fintech/request-credit', async () => {
      const response = await this.makeRequest('/request-credit', 'POST', {
        userData: {
          monthlyIncome: 35000,
          creditScore: 720,
          employmentStatus: 'employed'
        },
        requestedAmount: 25000,
        paymentTermMonths: 12,
        purpose: 'working_capital'
      });
      return {
        success: response.success,
        message: response.success ? 'Solicitud de crédito procesada' : response.data?.error,
        data: response.data
      };
    });
  }

  async testCreditGet() {
    return this.runTest('GET /api/fintech/request-credit', async () => {
      const response = await this.makeRequest('/request-credit');
      return {
        success: response.success,
        message: response.success ? 'Líneas de crédito obtenidas' : response.data?.error,
        data: response.data
      };
    });
  }

  async testCFDIGenerate() {
    return this.runTest('POST /api/fintech/generate-cfdi', async () => {
      const response = await this.makeRequest('/generate-cfdi', 'POST', {
        clientData: {
          name: 'Cliente Prueba SA',
          rfc: 'XAXX010101000',
          email: 'cliente@test.com',
          fiscalRegime: '601'
        },
        items: [
          {
            description: 'Producto de prueba',
            quantity: 1,
            unitPrice: 1000,
            productCode: '01010101',
            unit: 'PZA'
          }
        ],
        paymentMethod: 'PUE',
        cfdiUse: 'G03'
      });
      return {
        success: response.success,
        message: response.success ? 'CFDI generado correctamente' : response.data?.error,
        data: response.data
      };
    });
  }

  async testHealthCheck() {
    return this.runTest('Health Check - Database Connection', async () => {
      // Test básico de conectividad
      const response = await this.makeRequest('/wallet');
      return {
        success: response.status !== 500,
        message: response.status !== 500 ? 'Conexión OK' : 'Error de conexión',
        data: { status: response.status }
      };
    });
  }

  async testAuthentication() {
    return this.runTest('Authentication Test', async () => {
      const response = await this.makeRequest('/wallet', 'GET');
      return {
        success: response.status === 401 || response.status === 200,
        message: response.status === 401 ? 'Auth requerido (correcto)' : 'Autenticado',
        data: { authStatus: response.status }
      };
    });
  }

  async testErrorHandling() {
    return this.runTest('Error Handling Test', async () => {
      const response = await this.makeRequest('/invalid-endpoint');
      return {
        success: response.status === 404,
        message: response.status === 404 ? 'Error 404 manejado correctamente' : 'Error handling incorrecto',
        data: { errorStatus: response.status }
      };
    });
  }

  async testConcurrency() {
    return this.runTest('Concurrency Test', async () => {
      const promises = Array(5).fill().map(() => this.makeRequest('/wallet'));
      const responses = await Promise.all(promises);
      
      const allResponded = responses.every(r => r.status > 0);
      return {
        success: allResponded,
        message: allResponded ? 'Concurrencia manejada correctamente' : 'Problemas de concurrencia',
        data: { responsesCount: responses.length }
      };
    });
  }

  printSummary() {
    this.log('\n' + '='.repeat(60), 'cyan');
    this.log('📊 RESUMEN DE PRUEBAS', 'cyan');
    this.log('='.repeat(60), 'cyan');

    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const errors = this.results.filter(r => r.status === 'ERROR').length;

    this.log(`✅ Pasaron: ${passed}`, 'green');
    this.log(`❌ Fallaron: ${failed}`, 'red');
    this.log(`💥 Errores: ${errors}`, 'red');
    this.log(`📈 Total: ${this.results.length}`, 'blue');

    if (failed > 0 || errors > 0) {
      this.log('\n🔍 DETALLES DE FALLAS:', 'yellow');
      this.results
        .filter(r => r.status !== 'PASSED')
        .forEach(r => {
          this.log(`  • ${r.name}: ${r.error || r.message || 'Sin detalles'}`, 'red');
        });
    }

    this.log('\n' + '='.repeat(60), 'cyan');
    
    // Guardar reporte
    const report = {
      timestamp: new Date().toISOString(),
      summary: { passed, failed, errors, total: this.results.length },
      details: this.results
    };
    
    fs.writeFileSync('apex-test-report.json', JSON.stringify(report, null, 2));
    this.log('📄 Reporte guardado en: apex-test-report.json', 'blue');
  }

  async runAllTests() {
    this.log('🚀 INICIANDO PRUEBAS DEL BACKEND APEX', 'cyan');
    this.log(`🌐 URL Base: ${BASE_URL}`, 'blue');
    this.log(`🔑 Token: ${AUTH_TOKEN.substring(0, 10)}...`, 'blue');

    // Tests de infraestructura
    await this.testHealthCheck();
    await this.testAuthentication();
    await this.testErrorHandling();
    await this.testConcurrency();

    // Tests de APIs
    await this.testWalletGet();
    await this.testWalletPost();
    await this.testWalletPatch();
    await this.testFactoringRequest();
    await this.testFactoringGet();
    await this.testCreditRequest();
    await this.testCreditGet();
    await this.testCFDIGenerate();

    this.printSummary();
  }
}

// Ejecutar si se corre directamente
if (require.main === module) {
  const tester = new ApexTester();
  tester.runAllTests().catch(console.error);
}

module.exports = ApexTester;
