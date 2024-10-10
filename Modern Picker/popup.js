document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    const colorHistory = document.getElementById('colorHistory');
    const okButton = document.getElementById('okButton');
    const formatSelect = document.getElementById('formatSelect');
    const themeToggle = document.getElementById('themeToggle');
    const deleteAllButton = document.getElementById('deleteAllButton');
    const copyNotification = document.getElementById('copyNotification');
    const selectedColorBlock = document.getElementById('selectedColorBlock');
    const selectedColorCode = document.getElementById('selectedColorCode');
    const copyColorButton = document.getElementById('copyColorButton');
  
    // Initialize dark mode based on previous user settings
    chrome.storage.sync.get('darkMode', (data) => {
      if (data.darkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
      } else {
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
      }
    });
  
    // Handle dark mode toggle
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const darkModeEnabled = document.body.classList.contains('dark-mode');
      chrome.storage.sync.set({ 'darkMode': darkModeEnabled });
  
      if (darkModeEnabled) {
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
      } else {
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
      }
    });
  
    // Update the selected color display
    const updateSelectedColorDisplay = (color) => {
      selectedColorBlock.style.backgroundColor = color;
      selectedColorCode.textContent = color;
    };
  
    // Update color history with selected color
    const updateHistory = (color) => {
      const colorItem = document.createElement('div');
      colorItem.classList.add('color-history-item');
  
      const colorBlock = document.createElement('div');
      colorBlock.classList.add('color-block');
      colorBlock.style.backgroundColor = color;
  
      const colorCode = document.createElement('div');
      colorCode.classList.add('color-code');
      colorCode.textContent = color;
  
      const copyIcon = document.createElement('i');
      copyIcon.classList.add('fas', 'fa-copy', 'icon');
      copyIcon.addEventListener('click', () => {
        navigator.clipboard.writeText(color).then(() => {
          showCopyNotification(color);
        });
      });
  
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fas', 'fa-trash-alt', 'icon');
      deleteIcon.addEventListener('click', () => {
        colorItem.remove();
        saveHistoryToStorage(); // Update storage after removing an item
      });
  
      colorItem.appendChild(colorBlock);
      colorItem.appendChild(colorCode);
      colorItem.appendChild(copyIcon);
      colorItem.appendChild(deleteIcon);
      colorHistory.appendChild(colorItem);
    };
  
    // Display popup notification when color is copied
    const showCopyNotification = (colorCode) => {
      copyNotification.textContent = `Color ${colorCode} copied!`;
      copyNotification.style.display = 'block';
      setTimeout(() => {
        copyNotification.style.display = 'none';
      }, 2000);
    };
  
    // Format the color according to the selected format
    const formatColor = (color, format) => {
      switch (format) {
        case 'rgb':
          return hexToRgb(color);
        case 'hsl':
          return hexToHsl(color);
        case 'hsv':
          return hexToHsv(color);
        case 'hsb':
          return hexToHsb(color);
        case 'hwb':
          return hexToHwb(color);
        case 'cmyk':
          return hexToCmyk(color);
        case 'ncol':
          return hexToNcol(color);
        case 'cielab':
          return hexToCielab(color);
        case 'ciexyz':
          return hexToCiexyz(color);
        case 'veca':
          return hexToVeca(color);
        case 'decimal':
          return hexToDecimal(color);
        case 'hexint':
          return hexToHexInt(color);
        case 'hex':
        default:
          return color;
      }
    };
  
    // Conversion functions for all formats
    const hexToRgb = (hex) => {
      // Convert HEX to RGB format
      let bigint = parseInt(hex.slice(1), 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;
      return `rgb(${r}, ${g}, ${b})`;
    };
  
    const hexToHsl = (hex) => {
      // Convert HEX to HSL format
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      let max = Math.max(r, g, b);
      let min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };
  
    const hexToHsv = (hex) => {
      // Convert HEX to HSV format
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      let max = Math.max(r, g, b);
      let min = Math.min(r, g, b);
      let h, s, v = max;
      let d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return `hsv(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
    };
  
    const hexToHsb = (hex) => hexToHsv(hex); // HSB is often synonymous with HSV
  
    const hexToHwb = (hex) => {
      // Convert HEX to HWB format
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      let max = Math.max(r, g, b);
      let min = Math.min(r, g, b);
      let h = hexToHsl(hex).split(',')[0].split('(')[1];
      let w = min;
      let bl = 1 - max;
      return `hwb(${h}, ${Math.round(w * 100)}%, ${Math.round(bl * 100)}%)`;
    };
  
    const hexToCmyk = (hex) => {
      // Convert HEX to CMYK format
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      let k = 1 - Math.max(r, g, b);
      let c = (1 - r - k) / (1 - k) || 0;
      let m = (1 - g - k) / (1 - k) || 0;
      let y = (1 - b - k) / (1 - k) || 0;
      return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
    };
  
    const hexToNcol = (hex) => {
      // Convert HEX to ncol format (this is a placeholder function)
      return hex; // Implement this based on specific requirements
    };
  
    const hexToCielab = (hex) => {
      // Convert HEX to CIELAB format (this is a placeholder function)
      return hex; // Implement this based on specific requirements
    };
  
    const hexToCiexyz = (hex) => {
      // Convert HEX to CIEXYZ format (this is a placeholder function)
      return hex; // Implement this based on specific requirements
    };
  
    const hexToVeca = (hex) => {
      // Convert HEX to VECA format (this is a placeholder function)
      return hex; // Implement this based on specific requirements
    };
  
    const hexToDecimal = (hex) => {
      // Convert HEX to Decimal format
      return parseInt(hex.slice(1), 16);
    };
  
    const hexToHexInt = (hex) => {
      // Convert HEX to Hex Int format
      return parseInt(hex.slice(1), 16).toString(16).toUpperCase();
    };
  
    // Handle OK button click to update color history and display selected color
    okButton.addEventListener('click', () => {
      const selectedColor = colorPicker.value;
      const selectedFormat = formatSelect.value;
      const formattedColor = formatColor(selectedColor, selectedFormat);
  
      // Update the display of the selected color
      updateSelectedColorDisplay(formattedColor);
  
      // Update history with the selected color
      updateHistory(formattedColor);
      saveHistoryToStorage(); // Save to storage after updating
    });
  
    // Handle copy color button click
    copyColorButton.addEventListener('click', () => {
      const colorCode = selectedColorCode.textContent;
      navigator.clipboard.writeText(colorCode).then(() => {
        showCopyNotification(colorCode);
      });
    });
  
    // Handle delete all button click
    deleteAllButton.addEventListener('click', () => {
      colorHistory.innerHTML = '';
      saveHistoryToStorage(); // Clear storage when deleting all
    });
  
    // Save color history to Chrome storage
    const saveHistoryToStorage = () => {
      const historyItems = [];
      document.querySelectorAll('.color-history-item').forEach(item => {
        const colorCode = item.querySelector('.color-code').textContent;
        historyItems.push(colorCode);
      });
      chrome.storage.sync.set({ colorHistory: historyItems });
    };
  
    // Load color history from Chrome storage
    const loadHistoryFromStorage = () => {
      chrome.storage.sync.get('colorHistory', (data) => {
        if (data.colorHistory) {
          data.colorHistory.forEach(color => {
            updateHistory(color);
          });
        }
      });
    };
  
    loadHistoryFromStorage(); // Load history on startup
  });
  