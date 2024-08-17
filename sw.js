// this

// self
//2


self.addEventListener("install",(event) => {
    console.log('Service Worker Installed Successfully',event);
    self.skipWaiting()
})

self.addEventListener("activate", event => {
    console.log('service activated successfully',event)
})


self.addEventListener('fetch',event => {
    console.log(event)
})










