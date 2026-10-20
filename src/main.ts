import './style.css';
import { initShader, changeTheme } from './shader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// SKILLS DATA
// ==========================================
interface SkillItem {
  name: string;
  level: number; // 1 to 10
  tags: string;
}

const SKILLS_DATABASE: Record<string, { title: string; skills: SkillItem[] }> = {
  ai: {
    title: 'ARTIFICIAL INTELLIGENCE & ML',
    skills: [
      { name: 'PyTorch / TensorFlow', level: 4, tags: 'Deep Learning' },
      { name: 'LLM Agents / MCP / Skills', level: 9, tags: 'GenAI' },
      { name: 'Computer Vision (OpenCV)', level: 4, tags: 'Vision' },
      { name: 'Scikit-Learn', level: 5, tags: 'Data Sci' },
      { name: 'Langchain / LangGraph', level: 4, tags: 'Frameworks' },
    ]
  },
  languages: {
    title: 'PROGRAMMING LANGUAGES',
    skills: [
      { name: 'Python', level: 3, tags: 'Development' },
      { name: 'C++', level: 7, tags: 'DSA' },
      { name: 'Go', level: 4, tags: 'Development' },
      { name: 'JavaScript', level: 6, tags: 'Web Dev' },
      { name: 'Java', level: 3, tags: 'Development' },
      { name: 'SQL', level: 5, tags: 'Database' }
    ]
  },
  fundamentals: {
    title: 'FUNDAMENTAL SKILLS',
    skills: [
      { name: 'Data Structures & Algorithms', level: 6, tags: 'Core CS' },
      { name: 'Object Oriented Programming', level: 7, tags: 'Design' },
      { name: 'Database Management Systems', level: 5, tags: 'Core CS' },
      { name: 'Version Control (Git/GitHub)', level: 8, tags: 'Workflow' },
      { name: 'Operating Systems', level: 4, tags: 'Systems' },
      { name: 'Computer Networks', level: 3, tags: 'Core CS' }
    ]
  },
  fullstack: {
    title: 'FULL STACK DEVELOPMENT',
    skills: [
      { name: 'TypeScript & Modern JS', level: 7, tags: 'Frontend' },
      { name: 'FastAPI / REST', level: 6, tags: 'Backend' },
      { name: 'Node.js & Express', level: 5, tags: 'Backend' },
      { name: 'React / Next.js / Vite', level: 8, tags: 'UI Framework' },
      { name: 'PostgreSQL & Supabase', level: 7, tags: 'Database' }
    ]
  },
  gamedev: {
    title: 'GAME DEVELOPMENT',
    skills: [
      { name: 'Godot & 2D Engines', level: 7, tags: 'Indie Dev' },
      { name: 'Game Physics & Math', level: 8, tags: 'Simulation' },
      { name: 'C++ & Memory Models', level: 7, tags: 'Performance' },
      { name: 'Procedural Generation', level: 8, tags: 'Algorithms' },
      { name: 'Pixel Art & Level Design', level: 8, tags: 'Art' }
    ]
  },
  uiux: {
    title: 'USER INTERFACE & EXPERIENCE',
    skills: [
      { name: 'Design Systems & Tokens', level: 9, tags: 'Design' },
      { name: 'Micro-interactions & Motion', level: 9, tags: 'Animation' },
      { name: 'Responsive Web Typography', level: 9, tags: 'Craft' },
      { name: 'Figma UI Wireframing', level: 8, tags: 'Prototyping' },
      { name: 'Accessibility & Contrast', level: 8, tags: 'Usability' }
    ]
  },
  architecture: {
    title: 'SYSTEM ARCHITECTURE & DESIGN',
    skills: [
      { name: 'Distributed System Concepts', level: 7, tags: 'Architecture' },
      { name: 'Microservices & Event Buses', level: 7, tags: 'Backend' },
      { name: 'Docker & Containerization', level: 7, tags: 'DevOps' },
      { name: 'Caching Strategies (Redis)', level: 7, tags: 'Scale' },
      { name: 'Cloud Pipelines (AWS/GCP)', level: 6, tags: 'Cloud' }
    ]
  },
  other: {
    title: 'OTHER SKILLS & INTERESTS',
    skills: [
      { name: 'Chess', level: 3, tags: 'Strategy' },
      { name: 'Technical Writing & Research', level: 7, tags: 'Comms' },
      { name: 'Creative Ideation & R&D', level: 10, tags: 'Mindset' },
      { name: 'Late Night Philosophical Pondering', level: 10, tags: '3 AM' }
    ]
  }
};

