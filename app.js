(function () {
  if (!window.gsap) return;
  const plugins = [window.ScrollTrigger, window.SplitText, window.Flip].filter(Boolean);
  if (plugins.length) window.gsap.registerPlugin.apply(window.gsap, plugins);
})();

(function () {
  (function waitForGSAP() {
    if (window.gsap) {
      document.querySelectorAll('.mwg035').forEach(initEffect);
    } else {
      setTimeout(waitForGSAP, 50);
    }
  })();

  function initEffect(rootOG) {
    if (!rootOG) return;
    const items = rootOG.querySelectorAll('.mwg035-li');

    const isMobile = window.matchMedia('(max-width: 991px)').matches;

    const collapsedMinHeight = isMobile ? '5rem' : '6rem';
    const activeMinHeight = isMobile ? '5rem' : '15.25rem';
    const CLOSED = 'inset(0% 0% 100% 0%)';
    const OPEN = 'inset(0% 0% 0% 0%)';
    let lastIndexEntered = 0;
    const tls = [];
    const contents = [];
    const mediaBlocks = [];
    const texts = [];

    items.forEach((item, index) => {
      const content = item.querySelector('.accordion-content');
      contents.push(content);
      if (content) {
        gsap.set(content, {
          overflow: 'hidden',
          height: index === 0 ? 'auto' : 0
        });
      }

      const medias = item.querySelector('.mwg035-medias');
      mediaBlocks.push(medias);
      if (medias) {
        if (isMobile) {
          gsap.set(medias, {
            overflow: 'hidden',
            height: index === 0 ? 'auto' : 0,
            clipPath: 'none',
            y: 0
          });
        } else {
          gsap.set(medias, {
            overflow: 'hidden',
            clipPath: index === 0 ? OPEN : CLOSED,
            y: 0
          });
        }
      }

      const textEl = item.querySelector('.accordion-content_text');
      texts.push(textEl);
      if (textEl) {
        gsap.set(textEl, {
          opacity: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 24
        });
      }
    });

    gsap.set(items, { flex: '1 1 auto', minHeight: collapsedMinHeight, willChange: 'min-height' });
    gsap.set(items[0], { minHeight: activeMinHeight });

    items.forEach((item, index) => {
      const medias = item.querySelectorAll('.mwg035-media');
      const tl = gsap.timeline({ paused: index !== 0 ? true : false });
      tl.to(medias, {
        y: 0,
        stagger: {
          each: 0.04,
          from: 'random'
        },
        duration: 0.4,
        ease: 'power4.out'
      });
      tls.push(tl);

      function handleMouseEnter() {
        if (index === lastIndexEntered) return;

        tls[lastIndexEntered].timeScale(3).reverse();
        const previous = items[lastIndexEntered];
        const previousContent = contents[lastIndexEntered];
        const previousMedias = mediaBlocks[lastIndexEntered];
        const previousText = texts[lastIndexEntered];
        lastIndexEntered = index;
        tls[index].timeScale(1).play();

        gsap.to(previous, {
          minHeight: collapsedMinHeight,
          duration: 0.35,
          ease: 'power2.inOut'
        });

        gsap.to(item, {
          minHeight: activeMinHeight,
          duration: 0.35,
          ease: 'power2.inOut'
        });

        if (previousContent) {
          gsap.to(previousContent, { height: 0, duration: 0.35, ease: 'power2.inOut' });
        }

        if (contents[index]) {
          gsap.to(contents[index], { height: 'auto', duration: 0.35, ease: 'power2.inOut' });
        }

        if (isMobile) {
          if (previousMedias) {
            gsap.to(previousMedias, { height: 0, duration: 0.4, ease: 'power2.inOut' });
          }
          if (mediaBlocks[index]) {
            gsap.to(mediaBlocks[index], { height: 'auto', duration: 0.5, ease: 'power2.out' });
          }
        } else {
          if (previousMedias) {
            gsap.fromTo(
              previousMedias,
              { clipPath: OPEN, y: 0 },
              { clipPath: CLOSED, y: -32, duration: 0.45, ease: 'power3.inOut' }
            );
          }

          if (mediaBlocks[index]) {
            gsap.fromTo(
              mediaBlocks[index],
              { clipPath: CLOSED, y: -32 },
              { clipPath: OPEN, y: 0, duration: 0.8, ease: 'power3.out' }
            );
          }
        }

        if (previousText) {
          gsap.to(previousText, {
            opacity: 0,
            y: 24,
            duration: 0.3,
            ease: 'power2.in'
          });
        }

        if (texts[index]) {
          gsap.to(texts[index], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.15
          });
        }
      }

      item.addEventListener('mouseenter', handleMouseEnter);
      item.mouseEnterListener = handleMouseEnter;

      if (isMobile) {
        item.addEventListener('click', handleMouseEnter);
        item.clickListener = handleMouseEnter;
      }
    });

    const observer = new MutationObserver((mutations) => {
      const isRootRemoved = mutations.some(
        (mutation) =>
          mutation.type === 'childList' && Array.from(mutation.removedNodes).includes(rootOG)
      );
      if (isRootRemoved) {
        items.forEach((item) => {
          if (item.mouseEnterListener) {
            item.removeEventListener('mouseenter', item.mouseEnterListener);
          }
          if (item.clickListener) {
            item.removeEventListener('click', item.clickListener);
          }
        });
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

(function () {
  var root = document.querySelectorAll('.mwg032')[0];
  if (!root) return;

  var started = false;

  function waitForGSAP() {
    if (started) return;

    if (window.gsap && window.ScrollTrigger) {
      started = true;
      init();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  }

  waitForGSAP();

  function init() {
    var svg = root.querySelector('svg');
    if (!svg) return;

    var textPath = svg.querySelector('textPath');
    var path = svg.querySelector('path');
    var pinHeight = root.querySelector('.mwg032-pin-height');
    var container = root.querySelector('.mwg032-container');

    if (!textPath || !path || !pinHeight || !container) return;

    var uid = 'mwg032-path-' + Math.random().toString(36).slice(2, 9);

    path.setAttribute('id', uid);

    textPath.setAttribute('href', '#' + uid);

    textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + uid);

    var textContent = textPath.textContent.trim();

    function getTextWidth() {
      var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));

      var ctx = canvas.getContext('2d');

      ctx.font = window.getComputedStyle(textPath).font;

      return ctx.measureText(textContent).width;
    }

    var lastWidth = window.innerWidth;

    var resizeTimer = null;

    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    function build() {
      ScrollTrigger.getAll().forEach(function (trigger) {
        if (trigger.trigger === pinHeight) {
          trigger.kill(true);
        }
      });

      gsap.killTweensOf(textPath);

      var pathLength = path.getTotalLength();

      if (!pathLength) return;

      var textWidth = getTextWidth();

      var visibleStartPercent = (700 / pathLength) * 100;

      var visibleEndPercent = ((700 + 1516) / pathLength) * 100;

      var textPercent = (textWidth / pathLength) * 100;

      var startOffset = visibleEndPercent + 8;

      var endOffset = visibleStartPercent - textPercent - 40;

      gsap.set(textPath, {
        attr: {
          startOffset: startOffset + '%'
        }
      });

      var scrollDistance = Math.max(pinHeight.offsetHeight - window.innerHeight, 1);

      gsap.to(textPath, {
        attr: {
          startOffset: endOffset + '%'
        },

        ease: 'none',

        scrollTrigger: {
          trigger: pinHeight,

          start: 'top top',

          end: '+=' + scrollDistance,

          pin: container,

          scrub: true,

          invalidateOnRefresh: false
        }
      });
    }

    function startBuild() {
      requestAnimationFrame(function () {
        build();

        requestAnimationFrame(function () {
          ScrollTrigger.refresh();
        });
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(startBuild);
    } else {
      setTimeout(startBuild, 100);
    }

    if (!isMobile) {
      window.addEventListener(
        'resize',
        function () {
          var currentWidth = window.innerWidth;

          if (currentWidth === lastWidth) {
            return;
          }

          clearTimeout(resizeTimer);

          resizeTimer = setTimeout(function () {
            var newWidth = window.innerWidth;

            if (newWidth === lastWidth) {
              return;
            }

            lastWidth = newWidth;

            build();

            ScrollTrigger.refresh();
          }, 300);
        },
        {
          passive: true
        }
      );
    }
  }
})();

(function () {
  var root = document.querySelectorAll('.mwg032')[1];
  if (!root) return;

  var started = false;

  function waitForGSAP() {
    if (started) return;

    if (window.gsap && window.ScrollTrigger) {
      started = true;
      init();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  }

  waitForGSAP();

  function init() {
    var svg = root.querySelector('svg');
    if (!svg) return;

    var textPath = svg.querySelector('textPath');
    var path = svg.querySelector('path');
    var pinHeight = root.querySelector('.mwg032-pin-height');
    var container = root.querySelector('.mwg032-container');

    if (!textPath || !path || !pinHeight || !container) return;

    var uid = 'mwg032-path-' + Math.random().toString(36).slice(2, 9);

    path.setAttribute('id', uid);

    textPath.setAttribute('href', '#' + uid);

    textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + uid);

    var textContent = textPath.textContent.trim();

    function getTextWidth() {
      var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));

      var ctx = canvas.getContext('2d');

      ctx.font = window.getComputedStyle(textPath).font;

      return ctx.measureText(textContent).width;
    }

    var lastWidth = window.innerWidth;

    var resizeTimer = null;

    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    function build() {
      ScrollTrigger.getAll().forEach(function (trigger) {
        if (trigger.trigger === pinHeight) {
          trigger.kill(true);
        }
      });

      gsap.killTweensOf(textPath);

      var pathLength = path.getTotalLength();

      if (!pathLength) return;

      var textWidth = getTextWidth();

      var visibleStartPercent = (700 / pathLength) * 100;

      var visibleEndPercent = ((700 + 1516) / pathLength) * 100;

      var textPercent = (textWidth / pathLength) * 100;

      var startOffset = visibleEndPercent + 8;

      var endOffset = visibleStartPercent - textPercent - 40;

      gsap.set(textPath, {
        attr: {
          startOffset: startOffset + '%'
        }
      });

      var scrollDistance = Math.max(pinHeight.offsetHeight - window.innerHeight, 1);

      gsap.to(textPath, {
        attr: {
          startOffset: endOffset + '%'
        },

        ease: 'none',

        scrollTrigger: {
          trigger: pinHeight,

          start: 'top top',

          end: '+=' + scrollDistance,

          pin: container,

          scrub: true,

          invalidateOnRefresh: false
        }
      });
    }

    function startBuild() {
      requestAnimationFrame(function () {
        build();

        requestAnimationFrame(function () {
          ScrollTrigger.refresh();
        });
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(startBuild);
    } else {
      setTimeout(startBuild, 100);
    }

    if (!isMobile) {
      window.addEventListener(
        'resize',
        function () {
          var currentWidth = window.innerWidth;

          if (currentWidth === lastWidth) {
            return;
          }

          clearTimeout(resizeTimer);

          resizeTimer = setTimeout(function () {
            var newWidth = window.innerWidth;

            if (newWidth === lastWidth) {
              return;
            }

            lastWidth = newWidth;

            build();

            ScrollTrigger.refresh();
          }, 300);
        },
        {
          passive: true
        }
      );
    }
  }
})();

(function () {
  const root = document.querySelector('.mwg043');
  if (!root) return;

  (function waitForGSAP() {
    if (window.gsap && window.ScrollTrigger && window.InertiaPlugin) {
      initEffect();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  })();

  function initEffect() {
    gsap.registerPlugin(InertiaPlugin);
    const cardWrappers = root.querySelectorAll('.mwg043-card-wrapper');

    const mm = gsap.matchMedia();

    mm.add('(min-width: 992px)', () => {
      const angle = 5;
      const spread = 300;
      const lift = 45;
      const totalCards = cardWrappers.length - 1;
      const center = totalCards / 2;

      cardWrappers.forEach((el, index) => {
        const dist = index - center;
        gsap.set(el, {
          rotation: angle * dist,
          x: spread * dist,
          y: lift * Math.pow(dist, 2)
        });
      });

      const revealTween = gsap.from(cardWrappers, {
        rotation: 40,
        stagger: 0.07,
        ease: 'elastic.out(1, 0.75)',
        duration: 1.5,
        scrollTrigger: {
          trigger: root,
          start: 'top 20%',
          toggleActions: 'play none none none'
        },
        onComplete: () => root.classList.add('on')
      });

      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        onLeaveBack: () => {
          root.classList.remove('on');
          revealTween.pause(0);
        }
      });

      const hoverOk = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const xyMultiplier = 55;
      const rotationMultiplier = 40;
      const inertiaResistance = 130;
      const clampXY = gsap.utils.clamp(-320, 320);
      const clampRot = gsap.utils.clamp(-55, 55);
      let prevX = 0,
        prevY = 0,
        velX = 0,
        velY = 0,
        rafId = null;

      const onMove = (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          velX = e.clientX - prevX;
          velY = e.clientY - prevY;
          prevX = e.clientX;
          prevY = e.clientY;
          rafId = null;
        });
      };
      const enterHandlers = [];

      if (hoverOk) {
        root.addEventListener('mousemove', onMove);
        cardWrappers.forEach((el) => {
          const handler = (e) => {
            const target = el.querySelector('.mwg043-card');
            if (!target) return;
            const { left, top, width, height } = target.getBoundingClientRect();
            const offsetX = e.clientX - (left + width / 2);
            const offsetY = e.clientY - (top + height / 2);
            const rawTorque = offsetX * velY - offsetY * velX;
            const leverDist = Math.hypot(offsetX, offsetY) || 1;
            const angularForce = rawTorque / leverDist;
            gsap.to(target, {
              inertia: {
                x: { velocity: clampXY(velX * xyMultiplier), end: 0 },
                y: { velocity: clampXY(velY * xyMultiplier), end: 0 },
                rotation: { velocity: clampRot(angularForce * rotationMultiplier), end: 0 },
                resistance: inertiaResistance
              }
            });
          };
          el.addEventListener('mouseenter', handler);
          enterHandlers.push([el, handler]);
        });
      }

      return () => {
        root.classList.remove('on');
        root.removeEventListener('mousemove', onMove);
        enterHandlers.forEach(([el, h]) => el.removeEventListener('mouseenter', h));
      };
    });

    mm.add('(max-width: 991px)', () => {
      root.classList.add('on');

      cardWrappers.forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        });
      });

      return () => root.classList.remove('on');
    });
  }
})();

