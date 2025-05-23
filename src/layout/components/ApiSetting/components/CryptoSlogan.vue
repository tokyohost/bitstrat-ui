<script setup lang="ts">
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
</script>

<template>
  <div class="flex justify-center items-center w-full">
    <div>{{ proxy.$t('cryptoSlogan.sloganSplit1') }}</div>
    <div class="color-blue ml-1 mr-1">
      <a href="https://pycryptodome.readthedocs.io/en/latest/src/cipher/oaep.html"> {{ proxy.$t('cryptoSlogan.sloganSplit2') }} </a>
    </div>
    <div>{{ proxy.$t('cryptoSlogan.sloganSplit3') }}</div>
  </div>
</template>

<style scoped lang="scss"></style>
