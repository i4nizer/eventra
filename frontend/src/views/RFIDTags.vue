<template>
  <div class="rfid-tags">
    <div class="tagList">
      <tagsList />
    </div>
    <div class="tagHeader">
      <tagCount />
      <assignTags />
      <unassignTags />
      <summaryTagsChart :assignTags="10" :unassignTags="10" :totalTags="30" />
    </div>
  </div>
</template>

<script setup>
import tagCount from "@/components/Tags/tagCount.vue";
import tagsList from "@/components/Tags/tagsList.vue";
import unassignTags from "@/components/Tags/unassignTags.vue";
import summaryTagsChart from "@/components/Tags/summaryTagsChart.vue";
import assignTags from "@/components/Tags/assignTags.vue";
</script>

<style scoped>
.rfid-tags {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem;
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
}
</style>