(function () {
  function waitForGSAP() {
    if (window.gsap && window.ScrollTrigger) {
      initFooterParallax();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  }
  waitForGSAP();
  function initFooterParallax() {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-footer-parallax]').forEach((el) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'clamp(top bottom)',
          end: 'clamp(top top)',
          scrub: 0.6,
          refreshPriority: -1,
          invalidateOnRefresh: true
        }
      });
      const inner = el.querySelector('[data-footer-parallax-inner]');
      const dark = el.querySelector('[data-footer-parallax-dark]');
      if (inner) {
        tl.from(inner, {
          yPercent: -25,
          ease: 'none',
          force3D: true
        });
      }
      if (dark) {
        tl.from(
          dark,
          {
            opacity: 0.5,
            ease: 'none'
          },
          '<'
        );
      }
    });
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('[cards-anim]').forEach((container) => {
    const items = Array.from(container.children);

    gsap.set(items, { opacity: 0, y: 50 });

    gsap.to(items, {
      scrollTrigger: { trigger: container, start: 'top 80%', once: true },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
  });
});

const lenis = new Lenis({
  autoRaf: true
});

try {
  history.scrollRestoration = 'manual';
} catch (e) {}

var unlocked = false;

function toTop() {
  if (lenis && lenis.scrollTo) {
    try {
      lenis.scrollTo(0, {
        immediate: true,
        force: true
      });
    } catch (e) {}
  }

  window.scrollTo(0, 0);
}

