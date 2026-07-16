import { useState } from 'react'

export default function TrekkerRow({ trekker, onChange, onRemove, canRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null)

  function update(field, value) {
    onChange({ ...trekker, [field]: value })
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0] || null
    update('photoFile', file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-700 bg-gray-800 p-3">
      <label className="relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-600 bg-gray-900 text-xs text-gray-500">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          'Photo'
        )}
        <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" />
      </label>

      <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          required
          placeholder="Full name"
          value={trekker.name}
          onChange={(e) => update('name', e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          min="0"
          placeholder="Age"
          value={trekker.age}
          onChange={(e) => update('age', e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
        <input
          placeholder="Phone"
          value={trekker.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove trekker"
          className="shrink-0 rounded-full px-2 py-1 text-sm text-gray-500 hover:text-indigo-400"
        >
          ✕
        </button>
      )}
    </div>
  )
}
