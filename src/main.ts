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
      { name: 'PyTorch / Neural Nets', level: 9, tags: 'Deep Learning' },
      { name: 'LLM Agents & Prompt Ops', level: 9, tags: 'GenAI' },
      { name: 'Computer Vision (OpenCV)', level: 8, tags: 'Vision' },
      { name: 'Scikit-Learn / Classical ML', level: 8, tags: 'Data Sci' },
      { name: 'Model Optimization / ONNX', level: 7, tags: 'Inference' },
    ]
  },
  fundamentals: {
    title: 'FUNDAMENTAL SKILLS',
    skills: [
      { name: 'Data Structures & Algorithms', level: 9, tags: 'Core CS' },
      { name: 'Object Oriented Programming', level: 9, tags: 'Design' },
      { name: 'Problem Solving & Math', level: 9, tags: 'Theory' },
      { name: 'Version Control (Git/GitHub)', level: 8, tags: 'Workflow' },
      { name: 'Operating Systems & Linux', level: 8, tags: 'Systems' },
    ]
  },
  fullstack: {
    title: 'FULL STACK DEVELOPMENT',
    skills: [
      { name: 'TypeScript & Modern JS', level: 9, tags: 'Frontend' },
      { name: 'Node.js & Express / Fastify', level: 8, tags: 'Backend' },
      { name: 'React / Next.js / Vite', level: 9, tags: 'UI Framework' },
      { name: 'PostgreSQL & Supabase', level: 8, tags: 'Database' },
      { name: 'REST & GraphQL APIs', level: 8, tags: 'Networking' },
    ]
  },
  gamedev: {
    title: 'GAME DEVELOPMENT',
    skills: [
      { name: 'Pygame & 2D Engines', level: 9, tags: 'Indie Dev' },
      { name: 'Game Physics & Math', level: 8, tags: 'Simulation' },
      { name: 'C++ & Memory Models', level: 7, tags: 'Performance' },
      { name: 'Procedural Generation', level: 8, tags: 'Algorithms' },
      { name: 'Pixel Art & Level Design', level: 8, tags: 'Art' },
    ]
  },
  uiux: {
    title: 'USER INTERFACE & EXPERIENCE',
    skills: [
      { name: 'Design Systems & Tokens', level: 9, tags: 'Design' },
      { name: 'Micro-interactions & Motion', level: 9, tags: 'Animation' },
      { name: 'Responsive Web Typography', level: 9, tags: 'Craft' },
      { name: 'Figma UI Wireframing', level: 8, tags: 'Prototyping' },
      { name: 'Accessibility & Contrast', level: 8, tags: 'Usability' },
    ]
  },
  architecture: {
    title: 'SYSTEM ARCHITECTURE & DESIGN',
    skills: [
      { name: 'Distributed System Concepts', level: 8, tags: 'Architecture' },
      { name: 'Microservices & Event Buses', level: 7, tags: 'Backend' },
      { name: 'Docker & Containerization', level: 8, tags: 'DevOps' },
      { name: 'Caching Strategies (Redis)', level: 8, tags: 'Scale' },
      { name: 'Cloud Pipelines (AWS/GCP)', level: 7, tags: 'Cloud' },
    ]
  },
  other: {
    title: 'OTHER SKILLS & INTERESTS',
    skills: [
      { name: 'Technical Writing & Research', level: 9, tags: 'Comms' },
      { name: 'Creative Ideation & R&D', level: 10, tags: 'Mindset' },
      { name: 'Late Night Philosophical Pondering', level: 10, tags: '3 AM' },
      { name: 'Shader Programming (GLSL)', level: 7, tags: 'Graphics' },
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
  const buttons = document.querySelectorAll('.skill-category-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      const cat = btn.getAttribute('data-cat');
      if (cat) {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderSkills(cat);
      }
    });

    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      if (cat) {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderSkills(cat);
      }
    });
  });
}

function setupTablet3DTilt() {
  const chassis = document.getElementById('tablet-chassis');
  const stage = document.querySelector('.tablet-perspective-stage') as HTMLElement;
  if (!chassis || !stage) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 16 + 4;
    const rotY = (x / rect.width) * 16 - 4;
    chassis.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  });

  stage.addEventListener('mouseleave', () => {
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
  const items = document.querySelectorAll('.project-feed-item');
  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const pid = item.getAttribute('data-project');
      if (pid) {
        items.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        renderProject(pid);
      }
    });

    item.addEventListener('click', () => {
      const pid = item.getAttribute('data-project');
      if (pid) {
        items.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        renderProject(pid);
      }
    });
  });
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

    // Controlled scroll tween without aggressive multi-section auto-snap
    const scrollTween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: scrollWrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
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

    // Intelligent Wheel Snapping & Velocity Damper:
    // Allows viewing mid-transition freely during gentle scrolling,
    // but when an aggressive scroll occurs, it clamps and stops cleanly at the next section marker.
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
    let accumulatedDelta = 0;
    const sectionThreshold = 180; // distance threshold before snapping to the adjacent section

    window.addEventListener('wheel', (e) => {
      const maxScroll = scrollWrapper.offsetHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      // Only engage threshold snapping while inside the pinned stages
      if (currentScroll < maxScroll) {
        accumulatedDelta += e.deltaY;

        if (wheelTimeout) clearTimeout(wheelTimeout);

        wheelTimeout = setTimeout(() => {
          if (Math.abs(accumulatedDelta) > sectionThreshold) {
            const currentSectionProgress = currentScroll / maxScroll;
            const step = 1 / 3;
            let targetIndex = Math.round(currentSectionProgress * 3);

            if (accumulatedDelta > sectionThreshold) {
              // Scrolling down aggressively -> stop at next section
              targetIndex = Math.min(3, Math.floor(currentSectionProgress * 3) + 1);
            } else if (accumulatedDelta < -sectionThreshold) {
              // Scrolling up aggressively -> stop at previous section
              targetIndex = Math.max(0, Math.ceil(currentSectionProgress * 3) - 1);
            }

            const targetY = targetIndex * step * maxScroll;
            gsap.to(window, {
              scrollTo: targetY,
              duration: 0.45,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
          accumulatedDelta = 0;
        }, 90);
      }
    }, { passive: true });

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
