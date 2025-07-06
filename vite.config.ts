import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["7afe-2601-483-4280-bec0-b97b-f803-40c4-a48.ngrok-free.app"],
  },
  plugins: [react(), tailwindcss(), flowbiteReact()],
});
