/*
 * Citrus Index reminder: the live catalogue is the product. Keep the data legible,
 * use editorial metadata as navigation, and let Citrus Signal mark action and state.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, RefreshCw, Search, SlidersHorizontal } from "lucide-react";

const API_ROOT = "https://syncsphere-hiv6.onrender.com";
const DEFAULT_COUNTRY = typeof navigator !== "undefined" && navigator.language?.toLowerCase().includes("-in") ? "IN" : "US";

const formatPrice = (course, countryCode) => {
  if (countryCode === "IN") {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(course.pricePaise / 100);
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(course.priceUsdCents / 100);
};

const getCourseLabel = (course) => course.shortCourse || course.mainCategory || course.courseType || "Course";

function SkeletonCard() {
  return (
    <div className="course-card course-skeleton" aria-hidden="true">
      <div className="skeleton-line skeleton-kicker" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-title skeleton-title-short" />
      <div className="skeleton-line skeleton-copy" />
      <div className="skeleton-line skeleton-copy skeleton-copy-short" />
      <div className="skeleton-bottom"><div className="skeleton-line skeleton-price" /><div className="skeleton-line skeleton-dot" /></div>
    </div>
  );
}

function CourseCard({ course, countryCode, index }) {
  return (
    <article className="course-card" style={{ "--delay": `${index * 45}ms` }}>
      <div className="course-card-topline">
        <span className="course-index">0{index + 1}</span>
        <span className="course-code">{course.courseCode || "SKILLPATH"}</span>
      </div>
      <div className="course-card-content">
        <div className="course-tag">{getCourseLabel(course)}</div>
        <h3>{course.courseName}</h3>
        <p>{course.description}</p>
      </div>
      <div className="course-card-footer">
        <div>
          <span className="price-label">{countryCode === "IN" ? "India pricing" : "US pricing"}</span>
          <strong>{formatPrice(course, countryCode)}</strong>
        </div>
        <div className="course-footer-meta">
          {course.refundable && <span className="refundable"><Check size={13} strokeWidth={3} /> Refundable</span>}
          <button className="course-arrow" type="button" aria-label={`View ${course.courseName}`}><ArrowUpRight size={18} /></button>
        </div>
      </div>
    </article>
  );
}

function CourseError({ onRetry }) {
  return (
    <div className="course-state course-error" role="alert">
      <div className="state-mark">!</div>
      <div>
        <strong>The catalogue is taking a minute.</strong>
        <p>We couldn’t load the live course list. The API is intentionally a little unpredictable—try again and we’ll ask it once more.</p>
        <button className="retry-button" type="button" onClick={onRetry}><RefreshCw size={15} /> Retry request</button>
      </div>
    </div>
  );
}

export default function SkillpathCourses({ accentColor = "#F26B38", maxColumns = 3 }) {
  const [courses, setCourses] = useState([]);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY);
  const [countryWarning, setCountryWarning] = useState(false);
  const [status, setStatus] = useState("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const [requestKey, setRequestKey] = useState(0);

  const loadCourses = useCallback(async (signal) => {
    const response = await fetch(`${API_ROOT}/assignment/course-data`, { method: "GET", signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Course request failed with ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Course response was not an array");
    return data;
  }, []);

  const loadCountry = useCallback(async (signal) => {
    const response = await fetch(`${API_ROOT}/assignment/country-code`, { method: "GET", signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Country request failed with ${response.status}`);
    const data = await response.json();
    return data?.country_code === "IN" ? "IN" : "US";
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setCountryWarning(false);

    Promise.allSettled([loadCourses(controller.signal), loadCountry(controller.signal)]).then(([courseResult, countryResult]) => {
      if (controller.signal.aborted) return;
      if (courseResult.status === "rejected") {
        setCourses([]);
        setStatus("error");
        return;
      }
      setCourses(courseResult.value);
      setStatus(courseResult.value.length === 0 ? "empty" : "success");
      if (countryResult.status === "fulfilled") {
        setCountryCode(countryResult.value);
      } else {
        setCountryWarning(true);
      }
    });

    return () => controller.abort();
  }, [loadCourses, loadCountry, requestKey]);

  const visibleCourses = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const filtered = courses.filter((course) => [course.courseName, course.description, course.mainCategory, course.shortCourse].filter(Boolean).join(" ").toLowerCase().includes(normalized));
    return [...filtered].sort((a, b) => {
      if (sortOrder === "price-low") return (a.priceUsdCents || 0) - (b.priceUsdCents || 0);
      if (sortOrder === "price-high") return (b.priceUsdCents || 0) - (a.priceUsdCents || 0);
      return 0;
    });
  }, [courses, searchTerm, sortOrder]);

  return (
    <section className="catalogue-section" id="courses" style={{ "--accent": accentColor, "--columns": maxColumns }}>
      <div className="catalogue-layout">
        <aside className="catalogue-rail">
          <div className="rail-sticky">
            <span className="eyebrow">02 / Catalogue</span>
            <div className="rail-rule" />
            <p>Short courses for people who would rather make a thing than bookmark another tab.</p>
            <a className="rail-link" href="#footer">Keep exploring <ArrowUpRight size={14} /></a>
          </div>
        </aside>

        <div className="catalogue-main">
          <div className="catalogue-heading-row">
            <div>
              <span className="eyebrow">Live index / {status === "success" ? `${courses.length} courses` : "fetching"}</span>
              <h2>Find the thread<br /><em>worth pulling.</em></h2>
            </div>
            <p className="catalogue-intro">A changing set of focused courses, pulled live and priced for your region.</p>
          </div>

          <div className="catalogue-tools" aria-label="Course catalogue tools">
            <label className="search-field">
              <Search size={17} />
              <span className="sr-only">Search courses</span>
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search the index" type="search" />
            </label>
            <label className="sort-field">
              <SlidersHorizontal size={16} />
              <span className="sr-only">Sort courses</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="featured">Sort: featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          {countryWarning && status === "success" && <div className="country-note">Regional pricing is unavailable right now, so we’re showing the fallback USD price.</div>}

          {status === "loading" && <div className="course-grid">{[0, 1, 2, 3, 4, 5].map((item) => <SkeletonCard key={item} />)}</div>}
          {status === "error" && <CourseError onRetry={() => setRequestKey((key) => key + 1)} />}
          {status === "empty" && <div className="course-state"><div className="state-mark">—</div><div><strong>No courses in this edition.</strong><p>The catalogue returned cleanly, but there’s nothing to show yet. Check back soon.</p><button className="retry-button" type="button" onClick={() => setRequestKey((key) => key + 1)}><RefreshCw size={15} /> Refresh index</button></div></div>}
          {status === "success" && visibleCourses.length === 0 && <div className="course-state"><div className="state-mark">?</div><div><strong>No match in the index.</strong><p>Try a broader search term or clear the filter to see every live course.</p><button className="retry-button" type="button" onClick={() => setSearchTerm("")}>Clear search</button></div></div>}
          {status === "success" && visibleCourses.length > 0 && <div className="course-grid">{visibleCourses.map((course, index) => <CourseCard key={course.mangoId || course.courseCode || course.courseName} course={course} countryCode={countryCode} index={index} />)}</div>}
        </div>
      </div>
    </section>
  );
}

// These two props are the designer-facing controls when this component is used in Framer.
export const propertyControls = {
  accentColor: { type: "color", title: "Accent color", defaultValue: "#F26B38" },
  maxColumns: { type: "number", title: "Desktop columns", min: 2, max: 3, step: 1, defaultValue: 3 },
};
