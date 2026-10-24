/*
 * Lời chúc sinh nhật dùng chung cho mọi khách truy cập.
 * Cần có script CDN trước đoạn script chính:
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 * Thay PROJECT_URL và PUBLISHABLE_OR_ANON_KEY bằng thông tin trong Supabase > Project Settings > API.
 * KHÔNG dùng service_role key trong trình duyệt.
 * Thay event listener guestbookForm cũ bằng toàn bộ đoạn này.
 */
const SUPABASE_URL = "https://PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_PUBLISHABLE_OR_ANON_KEY_HERE";

const guestbookToggle = document.getElementById("guestbookToggle");
const guestbookForm = document.getElementById("guestbookForm");
const guestbookNote = guestbookForm.querySelector(".guestbook-note");
const wishBubbleIds = new Set();

const supabaseReady =
  window.supabase &&
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PROJECT_ID") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

const sharedWishes = supabaseReady
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

guestbookToggle.addEventListener("click", () => {
  const opened = guestbookForm.classList.toggle("open");
  guestbookToggle.setAttribute("aria-expanded", String(opened));
});

function showSharedWish(name, text) {
  const bubble = document.createElement("div");
  bubble.className = "wish-bubble";
  const sender = document.createElement("strong");
  sender.textContent = `${name} gửi lời chúc 💖`;
  const message = document.createElement("span");
  message.textContent = text;
  bubble.append(sender, message);

  const edge = Math.floor(Math.random() * 4);
  if (edge === 0) {
    bubble.style.left = `${4 + Math.random() * 55}vw`;
    bubble.style.top = "12vh";
  } else if (edge === 1) {
    bubble.style.left = `${4 + Math.random() * 55}vw`;
    bubble.style.bottom = "8vh";
  } else if (edge === 2) {
    bubble.style.left = "3vw";
    bubble.style.top = `${18 + Math.random() * 55}vh`;
  } else {
    bubble.style.right = "3vw";
    bubble.style.top = `${18 + Math.random() * 55}vh`;
  }

  document.body.appendChild(bubble);
  window.setTimeout(() => bubble.remove(), 8200);
}

async function loadSharedWishes() {
  if (!sharedWishes) return;
  const { data, error } = await sharedWishes
    .from("birthday_wishes")
    .select("id,name,message,created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Không tải được lời chúc dùng chung:", error.message);
    return;
  }

  // Hiện lần lượt các lời chúc mới nhất, tránh chồng quá nhiều bong bóng cùng lúc.
  const unseen = (data || []).filter((item) => !wishBubbleIds.has(item.id)).reverse();
  unseen.forEach((item, index) => {
    wishBubbleIds.add(item.id);
    window.setTimeout(() => showSharedWish(item.name, item.message), index * 2200);
  });
}

guestbookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const message = document.getElementById("guestWish").value.trim();
  if (!name || !message) return;

  if (!sharedWishes) {
    guestbookNote.textContent = "Cần điền Project URL và khóa công khai Supabase để chia sẻ lời chúc cho mọi người.";
    return;
  }

  const sendButton = guestbookForm.querySelector(".guestbook-send");
  sendButton.disabled = true;
  sendButton.textContent = "Đang gửi…";
  const { data, error } = await sharedWishes
    .from("birthday_wishes")
    .insert({ name, message })
    .select("id,name,message,created_at")
    .single();

  sendButton.disabled = false;
  sendButton.textContent = "Gửi lời chúc ✨";

  if (error) {
    guestbookNote.textContent = "Chưa gửi được. Hãy kiểm tra cấu hình Supabase và thử lại.";
    console.error("Không gửi được lời chúc:", error.message);
    return;
  }

  // Hiện ngay ở trình duyệt người gửi; các trình duyệt khác nhận lời chúc qua lần đồng bộ kế tiếp.
  wishBubbleIds.add(data.id);
  showSharedWish(data.name, data.message);
  guestbookNote.textContent = "Đã gửi lời chúc đến mọi người!";
  guestbookForm.reset();
  guestbookForm.classList.remove("open");
  guestbookToggle.setAttribute("aria-expanded", "false");
});

if (sharedWishes) {
  loadSharedWishes();
  // Đồng bộ các lời chúc mới cho tất cả khách đang mở thiệp.
  window.setInterval(loadSharedWishes, 8000);
}
