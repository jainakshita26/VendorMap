// converts "09:00" → 540 (minutes since midnight)
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// formats "21:00" → "9:00 PM"
export const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 || 12;
  const min    = m.toString().padStart(2, "0");
  return `${hour}:${min} ${period}`;
};

// returns { isOpen, label }
// isOpen → true/false
// label  → "Closes at 9:00 PM" or "Opens Monday at 9:00 AM"
export const getShopStatus = (hours, temporarilyClosed = false) => {
  // ← check temporary closure first
  if (temporarilyClosed) {
    return { isOpen: false, label: "Closed for today" };
  }

  if (!hours || hours.length === 0) return { isOpen: false, label: "" };

  const now     = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const current = now.getHours() * 60 + now.getMinutes();

  const today = hours.find((h) => h.day === dayName);
  if (!today || today.isClosed) {
    const days       = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const todayIndex = days.indexOf(dayName);
    for (let i = 1; i <= 7; i++) {
      const next = hours.find((h) => h.day === days[(todayIndex + i) % 7]);
      if (next && !next.isClosed) {
        const label = i === 1
          ? `Opens tomorrow at ${formatTime(next.open)}`
          : `Opens ${next.day} at ${formatTime(next.open)}`;
        return { isOpen: false, label };
      }
    }
    return { isOpen: false, label: "Closed" };
  }

  const openMin  = timeToMinutes(today.open);
  const closeMin = timeToMinutes(today.close);

  if (current >= openMin && current < closeMin) {
    return { isOpen: true, label: `Closes at ${formatTime(today.close)}` };
  }

  if (current < openMin) {
    return { isOpen: false, label: `Opens at ${formatTime(today.open)}` };
  }

  const days       = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const todayIndex = days.indexOf(dayName);
  for (let i = 1; i <= 7; i++) {
    const next = hours.find((h) => h.day === days[(todayIndex + i) % 7]);
    if (next && !next.isClosed) {
      const label = i === 1
        ? `Opens tomorrow at ${formatTime(next.open)}`
        : `Opens ${next.day} at ${formatTime(next.open)}`;
      return { isOpen: false, label };
    }
  }

  return { isOpen: false, label: "Closed" };
};