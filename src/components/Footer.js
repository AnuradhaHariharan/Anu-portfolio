import React from "react";
import { profile } from "../data/content";

export default function Footer({ onDestroy }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <p>
          Designed and built by {profile.name}. Body text is set in Atkinson Hyperlegible, a typeface made for
          readers with low vision.
        </p>
        <p className="footer-actions">
          <button type="button" className="link-btn" onClick={onDestroy}>
            Destroy this site
          </button>
          <a href="#top">Back to top</a>
        </p>
      </div>
    </footer>
  );
}
