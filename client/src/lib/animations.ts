export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export const animateCounter = (
  element: HTMLElement,
  target: number,
  duration: number = 2000
) => {
  const start = performance.now();
  
  const updateCounter = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    
    const current = Math.floor(target * easeOutExpo);
    element.textContent = current.toString();
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toString();
    }
  };
  
  requestAnimationFrame(updateCounter);
};

export const staggeredAnimation = (
  elements: NodeListOf<Element> | Element[],
  delay: number = 100
) => {
  Array.from(elements).forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("animate-slide-up");
    }, index * delay);
  });
};
