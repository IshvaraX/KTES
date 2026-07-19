import { useEffect, useRef, useState } from "react";
import { fileToURL, validMaps, permitId } from "./lib/utils.jsx";
import { generatePermitPdf } from "./lib/pdfGenerate";

const today = new Date().toISOString().split("T")[0];
const emptyMember = () => ({
  id: `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  phone: "",
  photo: null,
});

const inputBase =
  "h-11 w-full rounded border border-line bg-bg px-3.5 text-sm text-ink transition placeholder:text-ink-faint hover:border-ink-faint focus:border-moss focus:outline-none focus:ring-4 focus:ring-moss-light";
const inputError = "border-danger focus:border-danger focus:ring-danger/10";
const fieldLabel = "text-xs font-semibold text-ink-soft";

export default function PermitModal({ onClose }) {
  const [trek, setTrek] = useState({ trekName: "", trekLocation: "", startDate: "", endDate: "", mapsLink: "" });
  const [leader, setLeader] = useState({ name: "", phone: "", emergency: "", photo: null });
  const [members, setMembers] = useState([emptyMember()]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  function setField(setter) {
    return (field) => (e) => setter((prev) => ({ ...prev, [field]: e.target.value }));
  }
  const setTrekField = setField(setTrek);
  const setLeaderField = setField(setLeader);

  async function handlePhoto(e, target, memberId) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await fileToURL(file);
      if (target === "leader") setLeader((prev) => ({ ...prev, photo: url }));
      else setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, photo: url } : m)));
    } catch (err) {
      setToast(err.message || "Could not read that photo");
    }
  }

  function clearPhoto(target, memberId) {
    if (target === "leader") setLeader((prev) => ({ ...prev, photo: null }));
    else setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, photo: null } : m)));
  }

  function addMember() {
    setMembers((prev) => [...prev, emptyMember()]);
  }
  function removeMember(id) {
    setMembers((prev) => (prev.length > 1 ? prev.filter((m) => m.id !== id) : prev));
  }
  function updateMember(id, field, value) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function validate() {
    const next = {};
    if (!trek.trekName.trim()) next.trekName = true;
    if (!trek.trekLocation.trim()) next.trekLocation = true;
    if (!trek.startDate) next.startDate = true;
    if (!trek.endDate) next.endDate = true;
    if (!trek.mapsLink.trim() || !validMaps(trek.mapsLink)) next.mapsLink = true;
    if (!leader.name.trim()) next.leaderName = true;
    if (!leader.phone.trim()) next.leaderPhone = true;
    if (!leader.emergency.trim()) next.emergency = true;
    if (!leader.photo) next.leaderPhoto = true;

    members.forEach((m) => {
      if (!m.name.trim()) next[`member-name-${m.id}`] = true;
      if (m.name.trim() && !m.photo) next[`member-photo-${m.id}`] = true;
    });

    setErrors(next);
    if (next.mapsLink) return "Add a valid Google Maps link";
    if (next.leaderPhoto) return "Upload a photo for the group leader";
    const missingPhoto = members.find((m) => m.name.trim() && !m.photo);
    if (missingPhoto) return `Photo missing for ${missingPhoto.name}`;
    if (Object.keys(next).length) return "Fill in every required field";
    return null;
  }

  async function handleGenerate() {
    const problem = validate();
    if (problem) {
      setToast(problem);
      return;
    }
    setStatus("generating");
    try {
      await generatePermitPdf({
        trekName: trek.trekName.trim(),
        trekLocation: trek.trekLocation.trim(),
        startDate: trek.startDate,
        endDate: trek.endDate,
        mapsLink: trek.mapsLink.trim(),
        leader: { name: leader.name.trim(), phone: leader.phone.trim(), emergency: leader.emergency.trim(), photo: leader.photo },
        members: members.filter((m) => m.name.trim()).map((m) => ({ name: m.name.trim(), phone: m.phone.trim(), photo: m.photo })),
        permitId: permitId(),
        issued: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      });
      setStatus("done");
      setToast("Permits downloaded");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setToast("Couldn't generate the PDF — try again");
    } finally {
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <div
className="fixed inset-0 z-[100] flex items-center justify-center bg-white p-6"
  onMouseDown={(e) => e.target === e.currentTarget && onClose()}
>
      <div className="relative flex max-h-[min(88vh,820px)] w-full max-w-[640px] flex-col overflow-hidden rounded-[10px] bg-surface shadow-modal" role="dialog" aria-modal="true" aria-labelledby="permit-modal-title">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="permit-modal-title" className="font-display text-2xl font-bold uppercase text-ink">Register your trek</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-xl leading-none text-ink-soft hover:bg-surface-alt">×</button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-5">
          <section>
            <h3 className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-moss">Trek details</h3>
            <div className="flex flex-col gap-3">
              <input className={`${inputBase} ${errors.trekName ? inputError : ""}`} placeholder="Trek name *" value={trek.trekName} onChange={setTrekField("trekName")} />
              <input className={`${inputBase} ${errors.trekLocation ? inputError : ""}`} placeholder="Trek location *" value={trek.trekLocation} onChange={setTrekField("trekLocation")} />
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className={fieldLabel}>Start date *</label>
                  <input type="date" className={`${inputBase} ${errors.startDate ? inputError : ""}`} min={today} value={trek.startDate} onChange={setTrekField("startDate")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={fieldLabel}>End date *</label>
                  <input type="date" className={`${inputBase} ${errors.endDate ? inputError : ""}`} min={trek.startDate || today} value={trek.endDate} onChange={setTrekField("endDate")} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={fieldLabel}>Google Maps link *</label>
                <input type="url" className={`${inputBase} ${errors.mapsLink ? inputError : ""}`} placeholder="https://maps.app.google.com/..." value={trek.mapsLink} onChange={setTrekField("mapsLink")} />
                <span className="text-xs text-ink-faint">Paste the share link from Google Maps</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-moss">Group leader</h3>
            <div className="grid grid-cols-[auto_1fr_1fr] items-end gap-3.5">
              <PhotoUpload hasPhoto={!!leader.photo} photo={leader.photo} error={errors.leaderPhoto} onChange={(e) => handlePhoto(e, "leader")} onClear={() => clearPhoto("leader")} />
              <div className="flex flex-col gap-1.5">
                <label className={fieldLabel}>Name *</label>
                <input className={`${inputBase} ${errors.leaderName ? inputError : ""}`} value={leader.name} onChange={setLeaderField("name")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={fieldLabel}>Phone *</label>
                <input type="tel" className={`${inputBase} ${errors.leaderPhone ? inputError : ""}`} value={leader.phone} onChange={setLeaderField("phone")} />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <label className={fieldLabel}>Emergency contact *</label>
              <input type="tel" className={`${inputBase} ${errors.emergency ? inputError : ""}`} value={leader.emergency} onChange={setLeaderField("emergency")} />
            </div>
          </section>

          <section>
            <h3 className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-moss">Group members</h3>
            <div className="mb-3.5 flex flex-col gap-3">
              {members.map((m) => (
                <div key={m.id} className="grid grid-cols-[56px_1fr_1fr_auto] items-end gap-3 rounded border border-line p-3.5">
                  <PhotoUpload compact hasPhoto={!!m.photo} photo={m.photo} error={errors[`member-photo-${m.id}`]} onChange={(e) => handlePhoto(e, "member", m.id)} onClear={() => clearPhoto("member", m.id)} />
                  <div className="flex flex-col gap-1.5">
                    <label className={fieldLabel}>Name *</label>
                    <input className={`${inputBase} ${errors[`member-name-${m.id}`] ? inputError : ""}`} placeholder="Name" value={m.name} onChange={(e) => updateMember(m.id, "name", e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={fieldLabel}>Phone</label>
                    <input type="tel" className={inputBase} placeholder="Phone" value={m.phone} onChange={(e) => updateMember(m.id, "phone", e.target.value)} />
                  </div>
                  <button onClick={() => removeMember(m.id)} disabled={members.length === 1} aria-label="Remove member" title="Remove member" className="flex h-[34px] w-[34px] items-center justify-center rounded text-danger hover:bg-surface-alt disabled:cursor-not-allowed disabled:text-ink-faint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addMember} type="button" className="h-[42px] rounded border border-ink px-4 text-sm font-bold text-ink hover:bg-surface-alt">+ Add member</button>
          </section>
        </div>

        <div className="border-t border-line px-6 py-5">
          <button onClick={handleGenerate} disabled={status === "generating"} className="flex h-[46px] w-full items-center justify-center gap-2 rounded bg-accent text-sm font-bold text-[#fff8f2] transition hover:bg-accent-dark disabled:opacity-70">
            {status === "generating" ? (<><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" /> Generating…</>) : "Download permits"}
          </button>
        </div>

        {toast && <div className="absolute bottom-[88px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-[18px] py-2.5 text-[13px] text-bg shadow-card">{toast}</div>}
      </div>
    </div>
  );
}

function PhotoUpload({ hasPhoto, photo, error, onChange, onClear, compact }) {
  const inputRef = useRef(null);
  return (
    <div onClick={() => inputRef.current?.click()} className={`relative flex h-[70px] w-14 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border text-xl text-ink-faint ${hasPhoto ? "border-solid border-moss bg-surface-alt" : "border-dashed border-line bg-surface-alt"} ${error ? "!border-solid !border-danger" : ""}`}>
      {hasPhoto ? <img src={photo} alt="" className="h-full w-full object-cover" /> : <span>+</span>}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { onChange(e); e.target.value = ""; }} />
      {hasPhoto && <button onClick={(e) => { e.stopPropagation(); onClear(); }} aria-label="Remove photo" className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-danger text-[12px] leading-none text-white">×</button>}
    </div>
  );
}