const moveCountdownIntoDatePanel = () => {
  const datePanel = document.querySelector(".invitation-date-panel");
  const countdownValues = document.querySelector(".countdown-band .countdown-values");

  if (!datePanel || !countdownValues) return false;
  if (datePanel.querySelector(".date-panel-countdown")) return true;

  const countdownBlock = document.createElement("div");
  countdownBlock.className = "date-panel-countdown";
  countdownBlock.setAttribute("aria-label", "Thời gian còn lại đến lễ tốt nghiệp");

  const title = document.createElement("span");
  title.className = "date-panel-countdown-title";
  title.textContent = "COUNTDOWN";

  countdownBlock.append(title, countdownValues);

  const year = datePanel.querySelector(".date-panel-year");
  const date = datePanel.querySelector(".date-panel-date");

  if (year) {
    year.insertAdjacentElement("afterend", countdownBlock);
  } else if (date) {
    date.insertAdjacentElement("afterend", countdownBlock);
  } else {
    datePanel.append(countdownBlock);
  }

  return true;
};

if (!moveCountdownIntoDatePanel()) {
  const observer = new MutationObserver(() => {
    if (moveCountdownIntoDatePanel()) observer.disconnect();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