// ==========================================
// REAL PROJECTS DATA (FROM /public/Projects)
// ==========================================
interface ProjectItem {
  id: string;
  name: string;
  title: string;
  desc: string;
  tags: string[];
  link: string;
  images: string[];
}

const PROJECTS_DATABASE: Record<string, ProjectItem> = {
  squarey: {
    id: 'squarey',
    name: 'SQUAREY MAZE',
    title: 'SQUAREY MAZE - RETRO ADVENTURE',
    desc: 'An atmospheric retro puzzle maze adventure featuring custom pathfinding logic, procedural dungeons, dynamic retro lighting and pixel storytelling.',
    tags: ['Game Engine', 'Pixel Art', 'Procedural Gen', 'Pygame'],
    link: 'https://github.com/Dev-Akuma',
    images: [
      '/Projects/Squarey Maze/0.jpeg',
      '/Projects/Squarey Maze/1.jpeg',
      '/Projects/Squarey Maze/2.jpeg',
      '/Projects/Squarey Maze/3.jpeg',
      '/Projects/Squarey Maze/4.jpeg',
      '/Projects/Squarey Maze/5.jpeg'
    ]
  },
  compass: {
    id: 'compass',
    name: 'THE COMPASS',
    title: 'THE COMPASS - YOUR PERSONAL GUIDE',
    desc: 'A Platform where you can reflect on your day and life, to make each day a little better and your life a little brighter than yesterday.',
    tags: ['Web Application', 'Interactive Canvas', 'TypeScript', 'UI/UX'],
    link: 'https://github.com/Dev-Akuma',
    images: [
      '/Projects/The Compass/0.png',
      '/Projects/The Compass/1.png',
      '/Projects/The Compass/2.png'
    ]
  }
};

// ==========================================
// STICKY NOTES DATA (FOR ABOUT ME SECTION)
// ==========================================
const NOTES_DATABASE: Record<string, { category: string; title: string; body: string }> = {
  '1': {
    category: 'MINDSET & PHILOSOPHY',
    title: 'Core Motto: "I don\'t like being put down to one thing."',
    body: 'I believe in being a multidisciplinary builder. Rather than limiting myself to a single narrow specialization, I thrive at the intersections—where AI models meet playful game mechanics, where mathematical algorithms transform into tactile interfaces, and where code serves human curiosity.'
  },
  '2': {
    category: 'TECHNICAL ARCHITECTURE',
    title: 'Artificial Intelligence & Agentic Loops',
    body: 'Passionate about modern AI engineering—from training neural models and fine-tuning representations to architecting deterministic multi-agent orchestration pipelines. I like testing the boundary of LLM reasoning, code-generation agents, and local vision models.'
  },
  '3': {
    category: 'CREATIVE COMPUTING',
    title: 'Game Development, Graphics & Shaders',
    body: 'Games are the pinnacle of software craftsmanship because they demand 60FPS deterministic physics, real-time audio/visual syncing, and psychological player engagement. I love designing procedural generation rules, custom GLSL fragment shaders, and nostalgic pixel art.'
  },
  '4': {
    category: 'OBSESSIONS & CURIOSITY',
    title: 'The 3 AM Curiosity Deep-Dive',
    body: 'Some of my best prototypes began at 3:00 AM wondering how something works under the hood. Whether it is reading academic papers, dissecting graphics pipelines, or pondering why humans invent tools, curiosity is my perpetual fuel.'
  }
};

// ==========================================
// DOM SETUP & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize background Three.js shader
  initShader();

  const brandTrigger = document.getElementById('brand-logo-trigger');
  if (brandTrigger) {
    brandTrigger.addEventListener('click', () => {
      changeTheme();
    });
  }

  // Render initial Skills category
  renderSkills('ai');

  // Render initial Project details
  renderProject('squarey');

  // Setup UI event listeners
  setupSkillsInteractivity();
  setupProjectsInteractivity();
  setupTablet3DTilt();
  setupStickyNotesDesk();
  setupHeroPaintbrush();

  // Setup GSAP Pinned Scroll with Soft Snapping and Active Navbar Highlighting
  setupPinnedHorizontalScroll();
});

