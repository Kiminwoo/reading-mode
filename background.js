// background.js

// 확장 프로그램이 설치되거나 업데이트될 때 실행되는 이벤트 처리기
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      console.log('확장 프로그램이 설치되었습니다.');
      // 확장 프로그램 설치 시 초기 설정 수행
    } else if (details.reason === 'update') {
      console.log('확장 프로그램이 업데이트되었습니다.');
      // 확장 프로그램 업데이트 시 수행할 작업
    }
  });
  
  // 브라우저 액션(확장 프로그램 아이콘) 클릭 시 실행되는 이벤트 처리기
  chrome.action.onClicked.addListener((tab) => {

    console.log('확장 프로그램 아이콘이 클릭되었습니다.');

    // URL이 'chrome://'로 시작하는지 확인
    if (tab.url.startsWith('chrome://')) {
      console.warn('Cannot access a chrome:// URL');
      return; // 작업을 중단
    }
  
    // chrome:// URL이 아닌 경우에만 content script 실행
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/contentScript.js']
    }).then(() => {
      console.log('Reading mode enabled.');
    }).catch((error) => {
      console.error('Error executing script:', error);
    });
  });

  // 메시지를 처리하는 예시 (다른 스크립트와 통신할 때 사용)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'greet') {
      console.log('콘텐츠 스크립트로부터 인사 메시지를 받았습니다.');
      sendResponse({ response: '안녕하세요! 백그라운드에서 응답합니다.' });
    }
  });