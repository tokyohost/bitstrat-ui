<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans">
    <header class="flex justify-between items-center p-6 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-10 bg-gray-900/90">
      <div class="text-3xl font-extrabold text-teal-400 select-none cursor-pointer">Bitstrat</div>

      <div class="flex space-x-4">
        <button
          @click="goToLogin"
          class="px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out bg-transparent border border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-gray-900 shadow-lg shadow-teal-500/30"
        >
          登录
        </button>
        <button
          @click="goToRegister"
          class="px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out bg-teal-500 text-gray-900 hover:bg-teal-400 shadow-lg shadow-teal-500/50"
        >
          🚀 注册
        </button>
      </div>
    </header>

    <main class="container mx-auto p-8 pt-20">
      <div class="lg:flex items-center justify-between">
        <div class="lg:w-1/2 mb-12 lg:mb-0">
          <h1 class="text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500"> AI 智能体 </span>
            <br />
            助您实现卓越的加密货币合约交易
          </h1>
          <p class="text-xl text-gray-400 mb-8 max-w-lg">
            助您通过完全自定义调教世界顶尖的AI模型，在加密货币交易所实现毫秒级、全自动合约交易，最大化您的收益。
          </p>

          <div class="flex space-x-4">
            <button
              @click="startFreeTrial"
              class="px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 ease-in-out bg-teal-600 text-white hover:bg-teal-500 transform hover:scale-105 shadow-2xl shadow-teal-600/50"
            >
              立即开启 AI 交易
            </button>
          </div>
        </div>

        <div class="lg:w-1/2 flex justify-center">
          <div
            class="w-full max-w-md p-6 bg-gray-800 rounded-3xl shadow-2xl shadow-cyan-900/50 relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500"
          >
            <div
              class="absolute inset-0 opacity-10 bg-repeat [background-image:radial-gradient(circle_at_center,transparent_0.5px,rgba(0,255,255,.1)_1px)] [background-size:10px_10px]"
            ></div>

            <div class="relative z-10">
              <div class="text-5xl text-cyan-400 mb-4 animate-pulse">⚙️</div>
              <h3 class="text-2xl font-bold mb-3 text-cyan-400">实时策略洞察</h3>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-center text-sm">
                  <span class="i-carbon-flow-stream w-5 h-5 mr-2 text-green-400"></span>
                  <span class="font-mono">ETH/USDT:</span> LONG | 收益率: +1.23%
                </li>
                <li class="flex items-center text-sm">
                  <span class="i-carbon-flow-stream w-5 h-5 mr-2 text-yellow-400"></span>
                  <span class="font-mono">BTC/USDT:</span> NEUTRAL | 信号强度: 0.58
                </li>
                <li class="flex items-center text-sm">
                  <span class="i-carbon-flow-stream w-5 h-5 mr-2 text-red-400"></span>
                  <span class="font-mono">SOL/USDT:</span> SHORT | 开仓价: $18.50
                </li>
              </ul>
              <p class="mt-4 text-xs text-gray-500">数据更新频率: 45ms. 交易所 API 延迟: 2ms.</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <section class="container mx-auto p-8 mt-20">
      <h2 class="text-4xl font-bold text-center mb-12">我们的 <span class="text-teal-400">AI 核心优势</span></h2>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          class="p-6 rounded-xl bg-gray-800/70 border border-gray-700 hover:border-teal-500 transition-all duration-300 transform hover:translate-y-[-5px]"
        >
          <div class="i-carbon-flash-filled w-8 h-8 text-teal-400 mb-4"></div>
          <h3 class="text-xl font-semibold mb-2">极速执行</h3>
          <p class="text-gray-400 text-sm">AI 策略部署在低延迟服务器，确保交易订单在毫秒级内完成，抢占市场先机。</p>
        </div>

        <div
          class="p-6 rounded-xl bg-gray-800/70 border border-gray-700 hover:border-teal-500 transition-all duration-300 transform hover:translate-y-[-5px]"
        >
          <div class="i-carbon-machine-learning w-8 h-8 text-teal-400 mb-4"></div>
          <h3 class="text-xl font-semibold mb-2">支持最先进的AI智能体</h3>
          <p class="text-gray-400 text-sm">支持ChatGPT、DeepSeek、Gemini、Qwen、Grok 等智能体三步即可调用资源并通过提示词调教自己的交易体。</p>
        </div>

        <div
          class="p-6 rounded-xl bg-gray-800/70 border border-gray-700 hover:border-teal-500 transition-all duration-300 transform hover:translate-y-[-5px]"
        >
          <div class="i-carbon-security w-8 h-8 text-teal-400 mb-4"></div>
          <h3 class="text-xl font-semibold mb-2">资金安全</h3>
          <p class="text-gray-400 text-sm">只通过 API Key 进行交易操作，无法访问您的提现权限，资金安全可靠。</p>
        </div>
        <div
          class="p-6 rounded-xl bg-gray-800/70 border border-gray-700 hover:border-teal-500 transition-all duration-300 transform hover:translate-y-[-5px]"
        >
          <div class="i-carbon-security w-8 h-8 text-teal-400 mb-4"></div>
          <h3 class="text-xl font-semibold mb-2">模拟盘支持</h3>
          <p class="text-gray-400 text-sm">
            支持主流交易所Binance、Bybit、okx、bitget 平台模拟盘交易，让您可以在模拟盘下接近实盘回测您自定义的AI智能体。
          </p>
        </div>
      </div>
    </section>

    <footer class="text-center p-6 mt-20 border-t border-gray-800 text-gray-500 text-sm">
      © 2025 Bitstrat. All rights reserved. 智能合约交易的未来。
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// 假设您使用了 Vue Router
const router = useRouter();

// 跳转到登录页面
const goToLogin = () => {
  // 假设您的登录路由路径是 '/login'
  router.push('/login');
};

// 跳转到注册页面
const goToRegister = () => {
  // 假设您的注册路由路径是 '/register'
  router.push('/register');
};

// 开启免费试用 (可以跳转到功能介绍页或控制台)
const startFreeTrial = () => {
  // 假设您的控制台路由路径是 '/dashboard'
  router.push('/login');
};
</script>

<style scoped>
/* 可以在此处添加一些非原子化的复杂样式，但大部分应由 Unocss 完成 */

/* 引入图标集 (如果使用 Unocss 的 preset-icons) */
/* Unocss 会自动处理 i-carbon-xxx 这样的图标类名 */
</style>
