export const GUESTS = {
  "ban-than": {
    name: "Minh Anh",
    displayName: "Minh Anh",
    group: "Bạn bè",
  },
  "thay-co": {
    name: "Thầy cô",
    displayName: "thầy cô",
    group: "Thầy cô",
  },
  "gia-dinh": {
    name: "Gia đình",
    displayName: "cả nhà",
    group: "Gia đình",
  },
  "dong-nghiep": {
    name: "Anh chị đồng nghiệp",
    displayName: "anh chị",
    group: "Đồng nghiệp",
  },
};

export const DEFAULT_GUEST = {
  id: "guest",
  name: "Bạn",
  displayName: "bạn",
  group: "Khách mời",
};

export function getGuestFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const guestId = params.get("guest");
  const customName = params.get("to")?.trim();

  if (guestId && GUESTS[guestId]) {
    return { id: guestId, ...GUESTS[guestId] };
  }

  if (customName) {
    return {
      ...DEFAULT_GUEST,
      id: `custom-${customName.toLowerCase().replace(/\s+/g, "-")}`,
      name: customName,
      displayName: customName,
    };
  }

  return DEFAULT_GUEST;
}
