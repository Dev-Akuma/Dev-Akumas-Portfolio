import * as THREE from 'three';
import './style.css';
import { initShader } from './shader';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio loaded');
  initShader();

  // Scroll Reveal Observer for other sections
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));

  // Scroll Scrubbing for Hero and About
  const heroContent = document.querySelector('.hero-content') as HTMLElement;
  const aboutSection = document.getElementById('about') as HTMLElement;
  const aboutContainer = aboutSection?.querySelector('.about-panel-container') as HTMLElement;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero: fade out as we scroll down (0 to 600px)
    if (heroContent) {
      const heroOpacity = Math.max(0, 1 - (scrollY / 600));
      const heroTranslate = scrollY * 0.4; // Slight parallax up
      heroContent.style.opacity = heroOpacity.toString();
      heroContent.style.transform = `translateY(${heroTranslate}px)`;
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

  // Draggable Tabs Logic
  const track = document.getElementById('tabs-track');
  const dots = document.querySelectorAll('.dot[data-tab]');
  const label = document.getElementById('active-tab-label');
  const parallaxContents = document.querySelectorAll('.parallax-content');

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let currentIndex = 0;

  if (track) {
    // Touch Events
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchmove', touchMove, { passive: true });

    // Mouse Events
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', touchEnd);
    track.addEventListener('mousemove', touchMove);
  }

  function getSlideWidth() {
    return track && track.parentElement ? track.parentElement.offsetWidth : window.innerWidth;
  }

  function touchStart(e: TouchEvent | MouseEvent) {
    isDragging = true;
    startX = getPositionX(e);
    if (track) track.classList.add('dragging');
    animationID = requestAnimationFrame(animation);
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    if (track) track.classList.remove('dragging');

    // Determine nearest slide
    const movedBy = currentTranslate - prevTranslate;

    // Threshold to switch slide
    if (movedBy < -100 && currentIndex < dots.length - 1) currentIndex += 1;
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
    if (track) {
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
  }

  // Update State when clicking dots or releasing drag
  function updateTabState(index: number) {
    currentIndex = index;
    const slideWidth = getSlideWidth();
    prevTranslate = currentIndex * -slideWidth;
    currentTranslate = prevTranslate;

    if (track) {
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Reset parallax contents cleanly
    parallaxContents.forEach(content => {
      (content as HTMLElement).style.transform = `translateX(0px)`;
    });

    // Update dots
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
        if (label) label.textContent = dot.getAttribute('data-label');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Dot Click Logic
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateTabState(index);
    });
  });

  window.addEventListener('resize', () => {
    updateTabState(currentIndex);
  });
});
