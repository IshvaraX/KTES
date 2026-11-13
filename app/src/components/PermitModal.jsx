import { useEffect, useId, useRef, useState } from "react";
import { fileToURL, validMaps, permitId } from "./lib/utils.jsx";
import { generatePermitPdf } from "./lib/pdfGenerate";
import { mapsSearchLink } from "./lib/trails";

const today = new Date().toISOString().split("T")[0];
const emptyMember = () => ({
  id: `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  phone: "",
  photo: null,
});

function Field({ label, optional, error, hint, className = "", children }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const describedBy = error || hint ? hintId : undefined;
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[0.9375rem] font-medium">
        {label}
        {optional && <span className="text-granite"> (optional)</span>}
      </label>
      {children({
        id,
        "aria-required": optional ? undefined : "true",
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": describedBy,
      })}
      {(error || hint) && (
        <p id={hintId} className={`text-sm ${error ? "text-alert" : "text-granite"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

function PhotoUpload({ photo, error, label, onChange, onClear }) {
  const inputRef = useRef(null);
  return (
    <div className="flex shrink-0 flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={photo ? `Change photo for ${label}` : `Add photo for ${label}`}
        className={`flex h-[5.5rem] w-[4.25rem] items-center justify-center overflow-hidden rounded-[6px] text-center text-xs leading-tight font-medium ${
          photo
            ? "bg-white"
            : `border-[1.5px] border-dashed bg-mist/60 text-granite hover:bg-mist ${error ? "border-alert text-alert" : "border-shola/40"}`
        }`}
      >
        {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : "Add photo"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          onChange(e);
          e.target.value = "";
        }}
      />
      {photo && (
        <button type="button" onClick={onClear} className="text-sm text-granite underline underline-offset-2 hover:text-shola">
          Remove
        </button>
      )}
    </div>
  );
}

function Section({ title, aside, children }) {
  return (
    <fieldset className="min-w-0 border-t border-shola/12 pt-6 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <legend className="display-sm float-left text-2xl">{title}</legend>
        {aside}
      </div>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export default function PermitModal({ trail, onClose }) {
  const [trek, setTrek] = useState(() => ({
    trekName: trail?.name ?? "",
    trekLocation: trail ? `${trail.region}, Karnataka` : "",
    startDate: "",
    endDate: "",
    mapsLink: trail ? mapsSearchLink(trail) : "",
  }));
  const [leader, setLeader] = useState({ name: "", phone: "", emergency: "", photo: null });
  const [members, setMembers] = useState([emptyMember()]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);
  const firstFieldRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  const setTrekField = (field) => (e) => setTrek((prev) => ({ ...prev, [field]: e.target.value }));
  const setLeaderField = (field) => (e) => setLeader((prev) => ({ ...prev, [field]: e.target.value }));
  const setMemberField = (id, field) => (e) => {
    const v = e.target.value;
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: v } : m)));
  };

  async function handlePhoto(e, target, memberId) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await fileToURL(file);
      if (target === "leader") setLeader((prev) => ({ ...prev, photo: url }));
      else setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, photo: url } : m)));
    } catch (err) {
      setToast(err === "Max 2MB" ? "That photo is over 2 MB. Choose a smaller one." : "That file couldn't be read. Try another photo.");
    }
  }

  function clearPhoto(target, memberId) {
    if (target === "leader") setLeader((prev) => ({ ...prev, photo: null }));
    else setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, photo: null } : m)));
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
    if (next.mapsLink) return "Add a Google Maps link for the trailhead.";
    if (next.leaderPhoto) return "Add a photo for the group leader.";
    const missingPhoto = members.find((m) => m.name.trim() && !m.photo);
    if (missingPhoto) return `Add a photo for ${missingPhoto.name.trim()}.`;
    if (Object.keys(next).length) return "Fill in the highlighted fields.";
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
      setToast("Permits downloaded.");
    } catch (err) {
      setStatus("error");
      setToast("The PDF couldn't be made. Check your connection and try again.");
      console.error(err);
    } finally {
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  const permitCount = 1 + members.filter((m) => m.name.trim()).length;
  const required = "This is required.";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-shola/70 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sheet-in relative flex h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[14px] bg-paper shadow-[0_30px_80px_-20px_rgba(23,58,44,0.55)] sm:h-auto sm:max-h-[90dvh] sm:rounded-[10px]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-shola/12 px-5 pt-6 pb-5 sm:px-8">
          <div>
            <h2 id={titleId} className="display text-[2.5rem]">
              Trek permit
            </h2>
            <p className="mt-2 max-w-[44ch] text-granite">
              One cover sheet for the group, and a page with a map QR for each person.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-shola hover:bg-mist"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form
          className="flex flex-1 flex-col gap-8 overflow-x-hidden overflow-y-auto px-5 py-6 sm:px-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          id="permit-form"
          noValidate
        >
          <Section title="The trek">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Trek name" error={errors.trekName && required}>
                {(p) => <input {...p} ref={firstFieldRef} className="field" value={trek.trekName} onChange={setTrekField("trekName")} />}
              </Field>
              <Field label="Location" error={errors.trekLocation && required}>
                {(p) => <input {...p} className="field" value={trek.trekLocation} onChange={setTrekField("trekLocation")} />}
              </Field>
              <Field label="Start date" error={errors.startDate && required}>
                {(p) => <input {...p} type="date" className="field" min={today} value={trek.startDate} onChange={setTrekField("startDate")} />}
              </Field>
              <Field label="End date" error={errors.endDate && required}>
                {(p) => (
                  <input {...p} type="date" className="field" min={trek.startDate || today} value={trek.endDate} onChange={setTrekField("endDate")} />
                )}
              </Field>
              <Field
                label="Google Maps link"
                className="sm:col-span-2"
                error={errors.mapsLink && "Paste a link from Google Maps, like maps.app.goo.gl/…"}
                hint={
                  trail
                    ? "Filled with a map search for this trail. Swap in the exact trailhead pin if you have it."
                    : "In Google Maps, tap Share on the trailhead and paste the link here."
                }
              >
                {(p) => (
                  <input
                    {...p}
                    type="url"
                    inputMode="url"
                    className="field"
                    placeholder="https://maps.app.goo.gl/…"
                    value={trek.mapsLink}
                    onChange={setTrekField("mapsLink")}
                  />
                )}
              </Field>
            </div>
          </Section>

          <Section title="Group leader">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <PhotoUpload
                photo={leader.photo}
                error={errors.leaderPhoto}
                label="the group leader"
                onChange={(e) => handlePhoto(e, "leader")}
                onClear={() => clearPhoto("leader")}
              />
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <Field label="Name" error={errors.leaderName && required}>
                  {(p) => <input {...p} autoComplete="name" className="field" value={leader.name} onChange={setLeaderField("name")} />}
                </Field>
                <Field label="Phone" error={errors.leaderPhone && required}>
                  {(p) => <input {...p} type="tel" autoComplete="tel" className="field" value={leader.phone} onChange={setLeaderField("phone")} />}
                </Field>
                <Field
                  label="Emergency contact"
                    className="sm:col-span-2"
                  error={errors.emergency && required}
                  hint="Someone staying back in the city."
                >
                  {(p) => <input {...p} type="tel" className="field" value={leader.emergency} onChange={setLeaderField("emergency")} />}
                </Field>
              </div>
            </div>
            {errors.leaderPhoto && <p className="mt-2 text-sm text-alert">Add a photo for the group leader.</p>}
          </Section>

          <Section
            title="Members"
            aside={<span className="text-sm text-granite">{members.length === 1 ? "1 person" : `${members.length} people`}</span>}
          >
            <ul className="flex flex-col gap-5">
              {members.map((m, i) => (
                <li key={m.id} className="flex flex-col gap-4 rounded-[8px] bg-mist/55 p-4 sm:flex-row sm:items-start">
                  <PhotoUpload
                    photo={m.photo}
                    error={errors[`member-photo-${m.id}`]}
                    label={m.name.trim() || `member ${i + 1}`}
                    onChange={(e) => handlePhoto(e, "member", m.id)}
                    onClear={() => clearPhoto("member", m.id)}
                  />
                  <div className="grid flex-1 gap-4 sm:grid-cols-2">
                    <Field label="Name" error={errors[`member-name-${m.id}`] && required}>
                      {(p) => <input {...p} className="field" value={m.name} onChange={setMemberField(m.id, "name")} />}
                    </Field>
                    <Field label="Phone" optional>
                      {(p) => <input {...p} type="tel" className="field" value={m.phone} onChange={setMemberField(m.id, "phone")} />}
                    </Field>
                    {errors[`member-photo-${m.id}`] && (
                      <p className="text-sm text-alert sm:col-span-2">Add a photo for {m.name.trim() || "this member"}.</p>
                    )}
                  </div>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setMembers((p) => p.filter((x) => x.id !== m.id))}
                      className="self-start text-sm text-granite underline underline-offset-2 hover:text-alert sm:mt-9"
                    >
                      Remove<span className="sr-only"> {m.name.trim() || `member ${i + 1}`}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setMembers((p) => [...p, emptyMember()])} className="btn btn-quiet mt-5">
              Add another member
            </button>
          </Section>
        </form>

        <div className="flex shrink-0 flex-col gap-3 border-t border-shola/12 bg-paper px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-granite" aria-live="polite">
            {permitCount === 1 ? "1 permit page" : `${permitCount} permit pages`}, plus a cover sheet
          </p>
          <button type="submit" form="permit-form" disabled={status === "generating"} className="btn btn-stamp min-h-12 px-7 text-base">
            {status === "generating" ? "Making permits…" : "Download permits"}
          </button>
        </div>

        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute inset-x-0 bottom-28 flex justify-center px-5 transition-opacity sm:bottom-24 ${toast ? "opacity-100" : "opacity-0"}`}
        >
          {toast && <p className="max-w-md rounded-[8px] bg-shola px-4 py-2.5 text-center text-[0.9375rem] text-paper shadow-lg">{toast}</p>}
        </div>
      </div>
    </div>
  );
}
