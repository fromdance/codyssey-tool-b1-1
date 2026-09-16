'use strict';

/* ============================================
   0. 상태 관리 (State)
   ============================================ */
const state = {
  theme: 'light',       // 현재 테마
  allProjects: [],      // GitHub API 원본 데이터
  activeFilter: 'all',  // 현재 필터
  isMenuOpen: false,    // 햄버거 메뉴 상태
};

// 상수 값들
const SCROLL_TOP_BUTTON_VISIBLE_Y = 300;
const NAV_BACKGROUND_COLOR_CHANGE_Y = 60;

/* ============================================
   1. DOM 요소 캐싱
   ============================================ */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const header        = $('#header');
const hamburger     = $('#hamburger');
const navMenu       = $('#navMenu');
const themeToggle   = $('#themeToggle');
const themeIcon     = $('#themeIcon');
const projectsGrid  = $('#projectsGrid');
const projectFilters= $('#projectFilters');
const contactForm   = $('#contactForm');
const submitBtn     = $('#submitBtn');
const formSuccess   = $('#formSuccess');
const formErrorGlobal = $('#formErrorGlobal');
const scrollTopBtn  = $('#scrollTop');
const typingText    = $('#typingText');
const yearEl        = $('#year');

/* ============================================
   2. 연도 자동 업데이트
   ============================================ */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================
   3. 다크모드 - 시스템 설정 감지 + 토글
   ============================================ */
function initTheme() {
  // 1) 저장된 설정 우선, 없으면 시스템 설정 감지
  const saved = localStorage.getItem('theme');
  // prefers-color-scheme: css 미디어 쿼리 속성 중 하나로,
  // 사용자의 OS 설정 또는 User-Agent 설정에서 light 또는 dark 테마 중 어느것을 요청했는지 감지하는데 사용됨
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ?? (prefersDark ? 'dark' : 'light');

  applyTheme(initial);

  // 2) 시스템 테마 변경 실시간 감지 (저장된 설정 없을 때만)
  // Window.matchMedia(): 주어진 미디어쿼리 문자열에 대해, 해당 값이 일치하는지 및 변경 감지를 확인할 수 있는
  // `MediaQueryList` 객체를 반환하는 메서드
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        // e.matches, 즉 현재 사용자의 설정이 `prefers-color-scheme: dark`와 동일한 경우
        // 다크 모드로 설정, 그렇지 않은 경우 라이트 모드로 설정
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);

  // 아이콘 교체
  themeIcon.className = theme === 'dark'
    ? 'fa-solid fa-sun'
    : 'fa-solid fa-moon';
}

themeToggle.addEventListener('click', () => {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  // 수동 변경 시 localStorage에 저장
  localStorage.setItem('theme', next);
});

/* ============================================
   4. 헤더 스크롤 효과
   ============================================ */
function initScrollHeader() {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > NAV_BACKGROUND_COLOR_CHANGE_Y);
    scrollTopBtn.classList.toggle('visible', window.scrollY > SCROLL_TOP_BUTTON_VISIBLE_Y);
  };
  // `passive: true`: 터치 및 스크롤 이벤트 리스너에서 preventDefault를 절대 호출하지 않음을 나타내는 옵션
  // 이를 통해, 기존에 이벤트 리스너에서 스크롤을 취소할지 모르므로 브라우저가 항상 이벤트 리스너가 완료되는 것을 기다린 뒤
  // 스크롤을 처리하던 것을 방지
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================
   5. 스크롤 탑 버튼
   ============================================ */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   6. 햄버거 메뉴
   ============================================ */
