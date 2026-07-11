import { createServer } from 'vite';
(async () => {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  const module = await server.ssrLoadModule('/src/firebase.ts');
  console.log("module", module);
  await server.close();
})();