// ==========================================
// SKILLS INTERACTION
// ==========================================
function renderSkills(categoryKey: string) {
  const data = SKILLS_DATABASE[categoryKey];
  if (!data) return;

  const titleEl = document.getElementById('tablet-cat-title');
  const contentEl = document.getElementById('tablet-skills-content');
  if (titleEl) titleEl.textContent = data.title;

  if (contentEl) {
    contentEl.innerHTML = data.skills
      .map(
        (skill) => `
        <div class="skill-row">
          <div class="skill-row-top">
            <span>${skill.name}</span>
            <span style="color: #79c0ff;">LVL ${skill.level}/10 [${skill.tags}]</span>
          </div>
          <div class="skill-meter-bg">
            <div class="skill-meter-fill" style="width: ${skill.level * 10}%;"></div>
          </div>
        </div>
      `
      )
      .join('');
  }
}

function setupSkillsInteractivity() {
  const categoryKeys = Object.keys(SKILLS_DATABASE);
  let currentCategoryIndex = 0;
  const buttons = document.querySelectorAll('.skill-category-btn');

  function setCategory(index: number) {
    if (index < 0) index = categoryKeys.length - 1;
    if (index >= categoryKeys.length) index = 0;
    currentCategoryIndex = index;
    const cat = categoryKeys[currentCategoryIndex];

    buttons.forEach((b) => {
      if (b.getAttribute('data-cat') === cat) {
        b.classList.add('active');
        b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        b.classList.remove('active');
      }
    });
    renderSkills(cat);
  }

  buttons.forEach((btn, idx) => {
    btn.addEventListener('mouseenter', () => {
      setCategory(idx);
    });

    btn.addEventListener('click', () => {
      setCategory(idx);
    });
  });

  // Next / Prev switcher buttons
  const prevBtn = document.getElementById('skills-prev-btn');
  const nextBtn = document.getElementById('skills-next-btn');

  prevBtn?.addEventListener('click', () => {
    setCategory(currentCategoryIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    setCategory(currentCategoryIndex + 1);
  });

  // Touch Swipe on Tablet Chassis (Mobile swipe left/right)
  const chassis = document.getElementById('tablet-chassis');
  if (chassis) {
    let touchStartX = 0;
    let touchStartY = 0;

    chassis.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    chassis.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX < 0) {
          setCategory(currentCategoryIndex + 1);
        } else {
          setCategory(currentCategoryIndex - 1);
        }
      }
    }, { passive: true });
  }
}

function setupTablet3DTilt() {
  const chassis = document.getElementById('tablet-chassis');
  const stage = document.querySelector('.tablet-perspective-stage') as HTMLElement;
  if (!chassis || !stage) return;

  stage.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 1024) return;
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 16 + 4;
    const rotY = (x / rect.width) * 16 - 4;
    chassis.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  });

  stage.addEventListener('mouseleave', () => {
    if (window.innerWidth <= 1024) return;
    chassis.style.transform = `rotateX(8deg) rotateY(-8deg) rotateZ(1deg)`;
  });
}

