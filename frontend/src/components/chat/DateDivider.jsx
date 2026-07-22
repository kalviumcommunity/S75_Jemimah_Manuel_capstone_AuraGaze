export default function DateDivider({ label }) {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="h-px flex-1 bg-white/10" />

      <span className="mx-5 text-xs uppercase tracking-[4px] text-white/40">
        {label}
      </span>

      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}