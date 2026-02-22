self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', (event) => {
  // A simple fetch handler is enough to satisfy the PWA requirements for Chrome
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("Offline", { status: 503 });
    })
  );
});
