export function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
            </div>
        </div>
    );
}
