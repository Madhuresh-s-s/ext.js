document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("toggleProtection");
  const statusMessage = document.getElementById("status-message");
  let screenStream = null; // 🔴 To track the screen sharing stream
  const exitPassword = "secure123"; // ✅ Password for disabling protection

  chrome.storage.local.get("protectionStatus", (data) => {
    updateButtonState(data.protectionStatus || "inactive");
  });

  button.addEventListener("click", function () {
    chrome.storage.local.get("protectionStatus", (data) => {
      const currentStatus = data.protectionStatus || "inactive";

      if (currentStatus === "active") {
        // 🛑 Prompt for password before disabling
        const userInput = prompt("Enter password to disable protection:");

        if (userInput === exitPassword) {
          chrome.storage.local.set({ protectionStatus: "inactive" }, () => {
            updateButtonState("inactive");
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: stopScreenShare
              });
            });
            alert("Protection disabled.");
          });
        } else {
          alert("Incorrect password. Protection remains active.");
        }
      } else {
        // ✅ Enable protection without password
        chrome.storage.local.set({ protectionStatus: "active" }, () => {
          updateButtonState("active");
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: triggerScreenShare
            });
          });
        });
      }
    });
  });

  // ✅ Trigger screen sharing and enforce fullscreen
  function triggerScreenShare() {
    navigator.mediaDevices.getDisplayMedia({
      video: { cursor: "always" },
      audio: false
    }).then((stream) => {
      console.log("Screen sharing started");
      window.screenStream = stream; // 🔴 Save the stream globally

      // Enforce fullscreen
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen failed:", err);
      });

      // Stop sharing if user manually stops from the browser UI
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        console.log("Screen sharing stopped by user");
        document.exitFullscreen();
        chrome.storage.local.set({ protectionStatus: "inactive" });
        updateButtonState("inactive");
      });
    }).catch((err) => {
      console.error("Screen sharing was canceled or failed:", err);
    });
  }

  // 🛑 Stop screen sharing and exit fullscreen
  function stopScreenShare() {
    if (window.screenStream) {
      window.screenStream.getTracks().forEach(track => track.stop());
      window.screenStream = null;
      console.log("Screen sharing stopped by extension");
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
      console.log("Fullscreen exited");
    }
  }

  // 🔄 Update button and status message
  function updateButtonState(status) {
    if (status === "active") {
      button.textContent = "Disable Protection";
      button.classList.remove("inactive");
      button.classList.add("active");
      statusMessage.textContent = "Protection is active.";
    } else {
      button.textContent = "Enable Protection";
      button.classList.remove("active");
      button.classList.add("inactive");
      statusMessage.textContent = "Protection is disabled.";
    }
  }
});
