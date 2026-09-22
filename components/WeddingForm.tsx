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
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ name: name.trim(), wishes: wishes.trim() }));
    router.push("/camera");
  }

  return (
    <main className="form-page app-shell flex min-h-[100svh] flex-col items-center px-9 pb-[2svh] pt-[8.1svh] text-white">
      <PageBackground variant="form" />
      <WeddingHeader />

      <form className="mt-[12.5svh] w-full" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-white/55" />
          <span className="text-[9px] font-light">WISHES</span>
          <span className="h-px flex-1 bg-white/55" />
        </div>

        <div className="mt-5">
          <label htmlFor="guest-name" className="sr-only">Name</label>
          <input id="guest-name" name="name" value={name} onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: undefined })); }} placeholder="Nama" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} className="h-12 w-full border-0 border-b border-white/40 bg-transparent px-0 text-[11px] text-white outline-none placeholder:text-white/50 focus:border-white" />
          {errors.name && <p id="name-error" className="mt-1 text-[9px] text-white/75">{errors.name}</p>}
        </div>

        <div className="mt-2">
          <label htmlFor="guest-wishes" className="sr-only">Ucapan &amp; Do&apos;a</label>
          <textarea id="guest-wishes" name="wishes" value={wishes} onChange={(event) => { setWishes(event.target.value); setErrors((current) => ({ ...current, wishes: undefined })); }} placeholder="Ucapan & Do'a" rows={2} aria-invalid={Boolean(errors.wishes)} aria-describedby={errors.wishes ? "wishes-error" : undefined} className="block h-[92px] w-full resize-none border-0 border-b border-white/40 bg-transparent px-0 pt-5 text-[11px] text-white outline-none placeholder:text-white/50 focus:border-white" />
          {errors.wishes && <p id="wishes-error" className="mt-1 text-[9px] text-white/75">{errors.wishes}</p>}
        </div>

        <button type="submit" className="mx-auto mt-12 flex h-11 min-w-[138px] items-center justify-center rounded-full bg-white px-8 text-[12px] font-medium text-neutral-800 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Submit</button>
      </form>

      <div className="mt-auto pt-8">
        <CoupleLogo />
      </div>
    </main>
  );
}
