<template>
  <div class="students">
    <div class="studentTable">
      <studentTable
        :students="students"
        :sections="sections"
        :balances="[...balances.entries()]"
        @refresh="getData"
      />
    </div>
    <div class="studentHeader">
      <studentCounts :count="students.length" />
    </div>
  </div>
</template>

<script setup>
import studentCounts from "@/components/students/studentCounts.vue";
import studentTable from "@/components/students/studentTable.vue";
import { useApi } from "@/composables/api";
import { ref, onBeforeMount } from "vue";

//

const { api } = useApi();

// --- Sections
const sections = ref([]);
const getSections = async () => {
  await api
    .get(`/section`)
    .then((res) => (sections.value = res.data))
    .catch(console.error);
};

// --- Students
const students = ref([]);
const getStudents = async () => {
  await api
    .get(`/section/student`)
    .then((res) => (students.value = res.data))
    .catch(console.error);
};

// --- Balances
const balances = ref(new Map());

const getBalances = async (students) => {
  const promises = [];
  for (const student of students) {
    const { id, sectionId } = student;
    const res = api
      .get(`/section/${sectionId}/student/${id}/balance`)
      .then((res) => balances.value.set(id, res.data.balance))
      .catch(console.error);
    promises.push(res);
  }
  await Promise.all(promises);
};

// --- Data Fetching
const getData = async () => {
  await Promise.all([getSections(), getStudents()]);
  await getBalances(students.value);
};

onBeforeMount(getData);

//
</script>

<style scoped>
.students {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 30vw;
}

.studentTable {
  width: 100%;
}

/* Tablet */
@media (max-width: 1024px) {
  .students {
    padding: 0.875rem;
  }

  .studentHeader {
    margin-bottom: 1.25rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .students {
    padding: 0.75rem;
  }

  .studentHeader {
    margin-bottom: 1rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .students {
    padding: 0.5rem;
  }

  .studentHeader {
    margin-bottom: 0.875rem;
  }
}
</style>
