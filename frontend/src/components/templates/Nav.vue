<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-screen z-50 shadow-lg transition-all duration-300 overflow-y-auto nav-root',
      isCollapsed ? 'w-20' : 'w-64',
    ]"
    aria-label="Sidebar"
  >
    <!-- Header -->
    <div class="p-3 mt-6 flex items-center gap-3">
      <button
        @click="toggleCollapse"
        class="p-4 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition"
        aria-label="Toggle sidebar"
      >
        <i
          :class="
            isCollapsed
              ? 'fa-solid fa-bars text-xl nav-icon'
              : 'fa-solid fa-xmark text-xl nav-icon'
          "
        ></i>
      </button>

      <h1 v-if="!isCollapsed" class="text-xl font-bold nav-title">RFID</h1>
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
            class="group flex items-center gap-10 rounded-lg px-3 py-5 nav-item transition-all duration-200"
            :class="{
              'nav-item-active': route.path === item.to,
              'justify-center': isCollapsed,
            }"
          >
            <!-- Active indicator -->
            <span
              v-if="route.path === item.to"
              class="absolute left-0 top-0 bottom-0 w-[3px] nav-active-indicator"
            ></span>

            <i
              :class="[
                item.icon,
                'text-lg transition-transform duration-200 group-hover:scale-110 nav-icon',
              ]"
            ></i>

            <span
              v-if="!isCollapsed"
              class="truncate group-hover:font-semibold nav-label"
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

const emit = defineEmits(["toggle", "close"]);

const route = useRoute();
const router = useRouter();
const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit("toggle", isCollapsed.value);
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
    { to: "/events", icon: "fa-solid fa-calendar-days", label: "Events" },
    { to: "/rfid-tags", icon: "fa-solid fa-id-badge", label: "RFID Tags" },
    {
      to: "/attendance-logs",
      icon: "fa-solid fa-file-lines",
      label: "Attendance Logs",
    },
    { to: "/payment-logs", icon: "fa-solid fa-peso-sign", label: "Payment Logs" },
    { to: "/reports", icon: "fa-solid fa-chart-bar", label: "Reports" },
    { to: "/settings", icon: "fa-solid fa-cog", label: "Settings" },
  ].filter((item) => hasAccess(item.roles))
);

const onItemClick = (item) => {
  if (item.to && route.path !== item.to) {
    router.push(item.to).catch(() => {});
    emit("close");
  } else if (typeof item.onClick === "function") {
    item.onClick();
    emit("close");
  }
};
</script>

<style scoped>
.nav-root {
  border-right: 1px solid var(--border);
  background: var(--surface2);
  color: var(--accent);
  min-height: 100vh;
}

/* nav elements */
.nav-item {
  color: var(--text);
  background: transparent;
}
.nav-item:hover {
  background: rgba(16, 185, 129, 0.04);
}

/* active state */
.nav-item-active {
  background: rgba(16, 185, 129, 0.08);
  color: var(--accent);
  font-weight: 600;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
}

/* left active indicator */
.nav-active-indicator {
  background: var(--accent);
}

/* icon and text */
.nav-icon {
  color: var(--accent);
}
.nav-title {
  color: var(--text);
}
.nav-label {
  color: var(--text);
}

/* Custom Scrollbar */
.nav-root::-webkit-scrollbar {
  width: 8px;
}

.nav-root::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.nav-root::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-root::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}

/* Firefox Scrollbar */
.nav-root {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.02);
}

/* keep transitions */
aside {
  transition: all 300ms ease;
}
</style>
