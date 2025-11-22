<template>
  <div
    id="app"
    class="relative font-poppins min-h-screen flex transition-all duration-300 ease"
  >
    <!-- Mobile Menu Button -->
    <button
      v-if="showNav && isMobile"
      @click="toggleMobileSidebar"
      class="fixed top-4 left-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
      style="background: var(--surface2); border: 1px solid var(--border)"
      aria-label="Toggle menu"
    >
      <i
        :class="[
          isSidebarOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars',
          'text-xl',
        ]"
        style="color: var(--accent)"
      ></i>
    </button>

    <!-- Sidebar -->
    <transition name="sidebar-slide">
      <Nav
        v-if="showNav && (!isMobile || isSidebarOpen)"
        class="fixed top-0 left-0 h-screen z-50"
        @toggle="onToggleSidebar"
        @close="closeSidebar"
      />
    </transition>

    <!-- Dark overlay for mobile -->
    <div
      v-if="isMobile && isSidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease"
      @click="closeSidebar"
    ></div>

    <!-- Main content -->
    <main
      class="flex-1 min-h-screen transition-all duration-300 ease p-6"
      :style="mainStyle"
    >
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import Nav from "@/components/templates/Nav.vue";

const route = useRoute();
const showNav = computed(
  () => !route.matched.some((r) => r.meta && r.meta.hideNav)
);

// States
const isCollapsed = ref(false);
const isSidebarOpen = ref(false); // Start closed on mobile
const isMobile = ref(false);

// Watch for screen width to toggle between desktop and mobile layout
const handleResize = () => {
  isMobile.value = window.innerWidth < 1024; // < lg breakpoint
  if (!isMobile.value) {
    isSidebarOpen.value = true; // Always open on desktop
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => window.removeEventListener("resize", handleResize));

// Toggle mobile sidebar
const toggleMobileSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};

// Handle collapse toggle emitted from Nav
const onToggleSidebar = (collapsed) => {
  isCollapsed.value = collapsed;
};

const closeSidebar = () => {
  if (isMobile.value) isSidebarOpen.value = false;
};

// --- Compute main content style ---
const mainStyle = computed(() => {
  if (!showNav.value) return { marginLeft: "0" };

  // MOBILE: sidebar overlays content, no margin
  if (isMobile.value) return { marginLeft: "0", paddingTop: "4rem" };

  // DESKTOP: adjust margin-left based on collapsed width
  return {
    marginLeft: isCollapsed.value ? "5rem" : "16rem",
    transition: "margin-left 0.3s ease",
  };
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

#app {
  font-family: "Poppins", sans-serif;
  overflow-x: hidden;
  background-color: var(--bg);
  color: var(--text);
}

/* Sidebar slide-in animation for mobile – smoother 300ms ease */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 300ms ease, opacity 300ms ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
