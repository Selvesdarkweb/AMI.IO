let highestZ = 1;

class Paper {
  constructor(paperElement) {
    this.paperElement = paperElement;
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;

    this.init();
  }

  init() {
    // Mouse event listeners
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.paperElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));

    // Touch event listeners
    this.paperElement.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.paperElement.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  handleMouseMove(e) {
    if (!this.holdingPaper) return;

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      this.updateTransform();
    }

    if (this.rotating) {
      this.updateRotation(e.clientX, e.clientY);
    }
  }

  handleMouseDown(e) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    this.paperElement.style.zIndex = highestZ;
    highestZ += 1;

    this.mouseTouchX = e.clientX;
    this.mouseTouchY = e.clientY;
    this.prevMouseX = e.clientX;
    this.prevMouseY = e.clientY;

    if (e.button === 2) {
      this.rotating = true;
    }
  }

  handleMouseUp() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  handleTouchStart(e) {
    e.preventDefault(); // Prevent default touch behavior

    if (this.holdingPaper) return;

    this.holdingPaper = true;
    this.paperElement.style.zIndex = highestZ;
    highestZ += 1;

    const touch = e.touches[0];
    this.mouseTouchX = touch.clientX;
    this.mouseTouchY = touch.clientY;
    this.prevMouseX = touch.clientX;
    this.prevMouseY = touch.clientY;
  }

  handleTouchMove(e) {
    e.preventDefault(); // Prevent default touch behavior

    const touch = e.touches[0];
    this.mouseX = touch.clientX;
    this.mouseY = touch.clientY;

    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      this.updateTransform();
    }

    if (this.rotating) {
      this.updateRotation(this.mouseX, this.mouseY);
    }
  }

  handleTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  updateTransform() {
    this.paperElement.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  updateRotation(x, y) {
    const dirX = x - this.mouseTouchX;
    const dirY = y - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    this.rotation = degrees;
    this.updateTransform();
  }
}

// Prevent default context menu on right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Initialize Paper objects
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => new Paper(paper));
