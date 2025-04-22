import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      "b681-2601-483-4280-bec0-415f-ea39-154f-2162.ngrok-free.app",
    ],
  },
  plugins: [react(), tailwindcss(), flowbiteReact()],
});
