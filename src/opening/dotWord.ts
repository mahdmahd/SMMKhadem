// The intro's first beat: the word appears as a dot matrix, sweeping in left
// to right, drawn on a canvas laid exactly over the (still hidden) heading.

export function drawDotWord(
  canvas: HTMLCanvasElement,
  heading: HTMLElement,
  durationMs: number,
  signal: AbortSignal,
): Promise<void> {
  const rect = heading.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio, 2)
  const W = Math.ceil(rect.width * dpr)
  const H = Math.ceil(rect.height * dpr)
  canvas.width = W
  canvas.height = H

  // Re-create the heading's text box in canvas space.
  const cs = getComputedStyle(heading)
  const fontSize = parseFloat(cs.fontSize) * dpr
  const off = document.createElement('canvas')
  off.width = W
  off.height = H
  const octx = off.getContext('2d', { willReadFrequently: true })
  const ctx = canvas.getContext('2d')
  // No 2D canvas (old browser, test DOM): skip the dots, keep the sequence.
  if (!octx || !ctx) return Promise.resolve()
  octx.font = `${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`
  octx.letterSpacing = `${parseFloat(cs.letterSpacing) * dpr}px`
  const m = octx.measureText(heading.textContent ?? '')
  const lineHeight = parseFloat(cs.lineHeight) * dpr
  const asc = m.fontBoundingBoxAscent,
    desc = m.fontBoundingBoxDescent
  // CSS centres the font's content box inside the line box.
  const baseline = parseFloat(cs.paddingTop) * dpr + (lineHeight - (asc + desc)) / 2 + asc
  octx.fillStyle = '#fff'
  octx.fillText(heading.textContent ?? '', parseFloat(cs.paddingLeft) * dpr, baseline)

  const data = octx.getImageData(0, 0, W, H).data
  const cell = Math.max(3, fontSize / 24)
  const dots: { x: number; y: number; t0: number }[] = []
  for (let y = cell / 2; y < H; y += cell)
    for (let x = cell / 2; x < W; x += cell)
      if (data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3] > 128)
        dots.push({ x, y, t0: (x / W) * 0.6 + Math.random() * 0.25 })

  const grow = 0.15 // fraction of the duration each dot takes to appear
  return new Promise((resolve) => {
    const start = performance.now()
    const frame = (now: number) => {
      const t = (now - start) / durationMs
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#e5e7eb'
      for (const d of dots) {
        const k = Math.min(Math.max((t - d.t0) / grow, 0), 1)
        if (k <= 0) continue
        const r = cell * 0.42 * (1 - (1 - k) ** 3)
        ctx.beginPath()
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (signal.aborted) return
      if (t < 1) requestAnimationFrame(frame)
      else resolve()
    }
    requestAnimationFrame(frame)
  })
}
