self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
});

self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated!");
});
