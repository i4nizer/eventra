<template>
  <section class="sections-view">
    <div class="sectionList">
      <sectionList />
    </div>
    <div class="sectionCount">
      <sectionCount />
      <sectionChart :sections="sectionsData" />
    </div>
  </section>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useApi } from "@/composables/api";
import sectionCount from "@/components/Sections/sectionCount.vue";
import sectionList from "@/components/Sections/sectionList.vue";
import sectionChart from "@/components/Sections/sectionChart.vue";

const { api } = useApi();

const sectionsData = ref([]);

const getSectionsData = async () => {
  try {
    const sectionRes = await api.get("/section");
    const sections = sectionRes.data;

    const studentRes = await api.get("/section/student");
    const students = studentRes.data;

    const studentCountMap = {};
    students.forEach((student) => {
      const secId = student.sectionId;
      if (secId) {
        studentCountMap[secId] = (studentCountMap[secId] || 0) + 1;
      }
    });

    const getOrdinalSuffix = (n) => {
      const s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    sectionsData.value = sections.map((section) => ({
      name: `${section.name}-${getOrdinalSuffix(Number(section.year))} year`,
      studentCount: studentCountMap[section.id] || 0,
    }));
  } catch (error) {
    console.error(error);
  }
};

onBeforeMount(getSectionsData);
</script>

<style scoped>
.sections-view {
  width: 100%;
  display: flex;
  gap: 2rem;
  padding: 1rem;
}

.sectionList {
  width: 80%;
}

.sectionCount {
  width: 20%;
}
</style>
