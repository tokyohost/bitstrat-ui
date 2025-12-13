<template>
  <div class="p-2">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>{{ t('profile.personalInfo') }}</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <userAvatar />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />{{ t('profile.userName') }}
                <div class="pull-right">{{ state.user.userName }}</div>
              </li>
              <!--              <li class="list-group-item">-->
              <!--                <svg-icon icon-class="phone" />{{ t('profile.phone') }}-->
              <!--                <div class="pull-right">{{ state.user.phonenumber }}</div>-->
              <!--              </li>-->
              <li class="list-group-item">
                <svg-icon icon-class="email" />{{ t('profile.email') }}
                <div class="pull-right">{{ state.user.email }}</div>
              </li>
              <!--              <li class="list-group-item">-->
              <!--                <svg-icon icon-class="tree" />{{ t('profile.dept') }}-->
              <!--                <div v-if="state.user.deptName" class="pull-right">{{ state.user.deptName }} / {{ state.postGroup }}</div>-->
              <!--              </li>-->
              <!--              <li class="list-group-item">-->
              <!--                <svg-icon icon-class="peoples" />{{ t('profile.role') }}-->
              <!--                <div class="pull-right">{{ state.roleGroup }}</div>-->
              <!--              </li>-->
              <li class="list-group-item">
                <svg-icon icon-class="date" />{{ t('profile.createTime') }}
                <div class="pull-right">{{ state.user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>{{ t('profile.basicInfo') }}</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <!--            <el-tab-pane :label="t('profile.basicInfo')" name="userinfo">-->
            <!--              <userInfo :user="userForm" />-->
            <!--            </el-tab-pane>-->
            <el-tab-pane :label="t('profile.resetPassword')" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
            <!--            <el-tab-pane :label="t('profile.thirdParty')" name="thirdParty">-->
            <!--              <thirdParty :auths="state.auths" />-->
            <!--            </el-tab-pane>-->
            <el-tab-pane :label="t('profile.onlineDevice')" name="onlineDevice">
              <onlineDevice :devices="state.devices" />
            </el-tab-pane>
            <el-tab-pane :label="t('profile.invitationCode')" name="invitationCode">
              <InviteCodeInput :model-value="state.user?.invitationCode" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Profile" lang="ts">
import { useI18n } from 'vue-i18n';
import UserAvatar from './userAvatar.vue';
import UserInfo from './userInfo.vue';
import ResetPwd from './resetPwd.vue';
import ThirdParty from './thirdParty.vue';
import OnlineDevice from './onlineDevice.vue';
import { getAuthList } from '@/api/system/social/auth';
import { getUserProfile } from '@/api/system/user';
import { getOnline } from '@/api/monitor/online';
import { UserVO } from '@/api/system/user/types';
import InviteCodeInput from '@/views/system/user/profile/InviteCodeInput.vue';

const { t } = useI18n();

const activeTab = ref('resetPwd');
interface State {
  user: Partial<UserVO>;
  roleGroup: string;
  postGroup: string;
  auths: any;
  devices: any;
}
const state = ref<State>({
  user: {},
  roleGroup: '',
  postGroup: '',
  auths: [],
  devices: []
});

const userForm = ref({});

const getUser = async () => {
  const res = await getUserProfile();
  state.value.user = res.data.user;
  userForm.value = { ...res.data.user };
  state.value.roleGroup = res.data.roleGroup;
  state.value.postGroup = res.data.postGroup;
};

const getAuths = async () => {
  const res = await getAuthList();
  state.value.auths = res.data;
};
const getOnlines = async () => {
  const res = await getOnline();
  state.value.devices = res.rows;
};

onMounted(() => {
  getUser();
  getAuths();
  getOnlines();
});
</script>
