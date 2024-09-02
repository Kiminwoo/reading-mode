import React, { useState } from 'react';

// CSS-in-JS 스타일 객체 정의
const styles = {
  popupContainer: {
    width: '300px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd'
  },
  popupTitle: {
    margin: '0 0 15px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  popupButton: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  popupButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.02)',
  },
  sliderContainer: {
    width: '100%',
    margin: '15px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sliderLabel: {
    marginBottom: '8px',
    fontSize: '15px',
    color: '#444',
  },
  slider: {
    width: '100%',
    WebkitAppearance: 'none',
    height: '5px',
    background: '#ddd',
    borderRadius: '5px',
    outline: 'none',
    opacity: 0.8,
    transition: 'opacity 0.2s',
  },
  sliderThumb: {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '15px',
    height: '15px',
    background: '#007bff',
    cursor: 'pointer',
    borderRadius: '50%',
  },
};

const Popup = () => {
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  const handleReadingMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
  
      if (activeTab.url.startsWith('chrome://')) {
        alert('This extension cannot be used on chrome:// pages.');
        return;
      }
  
      // Reading mode를 활성화하거나 비활성화하는 스크립트 주입
      if (!readingMode) {
        // Reading Mode 활성화 - 광고 및 팝업 요소를 숨김
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => {
            const adSelectors = [
              'iframe[src*="ads"]',
              'div[class*="ad"]',
              'div[id*="ad"]',
              'div[class*="banner"]',
              'div[class*="sponsored"]',
              'div[class*="promo"]',
              'div[class*="pop-up"]',
              'aside',
              'object',
              'embed[src*="ads"]'
            ];
  
            const popupSelectors = [
              'div[class*="popup"]',
              'div[class*="modal"]',
              'div[class*="overlay"]',
              'div[id*="overlay"]',
              'div[class*="notification"]'
            ];
  
            // 광고와 팝업 요소 숨기기
            const allSelectors = [...adSelectors, ...popupSelectors];
            allSelectors.forEach((selector) => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(el => {
                el.style.display = 'none';  // 요소 숨기기
                el.setAttribute('data-hidden-by-extension', 'true'); // 복구를 위해 속성 추가
              });
            });
          }
        }).then(() => {
          console.log('Reading mode enabled.');
          setReadingMode(true);
        }).catch((error) => {
          console.error('Error enabling reading mode:', error);
        });
      } else {
        // Reading Mode 비활성화 - 숨겨진 요소 다시 표시
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => {
            // 숨겨진 광고와 팝업 요소 다시 표시
            const hiddenElements = document.querySelectorAll('[data-hidden-by-extension="true"]');
            hiddenElements.forEach(el => {
              el.style.display = ''; // 원래의 display 상태로 복원
              el.removeAttribute('data-hidden-by-extension'); // 임시 속성 제거
            });
          }
        }).then(() => {
          console.log('Reading mode disabled.');
          setReadingMode(false);
        }).catch((error) => {
          console.error('Error disabling reading mode:', error);
        });
      }
    });
  };

  const handleFontSizeChange = (newFontSize) => {
    setFontSize(newFontSize);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (activeTab.url.startsWith('chrome://')) {
        alert('This extension cannot be used on chrome:// pages.');
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (size) => {
          document.body.style.fontSize = `${size}px`;

          const textElements = document.querySelectorAll('p, span, div, a, li, h1, h2, h3, h4, h5, h6');
          textElements.forEach(el => {
            el.style.fontSize = `${size}px`;
          });
        },
        args: [newFontSize]
      }).then(() => {
        console.log('Font size updated to:', newFontSize);
      }).catch((error) => {
        console.error('Error updating font size:', error);
      });
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (activeTab.url.startsWith('chrome://')) {
        alert('This extension cannot be used on chrome:// pages.');
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (enableDarkMode) => {
          if (enableDarkMode) {
            const style = document.createElement('style');
            style.id = 'dark-mode-style';
            style.textContent = `
              body {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
              }
              p, span, div, a, li, h1, h2, h3, h4, h5, h6 {
                color: #e0e0e0 !important;
              }
              img {
                filter: brightness(0.8) !important;
              }
            `;
            document.head.appendChild(style);
          } else {
            const existingStyle = document.getElementById('dark-mode-style');
            if (existingStyle) existingStyle.remove();
          }
        },
        args: [!darkMode]
      }).then(() => {
        console.log(`Dark mode ${darkMode ? 'disabled' : 'enabled'}.`);
      }).catch((error) => {
        console.error('Error toggling dark mode:', error);
      });
    });
  };

  return (
    <div style={styles.popupContainer}>
      <h1 style={styles.popupTitle}>Reading Mode Enhancer</h1>
      <button
        style={styles.popupButton}
        onClick={handleReadingMode}>
        {readingMode ? 'Disable Reading Mode' : 'Enable Reading Mode'}
      </button>
      <div style={styles.sliderContainer}>
        <label style={styles.sliderLabel}>Font Size: {fontSize}px</label>
        <input
          style={styles.slider}
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
        />
      </div>
      <button
        style={styles.popupButton}
        onClick={toggleDarkMode}>
        {darkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
      </button>
    </div>
  );
};

export default Popup;