toTop();

function holdTop() {
  if (unlocked) return;

  if (window.scrollY !== 0) {
    toTop();
  }

  requestAnimationFrame(holdTop);
}

requestAnimationFrame(holdTop);

window.addEventListener(
  'scroll',
  function () {
    if (!unlocked && window.scrollY !== 0) {
      toTop();
    }
  },
  { passive: true }
);

function lockScroll() {
  var bar = window.innerWidth - document.documentElement.clientWidth;

  if (bar > 0) {
    document.documentElement.style.paddingRight = bar + 'px';
  }

  document.documentElement.classList.add('is--scroll-locked');

  toTop();

  if (lenis && lenis.stop) {
    try {
      lenis.stop();
    } catch (e) {}
  }
}

function unlockScroll() {
  if (unlocked) return;

  unlocked = true;

  document.documentElement.classList.remove('is--scroll-locked');

  document.documentElement.style.paddingRight = '';

  if (lenis && lenis.start) {
    try {
      lenis.start();
    } catch (e) {}
  }
}

setTimeout(unlockScroll, 7000);

function initWillemLoadingAnimation() {
  const container = document.querySelector('.willem-header');

  if (!container) {
    unlockScroll();
    return;
  }

  const loadingLetter = container.querySelectorAll('.willem__letter');

  const box = container.querySelectorAll('.willem-loader__box');

  const growingImage = container.querySelectorAll('.willem__growing-image');

  const headingStart = container.querySelectorAll('.willem__h1-start');

  const headingEnd = container.querySelectorAll('.willem__h1-end');

  const coverImageExtra = container.querySelectorAll('.willem__cover-image-extra');

  const headerLetter = container.querySelectorAll('.willem__letter-white');

  const navLinks = container.querySelectorAll('.willen-nav a');

  let finalOffsetX = 0;
  let finalOffsetY = 0;

  function measureFinalOffset() {
    const img = growingImage[0];
    const boxEl = box[0];

    if (!img || !boxEl) {
      return {
        x: 0,
        y: 0
      };
    }

    const saved = {
      w: img.style.width,
      h: img.style.height,
      t: img.style.transform,
      bw: boxEl.style.width
    };

    boxEl.style.width = '110vw';

    img.style.width = '100vw';
    img.style.height = '100dvh';
    img.style.transform = 'none';

    const rect = img.getBoundingClientRect();

    img.style.width = saved.w;
    img.style.height = saved.h;
    img.style.transform = saved.t;
    boxEl.style.width = saved.bw;

    return {
      x: rect.left,
      y: rect.top
    };
  }

  function boxTargetWidth() {
    const boxEl = box[0];

    if (!boxEl) {
      return '1em';
    }

    const inner = boxEl.querySelector('.willem-loader__box-inner');

    const h = (inner || boxEl).getBoundingClientRect().height;

    if (!h) {
      return '1.94em';
    }

    let want = (h * 16) / 9;

    const h1 = boxEl.closest('.willem__h1');

    if (h1) {
      const rest = h1.getBoundingClientRect().width - boxEl.getBoundingClientRect().width;

      const max = window.innerWidth * 0.92 - rest;

      if (max > 0 && want > max) {
        want = max;
      }
    }

    return Math.round(want) + 'px';
  }

  const tl = gsap.timeline({
    defaults: {
      ease: 'expo.inOut'
    },

    onStart: () => {
      container.classList.remove('is--hidden');

      lockScroll();

      const offset = measureFinalOffset();

      finalOffsetX = offset.x;

      finalOffsetY = offset.y;
    },

    onComplete: unlockScroll
  });

  if (loadingLetter.length) {
    tl.from(loadingLetter, {
      yPercent: 100,
      stagger: 0.025,
      duration: 1.25
    });
  }

  if (box.length) {
    tl.fromTo(
      box,
      {
        width: '0em'
      },
      {
        width: function () {
          return boxTargetWidth();
        },
        duration: 1.25
      },
      '< 1.25'
    );
  }

  if (growingImage.length) {
    tl.fromTo(
      growingImage,
      {
        width: '0%'
      },
      {
        width: '100%',
        duration: 1.25
      },
      '<'
    );
  }

  if (headingStart.length) {
    tl.fromTo(
      headingStart,
      {
        x: '0em'
      },
      {
        x: '-0.05em',
        duration: 1.25
      },
      '<'
    );
  }

  if (headingEnd.length) {
    tl.fromTo(
      headingEnd,
      {
        x: '0em'
      },
      {
        x: '0.05em',
        duration: 1.25
      },
      '<'
    );
  }

  if (coverImageExtra.length) {
    tl.fromTo(
      coverImageExtra,
      {
        opacity: 1
      },
      {
        opacity: 0,
        duration: 0.05,
        ease: 'none',
        stagger: 0.5
      },
      '-=0.05'
    );
  }

  if (growingImage.length) {
    tl.to(
      growingImage,
      {
        width: '100vw',
        height: '100dvh',
        x: () => -finalOffsetX,
        y: () => -finalOffsetY,
        duration: 2
      },
      '< 1.25'
    );
  }

  if (box.length) {
    tl.to(
      box,
      {
        width: '110vw',
        duration: 2
      },
      '<'
    );
  }

  if (headerLetter.length) {
    tl.from(
      headerLetter,
      {
        yPercent: 100,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.025
      },
      '< 1.2'
    );
  }

  if (navLinks.length) {
    tl.from(
      navLinks,
      {
        yPercent: 100,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.1
      },
      '<'
    );
  }
}

