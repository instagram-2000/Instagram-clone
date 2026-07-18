import { useState } from 'react'
import { updateHospital } from '../../firebase/hospitals'

function emptyItem(fields) {
  return Object.fromEntries(fields.map((f) => [f.name, '']))
}

const inputClass =
  'mt-0.5 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none'

// Generic list editor for one hospital content section (services,
// departments, doctors, testimonials) — shape driven entirely by the
// `fields` schema so all four sections share this one implementation.
function ContentSectionEditor({ slug, sectionKey, label, fields, section }) {
  const [enabled, setEnabled] = useState(section.enabled === 'on')
  const [orderNumber, setOrderNumber] = useState(section.orderNumber ?? 1)
  const [items, setItems] = useState(section.items?.length ? section.items : [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function markDirty() {
    setSaved(false)
  }

  function updateItem(index, field, value) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
    markDirty()
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem(fields)])
    markDirty()
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
    markDirty()
  }

  function moveItem(index, direction) {
    setItems((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    markDirty()
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await updateHospital(slug, {
        [`optionals.${sectionKey}`]: {
          enabled: enabled ? 'on' : 'off',
          orderNumber: Number(orderNumber) || 1,
          items: items.map((item) =>
            fields.reduce((acc, f) => {
              acc[f.name] = f.type === 'number' ? Number(item[f.name]) || 0 : item[f.name] || ''
              return acc
            }, {})
          ),
        },
      })
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => {
                setEnabled(e.target.checked)
                markDirty()
              }}
              className="h-4 w-4 cursor-pointer rounded border-slate-300"
            />
            Visible on landing page
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Order
            <input
              type="number"
              min={1}
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value)
                markDirty()
              }}
              className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
          >
            <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-medium text-slate-500">{f.label}</label>
                  <input
                    type={f.type === 'number' ? 'number' : f.type === 'url' ? 'url' : 'text'}
                    value={item[f.name] ?? ''}
                    onChange={(e) => updateItem(index, f.name, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 pt-4">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                title="Move up"
                className="cursor-pointer text-xs text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                title="Move down"
                className="cursor-pointer text-xs text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                title="Remove"
                className="cursor-pointer text-xs text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400">No items yet.</p>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addItem}
          className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Add item
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save section'}
        </button>
        {saved && <span className="text-sm text-emerald-600">Saved.</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  )
}

export default ContentSectionEditor
