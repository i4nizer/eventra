<template>
  <div class="events">
    <div class="eventHeader mb-12">
      <eventsCount />
    </div>
    <div class="eventList">
      <eventList />
    </div>
  </div>
</template>
<script setup>
import eventsCount from "@/components/Events/eventsCount.vue";
import eventList from "@/components/Events/eventList.vue";
</script>
