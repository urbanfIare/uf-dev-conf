import "./Skeleton.css";

function Skeleton({ width = "100%", height = "20px", className = "" }) {
  return <div className={`skeleton ${className}`} style={{ width, height }} />;
}

function PostSkeleton() {
  return (
    <article className="post-card skeleton-card">
      <div className="post-header">
        <Skeleton height="24px" className="skeleton-title" />
        <Skeleton height="16px" width="80%" />
        <Skeleton height="16px" width="60%" />
      </div>

      <div className="post-footer">
        <div className="post-meta">
          <Skeleton height="14px" width="80px" />
          <Skeleton height="14px" width="60px" />
        </div>
        <div className="post-tags">
          <Skeleton height="20px" width="50px" />
          <Skeleton height="20px" width="40px" />
        </div>
      </div>
    </article>
  );
}

function PostListSkeleton({ count = 3 }) {
  return (
    <section className="posts-section">
      <div className="posts-container">
        <div className="posts-grid">
          {Array.from({ length: count }, (_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { Skeleton, PostSkeleton, PostListSkeleton };
export default Skeleton;
