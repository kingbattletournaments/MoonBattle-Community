import { getPlatformFooterBranding } from "@/lib/platform-ref";

/**
 * Fixed MoonStack platform badge — not configurable via config/brand.ts.
 */
export function PlatformFooterBadge() {
  const b = getPlatformFooterBranding();

  return (
    <p className="landing-platform-badge" aria-label="Platform attribution">
      <span>{b.poweredByPrefix}</span>
      <strong className="landing-platform-product">{b.productName}</strong>
      <span>
        {b.productOf}
        <a
          href={b.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="landing-platform-company"
        >
          {b.companyName}
        </a>
      </span>
    </p>
  );
}
