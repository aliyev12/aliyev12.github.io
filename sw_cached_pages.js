const cacheName = 'v1';

// Caching pages and assets individually:
const cacheAssets = [
  'index.html',
  'about.html',
  'blog.html',
  'contact.html',
  'services.html',
  '/css/style.css',
  'main.js'
];

// Call Install Event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');

  event.waitUntil(
    caches
    .open(cacheName)
    .then(cache => {
      console.log('Service Worker: Caching Files');
      cache.addAll(cacheAssets);
    })
    .then(() => {
      self.skipWaiting()
    })
  );
});

// Call activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Remove unwanter caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      )
    })
  );
});

//Call Fetch Event
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching');
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
})