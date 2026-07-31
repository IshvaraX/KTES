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
  "h-11 w-full min-w-0 rounded-none border-2 border-[#2a513f] bg-white px-3.5 text-sm font-bold text-[#2a513f] transition placeholder:text-[#2a513f]/40 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-[#70e0bb] focus:border-[#2a513f]";
const inputError = "!border-red-600!ring-red-200";
const fieldLabel = "text- font-black uppercase tracking-wider text-[#2a513f]";

export default function PermitModal({ onClose }) {
  const [trek, setTrek] = useState({ trekName: "", trekLocation: "", startDate: "", endDate: "", mapsLink: "" });
  const [leader, setLeader] = useState({ name: "", phone: "", emergency: "", photo: null });
  const [members, setMembers] = useState([emptyMember()]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  function setField(setter) {
    return (field) => (e) => setter((prev) => ({...prev, [field]: e.target.value }));
  }
  const setTrekField = setField(setTrek);
  const setLeaderField = setField(setLeader);

  async function handlePhoto(e, target, memberId) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await fileToURL(file);
      if (target === "leader") setLeader((prev) => ({...prev, photo: url }));
      else setMembers((prev) => prev.map((m) => (m.id === memberId? {...m, photo: url } : m)));
    } catch (err) {
      setToast(err.message || "Could not read that photo");
    }
  }

  function clearPhoto(target, memberId) {
    if (target === "leader") setLeader((prev) => ({...prev, photo: null }));
    else setMembers((prev) => prev.map((m) => (m.id === memberId? {...m, photo: null } : m)));
  }

  function validate() {
    const next = {};
    if (!trek.trekName.trim()) next.trekName = true;
    if (!trek.trekLocation.trim()) next.trekLocation = true;
    if (!trek.startDate) next.startDate = true;
    if (!trek.endDate) next.endDate = true;
    if (!trek.mapsLink.trim() ||!validMaps(trek.mapsLink)) next.mapsLink = true;
    if (!leader.name.trim()) next.leaderName = true;
    if (!leader.phone.trim()) next.leaderPhone = true;
    if (!leader.emergency.trim()) next.emergency = true;
    if (!leader.photo) next.leaderPhoto = true;
    members.forEach((m) => {
      if (!m.name.trim()) next[`member-name-${m.id}`] = true;
      if (m.name.trim() &&!m.photo) next[`member-photo-${m.id}`] = true;
    });
    setErrors(next);
    if (next.mapsLink) return "Add a valid Google Maps link";
    if (next.leaderPhoto) return "Upload a photo for the group leader";
    const missingPhoto = members.find((m) => m.name.trim() &&!m.photo);
    if (missingPhoto) return `Photo missing for ${missingPhoto.name}`;
    if (Object.keys(next).length) return "Fill in every required field";
    return null;
  }

  async function handleGenerate() {
    const problem = validate();
    if (problem) { setToast(problem); return; }
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
      setStatus("error");
      setToast("Couldn't generate the PDF — try again");
      console.log(err);
    } finally {
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#2a513f]/80 backdrop-blur-sm p-0 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex w-full max-w- flex-col overflow-hidden border-t-4 sm:border-4 border-[#2a513f] bg-[#cef79f] shadow-[0_-8px_0_#2a513f] sm:shadow-[8px_8px_0px_0px_#2a513f] h-[80dvh] sm:max-h- rounded-t- sm:rounded-none" role="dialog" aria-modal="true">

        <div className="h-2 w-full flex shrink-0">
          <div className="flex-1 bg-[#83ba36]"></div>
          <div className="flex-1 bg-[#70e0bb]"></div>
          <div className="flex-1 bg-[#378e8e]"></div>
          <div className="flex-1 bg-[#2a513f]"></div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-b-4 border-[#2a513f] bg-white px-4 sm:px-6 py-4">
          <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-[#2a513f]">Register your trek</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#2a513f] bg-[#cef79f] text-lg font-black text-[#2a513f] hover:bg-[#70e0bb]">×</button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[#cef79f]">

          <section className="border-4 border-[#2a513f] bg-white p-4 shadow-[4px_4px_0px_0px_#2a513f]">
            <h3 className="mb-3 inline-block border-2 border-[#2a513f] bg-[#83ba36] px-2 py-1 text- font-black uppercase tracking-wider text-[#2a513f]">Trek details</h3>
            <div className="flex flex-col gap-3">
              <input className={`${inputBase} ${errors.trekName? inputError : ""}`} placeholder="Trek name *" value={trek.trekName} onChange={setTrekField("trekName")} />
              <input className={`${inputBase} ${errors.trekLocation? inputError : ""}`} placeholder="Trek location *" value={trek.trekLocation} onChange={setTrekField("trekLocation")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label className={fieldLabel}>Start date *</label>
                  <input type="date" className={`${inputBase} ${errors.startDate? inputError : ""}`} min={today} value={trek.startDate} onChange={setTrekField("startDate")} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label className={fieldLabel}>End date *</label>
                  <input type="date" className={`${inputBase} ${errors.endDate? inputError : ""}`} min={trek.startDate || today} value={trek.endDate} onChange={setTrekField("endDate")} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <label className={fieldLabel}>Google Maps link *</label>
                <input type="url" className={`${inputBase} ${errors.mapsLink? inputError : ""}`} placeholder="https://maps.app.google.com/..." value={trek.mapsLink} onChange={setTrekField("mapsLink")} />
                <span className="text- font-bold uppercase tracking-wider text-[#378e8e]">Paste the share link from Google Maps</span>
              </div>
            </div>
          </section>

          <section className="border-4 border-[#2a513f] bg-white p-4 shadow-[4px_4px_0px_0px_#2a513f]">
            <h3 className="mb-3 inline-block border-2 border-[#2a513f] bg-[#70e0bb] px-2 py-1 text- font-black uppercase tracking-wider text-[#2a513f]">Group leader</h3>
            {/* RESPONSIVE: stack on mobile */}
            <div className="flex flex-col sm:grid sm:grid-cols-[64px_1fr_1fr] gap-3 items-start sm:items-end">
              <PhotoUpload hasPhoto={!!leader.photo} photo={leader.photo} error={errors.leaderPhoto} onChange={(e) => handlePhoto(e, "leader")} onClear={() => clearPhoto("leader")} />
              <div className="flex w-full flex-col gap-1.5 min-w-0">
                <label className={fieldLabel}>Name *</label>
                <input className={`${inputBase} ${errors.leaderName? inputError : ""}`} value={leader.name} onChange={setLeaderField("name")} />
              </div>
              <div className="flex w-full flex-col gap-1.5 min-w-0">
                <label className={fieldLabel}>Phone *</label>
                <input type="tel" className={`${inputBase} ${errors.leaderPhone? inputError : ""}`} value={leader.phone} onChange={setLeaderField("phone")} />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1.5 min-w-0">
              <label className={fieldLabel}>Emergency contact *</label>
              <input type="tel" className={`${inputBase} ${errors.emergency? inputError : ""}`} value={leader.emergency} onChange={setLeaderField("emergency")} />
            </div>
          </section>

          <section className="border-4 border-[#2a513f] bg-white p-4 shadow-[4px_4px_0px_0px_#2a513f]">
            <h3 className="mb-3 inline-block border-2 border-[#2a513f] bg-[#378e8e] px-2 py-1 text- font-black uppercase tracking-wider text-white">Group members</h3>
            <div className="mb-3 flex flex-col gap-3">
              {members.map((m) => (
                <div key={m.id} className="flex flex-col sm:grid sm:grid-cols-[64px_1fr_1fr_40px] gap-3 border-2 border-[#2a513f] bg-[#cef79f]/50 p-3">
                  <PhotoUpload hasPhoto={!!m.photo} photo={m.photo} error={errors[`member-photo-${m.id}`]} onChange={(e) => handlePhoto(e, "member", m.id)} onClear={() => clearPhoto("member", m.id)} />
                  <div className="flex w-full flex-col gap-1.5 min-w-0">
                    <label className={fieldLabel}>Name *</label>
                    <input className={`${inputBase} ${errors[`member-name-${m.id}`]? inputError : ""}`} placeholder="Name" value={m.name} onChange={(e) => { const v=e.target.value; setMembers(p=>p.map(x=>x.id===m.id?{...x,name:v}:x)); }} />
                  </div>
                  <div className="flex w-full flex-col gap-1.5 min-w-0">
                    <label className={fieldLabel}>Phone</label>
                    <input type="tel" className={inputBase} placeholder="Phone" value={m.phone} onChange={(e)=>{ const v=e.target.value; setMembers(p=>p.map(x=>x.id===m.id?{...x,phone:v}:x)); }} />
                  </div>
                  <button onClick={() => setMembers(p=>p.length>1?p.filter(x=>x.id!==m.id):p)} disabled={members.length===1} className="h-11 w-full sm:w-10 border-2 border-[#2a513f] bg-white text-[#2a513f] hover:bg-red-100 disabled:opacity-30 flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
            <button onClick={() => setMembers(p=>[...p, emptyMember()])} type="button" className="h-11 w-full sm:w-auto border-4 border-[#2a513f] bg-white px-4 text-xs font-black uppercase tracking-wider text-[#2a513f] shadow-[3px_3px_0px_0px_#2a513f] hover:bg-[#70e0bb]">+ Add member</button>
          </section>
        </div>

        <div className="shrink-0 border-t-4 border-[#2a513f] bg-white p-4 sm:p-6">
          <button onClick={handleGenerate} disabled={status==="generating"} className="flex h- w-full items-center justify-center gap-2 border-4 border-[#2a513f] bg-[#83ba36] text-sm font-black uppercase tracking-wider text-[#2a513f] shadow-[4px_4px_0px_0px_#2a513f] hover:translate-x- hover:translate-y- hover:shadow-[2px_2px_0px_0px_#2a513f] disabled:opacity-70">
            {status==="generating"? "Generating..." : "Download permits"}
          </button>
        </div>

        {toast && <div className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 max-w-[90%] whitespace-normal text-center border-2 border-[#2a513f] bg-[#2a513f] px-5 py-2.5 text- font-bold uppercase text-[#cef79f] shadow-[4px_4px_0px_#2a513f]">{toast}</div>}
      </div>
    </div>
  );
}

function PhotoUpload({ hasPhoto, photo, error, onChange, onClear }) {
  const inputRef = useRef(null);
  return (
    <div onClick={() => inputRef.current?.click()} className={`relative flex h- w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden border-2 text-xl font-black ${hasPhoto? "border-[#2a513f] bg-white" : "border-dashed border-[#2a513f] bg-[#cef79f]"} ${error? "!border-red-600!bg-red-50" : ""}`}>
      {hasPhoto? <img src={photo} alt="" className="h-full w-full object-cover" /> : <span className="text-[#2a513f]">+</span>}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { onChange(e); e.target.value=""; }} />
      {hasPhoto && <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center bg-[#2a513f] text- text-white">×</button>}
    </div>
  );
}