// ==========================================
// PROJECTS INTERACTION (PLAYSTORE-STYLE VIEWER)
// ==========================================
function renderProject(projectId: string) {
  const proj = PROJECTS_DATABASE[projectId];
  if (!proj) return;

  const titleEl = document.getElementById('project-title');
  const descEl = document.getElementById('project-desc');
  const tagsEl = document.getElementById('project-tags');
  const mainDisplay = document.getElementById('project-main-display') as HTMLImageElement;
  const thumbnailsStrip = document.getElementById('project-thumbnails');
  const linkEl = document.getElementById('project-action-btn') as HTMLAnchorElement;

  if (titleEl) titleEl.textContent = proj.title;
  if (descEl) descEl.textContent = proj.desc;
  if (linkEl) linkEl.href = proj.link;

  if (tagsEl) {
    tagsEl.innerHTML = proj.tags.map((t) => `<span class="tag-pill">${t}</span>`).join('');
  }

  // Set initial main display image
  if (mainDisplay && proj.images.length > 0) {
    mainDisplay.src = proj.images[0];
  }

  // Populate interactive thumbnail selector strip
  if (thumbnailsStrip) {
    thumbnailsStrip.innerHTML = proj.images
      .map(
        (src, idx) => `
        <button class="project-thumb-btn ${idx === 0 ? 'active' : ''}" data-img="${src}" aria-label="Select preview image">
          <img src="${src}" alt="Screenshot thumbnail" loading="lazy" />
        </button>
      `
      )
      .join('');

    const thumbBtns = thumbnailsStrip.querySelectorAll('.project-thumb-btn');
    thumbBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const targetSrc = btn.getAttribute('data-img');
        if (mainDisplay && targetSrc) {
          mainDisplay.style.opacity = '0.3';
          setTimeout(() => {
            mainDisplay.src = targetSrc;
            mainDisplay.style.opacity = '1';
          }, 120);
        }
      });
    });
  }
}

