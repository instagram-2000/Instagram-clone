import { useState } from 'react'

function CredentialsDialog({ email, password, onClose }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-base font-semibold text-slate-900">Staff account created</h2>
        <p className="mt-2 text-sm text-slate-600">
          Share these credentials with the staff member. This password won't be shown again.
        </p>

        <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
          <p>
            <span className="text-slate-500">Email: </span>
            <span className="font-mono text-slate-900">{email}</span>
          </p>
          <p>
            <span className="text-slate-500">Password: </span>
            <span className="font-mono text-slate-900">{password}</span>
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCopy}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default CredentialsDialog
