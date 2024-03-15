// Get the DOM element with ID "buttonInstall" and store it in the `install` variable
const install = document.getElementById("buttonInstall");

// Event listener for the `beforeinstallprompt` event
window.addEventListener("beforeinstallprompt", (event) => {
  // Store the triggered events in the `window.deferredPrompt` variable
  window.deferredPrompt = event;

  // Show the install button by removing the "hidden" class
  install.classList.toggle("hidden", false);
});

// Click event listener for the install button
install.addEventListener("click", async () => {
  // Get the deferred prompt event from the `window.deferredPrompt` variable
  const promptEvent = window.deferredPrompt;

  // Check if the prompt event exists
  if (!promptEvent) {
    return;
  }

  // Show the installation prompt
  promptEvent.prompt();

  // Reset the deferred prompt variable to null as it can only be used once
  window.deferredPrompt = null;

  // Hide the install button by adding the "hidden" class
  install.classList.toggle("hidden", true);
});

// Event listener for the `appinstalled` event
window.addEventListener("appinstalled", (event) => {
  // Clear the deferred prompt variable when the app is successfully installed
  window.deferredPrompt = null;
});
