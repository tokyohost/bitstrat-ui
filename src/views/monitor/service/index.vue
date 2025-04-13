<template>
  <div class="dashboard">
    <div class="grid">
      <div v-for="(item, index) in services" :key="index" class="card">
        <img
          class="logo"
          :src="getLogoUrl(item.exchangeName)"
          :alt="item.exchangeName"
          @error="setDefaultLogo($event)"
        />
        <div class="name">{{ item.exchangeName }}</div>
        <div class="info">Client: {{ item.clientId }}</div>
        <div class="info">Node: {{ item.nodeName }}</div>
        <div class="delay" :class="getDelayColor(item.delay)">
          {{ item.delay }}ms
        </div>
      </div>
    </div>
  </div>
</template>

<script name="Service" setup lang="ts">
import { ref } from 'vue'

const services = ref([
  { exchangeName: 'okx', clientId: 'korean-node1', nodeName: 'korean-node1', delay: 1 },
  { exchangeName: 'bybit', clientId: 'korean-node1', nodeName: 'korean-node1', delay: 22 },
  { exchangeName: 'binance', clientId: 'japan-node1', nodeName: 'japan-node1', delay: 105 },
  { exchangeName: 'coinbase', clientId: 'us-node1', nodeName: 'us-node1', delay: 220 },
  { exchangeName: 'huobi', clientId: 'asia-node3', nodeName: 'asia-node3', delay: 300 }
])

function getLogoUrl(exchangeName) {
  // 示例用图标 CDN，可根据你实际项目替换
  return `https://cryptoicons.org/api/icon/${exchangeName.toLowerCase()}/64`
}

function setDefaultLogo(e) {
  e.target.src = 'https://via.placeholder.com/64?text=?'
}

function getDelayColor(delay) {
  if (delay <= 50) return 'fast'
  if (delay <= 150) return 'medium'
  return 'slow'
}
</script>

<style scoped>
.dashboard {
  padding: 24px;
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  min-height: 100vh;
}

.title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}

.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.name {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
}

.info {
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
}

.delay {
  margin-top: 8px;
  font-weight: bold;
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 16px;
  display: inline-block;
}

.fast {
  background-color: #e0f7e9;
  color: #1b5e20;
}

.medium {
  background-color: #fff8e1;
  color: #f9a825;
}

.slow {
  background-color: #ffebee;
  color: #c62828;
}
</style>
