<template>
  <div class="about">
    <div class="tagHeader mb-12">
      <tagCount />
    </div>
    <div class="tagList">
      <tagsList />
    </div>
  </div>
</template>

<script setup>
import tagCount from "@/components/Tags/tagCount.vue";
import tagsList from "@/components/Tags/tagsList.vue";
</script>
