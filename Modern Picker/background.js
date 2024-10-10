// background.js
chrome.runtime.onInstalled.addListener(() => {
  // Check if info.html has been shown before
  chrome.storage.local.get(['infoShown'], (result) => {
    if (!result.infoShown) {
      // Open info.html in a new tab
      chrome.tabs.create({ url: chrome.runtime.getURL('info.html') });

      // Mark info.html as shown
      chrome.storage.local.set({ infoShown: true });
    }
  });
});

// Listener to reset infoShown flag (for development purposes)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'resetInfoShown') {
    chrome.storage.local.set({ infoShown: false });
  }
});
