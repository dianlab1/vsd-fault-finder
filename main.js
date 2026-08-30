if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

document.querySelectorAll(".categories").forEach((row) => {
  row.addEventListener("click", (event) => {
    const target = event.target.closest("[data-cat]");
    if (!target) return;

    if (target.dataset.cat === "drive") {
      window.location.href = "drives.html";
    } else if (target.dataset.cat === "comp") {
      window.location.href = "compressors.html";
    } else if (target.dataset.cat === "motor") {
      window.location.href = "motors.html";
    }
  });
});
