const GOOGLE_FORM = {
  action:
    "https://docs.google.com/forms/d/e/1FAIpQLSdiOCNIDjRqD2sXT7WOJac326U-iD3y4IzfSIcjTy2703pHNg/formResponse",
  fields: {
    guestId: "entry.731183052",
    guestName: "entry.1386012636",
    attendStatus: "entry.435539801",
  },
};

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

  const googleForm = document.createElement("form");
  googleForm.method = "POST";
  googleForm.action = GOOGLE_FORM.action;
  googleForm.target = frameName;
  googleForm.hidden = true;

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
    googleForm.appendChild(input);
  });

  document.body.append(iframe, googleForm);
  googleForm.submit();

  window.setTimeout(() => {
    googleForm.remove();
    iframe.remove();
  }, 8000);
}

function showSendingState(form) {
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;

  button.disabled = true;
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
    Đang gửi...
  `;
}

function showSuccessState(form) {
  form.innerHTML = `
    <div class="success-note">
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </svg>
      <h3>Cảm ơn bạn!</h3>
      <p>Phản hồi đã được gửi và lưu vào Google Form.</p>
    </div>
  `;
}

function handleRsvpSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (!form.closest(".rsvp-modal")) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (form.dataset.rsvpState === "sending" || form.dataset.rsvpState === "sent") {
    return;
  }

  const formData = new FormData(form);
  const guestName = String(formData.get("guestName") || "").trim();
  const attendStatus = String(formData.get("attendStatus") || "").trim();

  if (!guestName || !attendStatus) return;

  form.dataset.rsvpState = "sending";
  showSendingState(form);

  submitToGoogleForm({
    guestId: getGuestId(),
    guestName,
    attendStatus,
  });

  window.setTimeout(() => {
    form.dataset.rsvpState = "sent";
    showSuccessState(form);
  }, 700);
}

if (!window.__graduationRsvpHandlerInstalled) {
  window.__graduationRsvpHandlerInstalled = true;
  document.addEventListener("submit", handleRsvpSubmit, true);
}
