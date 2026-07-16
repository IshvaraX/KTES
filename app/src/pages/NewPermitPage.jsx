import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TrekMap from '../components/TrekMap'
import TrekkerRow from '../components/TrekkerRow'
import { createPermit } from '../lib/permitStore'

const FALLBACK_CENTER = { lat: 12.9716, lng: 77.5946 }

function emptyTrekker() {
  return { name: '', age: '', phone: '', photoFile: null }
}

export default function NewPermitPage() {
  const navigate = useNavigate()
  const routerState = useLocation().state || {}

  const [trekName, setTrekName] = useState(routerState.trekName || '')
  const [location, setLocation] = useState(routerState.location || null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [leaderName, setLeaderName] = useState('')
  const [leaderPhone, setLeaderPhone] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [trekkers, setTrekkers] = useState([emptyTrekker()])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function updateTrekker(index, next) {
    setTrekkers((rows) => rows.map((r, i) => (i === index ? next : r)))
  }

  function removeTrekker(index) {
    setTrekkers((rows) => rows.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!location) {
      setError('Pick the trek location on the map first.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const id = await createPermit(
        { trekName, location, startDate, endDate, leaderName, leaderPhone, emergencyContact },
        trekkers,
      )
      navigate(`/permit/${id}`)
    } catch (err) {
      setError(err.message || 'Could not save the safety card.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <p className="label-eyebrow">Before you go</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-gray-100">
        Create a group safety card
      </h1>
      <p className="mt-2 max-w-xl text-sm text-gray-400">
        This isn't a legal trekking permit — some regions require one from the local forest
        department. Think of this as a QR-backed record you leave with family, a guide, or a
        homestay before setting off.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-base font-semibold text-gray-200">Trek</h2>
          <input
            required
            placeholder="Trek name"
            value={trekName}
            onChange={(e) => setTrekName(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
          <div className="h-64 overflow-hidden rounded-xl border border-gray-700">
            <TrekMap
              center={location || FALLBACK_CENTER}
              selectable
              selectedLocation={location}
              onMapClick={(pt) => setLocation({ ...pt, label: null })}
            />
          </div>
          <p className="text-xs text-gray-500">
            {location ? 'Location set — tap the map again to move it.' : 'Tap the map to set the trek location.'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-gray-400">
              Start date
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="text-xs text-gray-400">
              End date
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-base font-semibold text-gray-200">Group leader</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              required
              placeholder="Leader name"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <input
              required
              placeholder="Leader phone"
              value={leaderPhone}
              onChange={(e) => setLeaderPhone(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <input
              placeholder="Emergency contact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-gray-200">Trekkers</h2>
            <button
              type="button"
              onClick={() => setTrekkers((rows) => [...rows, emptyTrekker()])}
              className="rounded-full border border-blue-500 px-3 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500 hover:text-gray-900"
            >
              Add trekker
            </button>
          </div>
          {trekkers.map((t, i) => (
            <TrekkerRow
              key={i}
              trekker={t}
              onChange={(next) => updateTrekker(i, next)}
              onRemove={() => removeTrekker(i)}
              canRemove={trekkers.length > 1}
            />
          ))}
        </section>

        {error && <p className="text-sm text-indigo-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="self-start rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Generate safety card + QR'}
        </button>
      </form>
    </div>
  )
}
