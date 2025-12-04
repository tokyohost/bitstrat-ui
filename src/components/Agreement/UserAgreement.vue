<template>
  <div class="agreement-component">
    <div class="checkbox-container">
      <input
        type="checkbox"
        :id="checkboxId"
        :checked="modelValue"
        @change="handleCheckboxChange"
      />
      <label :for="checkboxId">
        {{ $t('agreement.checkbox_text') }}

        <a href="#" @click.prevent="showModal = true" class="agreement-link">
          {{ $t('agreement.link_text') }}
        </a>
      </label>
    </div>

    <div v-if="showRequiredError" class="required-error-message">
      {{ $t('agreement.required_error') }}
    </div>

    <el-dialog v-model="showModal" class="modal-overlay" :title="$t('agreement.modal_title')" append-to-body @close="showModal = false">
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h2>{{ $t('agreement.modal_title') }}</h2>-->
<!--&lt;!&ndash;          <button class="close-btn" @click="showModal = false">×</button>&ndash;&gt;-->
<!--        </div>-->

        <div class="modal-body">
          <p>{{ $t('agreement.last_updated') }}</p>
          <p class="intro">{{ $t('agreement.intro') }}</p>

          <ol>
            <li>
              <strong>{{ $t('agreement.section_1_title') }}</strong>
              <p>{{ $t('agreement.section_1_content') }}</p>
            </li>
            <li>
              <strong>{{ $t('agreement.section_2_title') }}</strong>
              <p>{{ $t('agreement.section_2_content') }}</p>
            </li>
            <li>
              <strong>{{ $t('agreement.section_3_title') }}</strong>
              <p>{{ $t('agreement.section_3_content') }}</p>
            </li>
            <li>
              <strong>{{ $t('agreement.section_4_title') }}</strong>
              <p>{{ $t('agreement.section_4_content') }}</p>
            </li>
            <li>
              <strong>{{ $t('agreement.section_5_title') }}</strong>
              <p>{{ $t('agreement.section_5_content') }}</p>
            </li>
            <li>
              <strong>{{ $t('agreement.section_6_title') }}</strong>
              <p>{{ $t('agreement.section_6_content') }}</p>
            </li>
            <li>
              <strong>{{ $t('agreement.section_7_title') }}</strong>
              <p>{{ $t('agreement.section_7_title') }}</p>
              <ul>
                <li>{{ $t('agreement.section_7_list_1') }}</li>
                <li>{{ $t('agreement.section_7_list_2') }}</li>
                <li>{{ $t('agreement.section_7_list_3') }}</li>
                <li>{{ $t('agreement.section_7_list_4') }}</li>
                <li>{{ $t('agreement.section_7_list_5') }}</li>
              </ul>
            </li>
            <li>
              <strong>{{ $t('agreement.section_8_title') }}</strong>
              <p>{{ $t('agreement.section_8_content') }}</p>
            </li>
            <li>
              <strong>{{ $t('agreement.section_9_title') }}</strong>
              <p>{{ $t('agreement.section_9_content') }}</p>
            </li>
          </ol>
        </div>

        <div class="modal-footer">
          <button @click="showModal = false" class="confirm-btn">
            {{ $t('agreement.confirm_button') }}
          </button>
        </div>
<!--      </div>-->
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// 假设你已在 main.js 中配置了 Vue I18n，并全局提供了 $t 函数

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 新增 prop 来接收父组件的必填错误状态，以便在组件内显示提示
  showRequiredError: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:modelValue']);

// 模态框的显示状态
const showModal = ref(false);

const checkboxId = computed(() => `agreement-${Math.random().toString(36).substring(2, 9)}`);

// 处理复选框变化
const handleCheckboxChange = (event) => {
  emit('update:modelValue', event.target.checked);
};
</script>

<style scoped>
/* 组件样式保持与上一次回答一致，这里只添加了错误提示的样式 */
.agreement-component {
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.agreement-link {
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}

.required-error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

/* 模态框样式（为简洁省略了重复部分） */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.6;
  color: #444;
}

.modal-footer {
  padding: 10px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.confirm-btn {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
