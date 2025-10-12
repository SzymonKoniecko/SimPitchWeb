<template>
  <div class="test-container">
    <h2>🔧 Test połączenia</h2>
    
    <div class="status-box" :class="statusClass">
      <span>{{ statusText }}</span>
    </div>

    <button @click="testConnection" :disabled="loading">
      {{ loading ? 'Testowanie...' : 'Testuj połączenie' }}
    </button>

    <div v-if="response" class="response">
      <h3>Odpowiedź:</h3>
      <pre>{{ JSON.stringify(response, null, 2) }}</pre>
    </div>

    <div v-if="error" class="error">
      <h3>Błąd:</h3>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { engineAPI } from '../api/EngineService/engine.api';

const loading = ref(false);
const response = ref<any>(null);
const error = ref<string | null>(null);
const status = ref<'idle' | 'success' | 'error'>('idle');

const statusClass = computed(() => ({
  'status-idle': status.value === 'idle',
  'status-success': status.value === 'success',
  'status-error': status.value === 'error',
}));

const statusText = computed(() => {
  switch (status.value) {
    case 'success': return '✅ Połączenie działa';
    case 'error': return '❌ Błąd połączenia';
    default: return '⏸️ Oczekiwanie na test';
  }
});

const testConnection = async () => {
  loading.value = true;
  response.value = null;
  error.value = null;
  status.value = 'idle';

  try {
    const data = await engineAPI.getSimulation("8a4429c2-e5db-4f5c-b97a-fd2becd8aafe");
    
    response.value = data;
    status.value = 'success';
    console.log('Otrzymano dane:', data);
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Nieznany błąd';
    status.value = 'error';
    console.error('Engine connection error:', err);
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
.test-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  margin-top: 0;
  color: #333;
}

.status-box {
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  font-weight: bold;
  text-align: center;
}

.status-idle {
  background: #f0f0f0;
  color: #666;
}

.status-success {
  background: #d4edda;
  color: #155724;
}

.status-error {
  background: #f8d7da;
  color: #721c24;
}

button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.response, .error {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 6px;
}

.response {
  background: #e7f3ff;
  border: 1px solid #007bff;
}

.error {
  background: #f8d7da;
  border: 1px solid #dc3545;
}

pre {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
}
</style>