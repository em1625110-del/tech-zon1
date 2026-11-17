import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

let outputDirectory

const githubPagesFallback = {
  name: 'github-pages-spa-fallback',
  apply: 'build',
  configResolved(config) {
    outputDirectory = resolve(config.root, config.build.outDir)
  },
  closeBundle() {
    copyFileSync(
      resolve(outputDirectory, 'index.html'),
      resolve(outputDirectory, '404.html'),
    )
  },
}

export default defineConfig({
  plugins: [react(), githubPagesFallback],
  // GitHub Pages открывает сайт по адресу /Tech-Zone/, а Vercel — из корня
  base: process.env.VERCEL ? '/' : '/Tech-Zone/',
  build: {
    rolldownOptions: {
      output: {
        // Библиотеки — в отдельные файлы: браузер кеширует их между обновлениями сайта
        codeSplitting: {
          groups: [
            { name: 'firebase', test: /node_modules[\\/]@?firebase/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)/ },
          ],
        },
      },
    },
  },
})