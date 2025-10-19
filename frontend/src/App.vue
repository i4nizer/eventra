<template>
  <div
    id="app"
    class="relative font-poppins bg-gray-50 min-h-screen flex transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
  >
    <!-- Sidebar -->
    <transition name="sidebar-slide">
      <Nav
        v-if="showNav"
        class="fixed top-0 left-0 h-screen z-50"
        @toggle="onToggleSidebar"
      />
    </transition>

    <!-- Dark overlay for mobile -->
    <div
      v-if="isMobile && isSidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
      @click="closeSidebar"
    ></div>

    <!-- Main content -->
    <main
      class="flex-1 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] p-6"
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
const isSidebarOpen = ref(true);
const isMobile = ref(false);

// Watch for screen width to toggle between desktop and mobile layout
const handleResize = () => {
  isMobile.value = window.innerWidth < 1024; // < lg breakpoint
  if (isMobile.value) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => window.removeEventListener("resize", handleResize));

// Handle collapse toggle emitted from Nav
const onToggleSidebar = (collapsed) => {
  isCollapsed.value = collapsed;

  // For mobile: toggling acts as open/close
  if (isMobile.value) {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};

const closeSidebar = () => {
  if (isMobile.value) isSidebarOpen.value = false;
};

// --- Compute main content style ---
const mainStyle = computed(() => {
  if (!showNav.value) return { marginLeft: "0" };

  // MOBILE: sidebar overlays content, no margin
  if (isMobile.value) return { marginLeft: "0" };

  // DESKTOP: adjust margin-left based on collapsed width
  return {
    marginLeft: isCollapsed.value ? "5rem" : "16rem",
    transition: "margin-left 0.5s cubic-bezier(0.25,0.1,0.25,1)",
  };
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

#app {
  font-family: "Poppins", sans-serif;
  overflow-x: hidden;
  background-color: #fdfdff;
}

/* Sidebar slide-in animation for mobile */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.4s ease, opacity 0.3s ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
