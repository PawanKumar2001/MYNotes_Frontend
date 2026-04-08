const NoteCardSkeleton = () => (
  <div className="card p-5 flex flex-col gap-3">
    <div className="skeleton h-5 w-3/4" />
    <div className="skeleton h-4 w-1/2" />
    <div className="h-px bg-gray-100" />
    <div className="space-y-2">
      <div className="skeleton h-3.5 w-full" />
      <div className="skeleton h-3.5 w-full" />
      <div className="skeleton h-3.5 w-2/3" />
    </div>
    <div className="flex items-center justify-between pt-1">
      <div className="skeleton h-3 w-20" />
      <div className="flex gap-2">
        <div className="skeleton h-7 w-14 rounded-lg" />
        <div className="skeleton h-7 w-16 rounded-lg" />
      </div>
    </div>
  </div>
)

export default NoteCardSkeleton
