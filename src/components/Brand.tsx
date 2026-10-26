import Image from "next/image";

export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand${compact ? " brand--compact" : ""}`}>
      <Image
        src={compact ? "/onlytits-icon.png" : "/onlytits-logo.png"}
        alt={compact ? "" : "Onlytits"}
        aria-hidden={compact}
        className="brand-image"
        width={compact ? 512 : 1175}
        height={compact ? 512 : 355}
        priority
      />
    </span>
  );
}
