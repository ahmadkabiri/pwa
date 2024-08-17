if ("serviceWorker" in navigator) {
  console.log("Support");
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("registered", reg))
    .catch(err => console.log(err))
} else {
  console.log("not support");
}