document.addEventListener('DOMContentLoaded', function () {
  toTop();

  try {
    initWillemLoadingAnimation();
  } catch (e) {
    unlockScroll();
  }
});

window.addEventListener('load', function () {
  if (!unlocked) {
    toTop();
  }
});

(function () {
  function waitForGSAP() {
    if (window.gsap && window.ScrollTrigger) {
      init();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  }

  waitForGSAP();

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    var slides = document.querySelectorAll('.case-slide');

    slides.forEach(function (slide, index) {
      var isLast = index === slides.length - 1;
      var wrapper = slide.querySelector('.case-content-wrapper');
      var content = slide.querySelector('.case-content');

      if (!content) return;

      if (wrapper) {
        var exitTl = gsap.timeline({
          scrollTrigger: {
            pin: wrapper,
            anticipatePin: 1,
            trigger: slide,
            start: 'top 0%',
            end: function () {
              return '+=' + window.innerHeight;
            },
            scrub: 1.2,
            refreshPriority: 1,
            invalidateOnRefresh: true
          }
        });

        exitTl.to(
          content,
          {
            rotationZ: (Math.random() - 0.5) * 10,
            scale: 0.7,
            rotationX: 40,
            ease: 'power1.in',
            force3D: true,
            duration: 1
          },
          0
        );

        if (isLast) {
          exitTl.to(
            content,
            {
              autoAlpha: 0,
              ease: 'none',
              duration: 0.6
            },
            0.4
          );
        }
      }

      var texts = content.querySelectorAll('.case-hat .case-text');

      var items = [
        texts[0],
        texts[1],
        content.querySelector('.case-content_left p'),
        content.querySelector('.case-content_link')
      ].filter(Boolean);

      if (items.length) {
        gsap.set(items, {
          opacity: 0,
          y: 50
        });

        var itemsTween = gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          paused: true
        });

        var itemsST = ScrollTrigger.create({
          trigger: slide,
          pinnedContainer: wrapper,
          start: 'top 80%',
          refreshPriority: -1,
          invalidateOnRefresh: true,

          onEnter: function () {
            itemsTween.play();
          },

          onEnterBack: function () {
            itemsTween.play();
          }
        });

        if (itemsST.isActive || itemsST.progress > 0) {
          itemsTween.play();
        }

        ScrollTrigger.create({
          trigger: slide,
          start: 'top bottom',
          refreshPriority: -1,

          onLeaveBack: function () {
            if (ScrollTrigger.isRefreshing) return;

            itemsTween.pause(0);
          }
        });
      }

      var imgWrap = content.querySelector('.case-content_image-warpper');

      var img = imgWrap ? imgWrap.querySelector('.case-content_image') : null;

      if (imgWrap && img) {
        imgWrap.style.overflow = 'hidden';

        var imgTl = gsap.timeline({
          paused: true
        });

        imgTl.fromTo(
          imgWrap,
          {
            clipPath: 'inset(0% 0% 100% 0%)'
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power3.inOut'
          }
        );

        imgTl.fromTo(
          img,
          {
            yPercent: -12
          },
          {
            yPercent: 0,
            duration: 1.2,
            ease: 'power3.inOut'
          },
          '<'
        );

        var imgST = ScrollTrigger.create({
          trigger: imgWrap,
          pinnedContainer: wrapper,
          start: 'top 95%',
          refreshPriority: -1,
          invalidateOnRefresh: true,

          onEnter: function () {
            imgTl.play();
          },

          onEnterBack: function () {
            imgTl.play();
          }
        });

        if (imgST.isActive || imgST.progress > 0) {
          imgTl.play();
        }

        ScrollTrigger.create({
          trigger: slide,
          start: 'top bottom',
          refreshPriority: -1,

          onLeaveBack: function () {
            if (ScrollTrigger.isRefreshing) return;

            imgTl.pause(0);
          }
        });
      }
    });

    ScrollTrigger.refresh();
  }
})();

