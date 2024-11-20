(function () {
  const cursor = new MouseFollower({
    activeState: 'active'
  });

  cursor.setText('Click & Drag')

  document.addEventListener('mousedown', () => {
    cursor.setText("It's not easy though");
  })

  document.addEventListener('mouseup', () => {
    cursor.removeText();
  })
})();

// Polyfill for requestAnimationFrame and cancelAnimationFrame
!(function (global) {
  "use strict";
  let lastTime = 0;
  let vendors = ["webkit", "moz", "ms", "o"];
  let requestAnimationFrame = global.requestAnimationFrame;
  let cancelAnimationFrame = global.cancelAnimationFrame;
  let prefix;

  // Check for vendor-prefixed versions
  for (
    let i = 0;
    i < vendors.length && (!requestAnimationFrame || !cancelAnimationFrame);
    i++
  ) {
    prefix = vendors[i];
    requestAnimationFrame =
      requestAnimationFrame || global[prefix + "RequestAnimationFrame"];
    cancelAnimationFrame =
      cancelAnimationFrame ||
      global[prefix + "CancelAnimationFrame"] ||
      global[prefix + "CancelRequestAnimationFrame"];
  }

  // Fallback to setTimeout if necessary
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback) {
      let currentTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currentTime - lastTime));
      let id = global.setTimeout(function () {
        callback(currentTime + timeToCall);
      }, timeToCall);
      lastTime = currentTime + timeToCall;
      return id;
    };

    cancelAnimationFrame = function (id) {
      global.clearTimeout(id);
    };
  }

  // Assign the correct methods to the global object
  global.requestAnimationFrame = requestAnimationFrame;
  global.cancelAnimationFrame = cancelAnimationFrame;
})(window);

