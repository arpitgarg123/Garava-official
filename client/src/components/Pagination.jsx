const Pagination = ({ page, totalPages, onChange })=> {
  if (totalPages <= 1) return null;
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => canPrev && onChange(page - 1)}
        disabled={!canPrev}
        className="rounded-xl border px-3 py-2 text-[1.0625rem] disabled:opacity-50"
      >
        ← Prev
      </button>
      <span className="text-[1.0625rem] text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => canNext && onChange(page + 1)}
        disabled={!canNext}
        className="rounded-xl border px-3 py-2 text-[1.0625rem] disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
}
export default Pagination