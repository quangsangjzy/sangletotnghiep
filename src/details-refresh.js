const updateEventDetails = () => {
  const section = document.querySelector("#details");
  const modules = section?.querySelectorAll(".detail-module");

  if (!section || !modules || modules.length < 3) return false;

  const [, venueModule, contactModule] = modules;

  const venueLabel = venueModule.querySelector("small");
  const venueTitle = venueModule.querySelector("h3");
  const venueText = venueModule.querySelector("p");

  if (venueLabel) venueLabel.textContent = "Địa điểm";
  if (venueTitle) venueTitle.textContent = "Hội trường tầng 6";
  if (venueText) venueText.textContent = "Tòa VIETNAM BUILDING";

  const contactIcon = contactModule.querySelector(".detail-icon");
  const contactLabel = contactModule.querySelector("small");
  const contactTitle = contactModule.querySelector("h3");
  const contactText = contactModule.querySelector("p");

  if (contactIcon) {
    contactIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    `;
  }

  if (contactLabel) contactLabel.textContent = "Thông tin liên lạc";
  if (contactTitle) contactTitle.textContent = "Liên hệ với Quang Sáng";
  if (contactText) {
    contactText.innerHTML =
      'Liên hệ qua Messenger, Zalo hoặc gọi <a href="tel:0876033311">0876033311</a>.';
  }

  section.querySelector(".section-heading .text-link")?.remove();
  section.dataset.detailsUpdated = "true";

  return true;
};

if (!updateEventDetails()) {
  const observer = new MutationObserver(() => {
    if (updateEventDetails()) observer.disconnect();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
