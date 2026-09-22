"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CoupleLogo } from "./CoupleLogo";
import { PageBackground } from "./PageBackground";
import { WeddingHeader } from "./WeddingHeader";

const STORAGE_KEY = "weddingMomentGuest";

type Errors = Partial<Record<"name" | "wishes", string>>;

export function WeddingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [wishes, setWishes] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved) as { name?: string; wishes?: string };
      setName(data.name ?? "");
      setWishes(data.wishes ?? "");
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = "Nama wajib diisi";
    if (!wishes.trim()) nextErrors.wishes = "Ucapan dan doa wajib diisi";
    else if (wishes.length > 300) nextErrors.wishes = "Ucapan dan doa maksimal 300 karakter";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ name: name.trim(), wishes: wishes.trim() }));
    router.push("/camera");
  }

  return (
    <main className="form-page app-shell flex min-h-[100svh] flex-col items-center px-[25px] pb-[3.7svh] pt-[8.1svh] text-white">
      <PageBackground variant="form" />
      <WeddingHeader />

      <form className="wedding-form mt-[10.5svh] w-full" onSubmit={handleSubmit} noValidate>
        <div className="wishes-divider flex items-center gap-6" aria-hidden="true">
          <span className="h-px flex-1 bg-white/55" />
          <span className="text-[12px] font-normal">WISHES</span>
          <span className="h-px flex-1 bg-white/55" />
        </div>

        <div className="form-field mt-9">
          <label htmlFor="guest-name">Nama</label>
          <input id="guest-name" name="name" value={name} onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: undefined })); }} placeholder="Masukan nama anda" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
          {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
        </div>

        <div className="form-field mt-4">
          <label htmlFor="guest-wishes">Ucapan &amp; Do&apos;a</label>
          <textarea id="guest-wishes" name="wishes" value={wishes} onChange={(event) => { setWishes(event.target.value); setErrors((current) => ({ ...current, wishes: undefined })); }} placeholder="Masukan ucapan & do'a" rows={4} maxLength={300} required aria-invalid={Boolean(errors.wishes)} aria-describedby={errors.wishes ? "wishes-error" : undefined} />
          {errors.wishes && <p id="wishes-error" className="field-error">{errors.wishes}</p>}
        </div>

        <button type="submit" className="mx-auto mt-[72px] flex h-11 min-w-[122px] items-center justify-center rounded-full bg-white px-8 text-[14px] font-normal text-neutral-800 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Submit</button>
      </form>

      <div className="mt-auto pt-8">
        <CoupleLogo />
      </div>
    </main>
  );
}