function setupProjectsInteractivity() {
  const projectKeys = Object.keys(PROJECTS_DATABASE);
  let currentProjectIndex = 0;
  const items = document.querySelectorAll('.project-feed-item');

  function setProject(index: number) {
    if (index < 0) index = projectKeys.length - 1;
    if (index >= projectKeys.length) index = 0;
    currentProjectIndex = index;
    const pid = projectKeys[currentProjectIndex];

    items.forEach((item) => {
      if (item.getAttribute('data-project') === pid) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    renderProject(pid);
  }

  items.forEach((item, idx) => {
    item.addEventListener('mouseenter', () => {
      setProject(idx);
    });

    item.addEventListener('click', () => {
      setProject(idx);
    });
  });

  // Next / Prev switcher buttons
  const prevBtn = document.getElementById('projects-prev-btn');
  const nextBtn = document.getElementById('projects-next-btn');

  prevBtn?.addEventListener('click', () => {
    setProject(currentProjectIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    setProject(currentProjectIndex + 1);
  });

  // Touch Swipe on Project Console Card (Mobile swipe left/right)
  const consoleCard = document.querySelector('.project-console-card');
  if (consoleCard) {
    let touchStartX = 0;
    let touchStartY = 0;

    consoleCard.addEventListener('touchstart', (e: Event) => {
      const te = e as TouchEvent;
      touchStartX = te.touches[0].clientX;
      touchStartY = te.touches[0].clientY;
    }, { passive: true });

    consoleCard.addEventListener('touchend', (e: Event) => {
      const te = e as TouchEvent;
      const touchEndX = te.changedTouches[0].clientX;
      const touchEndY = te.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX < 0) {
          setProject(currentProjectIndex + 1);
        } else {
          setProject(currentProjectIndex - 1);
        }
      }
    }, { passive: true });
  }
}

// ==========================================
// STICKY NOTES DESK (ABOUT ME)
// ==========================================
function setupStickyNotesDesk() {
  const notes = document.querySelectorAll('.sticky-note');
  const modalOverlay = document.getElementById('note-modal-overlay');
  const modalClose = document.getElementById('note-modal-close');
  const modalCat = document.getElementById('note-modal-category');
  const modalTitle = document.getElementById('note-modal-title');
  const modalBody = document.getElementById('note-modal-body');

  notes.forEach((note) => {
    note.addEventListener('click', () => {
      const nid = note.getAttribute('data-note-id');
      if (!nid || !NOTES_DATABASE[nid]) return;
      const data = NOTES_DATABASE[nid];

      if (modalCat) modalCat.textContent = data.category;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalBody) modalBody.textContent = data.body;
      if (modalOverlay) modalOverlay.classList.add('open');
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }
}

// ==========================================
// HIGH-PERFORMANCE DIRECT COMPOSITE PAINTBRUSH REVEAL
// ==========================================
function setupHeroPaintbrush() {
  const card = document.getElementById('hero-portrait-card');
  const canvas = document.getElementById('portrait-paint-canvas') as HTMLCanvasElement | null;
  const sketchImg = document.getElementById('portrait-base-sketch') as HTMLImageElement | null;
  if (!card || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Pre-load color image directly into memory (zero DOM insertion, 73KB WebP)
  const colorImg = new Image();
  colorImg.src = '/assets/Mee.webp';
  let colorLoaded = false;
  colorImg.onload = () => {
    colorLoaded = true;
  };

  // Offscreen brush stamp buffer to draw organic feathered stamps without recalculating gradients
  const BRUSH_RADIUS = 50;
  const stampCanvas = document.createElement('canvas');
  stampCanvas.width = BRUSH_RADIUS * 2;
  stampCanvas.height = BRUSH_RADIUS * 2;
  const stampCtx = stampCanvas.getContext('2d');
  if (stampCtx) {
    const grad = stampCtx.createRadialGradient(
      BRUSH_RADIUS,
      BRUSH_RADIUS,
      BRUSH_RADIUS * 0.15,
      BRUSH_RADIUS,
      BRUSH_RADIUS,
      BRUSH_RADIUS
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    stampCtx.fillStyle = grad;
    stampCtx.beginPath();
    stampCtx.arc(BRUSH_RADIUS, BRUSH_RADIUS, BRUSH_RADIUS, 0, Math.PI * 2);
    stampCtx.fill();
  }

  // Offscreen alpha mask canvas where the user's paint strokes are stamped
  const maskCanvas = document.createElement('canvas');
  const maskCtx = maskCanvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let lastX = -1;
  let lastY = -1;
  let isPointerDownOrHovering = false;
  let hasActiveStrokes = false;
  let lastPaintTime = 0;
  let animFrameId: number | null = null;
  const FADE_IDLE_DELAY = 1200; // ms before fading begins

  function resize() {
    const targetEl = sketchImg || card!;
    const rect = targetEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.round(rect.width);
    height = Math.round(rect.height);

    canvas!.width = width * dpr;
    canvas!.height = height * dpr;
    canvas!.style.width = `${width}px`;
    canvas!.style.height = `${height}px`;

    maskCanvas.width = width * dpr;
    maskCanvas.height = height * dpr;

    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    hasActiveStrokes = false;
  }

  function stamp(x: number, y: number) {
    if (!maskCtx) return;
    const px = x * dpr;
    const py = y * dpr;

    maskCtx.drawImage(
      stampCanvas,
      px - BRUSH_RADIUS,
      py - BRUSH_RADIUS,
      BRUSH_RADIUS * 2,
      BRUSH_RADIUS * 2
    );

    // Feather connection between mouse positions
    if (lastX >= 0 && lastY >= 0) {
      const pLastX = lastX * dpr;
      const pLastY = lastY * dpr;
      const dist = Math.hypot(px - pLastX, py - pLastY);
      const steps = Math.min(Math.ceil(dist / 12), 20);
      for (let i = 1; i <= steps; i++) {
        const ix = pLastX + (px - pLastX) * (i / steps);
        const iy = pLastY + (py - pLastY) * (i / steps);
        maskCtx.drawImage(
          stampCanvas,
          ix - BRUSH_RADIUS,
          iy - BRUSH_RADIUS,
          BRUSH_RADIUS * 2,
          BRUSH_RADIUS * 2
        );
      }
    }

    lastX = x;
    lastY = y;
  }

  function composite() {
    if (!ctx || !maskCtx || !colorLoaded) return;

    // Render the color image masked by the drawn brush strokes directly in hardware
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);

    ctx.save();
    // 1. Draw painted mask
    ctx.drawImage(maskCanvas, 0, 0);

    // 2. Source-in: Keep color image only where mask is painted
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(colorImg, 0, 0, canvas!.width, canvas!.height);
    ctx.restore();
  }

  function startLoop() {
    if (animFrameId !== null) return;
    animFrameId = requestAnimationFrame(loop);
  }

  // Fade decay controller: fully sleeps when inactive (0% CPU/GPU overhead)
  let fadeStepCount = 0;
  function loop(timestamp: number) {
    animFrameId = null;

    if (!hasActiveStrokes) {
      return; // Fully sleep
    }

    // Check if idle delay passed to slowly fade strokes
    if (!isPointerDownOrHovering && timestamp - lastPaintTime > FADE_IDLE_DELAY) {
      if (maskCtx) {
        maskCtx.save();
        maskCtx.globalCompositeOperation = 'destination-out';
        maskCtx.fillStyle = 'rgba(0, 0, 0, 0.025)';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.restore();

        fadeStepCount++;
        // After ~70 frames of fading (~1.2s), clear completely and put loop to sleep
        if (fadeStepCount > 75) {
          maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
          hasActiveStrokes = false;
          fadeStepCount = 0;
          return; // sleep
        }
      }
    }

    composite();

    if (hasActiveStrokes) {
      animFrameId = requestAnimationFrame(loop);
    }
  }

  // Handle pointer interactions
  card.addEventListener('pointerenter', (e) => {
    isPointerDownOrHovering = true;
    lastPaintTime = performance.now();
    hasActiveStrokes = true;
    fadeStepCount = 0;
    const rect = card.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    stamp(lastX, lastY);
    composite();
    startLoop();
  });

  card.addEventListener('pointermove', (e) => {
    isPointerDownOrHovering = true;
    lastPaintTime = performance.now();
    hasActiveStrokes = true;
    fadeStepCount = 0;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    stamp(x, y);
    composite();
    startLoop();
  });

  card.addEventListener('pointerleave', () => {
    isPointerDownOrHovering = false;
    lastX = -1;
    lastY = -1;
    lastPaintTime = performance.now();
    startLoop(); // Ensure loop runs until fade finishes, then sleeps
  });

  window.addEventListener('resize', () => {
    resize();
  });

  // Initial sizing once sketch image is mounted
  if (sketchImg && !sketchImg.complete) {
    sketchImg.onload = resize;
  } else {
    setTimeout(resize, 60);
  }
}

// ==========================================
// GSAP PINNED HORIZONTAL SCROLL & SOFT SNAPPING
// ==========================================
function setupPinnedHorizontalScroll() {
  const mm = gsap.matchMedia();

  // Desktop (> 1024px)
  mm.add('(min-width: 1025px)', () => {
    const track = document.getElementById('horizontal-track');
    const scrollWrapper = document.getElementById('scroll-wrapper');
    const navAnchors = document.querySelectorAll('.nav-anchor');
    if (!track || !scrollWrapper) return;

    // Controlled scroll tween with precise section snapping
    const scrollTween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: scrollWrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / 3, // 4 sections (0, 1/3, 2/3, 1)
          duration: { min: 0.25, max: 0.6 },
          delay: 0.1,
          ease: 'power2.out'
        },
        // Active navbar highlighting based on scroll progress
        onUpdate: (self) => {
          const progress = self.progress;
          let activeIndex = 0;
          if (progress >= 0.82) activeIndex = 3;
          else if (progress >= 0.50) activeIndex = 2;
          else if (progress >= 0.16) activeIndex = 1;
          else activeIndex = 0;

          navAnchors.forEach((link, idx) => {
            if (idx === activeIndex) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });

    // Sync navbar links with scroll position (Navbar bypasses wheel damping freely)
    navAnchors.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionIdx = parseInt(link.getAttribute('data-section') || '0', 10);
        const maxScroll = scrollWrapper.offsetHeight - window.innerHeight;
        const targetScroll = (sectionIdx / 3) * maxScroll;
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      });
    });

    // Contact button smooth scroll past pin
    const contactBtn = document.querySelector('.nav-anchor-contact');
    if (contactBtn) {
      contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });

      // Highlight contact when scrolled past the pinned stage
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 75%',
        onEnter: () => {
          navAnchors.forEach((a) => a.classList.remove('active'));
          contactBtn.classList.add('active');
        },
        onLeaveBack: () => {
          contactBtn.classList.remove('active');
        }
      });
    }

    return () => {
      scrollTween.kill();
    };
  });

  // Mobile / Tablet (<= 1024px): Standard vertical scroll
  mm.add('(max-width: 1024px)', () => {
    const anchors = document.querySelectorAll('.nav-anchor, .nav-anchor-contact');
    anchors.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          target?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  });
}
