interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
    animation?: "pulse" | "wave" | "none";
}

export function Skeleton({ className = "", variant = "text", width, height, animation = "pulse" }: SkeletonProps) {
    const animationClass = animation === "pulse" ? "animate-pulse" : animation === "wave" ? "animate-shimmer" : "";

    const variantClass = variant === "circular" ? "rounded-full" : variant === "rectangular" ? "rounded-md" : "rounded";

    const style: React.CSSProperties = {
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
    };

    return (
        <div
            className={`bg-slate-200 dark:bg-slate-700 ${variantClass} ${animationClass} ${className}`}
            style={style}
            role="status"
            aria-label="Loading"
        />
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <Skeleton height={24} width="80%" />
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="60%" />
            <div className="flex gap-2 pt-2">
                <Skeleton height={20} width={60} variant="rectangular" />
                <Skeleton height={20} width={60} variant="rectangular" />
            </div>
        </div>
    );
}

export function BlogPostSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {/* Title */}
            <Skeleton height={40} width="90%" />

            {/* Metadata */}
            <div className="flex gap-4">
                <Skeleton height={16} width={100} />
                <Skeleton height={16} width={80} />
            </div>

            {/* Content paragraphs */}
            <div className="space-y-3 pt-4">
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="95%" />
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="85%" />
            </div>

            <div className="space-y-3 pt-6">
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="90%" />
            </div>

            <div className="space-y-3 pt-6">
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="80%" />
            </div>
        </div>
    );
}

export function HeaderSkeleton() {
    return (
        <div className="flex items-center justify-between p-4">
            <Skeleton height={32} width={150} />
            <div className="flex gap-2">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
            </div>
        </div>
    );
}
