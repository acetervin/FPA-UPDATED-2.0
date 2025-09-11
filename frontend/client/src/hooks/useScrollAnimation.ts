import { useEffect, useState } from "react";

export function useScrollAnimation() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll("[data-nav-link]");
      
      let current = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute("id") || "";
        }
      });

      setActiveSection(current);

      // Update navigation highlighting
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === `#${current}`) {
          link.classList.add("text-primary", "font-semibold");
          link.classList.remove("text-foreground/80");
        } else {
          link.classList.remove("text-primary", "font-semibold");
          link.classList.add("text-foreground/80");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { activeSection };
}
