// `npm run cms`: start de Astro-devserver en open het CMS in de browser.
import { dev } from 'astro';

const root = new URL('..', import.meta.url);
const server = await dev({ root, server: { open: '/cms/' } });

const stop = async () => {
  await server.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