(function () {
  function waitForGSAP() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
      init();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  }
  waitForGSAP();

  function init() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    initFlipOnScroll();
    initPlayer();
  }

  function initFlipOnScroll() {
    var wrapperElements = document.querySelectorAll("[data-flip-element='wrapper']");
    var targetEl = document.querySelector("[data-flip-element='target']");
    if (!wrapperElements.length || !targetEl) return;
    var tl;

    function flipTimeline() {
      if (tl) {
        tl.kill();
        gsap.set(targetEl, { clearProps: 'all' });
      }

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperElements[0],
          start: 'center center',
          endTrigger: wrapperElements[wrapperElements.length - 1],
          end: 'center center',
          scrub: 0.25
        }
      });

      wrapperElements.forEach(function (element, index) {
        var nextIndex = index + 1;
        if (nextIndex < wrapperElements.length) {
          var nextWrapperEl = wrapperElements[nextIndex];
          var nextRect = nextWrapperEl.getBoundingClientRect();
          var thisRect = element.getBoundingClientRect();
          var nextDistance = nextRect.top + window.pageYOffset + nextWrapperEl.offsetHeight / 2;
          var thisDistance = thisRect.top + window.pageYOffset + element.offsetHeight / 2;
          var offset = nextDistance - thisDistance;

          tl.add(
            Flip.fit(targetEl, nextWrapperEl, {
              duration: offset,
              ease: 'none'
            })
          );
        }
      });
    }

    flipTimeline();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(flipTimeline, 100);
    });
  }

  function ensurePlayback(video) {
    var sourceEl = video.querySelector('source');
    var url = (sourceEl && sourceEl.getAttribute('src')) || video.getAttribute('src') || '';
    if (url.indexOf('.m3u8') === -1) return;

    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';

    s.onload = function () {
      if (window.Hls && window.Hls.isSupported()) {
        if (sourceEl) sourceEl.remove();
        video.removeAttribute('src');

        var hls = new window.Hls({ capLevelToPlayerSize: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.load();
      }
    };

    s.onerror = function () {
      video.load();
    };
    document.head.appendChild(s);
  }

  function initPlayer() {
    var I = {
      play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>',
      pause:
        '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
      muted:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
      sound:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
      full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>'
    };

    var target = document.querySelector("[data-flip-element='target']");
    var video =
      (target && target.querySelector('video')) || document.querySelector('.scaling-video__video');
    if (!video) return;

    ensurePlayback(video);

    var bar = document.createElement('div');
    bar.className = 'sv-bar';
    bar.innerHTML =
      '<button class="sv-btn sv-play" type="button" aria-label="Play"></button>' +
      '<div class="sv-track"><div class="sv-fill"></div></div>' +
      '<span class="sv-time">0:00</span>' +
      '<button class="sv-btn sv-full" type="button" aria-label="Fullscreen"></button>';
    document.body.appendChild(bar);

    var soundBtn = document.createElement('button');
    soundBtn.type = 'button';
    soundBtn.className = 'sv-sound';
    document.body.appendChild(soundBtn);

    var playBtn = bar.querySelector('.sv-play');
    var fullBtn = bar.querySelector('.sv-full');
    var track = bar.querySelector('.sv-track');
    var fill = bar.querySelector('.sv-fill');
    var timeEl = bar.querySelector('.sv-time');

    fullBtn.innerHTML = I.full;

    function fmt(s) {
      if (!isFinite(s)) return '0:00';
      var m = Math.floor(s / 60);
      var r = Math.floor(s % 60);
      return m + ':' + (r < 10 ? '0' : '') + r;
    }

    function paint() {
      playBtn.innerHTML = video.paused ? I.play : I.pause;
      playBtn.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
      soundBtn.innerHTML = video.muted ? I.muted : I.sound;
      soundBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
    }
    paint();

    playBtn.addEventListener('click', function () {
      if (video.paused) video.play().catch(function () {});
      else video.pause();
      paint();
    });

    function toggleSound() {
      video.muted = !video.muted;
      if (!video.muted && video.paused) video.play().catch(function () {});
      paint();
      gsap.fromTo(soundBtn, { scale: 0.85 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
    }

    soundBtn.addEventListener('click', toggleSound);

    function isFullscreen() {
      return document.fullscreenElement === video || document.webkitFullscreenElement === video;
    }

    fullBtn.addEventListener('click', function () {
      if (isFullscreen()) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        return;
      }

      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    });

    function onFsChange() {
      if (isFullscreen()) {
        video.setAttribute('controls', '');
        video.muted = false;
      } else {
        video.removeAttribute('controls');
      }
      paint();
    }
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);

    var scrubbing = false;

    function seekTo(e) {
      var r = track.getBoundingClientRect();
      var ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      if (isFinite(video.duration)) video.currentTime = ratio * video.duration;
      fill.style.width = ratio * 100 + '%';
    }

    track.addEventListener('pointerdown', function (e) {
      scrubbing = true;
      track.setPointerCapture(e.pointerId);
      seekTo(e);
    });
    track.addEventListener('pointermove', function (e) {
      if (scrubbing) seekTo(e);
    });
    track.addEventListener('pointerup', function () {
      scrubbing = false;
    });
    track.addEventListener('pointercancel', function () {
      scrubbing = false;
    });

    video.addEventListener('play', paint);
    video.addEventListener('pause', paint);

    var pointerInside = false;
    var onScreen = false;

    window.addEventListener('mousemove', function (e) {
      var r = video.getBoundingClientRect();
      pointerInside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });

    bar.addEventListener('mouseenter', function () {
      pointerInside = true;
    });
    soundBtn.addEventListener('mouseenter', function () {
      pointerInside = true;
    });

    gsap.ticker.add(function () {
      var r = video.getBoundingClientRect();

      var width = Math.max(220, r.width - 32);
      bar.style.width = width + 'px';
      bar.style.transform =
        'translate(' + (r.left + (r.width - width) / 2) + 'px,' + (r.bottom - 60) + 'px)';

      soundBtn.style.transform =
        'translate(' + (r.left + r.width / 2) + 'px,' + (r.top + r.height / 2) + 'px)';

      if (!scrubbing && isFinite(video.duration) && video.duration > 0) {
        fill.style.width = (video.currentTime / video.duration) * 100 + '%';
      }
      timeEl.textContent = fmt(video.currentTime);

      var shouldShow = onScreen && !isFullscreen() && (pointerInside || scrubbing);
      bar.classList.toggle('is-visible', shouldShow);
      soundBtn.classList.toggle('is-visible', shouldShow);
    });

    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          onScreen = entry.isIntersecting;
          if (onScreen) {
            video.play().catch(function () {});
          } else if (!isFullscreen()) {
            video.pause();
            video.currentTime = 0;
            video.muted = true;
            paint();
          }
        });
      },
      { threshold: 0.25 }
    ).observe(video);

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && onScreen) {
        video.play().catch(function () {});
      }
    });
  }
})();

