export default function Loading() {
  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 sticky top-28 animate-pulse">
            <div className="h-6 w-16 bg-[var(--surface-2)] rounded mb-6" />
            
            <div className="mb-6">
              <div className="h-4 w-12 bg-[var(--surface-2)] rounded mb-3" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <div className="h-5 w-5 bg-[var(--surface-2)] rounded" />
                  <div className="h-4 w-20 bg-[var(--surface-2)] rounded" />
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="h-4 w-12 bg-[var(--surface-2)] rounded mb-3" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <div className="h-5 w-5 bg-[var(--surface-2)] rounded" />
                  <div className="h-4 w-12 bg-[var(--surface-2)] rounded" />
                </div>
              ))}
            </div>

            <div>
              <div className="h-4 w-14 bg-[var(--surface-2)] rounded mb-3" />
              <div className="h-2 w-full bg-[var(--surface-2)] rounded mb-2" />
              <div className="flex gap-2">
                <div className="h-8 w-full bg-[var(--surface-2)] rounded-lg" />
                <div className="h-8 w-full bg-[var(--surface-2)] rounded-lg" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-[var(--surface-2)] rounded animate-pulse" />
            <div className="h-10 w-40 bg-[var(--surface-2)] rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-[var(--surface-2)]" />
                <div className="p-6 border-t border-[var(--border)]">
                  <div className="h-3 w-16 bg-[var(--surface-2)] rounded mb-2" />
                  <div className="h-5 w-full bg-[var(--surface-2)] rounded mb-2" />
                  <div className="h-5 w-3/4 bg-[var(--surface-2)] rounded mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-20 bg-[var(--surface-2)] rounded" />
                    <div className="h-12 w-12 bg-[var(--surface-2)] rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}