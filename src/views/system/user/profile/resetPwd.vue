<template>
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px" label-position="top">
    <el-form-item :label="t('resetPassword.oldPassword')" prop="oldPassword">
      <el-input v-model="user.oldPassword" :placeholder="t('resetPassword.oldPasswordPlaceholder')" type="password" show-password />
    </el-form-item>
    <el-form-item :label="t('resetPassword.newPassword')" prop="newPassword">
      <el-input v-model="user.newPassword" :placeholder="t('resetPassword.newPasswordPlaceholder')" type="password" show-password />
    </el-form-item>
    <el-form-item :label="t('resetPassword.confirmPassword')" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" :placeholder="t('resetPassword.confirmPasswordPlaceholder')" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ t('resetPassword.save') }}</el-button>
      <el-button type="danger" @click="close">{{ t('resetPassword.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { updateUserPwd } from '@/api/system/user';
import type { ResetPwdForm } from '@/api/system/user/types';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const pwdRef = ref<ElFormInstance>();
const user = ref<ResetPwdForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const equalToPassword = (rule: any, value: string, callback: any) => {
  if (user.value.newPassword !== value) {
    callback(new Error(t('resetPassword.rule.confirmPasswordNotMatch')));
  } else {
    callback();
  }
};

const rules = ref({
  oldPassword: [{ required: true, message: t('resetPassword.rule.oldPasswordRequired'), trigger: 'blur' }],
  newPassword: [
    { required: true, message: t('resetPassword.rule.newPasswordRequired'), trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: t('resetPassword.rule.newPasswordLength'),
      trigger: 'blur'
    },
    { pattern: /^[^<>"'|\\]+$/, message: t('resetPassword.rule.newPasswordPattern'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('resetPassword.rule.confirmPasswordRequired'), trigger: 'blur' },
    {
      required: true,
      validator: equalToPassword,
      trigger: 'blur'
    }
  ]
});

/** 提交按钮 */
const submit = () => {
  pwdRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await updateUserPwd(user.value.oldPassword, user.value.newPassword);
      proxy?.$modal.msgSuccess(t('resetPassword.success'));
    }
  });
};

/** 关闭按钮 */
const close = () => {
  proxy?.$tab.closePage();
};
</script>
