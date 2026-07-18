import { chromium } from 'playwright'

const base = 'http://localhost:5175'
const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error' && !msg.text().includes('Could not reach Cloud Firestore')) errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(String(err)))

async function shot(name) {
  await page.screenshot({ path: `shots/${name}.png` })
}

console.log('--- status page loads ---')
await page.goto(`${base}/appointment-status?tenant=abc`, { waitUntil: 'load' })
await page.waitForSelector('text=Check appointment status', { timeout: 10000 })

console.log('--- neither field required attribute present ---')
const phoneRequired = await page.getAttribute('input[type="tel"]', 'required')
const tokenRequired = await page.getAttribute('input[type="text"]', 'required')
console.log('phone required attr:', phoneRequired, '| token required attr:', tokenRequired)

console.log('--- submit with both empty shows validation message ---')
await page.click('button[type="submit"]')
await page.waitForSelector('text=Enter your phone number or token.', { timeout: 5000 })
await shot('01-missing-both')

console.log('--- submit with only phone filled attempts lookup (no crash) ---')
await page.fill('input[type="tel"]', '9999999999')
await page.click('button[type="submit"]')
await page.waitForSelector('text=No appointment found', { timeout: 10000 })
await shot('02-phone-only-not-found')

console.log('\nConsole/page errors:')
console.log(errors.length ? errors.join('\n') : '(none)')

await browser.close()
