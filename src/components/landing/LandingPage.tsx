"use client";

import { useState } from "react";
import { brand } from "@config/brand";
import { PlatformFooterBadge } from "@/components/platform/PlatformFooterBadge";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const downloadHref = brand.download.apkUrl || "#download";
  const screenshots = brand.appScreenshots.items;
  const screenshotAspectRatio = brand.appScreenshots.aspectRatio;

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <a href="#home" className="landing-logo">
            {brand.appName}
          </a>
          <div className="landing-nav-links">
            <a href="#screenshot">Screenshots</a>
            <a href="#features">Features</a>
            <a href="#howtoplay">How To Play</a>
            <a href="#download">Download</a>
          </div>
          <button
            type="button"
            className="landing-nav-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Menu
          </button>
        </div>
        <div className={`landing-nav-mobile${menuOpen ? " open" : ""}`}>
          <a href="#screenshot" onClick={() => setMenuOpen(false)}>Screenshots</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#howtoplay" onClick={() => setMenuOpen(false)}>How To Play</a>
          <a href="#download" onClick={() => setMenuOpen(false)}>Download</a>
        </div>
      </nav>

      <header className="landing-hero" id="home">
        <div className="landing-hero-inner">
          <div className="landing-hero-app-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.images.appLogo} alt={`${brand.appName} logo`} />
          </div>
          <p className="landing-hero-brand">{brand.appName}</p>
          <h1>{brand.tagline}</h1>
          <p className="landing-hero-sub">{brand.hero.subtitle}</p>
          <a className="landing-btn-primary" href={downloadHref}>
            {brand.download.buttonLabel}
          </a>
        </div>
      </header>

      <section className="landing-section light" id="screenshot">
        <div className="landing-container">
          <h2 className="landing-section-title">Screenshots</h2>
          <p className="landing-section-subtitle">
            A quick look at the app.
          </p>
          <div className="landing-screenshots" role="list">
            {screenshots.map((shot, idx) => (
              <div
                key={shot.src}
                className="landing-screenshot"
                role="listitem"
                style={{ aspectRatio: screenshotAspectRatio }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={brand.appScreenshots.width}
                  height={brand.appScreenshots.height}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section dark" id="features">
        <div className="landing-container">
          <h2 className="landing-section-title">Features</h2>
          <p className="landing-section-subtitle">
            What you get with {brand.appName}.
          </p>
          <ul className="landing-features-list">
            {brand.features.map((feature) => (
              <li key={feature.title}>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-section dark" id="howtoplay">
        <div className="landing-container">
          <h2 className="landing-section-title">{brand.howToPlay.title}</h2>
          <p className="landing-section-subtitle">{brand.howToPlay.subtitle}</p>
          <ol className="landing-how-list">
            {brand.howToPlay.steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.description}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="landing-section dark landing-download" id="download">
        <div className="landing-container">
          <h2 className="landing-section-title">{brand.prizes.title}</h2>
          <p>{brand.prizes.description}</p>
          <div className="landing-payment-methods">
            {brand.prizes.methods.map((method) => (
              <div key={method.name} className="landing-payment-method">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={method.logo} alt="" className="landing-payment-logo" aria-hidden="true" />
                <span>{method.name}</span>
              </div>
            ))}
          </div>
          <a className="landing-btn-solid" href={downloadHref}>
            Download Now
          </a>
          {!brand.download.apkUrl && (
            <p className="landing-download-note">
              APK link will be available here once uploaded by the admin team.
            </p>
          )}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <PlatformFooterBadge />
          <p>© {new Date().getFullYear()} {brand.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
