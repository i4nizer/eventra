<template>
  <div class="settings surface p-6 rounded">
    <h1 class="mb-4">Settings</h1>

    <div class="dark-toggle" role="group" aria-label="Theme settings">
      <span class="label mr-3">Dark mode</span>

      <label class="switch" role="switch" :aria-checked="isDark.toString()">
        <input
          type="checkbox"
          :checked="isDark"
          @change="setTheme($event.target.checked)"
          aria-label="Toggle dark mode"
        />
        <span class="slider"></span>
      </label>

      <span class="state ms-3">{{ isDark ? "On" : "Off" }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isDark = ref(document.documentElement.classList.contains("dark"));

function setTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
  isDark.value = dark;
}
</script>

<style scoped>
.settings { max-width: 720px; }

/* Switch container */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  vertical-align: middle;
}

/* Hide default checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

/* Slider track */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #cbd5e1; /* light track (will be overwritten by CSS vars if available) */
  transition: background 0.18s ease, box-shadow 0.18s ease;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
}

/* Knob */
.slider::before {
  content: "";
  position: absolute;
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.18s ease;
  box-shadow: 0 2px 6px rgba(16,24,40,0.12);
}

/* Checked state */
.switch input:checked + .slider {
  background: var(--accent);
}
.switch input:checked + .slider::before {
  transform: translateX(20px);
}

/* Focus styles for accessibility */
.switch input:focus + .slider {
  box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
}

/* Small helpers */
.label { font-weight: 600; color: var(--text); }
.state { color: var(--muted); font-size: 0.95rem; }

/* Optional spacing helpers (if your project doesn't use them) */
.mr-3 { margin-right: 0.75rem; }
.ms-3 { margin-left: 0.75rem; }

/* When dark mode is active, use --surface2 for the settings box background */
:global(.dark) .settings.surface {
  background: var(--surface2);
}
</style>
