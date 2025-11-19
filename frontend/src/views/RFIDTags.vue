<template>
  <div class="rfid-tags">
    <div class="tagHeader">
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

<style scoped>
.rfid-tags {
  padding: 1rem;
}

.tagHeader {
  margin-bottom: 1.5rem;
}

.tagList {
  width: 100%;
}

/* Tablet */
@media (max-width: 1024px) {
  .rfid-tags {
    padding: 0.875rem;
  }
  
  .tagHeader {
    margin-bottom: 1.25rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .rfid-tags {
    padding: 0.75rem;
  }
  
  .tagHeader {
    margin-bottom: 1rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .rfid-tags {
    padding: 0.5rem;
  }
  
  .tagHeader {
    margin-bottom: 0.875rem;
  }
}
</style>