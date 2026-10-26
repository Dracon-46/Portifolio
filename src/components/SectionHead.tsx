type Props = { index: string; label: string; id: string; title: string; lead?: string };

/** Numbered rule, then a split-reveal title. Shared by the later sections. */
export default function SectionHead({ index, label, id, title, lead }: Props) {
  return (
    <div className="mb-16 md:mb-24">
      <div className="mb-14 flex items-center gap-4">
        <span className="label">
          {index} — {label}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <h2 id={id} data-split className="display text-[clamp(3rem,7vw,6.5rem)] md:col-span-7">
          {title}
        </h2>
        {lead && (
          <p data-reveal className="max-w-md text-lg leading-relaxed text-muted md:col-span-4 md:col-start-9">
            {lead}
          </p>
        )}
      </div>
    </div>
  );
}
