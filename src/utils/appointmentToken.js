// Avoids visually ambiguous characters (0/O, 1/I) since patients read this
// off a screen and repeat it back at the front desk.
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateToken(length = 7) {
  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => CHARS[byte % CHARS.length]).join('')
}
