<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggle-click="toggleSideBar" />
    <breadcrumb v-if="!settingsStore.topNav" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="settingsStore.topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu flex align-center">
      <template v-if="appStore.device !== 'mobile'">
        <!--        <el-select-->
        <!--          v-if="userId === 1 && tenantEnabled"-->
        <!--          v-model="companyName"-->
        <!--          class="min-w-244px"-->
        <!--          clearable-->
        <!--          filterable-->
        <!--          reserve-keyword-->
        <!--          :placeholder="proxy.$t('navbar.selectTenant')"-->
        <!--          @change="dynamicTenantEvent"-->
        <!--          @clear="dynamicClearEvent"-->
        <!--        >-->
        <!--          <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId"> </el-option>-->
        <!--          <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>-->
        <!--        </el-select>-->

        <search-menu ref="searchMenuRef" />
        <!--        <el-tooltip content="搜索" effect="dark" placement="bottom">-->
        <!--          <div class="right-menu-item hover-effect" @click="openSearchMenu">-->
        <!--            <svg-icon class-name="search-icon" icon-class="search" />-->
        <!--          </div>-->
        <!--        </el-tooltip>-->

        <!-- 余额 -->

        <!-- VIP标识 -->
        <!--        <el-tooltip :content="isVIP ? '已开通VIP' : '开通VIP'" effect="dark" placement="bottom">-->
        <!--          <div class="vip-indicator" @click="handleVipClick">-->
        <!--            <el-popover placement="bottom" trigger="hover" :width="300" :persistent="false" @show="fetchVipDetails">-->
        <!--              <template #reference>-->
        <!--                <div class="vip-indicator" @click="handleVipClick">-->
        <!--                  <img :src="ic_vip" alt="VIP标识" />-->
        <!--                </div>-->
        <!--              </template>-->
        <!--              <template #default>-->
        <!--                <div v-if="vipDetails" class="vip-details">-->
        <!--                  <h3>VIP详情</h3>-->
        <!--                  <p>到期时间：{{ vipDetails.expireTime }}</p>-->
        <!--                  <p>权益列表：{{ vipDetails.name }}</p>-->
        <!--                  <ul>-->
        <!--                    <li v-for="(feature, index) in vipDetails.features" :key="index">{{ feature }}</li>-->
        <!--                  </ul>-->
        <!--                  <div v-if="vipDetails.isRenew" class="renew-info">续费ID: {{ vipDetails.renewId }}</div>-->
        <!--                </div>-->
        <!--                <div v-else>加载中...</div>-->
        <!--              </template>-->
        <!--            </el-popover>-->
        <!--          </div>-->
        <!--        </el-tooltip>-->
        <!-- 消息 -->
        <el-tooltip :content="proxy.$t('navbar.message')" effect="dark" placement="bottom">
          <div>
            <el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">
              <template #reference>
                <el-badge :value="newNotice > 0 ? newNotice : ''" :max="99">
                  <svg-icon icon-class="message" />
                </el-badge>
              </template>
              <template #default>
                <notice></notice>
              </template>
            </el-popover>
          </div>
        </el-tooltip>
        <!--        <el-tooltip content="Github" effect="dark" placement="bottom">-->
        <!--          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <!--        <el-tooltip :content="proxy.$t('navbar.document')" effect="dark" placement="bottom">-->
        <!--          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <el-tooltip :content="proxy.$t('navbar.full')" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip :content="proxy.$t('navbar.layoutSize')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <el-tooltip :content="proxy.$t('navbar.apiSetting')" effect="dark" placement="bottom">
          <ApiSettingsPopup></ApiSettingsPopup>
        </el-tooltip>
        <el-tooltip :content="proxy.$t('navbar.socketStatus')" effect="dark" placement="bottom">
          <SocketStatusPopup></SocketStatusPopup>
        </el-tooltip>
        <!--        <el-tooltip :content="proxy.$t('navbar.notifySetting')" effect="dark" placement="bottom">-->
        <!--          <NotifySettingsPopup></NotifySettingsPopup>-->
        <!--        </el-tooltip>-->
      </template>
      <el-tooltip :content="proxy.$t('navbar.language')" effect="dark" placement="bottom">
        <lang-select id="lang-select" class="right-menu-item hover-effect" />
      </el-tooltip>
      <div>
        <BalanceNav :balance="balance" @refresh="loadBalance" @to-recharge="toRecharge" @to-account="goAccountBalance"></BalanceNav>
        <RechargeDialog :show-button="false" v-model:visible="rechargeDialog" @recharge-success="handleRechargeSuccess" />
      </div>
      <div class="avatar-container">
        <el-dropdown class="right-menu-item hover-effect" trigger="click" @command="handleCommand">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link v-if="!dynamic" to="/user/profile">
                <el-dropdown-item>{{ proxy.$t('navbar.personalCenter') }}</el-dropdown-item>
              </router-link>
              <el-dropdown-item v-if="settingsStore.showSettings" command="setLayout">
                <span>{{ proxy.$t('navbar.layoutSetting') }}</span>
              </el-dropdown-item>
              <el-dropdown-item command="socketStatus">
                <span>{{ proxy.$t('navbar.socketStatus') }}</span>
              </el-dropdown-item>
              <el-dropdown-item command="apiSetting">
                <span>{{ proxy.$t('navbar.apiSetting') }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>{{ proxy.$t('navbar.logout') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-dialog v-model="showDialog">
      <div v-if="comoponeDetails === 'socketStatus'">
        <SocketStatusPopup :popover="false" />
      </div>
      <div v-if="comoponeDetails === 'apiSetting'">
        <ApiSettingsPopup :popover="false"></ApiSettingsPopup>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import SearchMenu from './TopBar/search.vue';
import { useAppStore } from '@/store/modules/app';
import { useUserStore } from '@/store/modules/user';
import { useSettingsStore } from '@/store/modules/settings';
import { useNoticeStore } from '@/store/modules/notice';
import { getTenantList } from '@/api/login';
import { dynamicClear, dynamicTenant } from '@/api/system/tenant';
import { TenantVO } from '@/api/types';
import notice from './notice/index.vue';
import router from '@/router';
import { ElMessageBoxOptions } from 'element-plus/es/components/message-box/src/message-box.type';
import ApiSettingsPopup from '@/layout/components/ApiSetting/ApiSettingsPopup.vue';
import NotifySettingsPopup from '@/layout/components/NotifySetting/NotifySettingsPopup.vue';
import SocketStatusPopup from '@/layout/components/SocketStatus/SocketStatusPopup.vue';

import vip_active from '@/assets/icons/png/vip_active.png';
import vip_inactive from '@/assets/icons/png/vip_inactive.png';
import ic_vip from '@/assets/icons/png/ic_vip.png';
import { getUserVipInfo } from '@/api/system/vip/userVip';
import { getUserProfile } from '@/api/system/user';
import BalanceNav from '@/layout/components/balance/BalanceNav.vue';
import RechargeDialog from '@/layout/components/Recharge/RechargeDialog.vue';

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const noticeStore = storeToRefs(useNoticeStore());
const newNotice = ref(<number>0);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userId = ref(userStore.userId);
const companyName = ref(undefined);
const tenantList = ref<TenantVO[]>([]);
// 是否切换了租户
const dynamic = ref(false);
// 租户开关
const tenantEnabled = ref(true);
// 搜索菜单
const searchMenuRef = ref<InstanceType<typeof SearchMenu>>();

const openSearchMenu = () => {
  searchMenuRef.value?.openSearch();
};

const balance = ref(0);

const loadBalance = async () => {
  const res = await getUserProfile();
  balance.value = res?.data?.user?.balance;
};
const goAccountBalance = () => {
  console.log('go account balance');
  proxy?.$router.push({ path: '/account/balance' });
};
const rechargeDialog = ref(false);
const toRecharge = () => {
  rechargeDialog.value = true;
};
const handleRechargeSuccess = async () => {
  await loadBalance();
};
// 动态切换
const dynamicTenantEvent = async (tenantId: string) => {
  if (companyName.value != null && companyName.value !== '') {
    await dynamicTenant(tenantId);
    dynamic.value = true;
    await proxy?.$router.push('/');
    await proxy?.$tab.closeAllPage();
    await proxy?.$tab.refreshPage();
  }
};

const dynamicClearEvent = async () => {
  await dynamicClear();
  dynamic.value = false;
  await proxy?.$router.push('/');
  await proxy?.$tab.closeAllPage();
  await proxy?.$tab.refreshPage();
};

/** 租户列表 */
const initTenantList = async () => {
  const { data } = await getTenantList(true);
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
  }
};

defineExpose({
  initTenantList
});

const toggleSideBar = () => {
  appStore.toggleSideBar(false);
};

const logout = async () => {
  await ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  } as ElMessageBoxOptions);
  userStore.logout().then(() => {
    router.replace({
      path: '/login',
      query: {
        redirect: encodeURIComponent(router.currentRoute.value.fullPath || '/')
      }
    });
  });
};

