
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');

  // Use Supabase project config directly instead of env variables
  const SUPABASE_URL = 'https://swmxqjdvungochdjvtjg.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXhxamR2dW5nb2NoZGp2dGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTMzOTYsImV4cCI6MjA2NTY2OTM5Nn0.RqmWdYj-_LCfRr2l6xYJIsCDhWUAUl2ho_-KrUp1igc';

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Evitar conflitos de minificação
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // Melhorar compatibilidade
      target: 'es2015',
      // Evitar problemas com chunks grandes
      rollupOptions: {
        output: {
          manualChunks: {
            'supabase': ['@supabase/supabase-js'],
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          },
        },
      },
    },
    // Configurações para evitar cache em desenvolvimento
    optimizeDeps: {
      include: ['@supabase/supabase-js'],
      force: mode === 'development',
    },
    define: {
      // Use direct Supabase project configuration
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
      'import.meta.env.VITE_APP_URL': JSON.stringify(env.VITE_APP_URL || ''),
      'import.meta.env.MODE': JSON.stringify(mode),
    },
  };
});
