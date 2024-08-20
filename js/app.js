// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((regiter) => {
      console.log("Registered Successfylly => ", regiter);
    })
    .catch((err) => console.log(err));
} else {
  console.log("Not Support");
}

// Dom Manipulation

const addCourseBtn = document.querySelector(".add-course");

const fetchCourse = async () => {
  try {
    const res = await fetch("https://redux-cms.iran.liara.run/api/courses");
    const data = await res.json();

    return data;
  } catch (err) {
    const data = await db.courses.toArray();
    return data;
  }
};

const createUi = (items) => {
  const coursesParent = document.querySelector("#courses-parent");
  console.log("courses =>", items);
  items.forEach((item) => {
    coursesParent.insertAdjacentHTML(
      "beforeend",
      `
        <div class="col">
          <div class="card" style="width: 18rem">
            <img
              src="/assets/images/post02.png"
              class="card-img-top"
              alt="Course Cover"
            />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
    `
    );
  });
};

const addNewCourse = () => {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then((sw) => {
      const newCourse = {
        title: "Node.js Expert",
      };

      db.syncCourses
        .put(newCourse)
        .then((data) =>
          console.log("New course info inserted successfully :)) =>", data)
        )
        .catch((err) => console.log("Err =>", err));

      return sw.sync
        .register("add-new-course")
        .then(() => console.log("Task added successfully :))"))
        .catch((err) => console.log("Error =>", err));
    });
  } else {
    // Fetch
  }
};

const notificationPermissionState = async () => {
  if (navigator.permissions) {
    let result = await navigator.permissions.query({ name: "notifications" });
    return result.state;
  }
};

const showNotification  = () => {
  new Notification('Notification Title',{
    body : "Notification Body :))"
  })
}

const getNotificationPermission = async () => {
  // Way 1
  Notification.requestPermission().then((result) => {
    // granted ✅
    // denied ❌
    if (result === "granted") {
      console.log("دسترسی داده شد");
      showNotification()

    } else if (result === "denied") {
      console.log("دسترسی داده نشد");
    }
  });

  // Way 2
  // const notificationPermission = Notification.permission;
  // console.log("Notification Permission =>", notificationPermission);

  // Way 3
  // const notificationPermission = await notificationPermissionState();
  // console.log("Notification Permission =>", notificationPermission);
};

addCourseBtn.addEventListener("click", addNewCourse);

window.addEventListener("load", async () => {
  const courses = await fetchCourse();
  getNotificationPermission();
  createUi(courses);
});