const emits = defineEmits(['setLayout']);

const setLayout = () => {
  emits('setLayout');
};
const showDialog = ref(false);
const comoponeDetails = ref<string>(null);

const socketStatus = () => {
  comoponeDetails.value = 'socketStatus';
  showDialog.value = true;
};
const apiSetting = () => {
  comoponeDetails.value = 'apiSetting';
  showDialog.value = true;
};
// 定义Command方法对象 通过key直接调用方法
const commandMap: { [key: string]: any } = {
  setLayout,
  logout,
  socketStatus,
  apiSetting
};
const handleCommand = (command: string) => {
  // 判断是否存在该方法
  if (commandMap[command]) {
    commandMap[command]();
  }
};
//用深度监听 消息
watch(
  () => noticeStore.state.value.notices,
  (newVal) => {
    newNotice.value = newVal.filter((item: any) => !item.read).length;
  },
  { deep: true }
);

// 添加VIP状态
const isVIP = ref(false); // 假设初始状态为未开通VIP

// 新增 VIP 详情数据结构，与后端返回的 CoinsUserVipInfoVo 对齐
const vipDetails = ref<{
  id: number;
  userId: number;
  vipId: number;
  buyTime: string;
  expireTime: string;
  status: number;
  name: string;
  level: number;
  maxAbAmount: number;
  maxActiveTask: number;
  price: number;
  avaliableDay: number;
} | null>(null);

