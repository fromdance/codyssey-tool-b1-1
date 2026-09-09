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
  // ① 저장된 설정 우선, 없으면 시스템 설정 감지
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ?? (prefersDark ? 'dark' : 'light');

  applyTheme(initial);

  // ② 시스템 테마 변경 실시간 감지 (저장된 설정 없을 때만)
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
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
  $$('.nav__link, .btn[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href.startsWith('#')) return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

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
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 카드마다 순서대로 딜레이 적용
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
    const current = texts[textIndex];

    if (isDeleting) {
      // 삭제 중
      typingText.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      // 타이핑 중
      typingText.textContent = current.slice(0, charIndex + 1);
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
   12. 언어별 필터링
   ============================================ */
function buildFilterButtons(projects) {
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
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // active 클래스 이동
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

    // 전송 중 UI
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';
    formSuccess.hidden = true;
    formErrorGlobal.hidden = true;

    try {
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

/* 개별 필드 유효성 검사 */
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
   14. 초기화 - 모든 기능 실행
   ============================================ */
function init() {
  initTheme();
  initScrollHeader();
  initHamburger();
  initSmoothScroll();
  initScrollAnimation();
  initTyping();
  initContactForm();
  fetchProjects();
}

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', init);