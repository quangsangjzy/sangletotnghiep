const moveCountdownIntoDatePanel = () => {
  const datePanel = document.querySelector(".invitation-date-panel");
  const countdownValues = document.querySelector(".countdown-band .countdown-values");

  if (!datePanel || !countdownValues) return false;
  if (datePanel.contains(countdownValues)) return true;

  const time = datePanel.querySelector(".date-panel-time");
  if (time) {
    time.insertAdjacentElement("afterend", countdownValues);
  } else {
    datePanel.prepend(countdownValues);
  }

  countdownValues.setAttribute("aria-label", "Thời gian còn lại đến lễ tốt nghiệp");
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
