import Image from "next/image";

export function CoupleLogo() {
  return <Image className="couple-logo" src="/images/logo.png" alt="Fachrul and Tasya monogram" width={63} height={90} priority />;
}
