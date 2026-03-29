/**
 * Resolve a CSS custom property to an sRGB tuple usable by canvas.
 * Uses a 1x1 canvas readback to reliably convert any color format
 * (oklch, lab, etc.) that browsers may serialize from getComputedStyle.
 */
export function resolveCssVar(prop: string): [number, number, number] {
  const probe = document.createElement("div")
  probe.style.display = "none"
  probe.style.color = `var(${prop})`
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()

  const cv = document.createElement("canvas")
  cv.width = cv.height = 1
  const ctx = cv.getContext("2d")!
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = resolved
  ctx.fillRect(0, 0, 1, 1)
  const d = ctx.getImageData(0, 0, 1, 1).data
  return [d[0], d[1], d[2]]
}
