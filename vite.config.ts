import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from "path";
import { writeFileSync, readFileSync } from "fs";

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
    {
      name: "copy-404",
      closeBundle() {
        const indexHtml = readFileSync(resolve(__dirname, "dist/index.html"));
        writeFileSync(resolve(__dirname, "dist/404.html"), indexHtml);
      },
    }
  ],
  base: "chronohub/",

})