//  fetchVipDetails 方法
const fetchVipDetails = async () => {
  try {
    const response = await getUserVipInfo({
      userId: userStore.userId // 使用当前用户的ID
    });
    if (response.code === 200) {
      const data = response.data;
      vipDetails.value = {
        id: data.id,
        userId: data.userId,
        vipId: data.vipId,
        buyTime: data.buyTime || '未知',
        expireTime: data.expireTime || '未知',
        status: data.status || 0,
        name: data.name || 'VIP会员',
        level: data.level || 0,
        maxAbAmount: data.maxAbAmount || 0,
        maxActiveTask: data.maxActiveTask || 0,
        price: data.price || 0,
        avaliableDay: data.avaliableDay || 0
      };
      isVIP.value = data.status === 1; // 根据状态判断是否为VIP
    } else {
      ElMessage.error('获取VIP详情失败，请稍后重试');
    }
  } catch (error) {
    console.error('获取VIP详情失败:', error);
    ElMessage.error('获取VIP详情失败，请稍后重试');
  }
};

// 修改 handleVipClick 方法，调用 fetchVipDetails
const handleVipClick = () => {
  router.push({ name: 'PurchaseVip' });
  if (!isVIP.value) {
    console.log('跳转到开通VIP页面');
  } // 调用获取VIP详情的方法
};
onMounted(() => {
  loadBalance();
});
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__wrapper) {
  height: 30px;
}

:deep(.el-badge__content.is-fixed) {
  top: 12px;
}

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  //background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin-top: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

// VIP标识样式
.vip-indicator {
  display: inline-block;
  padding: 0 8px;
  height: 32px;
  line-height: 32px;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #409eff;
  }
}

.vip-active {
  color: #ffd700; // 开通VIP后的颜色
}

// 新增 VIP 详情样式
.vip-details {
  h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }
  ul {
    list-style-type: disc;
    padding-left: 20px;
    li {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
  }
  .renew-info {
    // 新增样式：续费信息
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }
}
</style>
