export type LogoProps = {
  className?: string
}

/**
 * The MK monogram: geometric strokes in the display gradient on the near-black
 * tile, with the bone accent dot. Decorative wherever it sits next to the name,
 * so it is hidden from assistive tech. `public/images/favicon.svg` is the same
 * drawing.
 */
export default function Logo({ className }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" width="28" height="28" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mk-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#8a8a8a" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="14" fill="#050505" stroke="#ffffff" strokeOpacity=".14" strokeWidth="1.5" />
      <g fill="none" stroke="url(#mk-glow)" strokeWidth="5.2" strokeLinejoin="miter" strokeMiterlimit="10">
        <path d="M10.6 46.5V17.5L19.4 33.2L28.2 17.5V46.5" />
        <path d="M35 17.5V46.5M49.2 17.5L35 34M40 28.6L49.6 46.5" />
      </g>
      <circle cx="56.2" cy="45.6" r="2.7" fill="#e8e4dc" />
    </svg>
  )
}
