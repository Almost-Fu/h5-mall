import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import pxToViewport from 'postcss-px-to-viewport-8-plugin';
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    },
    css: {
        postcss: {
            plugins: [
                pxToViewport({
                    viewportWidth: 375,
                    unitPrecision: 5,
                    viewportUnit: 'vw',
                    selectorBlackList: ['.ignore', '.hairlines'],
                    minPixelValue: 1,
                    mediaQuery: false,
                    exclude: [/node_modules\/vant/]
                })
            ]
        }
    }
});
