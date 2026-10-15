function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}) {
  if (total === 0) return null

  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      if (start > 2) pages.push('...')

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) pages.push('...')

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row">
      {/* Results Info & Items Per Page */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>
          Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
          <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
          <span className="font-semibold text-slate-800">{total}</span> products
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-slate-400">Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Items per page"
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, index) =>
              p === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-8 items-center justify-center text-xs text-slate-400"
                >
                  •••
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  onClick={() => onPageChange(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-semibold transition-all cursor-pointer ${
                    p === page
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default Pagination
