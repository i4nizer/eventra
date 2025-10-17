import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const routes = [
  // make home available at "/"
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { path: "/" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || "/"),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
