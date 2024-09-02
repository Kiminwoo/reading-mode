(function() {
    // const elementsToRemove = document.querySelectorAll('aside, .ads, .popup, [id*="ad"]');
    // elementsToRemove.forEach(el => el.remove());
  
    // document.body.style.maxWidth = '800px';
    // document.body.style.margin = '0 auto';
    // document.body.style.lineHeight = '1.6';
    // document.body.style.fontSize = '18px';
  
    // 추가적인 사용자 정의 스타일 적용

    const contentContainer = document.querySelector('.main-content'); // 콘텐츠 컨테이너의 클래스 이름
    if (contentContainer) {
      contentContainer.classList.add('reading-mode-style');
    }

  })();