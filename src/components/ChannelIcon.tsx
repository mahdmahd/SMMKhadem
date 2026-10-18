import type { ChannelIcon as ChannelIconName } from '../data/portfolio'

export type ChannelIconProps = {
  icon: ChannelIconName
  className?: string
}

/**
 * Channel glyph.
 *
 * `public/images/icons/*.svg` are filled black for a light page, which would
 * vanish on this dark stage. Rather than recolouring the files, the raster
 * branch paints the SVG as a CSS mask over `currentColor`, so every icon
 * inherits the surrounding text colour and the hover state for free. `mail`
 * has no asset — it is drawn inline as a stroked envelope.
 */
export default function ChannelIcon({ icon, className }: ChannelIconProps) {
  const classes = ['channel-icon', className].filter(Boolean).join(' ')

  if (icon === 'mail') {
    return (
      <svg
        className={classes}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="2.75"
          y="5.25"
          width="18.5"
          height="13.5"
          rx="2.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m3.75 7.5 8.25 5.6 8.25-5.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  const mask = `url(/images/icons/${icon}.svg)`

  return (
    <span
      className={`${classes} channel-icon--mask`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      aria-hidden="true"
    />
  )
}
