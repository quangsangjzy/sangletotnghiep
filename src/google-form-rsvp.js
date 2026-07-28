const GOOGLE_FORM = {
  action:
    "https://docs.google.com/forms/d/e/1FAIpQLSdiOCNIDjRqD2sXT7WOJac326U-iD3y4IzfSIcjTy2703pHNg/formResponse",
  fields: {
    guestId: "entry.731183052",
    guestName: "entry.1386012636",
    attendStatus: "entry.435539801",
  },
};

let sentToGoogleForm = false;

function getGuestId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("guest") || params.get("to") || "guest";
}

function submitToGoogleForm(payload) {
  const frameName = `google-form-rsvp-${Date.now()}`;

  const iframe = document.createElement("iframe");
  iframe.name = frameName;
  iframe.title = "Google Form RSVP submission";
  iframe.hidden = true;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = GOOGLE_FORM.action;
  form.target = frameName;
  form.hidden = true;

  const fields = {
    [GOOGLE_FORM.fields.guestId]: payload.guestId,
    [GOOGLE_FORM.fields.guestName]: payload.guestName,
    [GOOGLE_FORM.fields.attendStatus]: payload.attendStatus,
    fvv: "1",
    pageHistory: "0",
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value ?? "");
    form.appendChild(input);
  });

  document.body.append(iframe, form);
  form.submit();
  sentToGoogleForm = true;

  window.setTimeout(() => {
    form.remove();
    iframe.remove();
  }, 8000);
}

function updateSuccessMessage() {
  if (!sentToGoogleForm) return;

  const message = document.querySelector(".success-note p");
  if (message) {
    message.textContent = "Phản hồi đã được gửi tới Google Form.";
  }
}

document.addEventListener(
  "submit",
  (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.closest(".rsvp-modal")) return;
    if (form.dataset.googleFormSubmitted === "true") return;

    const formData = new FormData(form);
    const guestName = String(formData.get("guestName") || "").trim();
    const attendStatus = String(formData.get("attendStatus") || "").trim();

    if (!guestName || !attendStatus) return;

    form.dataset.googleFormSubmitted = "true";
    submitToGoogleForm({
      guestId: getGuestId(),
      guestName,
      attendStatus,
    });

    requestAnimationFrame(updateSuccessMessage);
    window.setTimeout(updateSuccessMessage, 100);
  },
  true,
);

const observer = new MutationObserver(updateSuccessMessage);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
