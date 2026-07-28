const updateEventDetails = () => {
  const section = document.querySelector("#details");
  const modules = section?.querySelectorAll(".detail-module");

  if (!section || !modules || modules.length < 3) return false;

  const [timeModule, venueModule, contactModule] = modules;

  const setupSingleTitle = (module, title, html = false) => {
    module.querySelector("h3")?.remove();

    let text = module.querySelector("p.detail-primary-title");
    if (!text) {
      text = module.querySelector("p");
    }
    if (!text) {
      text = document.createElement("p");
      module.appendChild(text);
    }

    text.className = "detail-primary-title";
    if (html) {
      text.innerHTML = title;
    } else {
      text.textContent = title;
    }
  };

  const timeLabel = timeModule.querySelector("small");
  if (timeLabel) timeLabel.textContent = "Thời gian";
  setupSingleTitle(timeModule, "15:00–17:00 · 07.08.2026");

  const venueLabel = venueModule.querySelector("small");
  if (venueLabel) venueLabel.textContent = "Địa điểm";
  setupSingleTitle(venueModule, "Hội trường tầng 6 · Tòa VIETNAM BUILDING");

  const contactIcon = contactModule.querySelector(".detail-icon");
  const contactLabel = contactModule.querySelector("small");

  if (contactIcon) {
    contactIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    `;
  }

  if (contactLabel) contactLabel.textContent = "Thông tin liên lạc";
  setupSingleTitle(
    contactModule,
    'Messenger, Zalo hoặc <a href="tel:0876033311">0876033311</a>',
    true,
  );

  section.querySelector(".section-heading .text-link")?.remove();
  section.dataset.detailsUpdated = "true";

  return true;
};

const scheduleDetailsUpdate = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateEventDetails();
    });
  });
};

const observer = new MutationObserver(() => {
  if (document.querySelector("#details .detail-module")) {
    scheduleDetailsUpdate();
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

scheduleDetailsUpdate();
window.setTimeout(updateEventDetails, 120);
window.setTimeout(updateEventDetails, 500);
window.setTimeout(() => observer.disconnect(), 1500);
