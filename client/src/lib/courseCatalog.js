export const API_ROOT = "https://syncsphere-hiv6.onrender.com";
const COURSE_CACHE_KEY = "skillpath:verified-course-catalogue";
const COUNTRY_CACHE_KEY = "skillpath:verified-country-code";

const wait = (duration, signal) => new Promise((resolve, reject) => {
  const timeout = window.setTimeout(resolve, duration);
  signal?.addEventListener("abort", () => {
    window.clearTimeout(timeout);
    reject(new DOMException("Request aborted", "AbortError"));
  }, { once: true });
});

const readCache = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return parsed?.value ?? null;
  } catch {
    return null;
  }
};

const writeCache = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify({ value, cachedAt: Date.now() }));
  } catch {
    // Private browsing or storage quotas should never block the catalogue.
  }
};

const requestJsonWithRetry = async (path, signal, attempts = 3) => {
  let lastError;
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(`${API_ROOT}${path}`, { method: "GET", signal, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (signal?.aborted || index === attempts - 1) break;
      await wait(220 * (index + 1), signal);
    }
  }
  throw lastError || new Error("Catalogue request failed");
};

export const loadCourseData = async (signal) => {
  try {
    const data = await requestJsonWithRetry("/assignment/course-data", signal);
    if (!Array.isArray(data)) throw new Error("Course response was not an array");
    writeCache(COURSE_CACHE_KEY, data);
    return data;
  } catch (error) {
    const cached = readCache(COURSE_CACHE_KEY);
    if (Array.isArray(cached) && cached.length) return cached;
    throw error;
  }
};

export const loadCountryCode = async (signal) => {
  try {
    const data = await requestJsonWithRetry("/assignment/country-code", signal);
    const country = data?.country_code === "IN" ? "IN" : "US";
    writeCache(COUNTRY_CACHE_KEY, country);
    return country;
  } catch (error) {
    const cached = readCache(COUNTRY_CACHE_KEY);
    if (cached === "IN" || cached === "US") return cached;
    throw error;
  }
};

export const defaultCountry = () =>
  typeof navigator !== "undefined" && navigator.language?.toLowerCase().includes("-in")
    ? "IN"
    : "US";

export const formatPrice = (course, countryCode) => {
  if (countryCode === "IN") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format((course.pricePaise || 0) / 100);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format((course.priceUsdCents || 0) / 100);
};

export const getCourseLabel = (course) =>
  course.shortCourse || course.mainCategory || course.courseType || "Course";

export const courseSlug = (course) => {
  const basis = course.courseCode || course.courseName || course.mangoId || "course";
  const slug = String(basis)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "course"}-${course.mangoId || "index"}`;
};

export const coursePath = (course) => `/courses/${courseSlug(course)}`;

export const saveCourseForDetail = (course) => {
  try {
    sessionStorage.setItem("skillpath:selected-course", JSON.stringify(course));
  } catch {
    // The detail page can always fall back to the live catalogue fetch.
  }
};

export const readStoredCourse = () => {
  try {
    const raw = sessionStorage.getItem("skillpath:selected-course");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
