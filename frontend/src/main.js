import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@/assets/styles/theme.css";
import "@/assets/styles/button.css";
import "@/assets/styles/modal.css";
import "@/assets/styles/table.css";
import "@/assets/styles/card.css";

createApp(App).use(router).mount("#app");

// apply saved theme before app mounts to avoid flash
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else if (savedTheme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", prefersDark);
}
