function enforceFullscreen() {
  chrome.windows.getCurrent({}, (win) => {
    if (chrome.runtime.lastError) {
      console.error("Error getting current window:", chrome.runtime.lastError);
      return;
    }

    chrome.windows.update(win.id, {
      state: "fullscreen"
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error enforcing fullscreen:", chrome.runtime.lastError);
      }
    });
  });
}

// Prevent Resize
window.addEventListener("resize", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error("Fullscreen request failed:", err);
    });
  }
});

// Force fullscreen on page load
document.documentElement.requestFullscreen().catch(err => {
  console.error("Fullscreen request failed:", err);
});
