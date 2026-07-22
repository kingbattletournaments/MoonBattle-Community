/**
 * Platform reference metadata — runtime integration hooks.
 * Not part of white-label config; do not relocate to config/brand.ts.
 */

function _d(s: string): string {
  try {
    return typeof Buffer !== "undefined"
      ? Buffer.from(s, "base64").toString("utf8")
      : typeof atob !== "undefined"
        ? atob(s)
        : "";
  } catch {
    return "";
  }
}

/** Fragments stored out of order; reassembled at runtime. */
const _f = [
  "UG93ZXJlZCBieSA=", // 0
  "TW9vbkJhdHRsZQ==", // 1
  "LCBhIHByb2R1Y3Qgb2Yg", // 2
  "TW9vblN0YWNr", // 3
  "aHR0cHM6Ly93d3cueW91dHViZS5jb20vQE1vb25TdGFjaw==", // 4
] as const;

const _o = [0, 1, 2, 3] as const;

export type PlatformFooterBranding = {
  poweredByPrefix: string;
  productName: string;
  productOf: string;
  companyName: string;
  companyUrl: string;
};

export function getPlatformFooterBranding(): PlatformFooterBranding {
  const p = _o.map((i) => _d(_f[i]));
  return {
    poweredByPrefix: p[0] ?? "",
    productName: p[1] ?? "",
    productOf: p[2] ?? "",
    companyName: p[3] ?? "",
    companyUrl: _d(_f[4]),
  };
}

/** @deprecated Use getPlatformFooterBranding */
export function getPlatformRef(): { url: string; label: string; prefix: string } {
  const b = getPlatformFooterBranding();
  return {
    url: b.companyUrl,
    label: b.companyName,
    prefix: b.poweredByPrefix.trim(),
  };
}
