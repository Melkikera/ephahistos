export default function DashboardLoading() {
  return (
    <div className="py-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="rounded-md bg-gray-200 w-12 h-12 animate-pulse"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}