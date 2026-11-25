// Astro-integratie die het CMS toevoegt aan de devserver (`npm run cms` of `npm run dev`).
// Tijdens `astro build` doet deze integratie niets; het CMS komt dus nooit in dist/.
import { fileURLToPath } from 'node:url';
import { createHandler } from './server.mjs';

export default function cms() {
  let root;
  let log;
  return {
    name: 'pasquil-cms',
    hooks: {
      'astro:config:setup': ({ command, updateConfig, logger }) => {
        if (command !== 'dev') return;
        log = logger;
        updateConfig({
          vite: {
            server: { watch: { ignored: ['**/.cms-history/**', '**/dist/**'] } },
            plugins: [
              {
                name: 'pasquil-cms',
                enforce: 'post',
                configureServer(server) {
                  // Astro zet zijn eigen middleware (o.a. trailingSlash: 'always') in een post-hook vooraan;
                  // door hier ook een post-hook te gebruiken (na die van Astro) komt het CMS daarvóór.
                  return () => {
                    server.middlewares.stack.unshift({ route: '', handle: createHandler({ root, logger: log }) });
                    server.httpServer?.once('listening', () => {
                      const addr = server.httpServer.address();
                      if (addr && typeof addr === 'object') log.info(`CMS: http://localhost:${addr.port}/cms/`);
                    });
                  };
                },
              },
            ],
          },
        });
      },
      'astro:config:done': ({ config }) => {
        root = fileURLToPath(config.root);
      },
    },
  };
}
