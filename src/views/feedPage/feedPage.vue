<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { likeFeed, listFeed } from '@/api/system/feed';
import { FeedVO } from '@/api/system/feed/types';
import FeedChart from '@/views/feedPage/FeedChart.vue';

// --- 接口定义 (TypeScript) ---
interface Post extends FeedVO {
  id: number;
  author: string;
  avatar: string; // 可能是 IPFS 哈希或 URL
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

// --- 状态管理 ---
const posts = ref<FeedVO[]>([]);
const currentPage = ref(1);
const isLoading = ref(false);
const hasMore = ref(true); // 是否还有更多数据可以加载

// 虚拟 Web3 数据 (用于演示)
const generatePost = (id: number, item: FeedVO): FeedVO => ({
  id,
  author: `Anon #${Math.floor(Math.random() * 9000) + 1000}`,
  avatar: `https://i.pravatar.cc/150?img=${id % 70}`, // 随机头像
  likes: Math.floor(Math.random() * 500) + 10,
  isLiked: Math.random() > 0.8,
  ...item
});

// --- 无极加载/数据加载逻辑 ---

const loadMorePosts = async () => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;

  // 模拟 API 请求延迟
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await listFeed({
    pageNum: 10,
    pageSize: currentPage.value
  });

  // 模拟加载下一页的 10 个帖子
  const newPosts: FeedVO[] = [];
  const startId = (currentPage.value - 1) * 10 + 1;
  const data = res.rows;
  for (let i = 0; i < data.length; i++) {
    newPosts.push(generatePost(startId + i, data[i]));
  }

  posts.value.push(...newPosts);

  // 假设总共有 5 页数据
  if (data.length < 10) {
    hasMore.value = false;
  } else {
    currentPage.value++;
  }

  isLoading.value = false;
};

// --- 交互逻辑 ---

const toggleLike = async (post: Post) => {
  if (post.isLiked) {
    post.likeCount--;
  } else {
    post.likeCount++;
  }
  await likeFeed(post.id);
  post.isLiked = !post.isLiked;
};

// --- 移动端和无限滚动监听 ---

const observer = ref<IntersectionObserver | null>(null);
const sentinel = ref<HTMLElement | null>(null); // 观察的哨兵元素

const showFeedDetail = () => {
  ElMessage.warning('敬请期待');
};

onMounted(() => {
  // 初始加载第一批数据
  loadMorePosts();

  // 创建 Intersection Observer 实例
  observer.value = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore.value) {
        loadMorePosts();
      }
    },
    {
      root: null, // 视口作为根
      rootMargin: '0px 0px 100px 0px', // 提前 100px 加载
      threshold: 0.1
    }
  );

  // 开始观察哨兵元素
  if (sentinel.value) {
    observer.value.observe(sentinel.value);
  }
});

onUnmounted(() => {
  // 卸载组件时停止观察
  if (observer.value && sentinel.value) {
    observer.value.unobserve(sentinel.value);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
    <header class="sticky top-0 z-10 backdrop-blur-md bg-gray-900/80 p-3 mb-6 rounded-xl border border-blue-600/30 shadow-2xl shadow-blue-500/10">
      <h1 class="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">策略广场 Beta</h1>
      <p class="text-xs text-gray-500 mt-1">分享您的顶尖策略</p>
    </header>

    <main class="max-w-xl mx-auto space-y-6 pb-20">
      <div
        v-for="post in posts"
        :key="post.id"
        class="p-4 rounded-xl border border-green-500/30 bg-gray-800/60 shadow-lg transition duration-300 hover:shadow-green-500/20"
      >
        <div class="flex justify-between">
          <div class="flex items-center mb-3">
            <img :src="post.avatar" alt="Avatar" class="w-8 h-8 rounded-full border border-green-400/50 mr-3 blur-sm" />
            <div>
              <p class="text-sm font-bold text-green-400">
                {{ post.title }}
              </p>
              <p class="text-xs text-gray-500">{{ post.shareTime }}</p>
            </div>
          </div>

          <div>
            <span
              class="text-lg font-extrabold"
              :class="{
                'text-red-500': post.profit3m < 0,
                'text-green-400': post.profit3m > 0,
                'text-gray-400': post.profit3m == 0
              }"
            >
              <span v-if="post.profit3m > 0"> &#9650; </span>
              <span v-else-if="post.profit3m < 0"> &#9660; </span>
              {{ post.profit3m }}%
            </span>
            <p class="text-xs text-gray-500 mt-0.5 text-right">3个月收益</p>
          </div>
        </div>

        <p class="text-gray-200 text-base mb-4 leading-relaxed whitespace-pre-wrap">
          {{ post.content }}
        </p>
        <div class="flex justify-between items-center text-sm w-full">
          <FeedChart :id="post.id"></FeedChart>
        </div>

        <div class="flex justify-between items-center text-sm">
          <button
            @click="toggleLike(post)"
            :class="[
              'flex items-center px-3 py-1 rounded-full transition duration-200',
              post.isLiked ? 'bg-red-600/70 text-white shadow-red-500/50' : 'bg-gray-700/50 text-gray-400 hover:text-green-400'
            ]"
          >
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ post.likeCount }} 赞
          </button>

          <span class="text-gray-500 hover:cursor-pointer" @click="showFeedDetail">
            查看 <span class="ml-1 text-green-400 cursor-pointer hover:text-cyan-400">→</span>
          </span>
        </div>
      </div>

      <div ref="sentinel" class="h-1 bg-transparent"></div>

      <div class="text-center py-6">
        <div v-if="isLoading" class="text-cyan-400 flex items-center justify-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>加载更多数据...</span>
        </div>

        <p v-else-if="!hasMore" class="text-gray-500 border-t border-gray-700 pt-4 mt-4">没有更多啦</p>

        <button v-else @click="loadMorePosts" class="text-blue-500 hover:text-blue-400 underline">加载下一页</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 确保滚动动画平滑，尤其是在移动端 */
.min-h-screen {
  -webkit-overflow-scrolling: touch;
}

/* Web3 霓虹灯高光效果 */
.shadow-red-500\/50 {
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); /* 红色霓虹 */
}
.hover\:shadow-green-500\/20:hover {
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); /* 绿色霓虹 */
}
</style>
