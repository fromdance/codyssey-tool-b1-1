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
## 과제 목표
- HTML에서 `시맨틱 태그`를 왜 사용하는지 또한 본인이 어떤 기준으로 구조를 설계했는지 설명할 수 있다.
  - `시맨틱 태그`를 사용하는 이유: 태그 안의 내용이 어떤 것인지 태그 자체로 설명하는 의미론적 가치를 부여하므로써, `코드의 가독성`을 높이고, 검색 엔진이 검색 순위를 유의미하게 산정할 수 있도록 돕고, 스크린 리더를 사용하는 사용자가 페이지를 탐색하는 것을 도울 수 있기 때문 [#](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
- CSS에서 `Flexbox`와 `Grid`의 차이, 그리고 언제 각각을 선택해야 하는지 설명할 수 있다.
  - `Flexbox`: 항목을 행(또는 열)으로 배치하는 콘텐츠 중심의 1차원 레이아웃 방식. [#](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox)
    - `콘텐츠 중심`이므로, 컨테이너 내에서 콘텐츠가 차지하는 공간은 `콘텐츠의 크기`가 정함 (새로운 줄로 줄바꿈되는 경우엔 아이템 크기 + 해당 줄의 가용한 공간에 따라 조정)
    - 부모 요소 내의 콘텐츠 블록을 수직으로 중앙에 정렬할 때
    - 사용 가능한 너비/높이에 관계없이, 컨테이너 내 모든 자식요소가 가용한 너비/높이를 균등하게 차지하도록 할 때
    - 다중 열(column) 레이아웃에서, 각 열에 포함된 콘텐츠 양에 관계없이 모든 열의 높이를 동일하게 표시하려 할 때
  - `Grid`: 항목을 행과 열 모두를 고려해 배치하는 레이아웃 중심의 2차원 레이아웃 방식. [#](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids)
    - `레이아웃 중심`이므로, 레이아웃을 먼저 작성한 뒤 그 위에 아이템을 배치함
    - [fr](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/flex_value)이라는, '남은 그리드 컨테이너 공간 중 차지하는 비율'을 나타내는 특별한 단위를 제공하므로, 이러한 단위를 사용해 비율을 맞춰야 할 때
    - 행과 열, 둘 다 제어하여 요소들을 배치하려고 할 때([grid-template-columns](https://developer.mozilla.org/ko/docs/Web/CSS/Reference/Properties/grid-template-columns)와 [grid-template-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-rows)를 활용)
    - 다룰 요소 중 일부 또는 전체가 동일한 패턴을 반복하여 표시해야할 경우, 이를 좀 더 편하게 표현하려 할 때([repeat()](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts#track_listings_with_repeat_notation))
    - [repeat(auto-fit)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/repeat#auto-fit), [minmax](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/minmax)과 같은 요소를 활용해 반복되는 패턴을 반응형으로 표현하려 할 때
- `querySelector`로 DOM을 선택하고, `addEventListener`로 이벤트를 연결하는 흐름을 설명할 수 있다.
  - `querySelector()`/`querySelectorAll()`: 인자로 전달받은 `CSS 선택자(그룹)`에 일치하는 문서 내 `첫 번째 요소(또는 요소들)`을 반환하는 함수.
  - `addEventListener`: 요소를 나타내는 [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)의 메서드(정확히는 [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) 인터페이스의 메서드)로, 지정된 이벤트가 대상에 전달될 때마다 호출될 함수를 설정하는 메서드
    - `addEventListener`를 쓰는 이유
      - 하나의 이벤트에 대해 여러 개의 핸들러를 추가할 수 있음
        - `addEventListener`가 `EventTarget`의 이벤트 유형별 이벤트 리스너 목록에 `함수` 또는 `handleEvent() 함수를 구현하는 객체`를 추가하는 방식으로 동작하기 때문
          - 이때, 동일한 함수 또는 객체를 추가하려 하는 경우 추가되지 않음(단, 익명 함수의 경우 동일한 함수로 인식하지 않음)
      - `onXYZ`(ex. `onerror`) 속성을 사용하는 것과 달리, 리스너가 활성화되는 단계(캡처링, 버블링)를 세밀하게 제어할 수 있음
        - `option` 중 `capture` 옵션을 `true`로 줄 경우, DOM 트리 상에서 아래에 있는 `이벤트 타겟`에게 전달되기 전에 이 리스너에게 먼저 전달됨(캡처링) [#](https://ko.javascript.info/bubbling-and-capturing#ref-311)
        - 만약 해당 옵션을 주지 않았다면, 리스너는 `버블링 단계`에서 동작(리스너가 설정된 요소 및 그 하위 요소에서 이벤트 발생해, 위로 전파될 때 감지)
      - `HTML`, `SVG` 요소 뿐만 아니라, 모든 `Event Target`에 동작함([Document](https://developer.mozilla.org/en-US/docs/Web/API/Document), [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) 등)
- 화살표 함수, 구조분해 할당, 배열 메서드(map/filter)가 왜 필요하고 어떻게 사용하는지 설명할 수 있다.
  - `화살표 함수 표현식`
    - `ES6(ES2015)`에 등장한 문법으로, 기존 함수 표현식 대비 간결하게 함수를 선언할 수 있음
    - 또한, 다음과 같은 차이가 있음 (아래 내용은 화살표 함수의 특징) [#](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
      - `this`, `arguments`, `super`에 대한 바인딩을 가지지 않으며, 메서드로 사용되지 못함
        - `화살표 함수 표현식`의 경우, `this`가 바깥 context에 바인딩된 `this`를 따름(`렉시컬 바인딩`: 함수 선언 위치 기준으로 [클로저(함수와 그 함수를 둘러싼 상태)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) 지정) [#](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
        - 반면, `함수 표현식`은 `런타임 바인딩`임. 어떻게 정의되었는지 뿐만 아니라, 어떻게 호출되었는지에 따라 결정됨.
          ```javascript
          const abc = () => { console.log(this) };
          function fabc() {
              console.log(this);
          }
          const obj = { f: abc};
          const fobj = { f: fabc }
          obj.f(); // Window
          fobj.f(); // Object {f: Function}
          ```
          - 가령, 똑같이 `this`에 접근하는 함수 표현식이어도, *독립된 함수에서는* **전역 객체**를, *객체의 메서드로 호출될 때*는 **해당 객체**를 가리킴
          - [Function.call()], [Function.apply()]을 통해 특정 호출에 대한 `this`값을 설정하거나, [Function.bind()]를 통해 `this` 바인딩이 변경되지 않는 함수를 생성할 수 있음.
      - 생성자로 사용할 수 없음(즉, `new` 키워드와 함께 사용할 수 없음)
      - 함수 내에서 `yield` 키워드를 사용할 수 없고, 따라서 제너레이터 함수로 생성될 수 없음
    - 함수 선언은 호이스팅되어, 스코프 내 최상단 위치로 선언이 끌어올려짐.
      - `var`/`let`/`const`로 선언된 화살표 함수 역시 호이스팅 되지만, 실제 선언문에 도달하기 전에 함수를 호출할 경우 undefined 또는 에러 발생
    - 현재 코드에서는, `this` 바인딩을 이유로 `화살표 함수 표현식`을 사용함
      - 특히, **이벤트 리스너 함수**로 사용했는데, 이를 통해 `this`가 `이벤트를 트리거 하는 요소`가 아닌, 주변 범위의 `this`를 상속 받도록 함.
        - 이를 통해 `상태 객체(state)`, `변수로 선언해놓은 요소` 등 최상단 스코프에 선언된 객체들을 접근할 수 있음.
  - `구조분해 할당` [#](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring)
    - 배열의 `값`, 또는 객체의 `속성`을 개별 변수로 분리해 할당할 수 있게 해주는 구문
    - 데이터를 수신하는 위치(할당문의 `left value` 또는 새 식별자 바인딩 생성 위치)에서 사용할 수 있음
    - 현재 코드에서는, 객체 내에서 특정 프로퍼티를 추출해내어, 매번 참조할 프로퍼티가 있는 객체 이름을 앞에 붙이는 불편함을 덜음.
  - `배열 메서드`
    - 배열에는 [map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) 등 다양한 인스턴스 메서드를 갖고 있음.
      - `map(callbackFn)`
        - 배열 내 요소들에 대해, 지정된 함수를 호출한 결과를 담아 새로운 배열을 생성
      - `filter(callbackFn)`
        - 배열 내 요소들에 대해, 제공된 `함수(callbackFn)`가 구현하는 조건을 충족하는 요소만 선별한 `얕은 복사본`을 생성
      - `reduce(callbackFn)`
        - 배열 내 요소들에 대해, 지정된 `리듀서 함수`를 순서대로 실행하여, 이전 요소에 대한 계산 결과 값을 매개변수로 전달하며 연산을 실행한 결과값을 생성
    - 이러한 구문을 사용하면, 해당 로직들을 직접 구현하는 불편함을 덜 수 있고, 코드 가독성도 더 높일 수 있음.
- `fetch`와 `async/await`로 비동기 데이터를 가져오고, 로딩/성공/실패 상태를 UI로 어떻게 표현했는지 설명할 수 있다.
  - 비동기로 데이터 불러오기
    - 현재 코드에서는 `fetch()`를 사용해 `Github API`, `Formspree` 등 외부 API와 통신하고 있음
    - `fetch` [#](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
      - 기존에 Javascript 기반의 비동기 통신 API였던 [XHR(XMLHttpRequest)](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API)를 대체하는 API로, `이벤트` 기반의 `XHR`와 달리, `Promise`를 사용하며, `CORS`와 같은 고급 기능을 제공함
        - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise): `Promise`가 생성될 당시, 알려지지 않았을 수도 있는 값을 나타내는 프록시 객체. 당장 값을 반환할 수 없는 비동기 메서드들은 최종 값을 즉시 반환하는 대신, 미래의 어느 한 시점에서 결과 값을 제공할 `Promise`를 대신 반환함.
          ```javascript
          const myPromise = new Promise((resolve, reject) => {
            ...
            if(error) reject("error");
            else resolve("abc");
          });
          ```
          - `Promise`는 `Pending(보류중)`, `Fufilled(승인됨)`, `Rejected(거부됨)` 세 가지 상태를 가지며, 값이 반환된 경우는 `Fulfilled(Promise.then())`, 거절된 경우 이유와 함께 `Rejected(Promise.then().catch())` 됨.
    - `async/await` [#](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
      - ES2018에서 도입된 문법으로, 여러 `Promise`간의 흐름을 순서대로, 즉 동기적인 순서로 진행하는 함수를 만들 수 있음
        - `new Promise(...)` 내부의 코드는 `Promise`가 생성됨과 동시에 실행되므로, 기존의 코드로는 이러한 순서를 지키는게 거의 불가능함.
      - `async function`은 0개 이상의 `await` 키워드를 포함할 수 있는데, `await`가 달린 `Promise`를 만나게 되면, 해당 `Promise`가 이행/거부될 때까지 함수 실행을 일시 중단하며, 처리가 된 뒤 다시 진행함.
    - 현재 코드에서는, `요청 전송 -> 결과 수신 -> 결과를 바탕으로 성공/실패 UI 갱신` 을 위해 `fetch` 및 `async/await` 구문을 사용함
- "하나의 기능"을 만들기 위해 이벤트 → 상태 변경 → DOM 업데이트가 어떻게 연결되는지 설명할 수 있다. (React의 상태-렌더링 흐름의 기초)
  1. DOM 요소들과 유저의 상호작용으로 `click`, `keydown` 등의 이벤트가 발생한다.
  2. 해당 DOM 요소에, 해당 이벤트 발생시 트리거되는 이벤트 리스너가 동작한다.
  3. 이벤트 리스너는 Javascript 변수로 관리되는 상태 값을 변경시킨다.
  4. 변경된 상태값을 기반으로 DOM을 업데이트 하는 코드들을 실행한다.
     1. DOM의 클래스를 업데이트시켜, CSS 스타일 값이 변하게 한다.
        ```javascript
        ...
        navMenu.classList.add('active');
        ``` 
     2. `innerHTML`, `textContent` 등의 요소를 수정하여 DOM 내용을 직접 변경한다.
        ```javascript
        ...
        if (isDeleting) {
          // 삭제 중
          typingText.textContent = current.slice(0, charIndex - 1).join('');
          charIndex--;
        }
        ...
        ```