import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays,
  Camera,
  ChevronUp,
  Clock,
  ExternalLink,
  FolderOpen,
  GraduationCap,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Music,
  Navigation,
  Pause,
  Play,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import "./styles.css";
import { GUESTS, getGuestFromUrl } from "./data/guests";
import nhacNen from "./nhacnen.mp3";

const CONFIG = {
  graduateName: "Triệu Quang Sáng",
  shortName: "Quang Sáng",
  className: "Class of 2026",
  school: "Trường Đại học Công nghệ Đông Á",
  dateLabel: "07.08.2026",
  ceremonyDate: "2026-08-07T15:00:00+07:00",
  timeLabel: "15:00",
  venueName: "Trường Đại học Công nghệ Đông Á",
  venueAddress: "Phố Phan Tây Nhạc, Nam Từ Liêm, Hà Nội",
  dressCode:
    "Trang phục lịch sự; ưu tiên trắng, kem, xanh navy hoặc đen để hình ảnh hài hòa.",
  mapsUrl:
    "https://maps.google.com/?q=Truong%20Dai%20hoc%20Cong%20nghe%20Dong%20A%20Nam%20Tu%20Liem%20Ha%20Noi",
  galleryUrl: "https://drive.google.com/drive/folders/1kc_jkw_1EO0cxVIInOHLZhyz4uokBP-w?usp=sharing",
  audioUrl:nhacNen,
  invitationMessage:
    "Vậy là một hành trình học tập đã đi đến cột mốc đáng nhớ. Sáng trân trọng mời bạn dành thời gian đến chung vui, cùng lưu lại những khoảnh khắc tốt đẹp và đánh dấu ngày Sáng chính thức khép lại một chặng đường để bước sang hành trình mới. Sự hiện diện của bạn sẽ khiến ngày đặc biệt này trở nên trọn vẹn hơn.",
};

// Khi tạo Google Form mới, thay action và ba mã entry bên dưới.
const GOOGLE_FORM = {
  enabled: false,
  action: "",
  fields: {
    guestId: "entry.000000001",
    guestName: "entry.000000002",
    attendStatus: "entry.000000003",
  },
};