function initHamburger() {
   // 오버레이 동적 생성
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    state.isMenuOpen = true;
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-label', '메뉴 닫기');
  }

  function closeMenu() {
    state.isMenuOpen = false;
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-label', '메뉴 열기');
  }

  hamburger.addEventListener('click', () => {
    state.isMenuOpen ? closeMenu() : openMenu();
  });

  // 오버레이 클릭 시 닫기
  overlay.addEventListener('click', closeMenu);

  // ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isMenuOpen) closeMenu();
  });

  // 네비 링크 클릭 시 메뉴 닫기
  $$('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ============================================
   7. 부드러운 스크롤 (네비 링크)
   ============================================ */
function initSmoothScroll() {
  // `.btn[href^="#"]`: `btn` 클래스를 가지며, `href` 속성값이 `#`으로 시작하는 요소
  $$('.nav__link, .btn[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href.startsWith('#')) return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      // 이동할 Y좌표 위치 계산식
      // [target.getBoundingClientRect().top]
      // 뷰포트(현재 화면에서 보여지는 영역)에서 해당 요소(이동할 위치)의 상단(top)에 대해 상대적인 위치 정보
      // (즉, 해당 요소의 상단이 뷰포트 최상단으로부터 얼마나 떨어져있는지)
      // [getComputedStyle(document.documentElement).getPropertyValue('--nav-height')]
      // `document.documentElement`의 모든 CSS를 담은 객체에서, `--nav-height` 속성값을 불러옴
      // (`--nav-height`는 헤더 요소의 높이값)
      // 이들을 합하면, `뷰포트 상단과 이동할 요소의 상단 차이값 + 현재 Y위치 - 네비게이션 바 높이`
      const offsetTop = target.getBoundingClientRect().top
        + window.scrollY
        - parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-height'));

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
}

/* ============================================
   8. 스크롤 애니메이션 (IntersectionObserver)
   ============================================ */
function initScrollAnimation() {
  // IntersectionObserver: '대상 요소'와 `상위 요소(또는 최상위 문서의 뷰포트)` 간의 교차 영역 변화를 비동기적으로 감지하는 API
  // (현재 코드에서는 별도로 root를 지정하지 않았으므로, 브라우저의 뷰포트를 디폴트로 사용)
  // IntersectionObserver가 생성되면, 지정된 가시성 비율(ratios of visibility)을 감지하도록 구성됨.
  // `threshold`: observe된 요소의 '바운딩 박스 영역'과 '교차 영역'의 비율을 나타내는 값
  // (즉, 현재 요소가 몇 퍼센트나 보여지고 있는지)

  const observer = new IntersectionObserver(
    // 아래 callback 함수는 대상 요소의 가시 영역 비율이 임계값을 넘었을때 호출됨
    (entries) => {
      entries.forEach((entry) => {
        // entry = IntersectionObserverEntry 객체로, 임계값보다 가시성이 증가 또는 감소하여 임계값을 넘어간
        // 각 요소들과 관련 정보(교차 여부/비율, 타겟 요소 등)를 담고있는 객체
        if (entry.isIntersecting) {
          // 해당 요소가 교차한 경우, (즉, 뷰포트에 해당 요소가 20% 나온 경우)
          // 카드마다 순서대로 딜레이 적용
          // (SKILLS의 각 카드에 대해, 각 카드의 순서(index)별로 스크롤 애니메이션 딜레이를 달리 적용)
          const siblings = [...entry.target.parentElement.children];
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.08}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // 한 번만 실행
        }
      });
    },
    { threshold: 0.2 }
  );

  $$('.fade-up').forEach((el) => observer.observe(el));
}

/* ============================================
   9. 타이핑 효과
   ============================================ */
function initTyping() {
  if (!typingText) return;

  const texts = [
    'Frontend Developer 💻',
    'UI/UX를 사랑하는 개발자 🎨',
    'React & JavaScript 전문 🚀',
    '함께 성장하는 개발자 🌱',
  ];

  let textIndex  = 0;  // 현재 문장 인덱스
  let charIndex  = 0;  // 현재 글자 인덱스
  let isDeleting = false;

  const TYPING_SPEED   = 100;  // 타이핑 속도 (ms)
  const DELETING_SPEED = 50;   // 삭제 속도 (ms)
  const PAUSE_END      = 2000; // 완성 후 대기 (ms)
  const PAUSE_START    = 400;  // 삭제 후 대기 (ms)

  function type() {
    // 문자열의 각 문자를 나누어 배열에 담아 처리
    // 기존에는 문자열을 바로 slice 했으나, 이모지의 경우 javascript string에서 길이가 2이므로 잘라버리면
    // 대체 문자가 출력되는 문제가 있어, 각 문자를 배열에 나눠 담은 뒤, 범위 내 요소들을 join하여 출력하는 것으로 변경함.
    const current = [...texts[textIndex]];

    if (isDeleting) {
      // 삭제 중
      typingText.textContent = current.slice(0, charIndex - 1).join('');
      charIndex--;
    } else {
      // 타이핑 중
      typingText.textContent = current.slice(0, charIndex + 1).join('');
      charIndex++;
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === current.length) {
      // 문장 완성 → 대기 후 삭제 시작
      delay = PAUSE_END;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // 삭제 완료 → 다음 문장으로
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = PAUSE_START;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ============================================
   10. GitHub API - 프로젝트 불러오기
   ============================================ */
const GITHUB_USERNAME = 'fromdance';

async function fetchProjects() {
  // 로딩 표시
  projectsGrid.innerHTML = `
    <div class="projects__loading">
      <div class="spinner"></div>
      <p>프로젝트를 불러오는 중...</p>
    </div>
  `;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!res.ok) throw new Error(`GitHub API 오류: ${res.status}`);

    const repos = await res.json();

    // fork 제외, 설명 있는 것만
    state.allProjects = repos.filter(
      (repo) => !repo.fork && repo.description
    );

    // 필터 버튼 생성
    buildFilterButtons(state.allProjects);

    // 전체 렌더링
    renderProjects(state.allProjects);

  } catch (err) {
    console.error(err);
    projectsGrid.innerHTML = `
      <div class="projects__error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>프로젝트를 불러오지 못했습니다.</p>
        <button class="btn btn--outline" id="refresh">
          <i class="fa-solid fa-rotate-right"></i> 다시 시도
        </button>
      </div>
    `;
    $('#refresh').addEventListener('click', (e) => {
      e.preventDefault();
      fetchProjects();
    });
  }
}

/* ============================================
   11. 프로젝트 카드 렌더링
   ============================================ */
function renderProjects(projects) {
  if (projects.length === 0) {
    projectsGrid.innerHTML = `
      <div class="projects__empty">
        <i class="fa-solid fa-folder-open"></i>
        <p>표시할 프로젝트가 없습니다.</p>
      </div>
    `;
    return;
  }

  projectsGrid.innerHTML = projects
    .map((repo) => createProjectCard(repo))
    .join('');

  // 새로 생성된 카드에 스크롤 애니메이션 적용
  $$('.project-card').forEach((card, i) => {
    card.classList.add('fade-up');
    card.style.transitionDelay = `${i * 0.08}s`;

    // 이미 화면에 보이면 바로 visible
    setTimeout(() => card.classList.add('visible'), 50);
  });
}

function createProjectCard(repo) {
  const lang    = repo.language ?? '기타';
  const stars   = repo.stargazers_count ?? 0;
  const forks   = repo.forks_count ?? 0;
  const desc    = repo.description ?? '설명이 없습니다.';
  const updated = new Date(repo.updated_at).toLocaleDateString('ko-KR');

  return `
    <article class="project-card">
      <div class="project-card__header">
        <i class="fa-solid fa-code-branch"></i>
        <h3 class="project-card__name">${escapeHtml(repo.name)}</h3>
      </div>

      <p class="project-card__desc">${escapeHtml(desc)}</p>

      <span class="project-card__lang">${escapeHtml(lang)}</span>

      <div class="project-card__meta">
        <span>
          <i class="fa-solid fa-star"></i> ${stars}
        </span>
        <span>
          <i class="fa-solid fa-code-fork"></i> ${forks}
        </span>
        <span>
          <i class="fa-regular fa-clock"></i> ${updated}
        </span>
      </div>

      <a
        href="${repo.html_url}"
        target="_blank"
        rel="noopener noreferrer"
        class="project-card__link"
        aria-label="${repo.name} GitHub 저장소 열기"
      >
        GitHub에서 보기 <i class="fa-solid fa-arrow-right"></i>
      </a>
    </article>
  `;
}

/* XSS 방지 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================
   12. 프로젝트 언어별 필터링
   ============================================ */
function buildFilterButtons(projects) {
  // PROJECTS의 각 프로젝트의 주요 언어들을 추출하여 주요 언어 별로 프로젝트를 필터링 할 수 있는 버튼들을 생성
  // 언어 목록 추출 (중복 제거)
  const languages = [
    ...new Set(
      projects
        .map((r) => r.language)
        .filter(Boolean)
    ),
  ].sort();

  // 기존 '전체' 버튼 유지 + 언어 버튼 추가
  languages.forEach((lang) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = lang;
    btn.textContent = lang;
    projectFilters.appendChild(btn);
  });

  // 필터 버튼 클릭 이벤트 (이벤트 위임)
  projectFilters.addEventListener('click', (e) => {
    // `closest(CSS선택자)`: 요소 자신부터 시작해 상위부모 방향으로, 지정된 CSS 선택자와 일치하는 가장 가까운 조상요소 찾는 메서드
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // active 클래스 이동 (기존에 active된 버튼은 active 없애고, 현재 클릭된 버튼 active)
    $$('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    state.activeFilter = btn.dataset.filter;

    const filtered = state.activeFilter === 'all'
      ? state.allProjects
      : state.allProjects.filter(
          (r) => r.language === state.activeFilter
        );

    renderProjects(filtered);
  });
}

/* ============================================
   13. 폼 유효성 검사 + 이메일 전송 (Formspree)
   ============================================ */
function initContactForm() {
  if (!contactForm) return;

  // 폼의 각 input 및 에러 메시지 요소
  const fields = {
    name:    { el: $('#name'),    error: $('#nameError') },
    email:   { el: $('#email'),   error: $('#emailError') },
    message: { el: $('#message'), error: $('#messageError') },
  };

  // 실시간 유효성 검사 (포커스 아웃 시)
  Object.values(fields).forEach(({ el, error }) => {
    el.addEventListener('blur', () => validateField(el, error));
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) {
        validateField(el, error);
      }
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 전체 유효성 검사
    const isNameValid    = validateField(fields.name.el,    fields.name.error);
    const isEmailValid   = validateField(fields.email.el,   fields.email.error);
    const isMessageValid = validateField(fields.message.el, fields.message.error);

    if (!isNameValid || !isEmailValid || !isMessageValid) return;

    // 전송 중 UI (전송 버튼 비활성화 및 내부 텍스트 변경, 전송 성공/실패 텍스트 숨김)
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';
    formSuccess.hidden = true;
    formErrorGlobal.hidden = true;

    try {
      // 설정된 form action(Formspree API)으로 요청 전송
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        // 성공
        formSuccess.classList.remove('hidden');
        formErrorGlobal.classList.add('hidden');
        contactForm.reset();
        Object.values(fields).forEach(({ el }) => {
          el.classList.remove('invalid');
        });
      } else {
        throw new Error('전송 실패');
      }
    } catch {
      formSuccess.classList.add('hidden');
      formErrorGlobal.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 보내기';
    }
  });
}

