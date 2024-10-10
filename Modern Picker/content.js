// content.js

// Example function to inject CSS into the current page
function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Example CSS styles */
      body {
        background-color: #f4f4f4;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Example function to log messages or perform actions
  function logMessage(message) {
    console.log('Content Script Message:', message);
  }
  
  // Inject CSS when the script runs
  injectCSS();
  
  // Listen for messages from background or popup scripts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'log') {
      logMessage(message.text);
    }
  });
  