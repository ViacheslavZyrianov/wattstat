<script setup lang="ts"></script>

<template>
  <main>
    <slot />
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
