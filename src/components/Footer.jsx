import { FaGithub, FaReact, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <FaReact className="footer-logo" />
          <span className="footer-title">Reactopedia</span>
        </div>
        <nav className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/tutorials">Tutorials</Link>
          <Link to="/category/hooks">Hooks</Link>
          <Link to="/category/performance">Performance</Link>
        </nav>
        <div className="footer-newsletter">
          <form onSubmit={handleSubscribe}>
            <label htmlFor="newsletter" className="newsletter-label">
              Newsletter
            </label>
            <div className="newsletter-row">
              <input
                id="newsletter"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="newsletter-input"
                required
                disabled={subscribed}
              />
              <button
                type="submit"
                className="newsletter-btn"
                disabled={subscribed}
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
        <div className="footer-social">
          <a href="mailto:shahabuddinahmad888@gmail.com" aria-label="Email Shahabuddin Ahmad">
            <FaEnvelope />
          </a>
          <a href="https://github.com/shahabuddinahmad888-png" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
        </div>
      </div>
      <button
        className="footer-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑ Back to Top
      </button>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Reactopedia &nbsp;|&nbsp;
        </span>
        <div className="footer-madeby">
        </div>
      </div>
    </footer>
  );
}