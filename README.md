# codyssey-tool-b1-1
AI 도구 학습 - B1-1: 나를 소개하는 웹페이지 처음부터 만들기
## 프로젝트 설명
- 라이브러리 없이, 순수 HTML/CSS/Javascript를 사용해 반응형 포트폴리오 웹사이트를 완성하는 과제
- 또한, Github API, Formspree API 등 외부 서비스와 연동하여 외부 API 호출시 발생하는 로딩/에러/성공 상태를 처리하는 경험을 기름
## 수행 항목 체크 리스트
- [x] 시맨틱 마크업을 사용한 HTML 구조
- CSS 스타일링
  - [x] 레이아웃 - 네비게이션(`Flexbox`), 프로젝트 카드(`Grid`)
  - [x] 반응형 디자인
  - [x] 시각효과
- Javascript
  - [x] `onclick`, `onerror` 등 속성 사용하지 않고 `addEventListener`로 이벤트 연결
  - [x] DOM 요소 조작
    - `querySelector`, `querySelectorAll`로 요소를 선택
    - `textContent`, `innerHTML`로 내용을 변경
    - `classList.add`, `remove`, `toggle`로 클래스를 조작
  - [x] 이벤트 처리
    - `click`, `submit`, `scroll`, `input` 이벤트를 다룸
    - `event.preventDefault()`로 기본 동작을 방지
- 인터랙션 구현
  - [x] 햄버거 메뉴 토글
  - [x] 부드러운 스크롤
  - [x] 스크롤 탑 버튼 (스크롤 300px 이상에서 버튼 등장(`SCROLL_TOP_BUTTON_VISIBLE_Y`))
  - [x] 네비게이션 스타일 변경 (스크롤 60px 이상에서 변경(`NAV_BACKGROUND_COLOR_CHANGE_Y`))
  - [x] 다크 모드
  - [x] 스크롤 애니메이션 (`IntersectionObserver` 임계값은 0.2로 설정(`{ threshold: 0.2 }`))
- [x] 컨택트 폼 UX
- [x] ES6+ 문법 & 배열 메서드
- [x] 비동기 처리 & API 연동
- [x] 상태 관리 패턴
    1. 다크 모드 토글 -> 테마 상태 변경(`state.theme`) -> 전체 화면 스타일 변경(`document`의 `data-theme` 속성값을 `state.theme`로 변경)
    2. 햄버거 메뉴 토글 -> 네비게이션 메뉴 상태 변경(`state.isMenuOpen`) -> 네비게이션 메뉴 표시/숨김
    3. CONTACT 폼 입력 -> 폼 상태 변경(`'blur'`, `'input'`) 및 유효성 검사(`validateField`) -> 에러 메세지 표시/숨김(`errorEl.textContent = message;`)
    4. CONTACT 폼 제출 -> 전송 성공 여부(`res.ok` 또는 에러 발생해 catch) 상태 변경 -> 성공 메시지/실패 메시지 표시(`formSuccess`/`formErrorGlobal`)
    5. Github API 호출 -> 로딩/성공/에러 상태 변경(`res.ok`) → Projects 섹션 렌더링 변경(`projectsGrid.innerHTML`)
    6. 필터 버튼 클릭 -> 필터 상태 변경(`state.activeFilter`) -> 프로젝트 목록 변경(`state.allProjects.filter(...)`)
- [x] 배포
- [x] (보너스) 프로젝트 필터링
- [x] (보너스) 타이핑 효과
- [x] (보너스) 폼 실제 전송
- [x] (보너스) 시스템 다크 모드 감지
## 사용 기술
- Javascript
- HTML5
- CSS3
- [Font Awesome 7.2.0](https://fontawesome.com/)
- [Google Fonts](https://fonts.google.com/)
- [Github Pages](https://docs.github.com/ko/pages)
## 배포
- Github Pages를 사용하여, 아래 링크로 배포하였음
- https://fromdance.github.io/codyssey-tool-b1-1/
## 스크린샷
### 데스크탑
#### 라이트 모드
![desktop-lightmode](./lightmode.png)
#### 다크 모드
![desktop-darkmode](./darkmode.png)
### 모바일
#### 라이트 모드
![mobile-lightmode](./mobile_lightmode.png)
#### 다크 모드
![mobile-darkmode](./mobile_darkmode.png)
