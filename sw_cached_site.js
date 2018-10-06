const cacheName = 'v3';

// Call Install Event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
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
    fetch(event.request)
      .then(res => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cache
        caches
          .open(cacheName)
          .then(cache => {
            // Add response to cache
            cache.put(event.request, resClone);
          });
          return res;
      }).catch(error => caches.match(event.request).then(res => res))
  );
});