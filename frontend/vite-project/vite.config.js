import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import daisyui from "daisyui";


export default defineConfig({
   theme: {
        extend: {
            animation: {
                'border': 'border 4s linear infinite',
            },
            keyframes: {
                'border': {
                    to: { '--border-angle': '360deg' },
                }
            }                      
        },
    },
  plugins: [
    tailwindcss(),
    

  ],
})