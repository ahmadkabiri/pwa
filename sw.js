// Imports
importScripts("/js/dexie.js");
importScripts("/js/db.js");

// Utils
const limitInCache = (key, size) => {
  caches.open(key).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitInCache(key, size));
      }
    });
  });
};

// Service Worker Codes
const cacheVersion = 2;

const activeCaches = {
  static: `static-v${cacheVersion}`,
  dynamic: `dynamic-v${cacheVersion}`,
};

self.addEventListener("install", (event) => {
  console.log("Service Worker Installed Successfully :))");

  event.waitUntil(
    caches.open(activeCaches["static"]).then((cache) => {
      cache.addAll([
        "/",
        "/fallback.html",
        "js/script.js",
        "js/app.js",
        "js/code.js",
        "css/style.css",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated Successfully :))");

  const activeCacheNames = Object.values(activeCaches);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.forEach((cacheName) => {
          if (!activeCacheNames.includes(cacheName)) {
            return caches.delete(cacheName); // :))
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const urls = ["https://redux-cms.iran.liara.run/api/courses"];

  if (urls.includes(event.request.url)) {
    return event.respondWith(
      fetch(event.request).then((response) => {
        const clonedResponse = response.clone();
        clonedResponse.json().then((data) => {
          for (let course of data) {
            db.courses.put(course);
          }
        });
        return response;
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then((serverResponse) => {
              return caches.open([activeCaches["dynamic"]]).then((cache) => {
                cache.put(event.request, serverResponse.clone());
                return serverResponse;
              });
            })
            .catch((err) => {
              return caches.match("/fallback.html");
            });
        }
      })
    );
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "add-new-course") {
    console.log("Event =>", event);
    console.log("Tag =>", event.tag);
    createNewCourse();
  } else if (event.tag === "remove-course") {
    // Delete Request
  }
});

function createNewCourse() {
  // Post Request - fetch => Body => request body

  db.syncCourses.toArray().then((data) => {
    data.forEach(async (course) => {
      const res = await fetch("https://redux-cms.iran.liara.run/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: course.title,
          price: 0,
          category: "فرانت اند",
          registersCount: 30000,
          discount: 100,
          desc: "جاوا اسکریپت یکی از محبوب ترین زبان های برنامه نویسی در دنیا که در حوزه های مختلفی همچون وب اپلیکیشن ها و برنامه های موبایل و برنامه های برای سیسنم عامل ویندوز استفاده میشود ",
        }),
      });

      if (res.status === 201) {
        db.syncCourses
          .where({ title: course.title })
          .delete()
          .then(() =>
            console.log("Course removed successfully from indexedDB :))")
          )
          .catch((err) => console.log("Error in remove course =>", err));
      }
    });
  });

  console.log("Course Created Successfully :))");
}
