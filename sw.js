// this

// self
//2

const cacheVersion = 4

const activeCaches = {
  sabzlearn : `sabzlearn-v${cacheVersion}`
}

self.addEventListener("install", (event) => {
  console.log("Service Worker Installed Successfully", event);
  self.skipWaiting();

  event.waitUntil(
    // الان تمام این ایونت باید انجام بشه و دوباره میره سراغ اینوت هایی مثل اکتیویت و فچ
    caches.open(activeCaches.sabzlearn).then((cache) => {
      // console.log('Cached done successfully')
      // cache.add('js/app.js')
      // cache.add('js/code.js')
      // cache.add('css/style.css')

      cache.addAll([
        "/",
        "js/script.js",
        "js/app.js",
        "js/code.js",
        "css/style.css",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("service activated successfully", event);
  const activeCatchNames = Object.values(activeCaches)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.forEach(cacheName => {
          if(!activeCatchNames.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
});

self.addEventListener("fetch", (event) => {
  //به ازای هرفایل css js و غیره این event یکبار فراخوانی میشود.
  console.log(event.request);
  //   event.respondWith(fetch(event.request));
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});
















