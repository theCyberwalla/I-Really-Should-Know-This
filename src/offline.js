let registration = null;
export let offlineMessage = "Offline support is unavailable in this browser.";
function update() {
  const el = document.querySelector("#offline-status");
  if (el) el.textContent = offlineMessage;
  const waiting = registration?.waiting;
  let bar = document.querySelector("#offline-update");
  if (waiting && !bar) {
    bar = document.createElement("div");
    bar.id = "offline-update";
    bar.className = "storage-warning";
    bar.innerHTML =
      "A new offline edition is ready. <button>Load the new edition</button>";
    bar.querySelector("button").onclick = () => {
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => location.reload(),
        { once: true },
      );
      waiting.postMessage("ACTIVATE_ATLAS_UPDATE");
    };
    document.querySelector("header").after(bar);
  }
}
export const refreshOffline = update;
export async function startOffline() {
  if (!("serviceWorker" in navigator)) {
    update();
    return;
  }
  offlineMessage = "Downloading the offline edition…";
  update();
  try {
    registration = await navigator.serviceWorker.register("./sw.js");
    registration.addEventListener("updatefound", () => {
      registration.installing?.addEventListener("statechange", () => {
        setTimeout(update, 100);
      });
    });
    await navigator.serviceWorker.ready;
    offlineMessage =
      "Offline edition is installed. Lessons and your local trail work offline; external sources need a connection.";
    update();
  } catch {
    offlineMessage =
      "Offline download did not finish. Reconnect and reload to try again. Your learning records are stored separately.";
    update();
  }
}
