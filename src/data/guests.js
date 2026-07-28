export const GUESTS = {
  "nam": {
    name: "Thế Nam",
    displayName: "Thế Nam",
    group: "Bạn bè",
  },
  "dieulinh": {
    name: "Diệu Linh",
    displayName: "Diệu Linh",
    group: "Bạn bè",
  },
  "maitrang": {
    name: "Mai Trang",
    displayName: "Mai Trang",
    group: "Bạn bè",
  },
  "quocanh": {
    name: "Quốc Anh",
    displayName: "Quốc Anh",
    group: "Bạn bè",
  },
  "thanhthao": {
    name: "Em Thảo",
    displayName: "Em Thảo",
    group: "Bạn bè",
  },
  "nguyet": {
    name: "Nguyệt",
    displayName: "Nguyệt",
    group: "Bạn bè",
  },
  "nam": {
    name: "Minh Anh",
    displayName: "Minh Anh",
    group: "Bạn bè",
  },
  "nhumai": {
    name: "Như Mai",
    displayName: "Như Mai",
    group: "Bạn bè",
  },
  "nangvungcao": {
    name: "Thu Hiền, Yến Chi, Ánh Hoàn",
    displayName: "Thu Hiền, Yến Chi, Ánh Hoàn",
    group: "Bạn bè",
  },
  "giangmee": {
    name: "Giang Mee",
    displayName: "Giang Mee",
    group: "Bạn bè",
  },
  "nhat": {
    name: "Nhật",
    displayName: "Nhật",
    group: "Bạn bè",
  },
  "honghanh": {
    name: "Hồng Hạnh",
    displayName: "Hồng Hạnh",
    group: "Bạn bè",
  },
  "nguyenmai": {
    name: "Nguyễn Mai",
    displayName: "Nguyễn Mai",
    group: "Bạn bè",
  },
  "kimloan": {
    name: "Kim Loan",
    displayName: "Kim Loan",
    group: "Bạn bè",
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
