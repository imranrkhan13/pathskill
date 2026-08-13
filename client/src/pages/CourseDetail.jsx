import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, CircleHelp, LoaderCircle, RefreshCw, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";
import { AIChatBox } from "../components/AIChatBox";
import { courseSlug, defaultCountry, formatPrice, getCourseLabel, loadCountryCode, loadCourseData, readStoredCourse } from "../lib/courseCatalog";

const logoImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663269119805/RLuUjxTpFhooJsSB.png";

const suggestedPrompts = [
  "What will I learn in this course?",
  "Who is this course best for?",
  "Explain the price and refund policy.",
];

const cleanCourse = (course) => ({
  courseName: course.courseName || "Untitled course",
  description: course.description || "No course description is available yet.",
  courseCode: course.courseCode || "SKILLPATH",
  mainCategory: course.mainCategory || "",
  shortCourse: course.shortCourse || "",
  courseType: course.courseType || "",
  pricePaise: Number(course.pricePaise || 0),
  priceUsdCents: Number(course.priceUsdCents || 0),
  refundable: Boolean(course.refundable),
});

const askCourseAssistant = async (course, messages) => {
  const response = await fetch("/api/course-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course, messages }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error || "The course assistant is unavailable right now. Please try again.");
  return result;
};

export default function CourseDetail() {
  const [, params] = useRoute("/courses/:slug");
  const [course, setCourse] = useState(() => readStoredCourse());
  const [status, setStatus] = useState(() => (readStoredCourse() ? "ready" : "loading"));
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [messages, setMessages] = useState([]);
  const [assistantError, setAssistantError] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    const stored = readStoredCourse();
    if (stored && courseSlug(stored) === params?.slug) {
      setCourse(stored);
      setStatus("ready");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    Promise.allSettled([loadCourseData(controller.signal), loadCountryCode(controller.signal)]).then(([coursesResult, countryResult]) => {
      if (controller.signal.aborted) return;
      if (coursesResult.status !== "fulfilled" || !Array.isArray(coursesResult.value)) {
        setStatus("error");
        return;
      }

      const selected = coursesResult.value.find((item) => courseSlug(item) === params?.slug);
      if (!selected) {
        setStatus("missing");
        return;
      }

      setCourse(selected);
      setStatus("ready");
      if (countryResult.status === "fulfilled") setCountryCode(countryResult.value);
    });

    return () => controller.abort();
  }, [params?.slug]);

  const courseContext = useMemo(() => (course ? cleanCourse(course) : null), [course]);

  const sendMessage = async (content) => {
    if (!courseContext || isAsking) return;
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setAssistantError("");
    setIsAsking(true);

    try {
      const result = await askCourseAssistant(courseContext, nextMessages.slice(-8));
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "The course assistant is unavailable right now. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  if (status === "loading") {
    return <div className="detail-state"><LoaderCircle className="spin" size={24} /><p>Opening this course...</p></div>;
  }

  if (status !== "ready" || !course) {
    return (
      <div className="detail-state">
        <CircleHelp size={24} />
        <h1>{status === "missing" ? "This course has moved." : "The course detail is unavailable."}</h1>
        <p>Return to the live index and choose a current course to continue.</p>
        <Link className="primary-button" href="/"><ArrowLeft size={17} /> Back to catalogue</Link>
      </div>
    );
  }

  return (
    <div className="course-detail-shell">
      <header className="site-header detail-header">
        <Link className="wordmark" href="/" aria-label="Skillpath home"><img src={logoImage} alt="" /><span>skillpath</span></Link>
        <Link className="header-cta" href="/"><ArrowLeft size={15} /> Back to catalogue</Link>
      </header>

      <main>
        <section className="detail-intro">
          <div className="detail-breadcrumb"><span>{course.courseCode || "SKILLPATH"}</span><span> / </span><span>{getCourseLabel(course)}</span></div>
          <div className="detail-title-block">
            <div>
              <span className="eyebrow">Course detail / live index</span>
              <h1>{course.courseName}</h1>
            </div>
            <p>{course.description}</p>
          </div>
          <div className="detail-meta-grid">
            <div><span>Format</span><strong>{course.courseType || "Focused course"}</strong></div>
            <div><span>Category</span><strong>{getCourseLabel(course)}</strong></div>
            <div><span>{countryCode === "IN" ? "India pricing" : "US pricing"}</span><strong>{formatPrice(course, countryCode)}</strong></div>
            <div><span>Terms</span><strong>{course.refundable ? "Refundable" : "See course terms"}</strong></div>
          </div>
        </section>

        <section className="detail-body">
          <div className="detail-rail">
            <span className="eyebrow">03 / Course lens</span>
            <p>Bring a question. The assistant will answer from the available course information, not from the open web.</p>
            {course.refundable && <span className="refund-chip"><Check size={14} strokeWidth={3} /> Refundable course</span>}
          </div>

          <div className="course-ai-panel">
            <div className="assistant-heading">
              <div><span className="eyebrow">Course help</span><h2>Ask before<br /><em>you commit.</em></h2></div>
              <Sparkles size={24} aria-hidden="true" />
            </div>
            <p className="assistant-intro">Ask about the course name, description, category, format, price, or refund status. If the available information does not answer your question, the assistant will say so clearly.</p>
            {assistantError && <div className="assistant-error" role="alert"><span>{assistantError}</span><button type="button" onClick={() => { setAssistantError(""); const last = [...messages].reverse().find((message) => message.role === "user"); if (last) sendMessage(last.content); }}><RefreshCw size={14} /> Retry</button></div>}
            <AIChatBox
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isAsking}
              height="440px"
              placeholder={`Ask about ${course.courseName}`}
              emptyStateMessage="Ask a course-specific question"
              suggestedPrompts={suggestedPrompts}
            />
          </div>
        </section>
      </main>

      <footer className="detail-footer"><span>Skillpath / live index</span><a href="mailto:hello@skillpath.example">Need another route? Say hello <ArrowUpRight size={14} /></a></footer>
    </div>
  );
}
