import { messages, interpolate, type AppLanguage } from "@/i18n/messages";

export function formatDate(
  date: string,
  includeRelative = false,
  lang: AppLanguage = "es"
) {
  const currentDate = new Date();
  let dateStr = date;
  if (!dateStr.includes("T")) {
    dateStr = `${dateStr}T00:00:00`;
  }

  const targetDate = new Date(dateStr);
  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  const m = messages[lang];
  let relativePart = "";

  if (yearsAgo > 0) {
    relativePart = interpolate(m["date.years_ago"], { n: yearsAgo });
  } else if (monthsAgo > 0) {
    relativePart = interpolate(m["date.months_ago"], { n: monthsAgo });
  } else if (daysAgo > 0) {
    relativePart = interpolate(m["date.days_ago"], { n: daysAgo });
  } else {
    relativePart = m["date.today"];
  }

  const locale = lang === "es" ? "es-AR" : "en-US";
  const fullDate = targetDate.toLocaleString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${relativePart})`;
}
