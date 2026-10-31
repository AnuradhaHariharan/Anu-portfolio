import React from "react";
import { profile } from "../data/content";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <p>
          Designed and built by {profile.name}. Body text is set in Atkinson Hyperlegible, a typeface made for
          readers with low vision.
        </p>
        <p>
          <a href="#top">Back to top</a>
        </p>
      </div>
    </footer>
  );
}
