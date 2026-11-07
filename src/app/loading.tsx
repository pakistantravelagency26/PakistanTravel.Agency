export default function Loading() {
  return (
    <div className="bg-slate-50 min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-44 sm:h-56 bg-slate-200/80 rounded-3xl w-full" />

        {/* Filter / Title Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-slate-200/80 rounded-xl w-48 sm:w-64" />
          <div className="h-8 bg-slate-200/80 rounded-xl w-32 hidden sm:block" />
        </div>

        {/* Cards Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm p-4 space-y-3">
              <div className="h-44 bg-slate-200/80 rounded-2xl w-full" />
              <div className="h-4 bg-slate-200/80 rounded w-1/3" />
              <div className="h-5 bg-slate-200/80 rounded w-3/4" />
              <div className="h-4 bg-slate-200/80 rounded w-1/2" />
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <div className="h-4 bg-slate-200/80 rounded w-1/4" />
                <div className="h-6 bg-slate-200/80 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