/* 폼 개별 필드 유효성 검사 */
function validateField(el, errorEl) {
  let message = '';

  if (el.id === 'name') {
    if (!el.value.trim()) {
      message = '이름을 입력해주세요.';
    } else if (el.value.trim().length < 2) {
      message = '이름은 2자 이상 입력해주세요.';
    }
  }

  if (el.id === 'email') {
    // 이메일 검사 정규식
    // [공백 또는 @이 아닌 문자 1개 이상] + [@] + [공백 또는 @이 아닌 문자 1개 이상 ] + [.] + [공백 또는 @이 아닌 문자 1개 이상]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!el.value.trim()) {
      message = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(el.value.trim())) {
      message = '올바른 이메일 형식이 아닙니다.';
    }
  }

  if (el.id === 'message') {
    if (!el.value.trim()) {
      message = '메시지를 입력해주세요.';
    } else if (el.value.trim().length < 10) {
      message = '메시지는 10자 이상 입력해주세요.';
    }
  }

  // 에러 메시지 있는 경우, 해당 필드에 에러 표시
  if (message) {
    el.classList.add('invalid');
    errorEl.textContent = message;
    return false;
  } else {
    el.classList.remove('invalid');
    errorEl.textContent = '';
    return true;
  }
}

/* ============================================
   14. 이미지 불러오기 오류시 대체 이미지 설정
   ============================================ */
function initImageReplacement() {
  const image = $('.about__image')
  image.addEventListener('error', (e) => {
    image.src = 'https://placehold.co/200x200?text=Profile';
  }, {once: true});
  // img 태그에 src를 기입해놓을 경우, 이 코드를 통해 eventListener를 달아주기 전에
  // 먼저 브라우저에서 이미지를 불러오고, 에러가 발생해 위 핸들러는 동작하지 않음.
  // 따라서, img 태그의 src를 제거한 뒤 이 js 코드에서 기입하는 형태로 변경.
  image.src = 'images/profile.jpg';
}
/* ============================================
   15. 초기화 - 모든 기능 실행
   ============================================ */
function init() {
  initTheme();
  initScrollHeader();
  initHamburger();
  initSmoothScroll();
  initScrollAnimation();
  initTyping();
  initContactForm();
  initImageReplacement();
  fetchProjects();
}

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', init);