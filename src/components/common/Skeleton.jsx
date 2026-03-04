const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-32 w-32 rounded-full',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-10 w-32 rounded-lg',
    card: 'h-48 w-full rounded-lg',
  };

  return (
    <div
      className={`animate-pulse bg-darkGray rounded ${variants[variant]} ${className}`}
    />
  );
};

export const SkeletonCard = ({ children, className = '' }) => (
  <div className={`p-6 bg-card border border-darkGray rounded-lg ${className}`}>
    {children}
  </div>
);

export const SkeletonHeader = () => (
  <div className="space-y-3">
    <Skeleton variant="title" />
    <Skeleton variant="text" />
  </div>
);

export const SkeletonList = ({ items = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    ))}
  </div>
);

export default Skeleton;
