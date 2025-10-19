import { createRouter, createWebHistory } from "vue-router";
import Auth from "@/views/Auth.vue";

const routes = [
  // make home available at "/"

  {
    path: "/",
    name: "Auth",
    component: Auth,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/Dashboard.vue"),
  },
  {
    path: "/students",
    name: "Students",
    component: () => import("@/views/Students.vue"),
  },
  {
    path: "/reports",
    name: "Reports",
    component: () => import("@/views/Reports.vue"),
  },
  {
    path: "/attendance-logs",
    name: "AttendaceLogs",
    component: () => import("@/views/AttendanceLogs.vue"),
  },
  {
    path: "/rfid-tags",
    name: "RFIDTags",
    component: () => import("@/views/RFIDTags.vue"),
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("@/views/Notifiation.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/Settings.vue"),
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: () => import("@/views/Accounts.vue"),
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("@/views/Events.vue"),
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
