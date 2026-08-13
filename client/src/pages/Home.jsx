/*
 * Citrus Index reminder: use asymmetric editorial spacing, cream paper surfaces,
 * ink-black type, and Citrus Signal orange for the path from curiosity to action.
 */
import { ArrowDown, ArrowUpRight, MoveRight } from "lucide-react";
import SkillpathCourses from "../components/SkillpathCourses";

const heroImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663269119805/EoHsjcRpBRcUErgj.jpg";
const logoImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663269119805/RLuUjxTpFhooJsSB.png";

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Skillpath home">
          <img src={logoImage} alt="" />
          <span>skillpath</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#courses">The catalogue</a>
          <a href="#footer">About</a>
        </nav>
        <a className="header-cta" href="#courses">Explore courses <ArrowUpRight size={15} /></a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-art" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />
          <div className="hero-content">
            <span className="eyebrow hero-eyebrow">01 / Direction for curious people</span>
            <h1>Make a move<br /><em>worth making.</em></h1>
            <p className="hero-description">Skillpath is a live index of focused courses for building better work, clearer ideas, and a life with more momentum.</p>
            <a className="primary-button" href="#courses">Find your next thread <MoveRight size={18} /></a>
          </div>
          <div className="hero-footnote"><span>Scroll to browse</span><ArrowDown size={16} /></div>
          <svg className="route-doodle" viewBox="0 0 520 320" fill="none" aria-hidden="true">
            <path d="M7 276C75 257 62 177 135 178C214 179 190 272 271 254C350 236 319 89 405 75C460 66 486 107 512 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="135" cy="178" r="6" fill="var(--accent)" />
            <circle cx="405" cy="75" r="6" fill="var(--accent)" />
            <path d="M496 39l17 3-7 15" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </section>

        <section className="manifesto-section">
          <div className="manifesto-number">01</div>
          <div className="manifesto-copy"><p className="eyebrow">A better kind of browsing</p><p>Not another infinite feed. Just a small, changing set of courses with enough signal to help you choose what comes next.</p></div>
          <div className="manifesto-aside">Built for the<br /><strong>in-between.</strong></div>
        </section>

        <SkillpathCourses accentColor="#F26B38" maxColumns={3} />
      </main>

      <footer className="site-footer" id="footer">
        <div className="footer-brand"><img src={logoImage} alt="" /><span>skillpath</span><p>Direction for curious people.</p></div>
        <div className="footer-links"><a href="#courses">Catalogue <ArrowUpRight size={14} /></a><a href="#top">Back to top <ArrowUpRight size={14} /></a><a href="mailto:hello@skillpath.example">Say hello <ArrowUpRight size={14} /></a></div>
        <div className="footer-bottom"><span>© 2026 Skillpath</span><span>Live index / edition 01</span></div>
      </footer>
    </div>
  );
}
