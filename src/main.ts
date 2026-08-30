
import './style.css';
import { initShader, changeTheme } from './shader';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio loaded');
  initShader();

  // Logo Theme Changer
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    heroLogo.addEventListener('click', () => {
      changeTheme();
    });
  }

  // Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('revealed')) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));

  // Navbar ScrollSpy
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-links a');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });

  // Scroll Scrubbing for Hero and About
  const heroContent = document.querySelector('.hero-content') as HTMLElement;
  const aboutSection = document.getElementById('about') as HTMLElement;
  const aboutContainer = aboutSection?.querySelector('.about-panel-container') as HTMLElement;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero: Left-Right fade out as we scroll down (0 to 600px)
    if (heroContent) {
      const heroProgress = Math.min(1, Math.max(0, scrollY / 600)); // 0 to 1
      const heroTranslate = scrollY * 0.4; // Slight parallax up
      
      heroContent.style.transform = `translateY(${heroTranslate}px)`;

      heroContent.style.webkitMaskImage = `linear-gradient(to right, transparent 0%, transparent 33.33%, black 66.66%, black 100%)`;
      heroContent.style.maskImage = `linear-gradient(to right, transparent 0%, transparent 33.33%, black 66.66%, black 100%)`;
      heroContent.style.webkitMaskSize = `300% 100%`;
      heroContent.style.maskSize = `300% 100%`;
      
      // Calculate mask position (100% -> visible, 0% -> hidden)
      const maskPos = (1 - heroProgress) * 100;
      heroContent.style.webkitMaskPosition = `${maskPos}% 0`;
      heroContent.style.maskPosition = `${maskPos}% 0`;
    }

    // About: fade in as we scroll down
    if (aboutSection && aboutContainer) {
      const aboutTop = aboutSection.offsetTop;
      const windowHeight = window.innerHeight;

      // Calculate how far we've scrolled into the About section
      // Starts fading in when the top of About enters the bottom of the screen
      const distanceIntoView = (scrollY + windowHeight) - aboutTop;

      if (distanceIntoView > 0) {
        // Map distance to opacity (e.g. fully visible after 600px of scrolling into it)
        const aboutOpacity = Math.min(1, Math.max(0, distanceIntoView / 600));
        // Translate from 40px down to 0px
        const aboutTranslate = Math.max(0, 40 - (distanceIntoView / 600) * 40);

        aboutContainer.style.opacity = aboutOpacity.toString();
        aboutContainer.style.transform = `translateY(${aboutTranslate}px)`;
      } else {
        aboutContainer.style.opacity = '0';
        aboutContainer.style.transform = `translateY(40px)`;
      }
    }
  });

  // Trigger scroll event once to set initial states
  window.dispatchEvent(new Event('scroll'));

  // Custom Drag Cursor Logic
  const dragCursor = document.getElementById('drag-cursor');
  const tabsViewports = document.querySelectorAll('.tabs-viewport');

  if (dragCursor) {
    tabsViewports.forEach(tabsViewport => {
      tabsViewport.addEventListener('mousemove', (e: Event) => {
        if (window.innerWidth <= 768) return; // Disable cursor on mobile
        const mouseEvent = e as MouseEvent;
        dragCursor.style.left = mouseEvent.clientX + 'px';
        dragCursor.style.top = mouseEvent.clientY + 'px';
      });
      tabsViewport.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 768) return;
        dragCursor.classList.add('active');
      });
      tabsViewport.addEventListener('mouseleave', () => {
        dragCursor.classList.remove('active');
        dragCursor.classList.remove('dragging');
      });
    });
  }

  // Tab Sliding System (Multiple Tracks)
  const tracks = document.querySelectorAll('.tabs-track');

  tracks.forEach(trackElement => {
    const track = trackElement as HTMLElement;
    const parallaxContents = track.querySelectorAll('.parallax-content');
    const slides = track.querySelectorAll('.tab-slide');
    if (!slides.length) return;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;

    const parentViewport = track.closest('.tabs-viewport');
    const navArrowLeft = parentViewport?.querySelector('.nav-arrow-left') as HTMLElement | null;
    const navArrowRight = parentViewport?.querySelector('.nav-arrow-right') as HTMLElement | null;

    // Touch Events
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchmove', touchMove, { passive: true });

    // Mouse Events
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', touchEnd);
    track.addEventListener('mousemove', touchMove);

    function getSlideWidth() {
      const firstSlide = slides[0] as HTMLElement;
      return firstSlide ? firstSlide.offsetWidth : window.innerWidth;
    }

    function touchStart(e: TouchEvent | MouseEvent) {
      isDragging = true;
      startX = getPositionX(e);
      track.classList.add('dragging');
      if (dragCursor && window.innerWidth > 768) dragCursor.classList.add('dragging');
      animationID = requestAnimationFrame(animation);
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(animationID);
      track.classList.remove('dragging');
      if (dragCursor) dragCursor.classList.remove('dragging');

      // Determine nearest slide
      const movedBy = currentTranslate - prevTranslate;

      // Threshold to switch slide
      if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
      if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

      updateTabState(currentIndex);
    }

    function touchMove(e: TouchEvent | MouseEvent) {
      if (isDragging) {
        const currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startX;
      }
    }

    function getPositionX(event: TouchEvent | MouseEvent) {
      return event.type.includes('mouse') ? (event as MouseEvent).pageX : (event as TouchEvent).touches[0].clientX;
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
      track.style.transform = `translateX(${currentTranslate}px)`;

      // Parallax effect
      const slideWidth = getSlideWidth();
      parallaxContents.forEach((content) => {
        const slideIndex = Array.from(track.children).indexOf(content.closest('.tab-slide') as Element);
        const slideOffset = -(slideIndex * slideWidth);
        const relativeTranslate = currentTranslate - slideOffset;

        // Move content slightly opposite to the drag direction
        (content as HTMLElement).style.transform = `translateX(${-relativeTranslate * 0.15}px)`;
      });
    }

    // Update State when clicking dots or releasing drag
    function updateTabState(index: number) {
      currentIndex = index;
      const slideWidth = getSlideWidth();
      prevTranslate = currentIndex * -slideWidth;
      currentTranslate = prevTranslate;

      track.style.transform = `translateX(${currentTranslate}px)`;

      // Reset parallax contents cleanly
      parallaxContents.forEach(content => {
        (content as HTMLElement).style.transform = `translateX(0px)`;
      });

      // Update Dynamic Arrows (if any)
      const totalTabs = slides.length;
      
      if (navArrowLeft) {
        const tabsLeft = index;
        if (tabsLeft === 0) {
          navArrowLeft.style.transform = 'translateY(-50%) scale(0)';
          navArrowLeft.style.opacity = '0';
        } else {
          const scale = 0.8 + (tabsLeft * 0.2);
          navArrowLeft.style.transform = `translateY(-50%) scale(${scale})`;
          navArrowLeft.style.opacity = '1';
        }
      }
      
      if (navArrowRight) {
        const tabsRight = (totalTabs - 1) - index;
        if (tabsRight === 0) {
          navArrowRight.style.transform = 'translateY(-50%) scale(0)';
          navArrowRight.style.opacity = '0';
        } else {
          const scale = 0.8 + (tabsRight * 0.2);
          navArrowRight.style.transform = `translateY(-50%) scale(${scale})`;
          navArrowRight.style.opacity = '1';
        }
      }
    }

    // Dynamic Arrows Click Logic
    if (navArrowLeft) {
      navArrowLeft.addEventListener('click', () => {
        if (currentIndex > 0) updateTabState(currentIndex - 1);
      });
    }
    if (navArrowRight) {
      navArrowRight.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) updateTabState(currentIndex + 1);
      });
    }

    // Initial call to set up track
    updateTabState(currentIndex);

    window.addEventListener('resize', () => {
      updateTabState(currentIndex);
    });
  });
});
