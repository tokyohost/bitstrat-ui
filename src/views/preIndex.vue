<template>
  <div class="pre-index">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">BitStrat</div>
      <div class="auth-buttons">
        <button @click="login">Login</button>
        <button @click="register">Register</button>
      </div>
    </header>

    <!-- 瀑布流内容区域 -->
    <main class="content flex" style="min-height: calc(100vh - 218px)">
      <div class="waterfall">
        <div class="item h-40" v-for="(item, index) in items" :key="index">
          <div class="card">
            <div class="card-body">
              <h3 class="color-white">{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="stats">
                <div class="stat">
                  <span>{{ item.stat1.name }}</span>
                  <strong>{{ item.stat1.value }}</strong>
                </div>
                <div class="stat">
                  <span>{{ item.stat2.name }}</span>
                  <strong>{{ item.stat2.value }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部联系方式 -->
    <footer class="footer">
      <div class="contact">
        <p>Contact Us</p>
        <ul>
          <li><a href="https://t.me/yourusername" target="_blank">TG</a></li>
          <li><a href="https://x.com/yourusername" target="_blank">X</a></li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: 'Quant Strategy 1',
          description: 'A high-frequency trading strategy focused on arbitrage opportunities.',
          stat1: { name: 'Current ROI', value: '14.5%' },
          stat2: { name: 'Market Efficiency', value: '92%' }
        },
        {
          title: 'Quant Strategy 2',
          description: 'A mean-reversion strategy analyzing short-term market corrections.',
          stat1: { name: 'Current ROI', value: '18.3%' },
          stat2: { name: 'Market Efficiency', value: '85%' }
        },
        {
          title: 'Crypto Hedge Fund',
          description: 'A diversified crypto portfolio designed for long-term growth.',
          stat1: { name: '1-Month Growth', value: '5.7%' },
          stat2: { name: 'Risk Level', value: 'Low' }
        },
        {
          title: 'Arbitrage Bot',
          description: 'An arbitrage trading bot executing trades across multiple exchanges.',
          stat1: { name: '24h Profit', value: '2.1%' },
          stat2: { name: 'Trade Volume', value: '250 BTC' }
        },
        {
          title: 'DeFi Yield Farming',
          description: 'Yield farming strategies utilizing decentralized finance protocols.',
          stat1: { name: 'Annual Yield', value: '12.4%' },
          stat2: { name: 'Staked Amount', value: '1,500 ETH' }
        },
        {
          title: 'Stablecoin Arbitrage',
          description: 'Stablecoin arbitrage opportunities across decentralized exchanges.',
          stat1: { name: 'Current Spread', value: '0.9%' },
          stat2: { name: 'Liquidity', value: 'High' }
        }
      ]
    };
  },
  methods: {
    login() {
      this.$router.push('/login');
    },
    register() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  color: #fff;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #1e1e1e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 28px;
  font-weight: 700;
  color: #4caf50;
}

.auth-buttons button {
  margin-left: 15px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
}

.auth-buttons button:hover {
  background-color: #45a049;
}

/* 瀑布流布局 */
.content {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.waterfall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  width: 80%;
  height: fit-content;
}

.item {
  background-color: #222;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.card-body h3 {
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}

.card-body p {
  font-size: 14px;
  color: #bbb;
  margin-bottom: 15px;
}

.stats {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #bbb;
}

.stat {
  text-align: center;
}

.stat span {
  display: block;
  font-size: 12px;
  color: #888;
}

.stat strong {
  display: block;
  font-size: 16px;
  color: #4caf50;
}

/* 底部联系方式 */
.footer {
  background-color: #1e1e1e;
  color: #bbb;
  padding: 30px 0;
  text-align: center;
}

.contact ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
}

.contact li {
  margin: 0 15px;
}

.contact a {
  color: #4caf50;
  text-decoration: none;
  font-weight: bold;
}

.contact a:hover {
  text-decoration: underline;
}
</style>