(function () {
  function start() {
    gsap.registerPlugin(SplitText);

    var SEL = '[data-slide-hover=""]';
    var HOVER_PARENT_SELECTOR = '.case-content_guts';
    var DURATION = 0.45;
    var STAGGER = 0.025;
    var EASE = 'power3.inOut';
    var TABLET_MQ = window.matchMedia('(max-width: 991px)');

    var style = document.createElement('style');
    style.textContent =
      SEL +
      '{display:inline-block;overflow:hidden;vertical-align:top;position:relative;}' +
      SEL +
      ' .willem-nav__link-inner{display:block;position:relative;}' +
      SEL +
      ' .willem-nav__line{display:block;white-space:nowrap;}' +
      SEL +
      ' .willem-nav__line--copy{position:absolute;top:100%;left:0;}';
    document.head.appendChild(style);

    var instances = [];

    function isDisabled(link) {
      return !!link.closest(HOVER_PARENT_SELECTOR) && TABLET_MQ.matches;
    }

    function build(link) {
      if (link.dataset.navHover) return;
      if (isDisabled(link)) return;
      link.dataset.navHover = '1';

      var text = link.textContent.trim();
      if (!text) return;

      var inner = document.createElement('span');
      inner.className = 'willem-nav__link-inner';
      var lineA = document.createElement('span');
      lineA.className = 'willem-nav__line';
      lineA.textContent = text;
      var lineB = document.createElement('span');
      lineB.className = 'willem-nav__line willem-nav__line--copy';
      lineB.setAttribute('aria-hidden', 'true');
      lineB.textContent = text;
      inner.appendChild(lineA);
      inner.appendChild(lineB);
      link.textContent = '';
      link.appendChild(inner);

      var splits = [],
        tl = null;

      function make() {
        splits = [new SplitText(lineA, { type: 'chars' }), new SplitText(lineB, { type: 'chars' })];
        tl = gsap.timeline({
          paused: true,
          defaults: { duration: DURATION, ease: EASE, stagger: { each: STAGGER } }
        });
        tl.to(splits[0].chars, { yPercent: -100 }, 0).to(splits[1].chars, { yPercent: -100 }, 0);
      }

      function refresh() {
        if (tl) tl.kill();
        splits.forEach(function (s) {
          s.revert();
        });
        make();
      }

      make();

      var hoverTarget = link.closest(HOVER_PARENT_SELECTOR) || link;

      function onEnter() {
        tl.play();
      }
      function onLeave() {
        tl.reverse();
      }

      hoverTarget.addEventListener('mouseenter', onEnter);
      hoverTarget.addEventListener('mouseleave', onLeave);
      hoverTarget.addEventListener('focusin', onEnter);
      hoverTarget.addEventListener('focusout', onLeave);

      function destroy() {
        hoverTarget.removeEventListener('mouseenter', onEnter);
        hoverTarget.removeEventListener('mouseleave', onLeave);
        hoverTarget.removeEventListener('focusin', onEnter);
        hoverTarget.removeEventListener('focusout', onLeave);
        if (tl) tl.kill();
        splits.forEach(function (s) {
          s.revert();
        });
        link.textContent = text;
        delete link.dataset.navHover;
      }

      instances.push({ link: link, refresh: refresh, destroy: destroy });
    }

    function teardownDisabled() {
      instances = instances.filter(function (i) {
        if (isDisabled(i.link)) {
          i.destroy();
          return false;
        }
        return true;
      });
    }

    function initAll(root) {
      (root || document).querySelectorAll(SEL).forEach(build);
    }

    document.fonts.ready.then(function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      initAll();
    });

    TABLET_MQ.addEventListener('change', function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      teardownDisabled();
      initAll();
    });

    var w = window.innerWidth,
      t;
    window.addEventListener('resize', function () {
      if (window.innerWidth === w) return;
      w = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(function () {
        instances.forEach(function (i) {
          i.refresh();
        });
      }, 200);
    });

    window.initNavLinks = initAll;
  }

  (function waitForLibs() {
    if (window.gsap && window.SplitText) {
      start();
    } else {
      setTimeout(waitForLibs, 50);
    }
  })();
})();

