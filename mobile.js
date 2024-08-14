let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  rotating = false;

  init(paper) {
    this.paper = paper;

    // Common function to handle movement
    const handleMovement = (x, y) => {
      if (!this.rotating) {
        this.velX = x - this.prevX;
        this.velY = y - this.prevY;
        this.rotation = (360 + Math.round(180 * Math.atan2(y - this.startY, x - this.startX) / Math.PI)) % 360;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentX += this.velX;
          this.currentY += this.velY;
        }
        this.prevX = x;
        this.prevY = y;
        this.applyTransform();
      }
    };

    // For touch devices
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      this.paper.style.zIndex = highestZ++;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMovement(e.touches[0].clientX, e.touches[0].clientY);
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For mouse devices
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      this.paper.style.zIndex = highestZ++;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;

      if (e.button === 2) {
        this.rotating = true;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.holdingPaper) {
        handleMovement(e.clientX, e.clientY);
      }
    });

    document.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Handle right-click context menu for rotation
    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  applyTransform() {
    this.paper.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${this.rotation}deg)`;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