const FIREWORKS = [
  { className: "firework firework-1", particles: 12 },
  { className: "firework firework-2", particles: 14 },
  { className: "firework firework-3", particles: 10 },
  { className: "firework firework-4", particles: 12 },
];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function useCountdown(targetDate) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const difference = Math.max(target - Date.now(), 0);
      setTimeLeft({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return timeLeft;
}

function saveMockRsvp(payload) {
  const key = "graduation-quang-sang-rsvp";
  const current = JSON.parse(localStorage.getItem(key) || "[]");
  current.push({ ...payload, submittedAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(current));
}

async function submitRsvp(payload) {
  if (!GOOGLE_FORM.enabled || !GOOGLE_FORM.action) {
    saveMockRsvp(payload);
    return { mode: "mock" };
  }

  const formData = new FormData();
  formData.append(GOOGLE_FORM.fields.guestId, payload.guestId);
  formData.append(GOOGLE_FORM.fields.guestName, payload.guestName);
  formData.append(GOOGLE_FORM.fields.attendStatus, payload.attendStatus);

  await fetch(GOOGLE_FORM.action, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });

  return { mode: "google-form" };
}

function createConfetti() {
  const root = document.createElement("div");
  root.className = "confetti-root";
  document.body.appendChild(root);

  Array.from({ length: 64 }).forEach((_, index) => {
    const piece = document.createElement("span");
    piece.className = `confetti-piece confetti-${index % 5}`;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 0.7}s`;
    piece.style.animationDuration = `${2.6 + Math.random() * 2.1}s`;
    root.appendChild(piece);
  });

  window.setTimeout(() => root.remove(), 5200);
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["intro", "Thiệp mời"],
    ["invitation", "Thư mời"],
    ["details", "Thông tin"],
    ["album", "Album"],
    ["rsvp", "Xác nhận"],
  ];

  return (
    <header className="site-header">
      <a className="brand" href="#intro" aria-label="Về đầu trang">
        <span>
          <GraduationCap size={18} />
        </span>
        Thiệp tốt nghiệp
      </a>

      <button
        className="menu-btn"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Mở menu"
      >
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>

      <nav className={open ? "nav is-open" : "nav"}>
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function MusicButton() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const removeListeners = () => {
      document.removeEventListener("pointerdown", playOnFirstInteraction);
      document.removeEventListener("keydown", playOnFirstInteraction);
    };

    const playOnFirstInteraction = async (event) => {
      // Nếu bấm đúng nút nhạc thì để hàm toggle bên dưới xử lý
      if (event.target.closest?.(".music-float")) return;

      const audio = audioRef.current;
      if (!audio || !audio.paused) {
        removeListeners();
        return;
      }

      try {
        audio.volume = 0.6;
        await audio.play();
        setPlaying(true);
        removeListeners();
      } catch (error) {
        console.warn("Trình duyệt chưa cho phép phát nhạc:", error);
      }
    };

    document.addEventListener("pointerdown", playOnFirstInteraction);
    document.addEventListener("keydown", playOnFirstInteraction);

    return removeListeners;
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        audio.volume = 0.6;
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch (error) {
      console.warn("Không thể phát nhạc:", error);
      setPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={CONFIG.audioUrl}
        loop
        preload="auto"
      />

      <button
        type="button"
        className={playing ? "music-float is-playing" : "music-float"}
        onClick={toggleMusic}
        aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
      >
        {playing ? <Pause size={17} /> : <Play size={17} />}
        <Music size={14} />
      </button>
    </>
  );
}

function WaxSeal() {
  return (
    <span className="wax-seal" aria-hidden="true">
      <Heart size={23} />
    </span>
  );
}

function FireworksBackdrop() {
  return (
    <div className="intro-fireworks" aria-hidden="true">
      {FIREWORKS.map((firework, fireworkIndex) => (
        <span className={firework.className} key={firework.className}>
          <span className="firework-rocket" />
          <span className="firework-burst">
            {Array.from({ length: firework.particles }).map((_, particleIndex) => (
              <i
                key={particleIndex}
                style={{
                  "--angle": `${(360 / firework.particles) * particleIndex}deg`,
                  "--distance": `${62 + (particleIndex % 3) * 18}px`,
                  "--particle-delay": `${fireworkIndex * 0.02 + particleIndex * 0.008}s`,
                }}
              />
            ))}
          </span>
        </span>
      ))}
    </div>
  );
}

// Giữ nguyên bố cục phong bì, thay sticker cũ bằng pháo hoa CSS có hiệu ứng bắn.
function EnvelopeIntro() {
  const openInvite = () => {
    document
      .querySelector("#invitation")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="intro" className="intro">
      <div className="paper-grain" />
      <FireworksBackdrop />

      <div className="intro-copy" data-reveal>
        <h1>Lễ Tốt Nghiệp</h1>
        <span>♥</span>
      </div>

      <button
        className="envelope-stage"
        type="button"
        onClick={openInvite}
        aria-label="Xem thiệp mời tốt nghiệp"
      >
        <div className="tap-hint">Chạm để xem thiệp</div>
        <div className="envelope">
          <div className="envelope-back" />
          <div className="letter-peek" />
          <div className="envelope-flap" />
          <div className="envelope-front" />
          <WaxSeal />
        </div>
      </button>
    </section>
  );
}

function PersonalInvitation({ guest }) {
  const countdown = useCountdown(CONFIG.ceremonyDate);
  const units = [
    ["Ngày", countdown.days],
    ["Giờ", countdown.hours],
    ["Phút", countdown.minutes],
    ["Giây", countdown.seconds],
  ];

  return (
    <section id="invitation" className="section invitation-editorial-section">
      <div className="layout-shell">
        <article className="editorial-invite invitation-no-photo" data-reveal>
          <aside className="invite-rail">
            <strong>Thư mời</strong>
          </aside>

          <div className="editorial-copy">
            <p className="eyebrow">Thư mời tham dự</p>
            <h2>
              Lễ tốt nghiệp
            </h2>

            <div className="guest-message-card">
              <strong>Thân mời {guest.displayName},</strong>
              <p>{CONFIG.invitationMessage}</p>
            </div>
          </div>

          <aside className="invitation-date-panel">
            <span className="date-panel-label">Thời gian</span>
            <strong className="date-panel-time">15:00-17:00</strong>
            <div className="date-panel-rule" />
            <strong className="date-panel-date">07.08</strong>
            <span className="date-panel-year">2026</span>
            <div className="date-panel-place">
              <GraduationCap size={21} />
              <span>
                <strong>{CONFIG.school}</strong>
                <small>{CONFIG.venueAddress}</small>
              </span>
            </div>
          </aside>
        </article>

        <div className="countdown-band" data-reveal>
          <div className="countdown-heading">
            <small>Countdown</small>
            <strong>Hẹn gặp bạn tại cột mốc đặc biệt này</strong>
          </div>
          <div className="countdown-values">
            {units.map(([label, value]) => (
              <div className="countdown-unit" key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventDetails() {
  const details = [
    {
      icon: <CalendarDays size={23} />,
      index: "01",
      label: "Thời gian",
      title: `${CONFIG.timeLabel} · ${CONFIG.dateLabel}`,
      text: "Vui lòng có mặt sớm một chút để cùng chuẩn bị và chụp ảnh.",
    },
    {
      icon: <MapPin size={23} />,
      index: "02",
      label: "Địa điểm",
      title: CONFIG.venueName,
      text: CONFIG.venueAddress,
    },
    {
      icon: <GraduationCap size={23} />,
      index: "03",
      label: "Trang phục",
      title: "Smart & Neat",
      text: CONFIG.dressCode,
    },
  ];

  return (
    <section id="details" className="section details-section">
      <div className="layout-shell">
        <header className="section-heading" data-reveal>
          <div>
            <p>Thông tin buổi lễ</p>
            <h2>Mọi điều bạn cần biết</h2>
          </div>
          <a className="text-link" href={CONFIG.mapsUrl} target="_blank" rel="noreferrer">
            Mở bản đồ <ExternalLink size={17} />
          </a>
        </header>

        <div className="details-track" data-reveal>
          {details.map((item) => (
            <article className="detail-module" key={item.index}>
              <span className="detail-index">{item.index}</span>
              <span className="detail-icon">{item.icon}</span>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>

        <a className="map-route-button" href={CONFIG.mapsUrl} target="_blank" rel="noreferrer">
          <Navigation size={18} /> Chỉ đường tới địa điểm
        </a>
      </div>
    </section>
  );
}

function AlbumSection() {
  return (
    <section id="album" className="section album-section">
      <div className="layout-shell">
        <a
          className="drive-editorial-card"
          href={CONFIG.galleryUrl}
          target="_blank"
          rel="noreferrer"
          data-reveal
        >
          <div className="drive-copy">
            <span className="drive-tag">Album / Google Drive</span>
            <h2>Khoảnh khắc sau buổi lễ</h2>
            <p>
              Ảnh sẽ được cập nhật tại thư mục Drive sau ngày chụp. Bạn có thể mở,
              xem và tải ảnh chất lượng gốc tại đây.
            </p>
            <span className="drive-open-button">
              Mở thư mục ảnh <ExternalLink size={17} />
            </span>
          </div>

          <div className="drive-art" aria-hidden="true">
            <div className="folder-back" />
            <div className="folder-paper paper-one">
              <Camera size={35} />
            </div>
            <div className="folder-paper paper-two">2026</div>
            <div className="folder-front">
              <FolderOpen size={52} />
              <span>GRADUATION ARCHIVE</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

function RsvpSection({ guest }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMode, setSaveMode] = useState("mock");

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      guestId: guest.id,
      guestName: formData.get("guestName") || guest.displayName,
      attendStatus: formData.get("attendStatus"),
    };

    setSaving(true);
    try {
      const result = await submitRsvp(payload);
      setSaveMode(result.mode);
      setSent(true);
      createConfetti();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="rsvp" className="section rsvp-section">
      <div className="layout-shell">
        <article className="rsvp-split-card" data-reveal>
          <div className="rsvp-copy">
            <p>RSVP / Phản hồi</p>
            <h2>Rất mong được đón tiếp bạn</h2>
          </div>

          <div className="rsvp-ticket">
            <span className="ticket-hole ticket-hole-top" />
            <span className="ticket-hole ticket-hole-bottom" />
            <div className="ticket-code">GUEST PASS</div>
            <UserRound size={26} />
            <small>Khách mời</small>
            <strong>{guest.displayName}</strong>
            <button className="primary-button" type="button" onClick={() => setOpen(true)}>
              Xác nhận tham dự
            </button>
          </div>
        </article>
      </div>

      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="rsvp-modal">
            <button
              className="close-modal"
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng form RSVP"
            >
              <X size={20} />
            </button>

            {!sent ? (
              <form onSubmit={submit}>
                <p className="modal-kicker">Xác nhận tham dự</p>
                <h3>Hẹn gặp bạn trong ngày tốt nghiệp</h3>

                <label>
                  Họ và tên
                  <input
                    name="guestName"
                    required
                    defaultValue={guest.displayName}
                    placeholder="Nhập tên của bạn"
                  />
                </label>

                <label>
                  Bạn có thể tham dự không?
                  <select name="attendStatus" required defaultValue="">
                    <option value="" disabled>
                      Chọn câu trả lời
                    </option>
                    <option value="Có, mình sẽ tham dự">Có, mình sẽ tham dự</option>
                    <option value="Rất tiếc, mình không thể tham dự">
                      Rất tiếc, mình không thể tham dự
                    </option>
                  </select>
                </label>

                <button className="modal-submit" type="submit" disabled={saving}>
                  <Send size={18} /> {saving ? "Đang gửi..." : "Gửi phản hồi"}
                </button>
              </form>
            ) : (
              <div className="success-note">
                <Sparkles size={44} />
                <h3>Cảm ơn bạn!</h3>
                <p>
                  Phản hồi đã được ghi nhận
                  {saveMode === "mock" ? " ở chế độ demo trên trình duyệt." : " vào Google Form."}
                </p>
                <button className="modal-submit" type="button" onClick={() => setOpen(false)}>
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ThankYouSection({ guest }) {
  return (
    <section id="thanks" className="section thanks-section">
      <div className="layout-shell">
        <article className="thank-editorial thank-no-photo" data-reveal>
          <div className="thank-copy">
            <p>Lời cảm ơn</p>
            <h2>Cảm ơn vì đã đồng hành!</h2>
            <span>Hẹn gặp {guest.displayName} lúc 15:00 ngày 07.08.2026.</span>
            <strong>{CONFIG.shortName}</strong>
          </div>

          <div className="thank-event-stamp" aria-hidden="true">
            <span>07</span>
            <small>AUG</small>
            <strong>2026</strong>
          </div>

          <div className="thank-mark" aria-hidden="true">
            <GraduationCap size={42} />
          </div>
        </article>
      </div>
    </section>
  );
}

function FloatingNav() {
  return (
    <div className="floating-nav" aria-label="Điều hướng nhanh">
      <a href="#intro" aria-label="Về đầu trang">
        <ChevronUp size={18} />
      </a>
      <a href="#invitation" aria-label="Lời mời">
        <CalendarDays size={18} />
      </a>
      <a href="#details" aria-label="Thông tin">
        <Clock size={18} />
      </a>
      <a href="#rsvp" aria-label="Xác nhận">
        <MessageCircle size={18} />
      </a>
    </div>
  );
}

function AdminGuestLinks() {
  const baseUrl = `${window.location.origin}${window.location.pathname}`;

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Đã copy link mời");
    } catch {
      window.prompt("Copy link này:", url);
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-card">
        <p>Invitation link manager</p>
        <h1>Danh sách khách mời demo</h1>
        <span>
          Tất cả khách dùng chung một nội dung lời mời; chỉ tên và nhóm khách thay đổi.
          Sửa danh sách trong <code>src/data/guests.js</code>.
        </span>

        <div className="guest-table">
          {Object.entries(GUESTS).map(([id, guest]) => {
            const url = `${baseUrl}?guest=${id}`;
            return (
              <div className="guest-row" key={id}>
                <div>
                  <strong>{guest.name}</strong>
                  <span>{guest.group}</span>
                </div>
                <input value={url} readOnly aria-label={`Link mời ${guest.name}`} />
                <button type="button" onClick={() => copyLink(url)}>
                  Copy link
                </button>
              </div>
            );
          })}
        </div>

        <div className="admin-example">
          Tên tùy chỉnh: <code>{baseUrl}?to=Nguyễn%20Văn%20A</code>
        </div>
      </section>
    </main>
  );
}

function App() {
  useReveal();
  const params = new URLSearchParams(window.location.search);
  const guest = getGuestFromUrl();

  if (params.get("admin") === "1") {
    return <AdminGuestLinks />;
  }

  return (
    <>
      <Header />
      <MusicButton />
      <main>
        <EnvelopeIntro />
        <PersonalInvitation guest={guest} />
        <EventDetails />
        <AlbumSection />
        <RsvpSection guest={guest} />
        <ThankYouSection guest={guest} />
      </main>
      <FloatingNav />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
