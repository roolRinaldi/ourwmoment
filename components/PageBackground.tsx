export function PageBackground({ variant }: { variant: "landing" | "form" }) {
  return (
    <>
      <div className="photo-background" aria-hidden="true" />
      <div className={`${variant}-treatment`} aria-hidden="true" />
    </>
  );
}
