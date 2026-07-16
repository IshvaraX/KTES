import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PermitQRCode from '../components/QRCode'
import { getPermit } from '../lib/permitStore'

export default function PermitViewPage() {
  const { id } = useParams()
  const [permit, setPermit] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPermit(id)
      .then((p) => (p ? setPermit(p) : setError('No safety card found with this link.')))
      .catch((err) => setError(err.message || 'Could not load this safety card.'))
  }, [id])

  if (error) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-center text-sm text-ochre-dark">{error}</p>
  }
  if (!permit) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-center text-sm text-slate">Loading…</p>
  }

  const shareUrl = window.location.href
  const trekkers = permit.trekkers || []

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="no-print mb-6 flex justify-end">
        <button
          onClick={() => window.print()}
          className="rounded-full border border-moss px-4 py-1.5 text-xs font-medium text-moss-dark hover:bg-moss hover:text-paper"
        >
          Print
        </button>
      </div>

      <div className="rounded-2xl border border-slate-light/40 bg-paper p-8">
        <p className="label-eyebrow">Group safety card — not a legal permit</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-moss-dark">
          {permit.trek_name}
        </h1>
        <p className="mt-1 text-sm text-slate">
          {permit.start_date} → {permit.end_date}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="label-eyebrow">Leader</p>
            <p className="mt-1">{permit.leader_name}</p>
            <p className="text-slate">{permit.leader_phone}</p>
          </div>
          <div>
            <p className="label-eyebrow">Emergency contact</p>
            <p className="mt-1">{permit.emergency_contact || '—'}</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="label-eyebrow">Trekkers ({trekkers.length})</p>
          <ul className="mt-3 flex flex-col gap-3">
            {trekkers.map((t, i) => (
              <li key={i} className="flex items-center gap-3">
                {t.photo_url ? (
                  <img src={t.photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-canvas" />
                )}
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-slate">
                    {[t.age && `${t.age} yrs`, t.phone].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="no-print mt-8 flex justify-center border-t border-slate-light/30 pt-6">
          <PermitQRCode url={shareUrl} />
        </div>
      </div>
    </div>
  )
}
