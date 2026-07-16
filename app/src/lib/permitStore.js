import { supabase } from './supabaseClient'

const LOCAL_KEY = (id) => `trailhead:permit:${id}`
const LOCAL_INDEX_KEY = 'trailhead:permits'

function newId() {
  return crypto.randomUUID()
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Creates a permit record plus its trekker rows (with photos).
 * permit: { trekName, location: {lat, lng, label}, startDate, endDate,
 *           leaderName, leaderPhone, emergencyContact }
 * trekkers: [{ name, age, phone, photoFile }]
 * Returns the new permit id.
 */
export async function createPermit(permit, trekkers) {
  const id = newId()

  if (supabase) {
    // Upload each trekker's photo to Supabase Storage first, so we can
    // store a public URL alongside the rest of the row.
    const trekkerRows = []
    for (const t of trekkers) {
      let photoUrl = null
      if (t.photoFile) {
        const path = `${id}/${newId()}-${t.photoFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('permit-photos')
          .upload(path, t.photoFile)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('permit-photos').getPublicUrl(path)
        photoUrl = data.publicUrl
      }
      trekkerRows.push({
        permit_id: id,
        name: t.name,
        age: t.age || null,
        phone: t.phone || null,
        photo_url: photoUrl,
      })
    }

    const { error: permitError } = await supabase.from('permits').insert({
      id,
      trek_name: permit.trekName,
      location: permit.location,
      start_date: permit.startDate,
      end_date: permit.endDate,
      leader_name: permit.leaderName,
      leader_phone: permit.leaderPhone,
      emergency_contact: permit.emergencyContact,
    })
    if (permitError) throw permitError

    const { error: trekkerError } = await supabase.from('trekkers').insert(trekkerRows)
    if (trekkerError) throw trekkerError

    return id
  }

  // Local fallback: everything (including photos, as data URLs) lives
  // in this browser only. Fine for solo/personal use; a scanned QR will
  // only resolve on the same device unless Supabase is configured.
  const trekkerRows = await Promise.all(
    trekkers.map(async (t) => ({
      name: t.name,
      age: t.age || null,
      phone: t.phone || null,
      photo_url: t.photoFile ? await fileToDataUrl(t.photoFile) : null,
    })),
  )

  const record = {
    id,
    trek_name: permit.trekName,
    location: permit.location,
    start_date: permit.startDate,
    end_date: permit.endDate,
    leader_name: permit.leaderName,
    leader_phone: permit.leaderPhone,
    emergency_contact: permit.emergencyContact,
    created_at: new Date().toISOString(),
    trekkers: trekkerRows,
  }

  localStorage.setItem(LOCAL_KEY(id), JSON.stringify(record))
  const index = JSON.parse(localStorage.getItem(LOCAL_INDEX_KEY) || '[]')
  index.unshift(id)
  localStorage.setItem(LOCAL_INDEX_KEY, JSON.stringify(index))

  return id
}

export async function getPermit(id) {
  if (supabase) {
    const { data: permit, error: permitError } = await supabase
      .from('permits')
      .select('*')
      .eq('id', id)
      .single()
    if (permitError) throw permitError

    const { data: trekkers, error: trekkerError } = await supabase
      .from('trekkers')
      .select('*')
      .eq('permit_id', id)
    if (trekkerError) throw trekkerError

    return { ...permit, trekkers }
  }

  const raw = localStorage.getItem(LOCAL_KEY(id))
  if (!raw) return null
  return JSON.parse(raw)
}

export function isBackendConfigured() {
  return Boolean(supabase)
}
