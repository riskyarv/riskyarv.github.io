// Level 1: Splash lightbox (opens the image in-page instead of a new tab)

document.addEventListener("DOMContentLoaded", () => {
  const opener = document.getElementById("splash-open");
  const lightbox = document.getElementById("splash-lightbox");
  if (!opener || !lightbox || typeof lightbox.showModal !== "function") return;

  const image = document.getElementById("splash-lightbox-image");
  const closeBtn = document.getElementById("splash-close");

  function close() {
    lightbox.close();
  }

  opener.addEventListener("click", (event) => {
    event.preventDefault();
    lightbox.classList.remove("zoomed");
    closeBtn.setAttribute("aria-label", (typeof t === "function" && t("l1-lightbox-close")) || "Close");
    lightbox.showModal();
    document.body.classList.add("lightbox-open");
  });

  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
  });

  closeBtn.addEventListener("click", close);

  image.addEventListener("click", (event) => {
    event.stopPropagation();
    const zoomed = lightbox.classList.toggle("zoomed");
    if (zoomed) {
      // Center the zoomed image around the tapped point
      const rect = image.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;
      const scroller = image.parentElement;
      requestAnimationFrame(() => {
        scroller.scrollLeft = relX * scroller.scrollWidth - scroller.clientWidth / 2;
        scroller.scrollTop = relY * scroller.scrollHeight - scroller.clientHeight / 2;
      });
    }
  });

  // Clicking the backdrop (outside the image) closes the lightbox
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.classList.contains("splash-lightbox-scroll")) {
      close();
    }
  });
});
