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

export async function createPermit(permit, trekkers) {
  const id = newId()

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
  const raw = localStorage.getItem(LOCAL_KEY(id))
  if (!raw) return null
  return JSON.parse(raw)
}

export function isBackendConfigured() {
  return false
}
