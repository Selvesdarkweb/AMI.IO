let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const startHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if (e.touches) { // For touch events
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      } else { // For mouse events
        this.touchStartX = e.clientX;
        this.touchStartY = e.clientY;
      }
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    };

    const moveHandler = (e) => {
      e.preventDefault();
      if (this.rotating) return;

      if (e.touches) { // For touch events
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;
      } else { // For mouse events
        this.touchMoveX = e.clientX;
        this.touchMoveY = e.clientY;
      }

      this.velX = this.touchMoveX - this.prevTouchX;
      this.velY = this.touchMoveY - this.prevTouchY;

      const dirX = this.touchMoveX - this.touchStartX;
      const dirY = this.touchMoveY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Add event listeners for touch and mouse interactions
    paper.addEventListener('touchstart', startHandler);
    paper.addEventListener('touchmove', moveHandler);
    paper.addEventListener('touchend', endHandler);

    paper.addEventListener('mousedown', startHandler);
    paper.addEventListener('mousemove', moveHandler);
    paper.addEventListener('mouseup', endHandler);

    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