// ParticleEffects namespace and related functionality
(function (global) {
  "use strict";

  // Define the ParticleEffects namespace and utility functions
  const ParticleEffects = (global.ParticleEffects = {});

  ParticleEffects.isTouch = "ontouchstart" in document.documentElement;

  ParticleEffects.getTaggedElem = function (element, tagName) {
    if (!element.dataset.icon) {
      return false
    }

    while (element && element.nodeType !== 9) {
      if (element.nodeName && element.nodeName.toLowerCase() === tagName) {
        // console.log(element.nodeName, element.dataset.icon)
        return element;
      }
      element = element.parentNode;
    }

    return false;
  };

  ParticleEffects.charCount = 0;
  ParticleEffects.charElems = [];

  ParticleEffects.parseForParticles = function (element) {
    let words = element.textContent.split(" ");

    let icon = element.dataset?.icon;
    if (icon) {
      words = [" "];
      element.dataset.icon = "";
    }

    while (element.firstChild) element.removeChild(element.firstChild);

    let fragment = document.createDocumentFragment();
    let wordSpans = [];
    let charSpans = [];

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let wordSpan = document.createElement("span");
      wordSpan.className = "word";
      wordSpans.push(wordSpan);

      let chars = word.split("");
      for (let j = 0; j < chars.length; j++) {
        let charSpan = document.createElement("span");
        charSpan.className = "char";
        charSpan.textContent = chars[j];
        if (icon) {
          charSpan.textContent = "";
          charSpan.dataset.icon = icon;
        }
        charSpans.push(charSpan);
        wordSpan.appendChild(charSpan);
        ParticleEffects.charCount++;
      }
      fragment.appendChild(wordSpan);
      fragment.appendChild(document.createTextNode(" "));
    }
    element.appendChild(fragment);
    return ParticleEffects.isTouch ? wordSpans : charSpans;
  };

  // Sparkle effect for hovered elements using ES6 Classes
  let currentElement;

  class SparkleEffect {
    constructor(element) {
      this.element = element;
      this.chars = element.querySelectorAll(".char");
      this.charsLen = this.chars.length;
      if (this.charsLen) {
        this.endIndex = 0;
        this.startIndex = 0;
        this.hueIndex = Math.floor(360 * Math.random());
        this.colors = [];
        this.isHovered = true;
        this.isSparkling = true;
        this.sparkle();
        currentElement = element;
        document.addEventListener("mouseover", this, false);
      }
    }

    handleEvent(event) {
      let handlerName = event.type + "Handler";
      if (this[handlerName]) this[handlerName](event);
    }

    mouseoverHandler(event) {
      if (!this.element.contains(event.target)) {
        this.isHovered = false;
        currentElement = null;
        document.removeEventListener("mouseover", this, false);
      }
    }

    sparkle() {
      this.endIndex = Math.min(this.endIndex + 1, this.charsLen);
      let hue = (10 * this.hueIndex) % 240 + 120;
      let color = this.isHovered ? "hsl(" + hue + ", 70%, 80%)" : "white";
      this.colors.unshift(color);

      for (let i = this.startIndex; i < this.endIndex; i++) {
        this.chars[i].style.color = this.colors[i];
      }

      if (this.isHovered) {
        this.hueIndex++;
      } else {
        this.startIndex = Math.min(this.startIndex + 1, this.charsLen);
      }

      this.isSparkling = this.startIndex !== this.charsLen;
      if (this.isSparkling) requestAnimationFrame(this.sparkle.bind(this));
    }
  }

  ParticleEffects.onMouseover = function (event) {
    let anchor = ParticleEffects.getTaggedElem(event.target, "a");
    if (!ParticleEffects.isCursorActive && anchor && anchor !== currentElement)
      new SparkleEffect(anchor);
  };

  // Particle system for characters using ES6 Classes
  let cursorX, cursorY;
  const TAU = 2 * Math.PI;
  const interactionRadius = 250;
  const transformProperty = getVendorPrefixedProperty("transform");
  let particles = (ParticleEffects.charParticles = []);
  let particleIndex = 0;
  let isAllParticlesSettled = true;
  let isInitialized = false;

  // Feature detection functions
  function supportsTransforms() {
    const style = document.createElement("div").style;
    return (
      "transform" in style ||
      "WebkitTransform" in style ||
      "MozTransform" in style ||
      "msTransform" in style ||
      "OTransform" in style
    );
  }

  function supports3DTransforms() {
    const div = document.createElement("div");
    div.style.cssText = "transform: rotateY(45deg);";
    const has3d = div.style.transform !== "";
    if (has3d) return true;

    const prefixes = ["Webkit", "Moz", "ms", "O"];
    for (let i = 0; i < prefixes.length; i++) {
      div.style.cssText = prefixes[i] + "Transform: rotateY(45deg);";
      if (div.style[prefixes[i] + "Transform"] !== "") {
        return true;
      }
    }
    return false;
  }

  const hasTransforms = supportsTransforms();
  const has3DTransforms = supports3DTransforms();

  class CharParticle {
    constructor(element) {
      this.index = particleIndex++;
      this.element = element;
      this.x = 0;
      this.y = 0;
      this.angle = 0;
      this.scale = 1;
      this.velocityX = 0;
      this.velocityY = 0;
      this.velocityR = 0;
      this.isSettled = true;
      this.wasSettled = true;
      this.updatePosition();
    }

    updatePosition() {
      let elem = this.element;
      this.width = elem.offsetWidth;
      this.height = elem.offsetHeight;
      this.originX = elem.offsetLeft + this.width / 2;
      this.originY = elem.offsetTop + this.height / 2;
    }

    update() {
      let dx = cursorX - (this.originX + this.x);
      let dy = cursorY - (this.originY + this.y);
      let distance = Math.sqrt(dx * dx + dy * dy);
      let rotationForce = 0;

      if (ParticleEffects.isCursorActive && interactionRadius > distance) {
        let interactionStrength = 1 - distance / interactionRadius;
        let angleToCursor = Math.atan2(dy, dx);
        rotationForce = angleToCursor - Math.PI / 2;
        rotationForce *= Math.min(3 * interactionStrength, 1);

        let angleDifference = Math.abs(rotationForce - this.angle);
        if (Math.abs(rotationForce - TAU - this.angle) < angleDifference) {
          rotationForce -= TAU;
        } else if (
          Math.abs(rotationForce + TAU - this.angle) < angleDifference
        ) {
          rotationForce += TAU;
        }

        interactionStrength *= 3.5 * interactionStrength;
        this.velocityX += Math.cos(angleToCursor) * -interactionStrength;
        this.velocityY += Math.sin(angleToCursor) * -interactionStrength;
      }

      this.angle = this.angle % TAU;
      this.velocityX += 0.005 * (0 - this.x);
      this.velocityY += 0.005 * (0 - this.y);
      this.velocityR += rotationForce - this.angle;
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.angle += 0.01 * this.velocityR;
      this.velocityX *= 0.95;
      this.velocityY *= 0.95;
      this.velocityR *= 0.95;

      let totalDistance = Math.sqrt(this.x * this.x + this.y * this.y);
      this.scale = 2 * (totalDistance / interactionRadius) + 1;

      let isCurrentlySettled =
        Math.abs(this.x) < 0.03 &&
        Math.abs(this.y) < 0.03 &&
        Math.abs(this.angle) < 0.004 &&
        Math.abs(this.scale - 1) < 0.03;
      this.isSettled = this.wasSettled && isCurrentlySettled;
      isAllParticlesSettled = isAllParticlesSettled && this.isSettled;
      this.wasSettled = isCurrentlySettled;
      this.render();
    }

    render() {
      if (hasTransforms) {
        if (has3DTransforms) {
          this.element.style[transformProperty] = this.isSettled
            ? "none"
            : `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale}) rotate(${this.angle}rad)`;
        } else {
          this.element.style[transformProperty] = this.isSettled
            ? "none"
            : `translate(${this.x}px, ${this.y}px) scale(${this.scale}) rotate(${this.angle}rad)`;
        }
      } else {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
      }
    }
  }

  function onMouseDown(event) {
    activateCursor(event, event);
  }

  function onTouchStart(event) {
    for (let i = 0, len = event.changedTouches.length; i < len; i++) {
      let touch = event.changedTouches[i];
      if (primaryTouchId) {
        if (!secondaryTouchId) {
          activateCursor(touch, event);
        }
      } else {
        primaryTouchId = touch.identifier;
        global.addEventListener("touchend", onPrimaryTouchEnd, false);
      }
    }
  }

  function activateCursor(event, originalEvent) {
    if (!ParticleEffects.getTaggedElem(event.target, "span")) {
      ParticleEffects.isCursorActive = true;
      ParticleEffects.areAllCharParticlesSettled = false;
      cursorX = event.pageX;
      cursorY = event.pageY;
      if (event.identifier) {
        secondaryTouchId = event.identifier;
      }
      originalEvent.preventDefault();
      if (ParticleEffects.isTouch) {
        global.addEventListener("touchmove", onTouchMove, false);
        global.addEventListener("touchend", onSecondaryTouchEnd, false);
      } else {
        global.addEventListener("mousemove", onMouseMove, false);
        global.addEventListener("mouseup", onMouseUp, false);
      }
    }
  }

  function onMouseMove(event) {
    updateCursorPosition(event);
  }

  function onTouchMove(event) {
    for (let i = 0, len = event.changedTouches.length; i < len; i++) {
      let touch = event.changedTouches[i];
      if (secondaryTouchId && touch.identifier === secondaryTouchId) {
        updateCursorPosition(touch);
      }
    }
  }

  function updateCursorPosition(event) {
    cursorX = parseInt(event.pageX, 10);
    cursorY = parseInt(event.pageY, 10);
  }

  function onMouseUp() {
    ParticleEffects.isCursorActive = false;
    global.removeEventListener("mousemove", onMouseMove, false);
    global.removeEventListener("mouseup", onMouseUp, false);
  }

  function onPrimaryTouchEnd(event) {
    for (let i = 0, len = event.changedTouches.length; i < len; i++) {
      let touch = event.changedTouches[i];
      if (touch.identifier === primaryTouchId) {
        primaryTouchId = null;
        deactivateCursor();
        global.removeEventListener("touchend", onPrimaryTouchEnd, false);
      }
    }
  }

  function onSecondaryTouchEnd(event) {
    for (let i = 0, len = event.changedTouches.length; i < len; i++) {
      let touch = event.changedTouches[i];
      if (touch.identifier === secondaryTouchId) {
        deactivateCursor();
      }
    }
  }

  function deactivateCursor() {
    ParticleEffects.isCursorActive = false;
    secondaryTouchId = null;
    if (ParticleEffects.isTouch) {
      global.removeEventListener("touchmove", onTouchMove, false);
      global.removeEventListener("touchend", onSecondaryTouchEnd, false);
    } else {
      global.removeEventListener("mousemove", onMouseMove, false);
      global.removeEventListener("mouseup", onMouseUp, false);
    }
  }

  function animate() {
    if (!ParticleEffects.areAllCharParticlesSettled) {
      isAllParticlesSettled = true;
      for (let i = 0, len = particles.length; i < len; i++) {
        particles[i].update();
      }
      ParticleEffects.areAllCharParticlesSettled = isAllParticlesSettled;
    }
    requestAnimationFrame(animate);
  }

  let primaryTouchId, secondaryTouchId;

  ParticleEffects.addCharParticles = function (elements) {
    let particleArray = [];
    for (let i = 0, len = elements.length; i < len; i++) {
      let particle = new CharParticle(elements[i]);
      particleArray.push(particle);
      particles.push(particle);
    }
    return particleArray;
  };

  ParticleEffects.initCharParticles = function () {
    if (isInitialized) {
      for (let i = 0, len = particles.length; i < len; i++) {
        particles[i].updatePosition();
      }
    } else {
      ParticleEffects.addCharParticles(ParticleEffects.initialParticleElems);
      if (ParticleEffects.isTouch) {
        document.addEventListener("touchstart", onTouchStart, false);
      } else {
        document.addEventListener("mousedown", onMouseDown, false);
      }
      animate();
      isInitialized = true;
    }
  };

  // Initialization
  setTimeout(ParticleEffects.initCharParticles, 20);

  // Initialization of particles and event listeners
  let isParticlesInitialized = false;

  ParticleEffects.initialParticleElems = [];

  function initialize() {
    if (!isParticlesInitialized) {
      let splitElements = document.querySelectorAll(".split");
      for (let i = 0, len = splitElements.length; i < len; i++) {
        let charElements = ParticleEffects.parseForParticles(splitElements[i]);
        ParticleEffects.initialParticleElems =
          ParticleEffects.initialParticleElems.concat(charElements);
      }
      if (!ParticleEffects.isTouch) {
        document.addEventListener(
          "mouseover",
          ParticleEffects.onMouseover,
          false
        );
      }

      isParticlesInitialized = true;
    }
  }

  global.addEventListener("DOMContentLoaded", initialize, false);
  if (!ParticleEffects.isTouch) {
    global.onload = initialize;
  }

  // Utility function to get vendor-prefixed CSS property
  function getVendorPrefixedProperty(property) {
    let prefixes = ["", "Webkit", "Moz", "ms", "O"];
    let style = document.createElement("div").style;

    for (let i = 0; i < prefixes.length; i++) {
      let prop = prefixes[i]
        ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1)
        : property;
      if (prop in style) {
        return prop;
      }
    }
    return null;
  }
})(window);
