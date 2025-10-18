<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-screen z-50 border-r border-gray-200 bg-white shadow-lg transition-all duration-300 overflow-y-auto',
      isCollapsed ? 'w-20' : 'w-64',
    ]"
    aria-label="Sidebar"
  >
    <!-- Header -->
    <div class="p-3 mt-6 flex items-center gap-3">
      <button
        @click="toggleCollapse"
        class="p-4 rounded-lg hover:bg-gray-100 transition"
        aria-label="Toggle sidebar"
      >
        <i
          :class="
            isCollapsed
              ? 'fa-solid fa-bars text-xl text-black-600'
              : 'fa-solid fa-xmark text-xl text-black-600'
          "
        ></i>
      </button>

      <h1 v-if="!isCollapsed" class="text-xl font-bold text-black-600">RFID</h1>
    </div>

    <!-- Navigation -->
    <nav class="mt-3 w-full px-2">
      <ul class="flex flex-col space-y-1">
        <li
          v-for="item in sidebarItems"
          :key="item.to || item.label"
          class="relative"
        >
          <component
            :is="item.to ? 'router-link' : 'button'"
            :to="item.to"
            @click="onItemClick(item)"
            :title="isCollapsed ? item.label : undefined"
            class="group flex items-center gap-10 rounded-lg px-3 py-5 text-gray-700 hover:bg-emerald-50 transition-all duration-200"
            :class="{
              'bg-emerald-100 text-emerald-700 font-semibold shadow-sm':
                route.path === item.to,
              'justify-center': isCollapsed,
            }"
          >
            <!-- Active indicator -->
            <span
              v-if="route.path === item.to"
              class="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-600 rounded-r-full"
            ></span>

            <i
              :class="[
                item.icon,
                'text-lg transition-transform duration-200 group-hover:scale-110 text-emerald-600',
              ]"
            ></i>

            <span
              v-if="!isCollapsed"
              class="truncate group-hover:text-emerald-700"
            >
              {{ item.label }}
            </span>
          </component>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const hasAccess = () => true;

const sidebarItems = computed(() =>
  [
    { to: "/dashboard", icon: "fa-solid fa-house", label: "Dashboard" },
    {
      to: "/students",
      icon: "fa-solid fa-user-graduate",
      label: "Students",
    },
    { to: "/rfid-tags", icon: "fa-solid fa-id-badge", label: "RFID Tags" },
    {
      to: "/attendance-logs",
      icon: "fa-solid fa-file-lines",
      label: "Attendance Logs",
    },
    { to: "/reports", icon: "fa-solid fa-chart-bar", label: "Reports" },

    { to: "/accounts", icon: "fa-solid fa-shield-halved", label: "Accounts" },

    {
      to: "/notifications",
      icon: "fa-solid fa-bell",
      label: "Notifications",
    },
    { to: "/settings", icon: "fa-solid fa-cog", label: "Settings" },
    // {
    //   to: "/logout",
    //   icon: "fa-solid fa-right-from-bracket",
    //   label: "Logout",
    // },
  ].filter((item) => hasAccess(item.roles))
);

const onItemClick = (item) => {
  if (item.to && route.path !== item.to) {
    router.push(item.to).catch(() => {});
  } else if (typeof item.onClick === "function") {
    item.onClick();
  }
};
</script>

<style scoped>
aside {
  min-height: 100vh;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* Scrollbar styling */
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}
</style>
