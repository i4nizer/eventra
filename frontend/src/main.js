import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";

createApp(App).use(router).mount("#app");