(function () {
  var THRESHOLD = 8; // гасит дрожание тачпада
  var TOP_ZONE = 80; // у верха страницы навбар всегда открыт

  function init() {
    var nav = null;
    var all = document.querySelectorAll('[navbar-scroll]');
    for (var i = 0; i < all.length; i++) {
      if (all[i].offsetHeight > 0) {
        nav = all[i];
        break;
      }
    }
    if (!nav) return;

    var lastY = window.scrollY;
    var lastRun = 0;

    window.addEventListener(
      'scroll',
      function () {
        var now = Date.now();
        if (now - lastRun < 50) return;
        lastRun = now;

        var y = window.scrollY;
        var delta = y - lastY;
        if (Math.abs(delta) < THRESHOLD) return;
        lastY = y;

        if (y <= TOP_ZONE) {
          nav.classList.remove('is--nav-hidden');
          return;
        }
        nav.classList[delta > 0 ? 'add' : 'remove']('is--nav-hidden');
      },
      { passive: true }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(function () {
  var POINT = 0.2; // 30% пути секции через экран

  function init() {
    var el = document.querySelector('.mwg044-header.last');
    if (!el) return;

    var section = el.closest('.mwg032-pin-height') || el.closest('.mwg032') || el.parentElement;
    var lastRun = 0;

    function update() {
      var r = section.getBoundingClientRect();

      var passed = window.innerHeight - r.top;
      var total = r.height + window.innerHeight;
      var progress = total > 0 ? passed / total : 0;

      el.classList[progress >= POINT ? 'add' : 'remove']('is--visible');
    }

    window.addEventListener(
      'scroll',
      function () {
        var now = Date.now();
        if (now - lastRun < 80) return;
        lastRun = now;
        update();
      },
      { passive: true }
    );

    window.addEventListener('load', update);
    window.addEventListener('resize', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.bold-nav-full');
  if (!nav || !window.gsap) return;

  let lastScroll = window.scrollY;
  let ticking = false;

  function updateNav() {
    const currentScroll = window.scrollY;
    const difference = currentScroll - lastScroll;

    if (currentScroll <= 10) {
      gsap.to(nav, {
        yPercent: 0,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: true
      });

      lastScroll = currentScroll;
      ticking = false;
      return;
    }

    if (Math.abs(difference) < 5) {
      ticking = false;
      return;
    }

    if (difference > 0) {
      gsap.to(nav, {
        yPercent: -100,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true
      });
    } else {
      gsap.to(nav, {
        yPercent: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true
      });
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true }
  );
});

document.addEventListener('DOMContentLoaded', function () {
  const navBar = document.querySelector('.bold-nav-full__bar');
  if (!navBar) return;

  function updateNavBar() {
    const scrollY = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (pageHeight <= 0) return;

    const scrollPercent = (scrollY / pageHeight) * 100;

    navBar.classList.toggle('is-scrolled', scrollPercent >= 4);
  }

  window.addEventListener('scroll', updateNavBar, { passive: true });

  updateNavBar();
});

(function () {
  var done = false;
  function boost() {
    var imgs = document.querySelectorAll('.willem-header img');
    if (!imgs.length) return;
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].loading = 'eager';
      imgs[i].setAttribute('fetchpriority', i < 2 ? 'high' : 'auto');
    }
    done = true;
    if (obs) obs.disconnect();
  }
  var obs = new MutationObserver(function () {
    if (!done) boost();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', function () {
    if (!done) boost();
  });
})();

gsap.registerPlugin(ScrollTrigger, SplitText);
function initGradientWaveText() {
  document.querySelectorAll('[data-gradient-wave-text]').forEach((heading) => {
    const scrollStart = heading.getAttribute('data-gradient-wave-scroll-start') || 'top 90%';
    const scrollEnd = heading.getAttribute('data-gradient-wave-scroll-end') || 'center 40%';
    const startColor =
      heading.getAttribute('data-gradient-wave-color-start') || 'rgba(255, 255, 255, 0.2)';
    const waveColor = heading.getAttribute('data-gradient-wave-color-wave') || '#F84131';
    const waveDuration = parseFloat(heading.getAttribute('data-gradient-wave-duration')) || 0.4;
    const scrubValue = parseFloat(heading.getAttribute('data-gradient-wave-scrub')) || 0.1;
    const endColor = getComputedStyle(heading).color;
    new SplitText(heading, {
      type: 'words, chars',
      autoSplit: true,
      onSplit(self) {
        const chars = self.chars;
        const activeChars = new Set();
        const progress = { value: 0 };
        let isReady = false;
        const syncChars = () => {
          const activeCount = Math.round(progress.value * chars.length);
          chars.forEach((char, index) => {
            const isActive = index < activeCount;
            gsap.killTweensOf(char);
            gsap.set(char, { color: isActive ? endColor : startColor });
            if (isActive) activeChars.add(char);
            else activeChars.delete(char);
          });
        };
        const ctx = gsap.context(() => {
          gsap.set(chars, { color: startColor });
          gsap.to(progress, {
            value: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: heading,
              start: scrollStart,
              end: scrollEnd,
              scrub: scrubValue,
              onRefresh: () => {
                isReady = false;
                syncChars();
                requestAnimationFrame(() => {
                  isReady = true;
                });
              }
            },
            onUpdate: () => {
              if (!isReady) return;
              const activeCount = Math.round(progress.value * chars.length);
              chars.forEach((char, index) => {
                const isActive = index < activeCount;
                if (isActive && !activeChars.has(char)) {
                  activeChars.add(char);
                  gsap.killTweensOf(char);
                  gsap
                    .timeline()
                    .to(char, {
                      color: waveColor,
                      duration: waveDuration * 0.3,
                      ease: 'power2.out'
                    })
                    .to(char, {
                      color: endColor,
                      duration: waveDuration * 0.7,
                      ease: 'power2.in'
                    });
                }
                if (!isActive && activeChars.has(char)) {
                  activeChars.delete(char);
                  gsap.killTweensOf(char);
                  gsap.to(char, {
                    color: startColor,
                    duration: waveDuration * 0.5,
                    ease: 'none'
                  });
                }
              });
            }
          });
        }, heading);
        return ctx;
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initGradientWaveText();
});

(function () {
  const root = document.querySelector('.mwg046');
  if (!root) return;

  (function waitForGSAP() {
    if (window.gsap) {
      initEffect();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  })();

  function initEffect() {
    wrapLettersInSpan(root.querySelector('.mwg046-sentence'));
    const letters = root.querySelectorAll('.mwg046-letter span');
    const shuffleLetters = shuffleArray(Array.from(letters));

    gsap.from(shuffleLetters, {
      y: '112%',
      ease: 'power4.inOut',
      duration: 0.6,
      stagger: 0.02,
      delay: 5 // пауза перед стартом всей анимации
    });

    function wrapLettersInSpan(element) {
      const text = element.textContent;
      element.innerHTML = text
        .split(' ')
        .map(
          (word) =>
            `<span class="word">${word
              .split('')
              .map((char) => `<span class="mwg046-letter"><span>${char}</span></span>`)
              .join('')}</span>`
        )
        .join(' ');
    }
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  }
})();

(function () {
  function waitForGSAP() {
    if (window.gsap) {
      initEffect();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  }
  waitForGSAP();

  function initEffect() {
    const navAnim = document.querySelectorAll('.nav-anim');
    gsap.set(navAnim, { opacity: 0, y: 80 });
    gsap.to(navAnim, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 5,
      clearProps: 'transform'
    });
  }
})();

function initBoldFullScreenNavigation() {
  document.querySelectorAll('[data-navigation-toggle="toggle"]').forEach((toggleBtn) => {
    toggleBtn.addEventListener('click', () => {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      if (navStatusEl.getAttribute('data-navigation-status') === 'not-active') {
        navStatusEl.setAttribute('data-navigation-status', 'active');
      } else {
        navStatusEl.setAttribute('data-navigation-status', 'not-active');
      }
    });
  });
  document.querySelectorAll('[data-navigation-toggle="close"]').forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      navStatusEl.setAttribute('data-navigation-status', 'not-active');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      if (navStatusEl.getAttribute('data-navigation-status') === 'active') {
        navStatusEl.setAttribute('data-navigation-status', 'not-active');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initBoldFullScreenNavigation();

  setTimeout(() => {
    const navFullEl = document.querySelector('.bold-nav-full');
    if (navFullEl) {
      navFullEl.classList.add('is-visible');
    }
  }, 5000);
});

let emojiAnimationRunning = false;

function initEmojiRain(emojiTypes, emojiContainer) {
  if (emojiAnimationRunning) return;

  emojiAnimationRunning = true;

  const emojiContainerHeight = emojiContainer.offsetHeight;
  const emojiQuantity = 60;

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const createEmojiElement = () => {
    const emojiScale = Math.random() * 0.6 + 0.4;
    const emojiRotate = getRandomInt(1, 5);
    const emojiDelay = 0.001 * getRandomInt(0, 1250);
    const emojiSpeed = getRandomInt(500, 1500) * 0.001;
    const emojiPosition = `${getRandomInt(0, 10)}0%`;
    const emojiClass = `single-rain-emoji-image-${emojiTypes[Math.floor(Math.random() * emojiTypes.length)]}`;

    const singleEmoji = document.createElement('div');
    singleEmoji.className = 'single-rain-emoji append';
    singleEmoji.style.left = emojiPosition;

    const singleEmojiChild = document.createElement('div');
    singleEmojiChild.className = emojiClass;
    singleEmoji.appendChild(singleEmojiChild);

    gsap.fromTo(
      singleEmoji,
      { y: emojiContainerHeight, xPercent: -50, rotate: 0.001, scale: emojiScale },
      {
        y: '-100%',
        xPercent: -50,
        rotate: 0.001,
        delay: emojiDelay,
        ease: 'Power1.easeIn',
        duration: emojiSpeed
      }
    );

    gsap.fromTo(
      singleEmojiChild,
      { xPercent: -25, rotate: emojiRotate },
      {
        xPercent: 25,
        rotate: -emojiRotate,
        ease: 'Power1.easeInOut',
        delay: emojiDelay,
        duration: 0.8,
        repeat: -1,
        yoyo: true
      }
    );

    emojiContainer.appendChild(singleEmoji);
  };

  Array.from({ length: emojiQuantity }).forEach(createEmojiElement);

  setTimeout(() => {
    emojiContainer.querySelectorAll('.single-rain-emoji.append').forEach((el) => el.remove());
    emojiAnimationRunning = false;
  }, 2750);
}

function initFormSuccessWatcher() {
  document.querySelectorAll('.mwg044-form_block').forEach((form) => {
    const wrapper = form.closest('.w-form');
    const button = form.querySelector('.mwg044-form_button');
    if (!wrapper || !button) return;

    const doneMsg = wrapper.querySelector('.w-form-done');
    if (!doneMsg) return;

    const observer = new MutationObserver(() => {
      if (doneMsg.style.display === 'block') {
        button.classList.add('is-sent');
      }
    });

    observer.observe(doneMsg, { attributes: true, attributeFilter: ['style'] });
  });
}

function initEmojiRainActions() {
  document.querySelectorAll('[data-emoji-rain-type-1]').forEach((trigger) => {
    let wasSent = trigger.classList.contains('is-sent');

    const observer = new MutationObserver(() => {
      const isSent = trigger.classList.contains('is-sent');
      if (isSent && !wasSent) {
        const type1 = trigger.getAttribute('data-emoji-rain-type-1');
        const type2 = trigger.getAttribute('data-emoji-rain-type-2') || type1;
        const emojiContainer = document.querySelector('[data-emoji-rain-container]');

        if (!emojiContainer) {
          console.warn('No emoji rain container found with [data-emoji-rain-container]');
          return;
        }

        initEmojiRain([type1, type2], emojiContainer);
      }
      wasSent = isSent;
    });

    observer.observe(trigger, { attributes: true, attributeFilter: ['class'] });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFormSuccessWatcher();
  initEmojiRainActions();
});

(function () {
  function waitForGSAP() {
    if (window.gsap) {
      initEffect();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  }
  waitForGSAP();

  function initEffect() {
    document.querySelectorAll('.mwg044').forEach(function (root) {
      if (root.dataset.mwg044Init) return;
      root.dataset.mwg044Init = '1';

      const duplicate = root.querySelector('.mwg044-duplicate');
      if (!duplicate) return;

      const xTo = gsap.quickTo(duplicate, '--xpercent', {
        duration: 0.4,
        ease: 'back'
      });

      const yTo = gsap.quickTo(duplicate, '--ypercent', {
        duration: 0.4,
        ease: 'back'
      });

      root.addEventListener('mousemove', function (e) {
        const bound = root.getBoundingClientRect();
        xTo(gsap.utils.mapRange(bound.left, bound.left + bound.width, 0, 100, e.clientX));
        yTo(gsap.utils.mapRange(bound.top, bound.top + bound.height, 0, 100, e.clientY));
      });
    });
  }
})();