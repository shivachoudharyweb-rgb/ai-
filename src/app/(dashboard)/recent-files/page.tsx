export default function RecentFilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Recent Files</h1>
      </div>
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Recently modified files will appear here.</p>
        </div>
      </div>
    </div>
  );
}
