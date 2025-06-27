import { Calendar, Clock, Tag } from "lucide-react";
import { formatDate } from "../../utils/date";
import { useRealTimeDate } from "../../hooks/useRealTimeDate";
import { PostListSkeleton } from "../common/Skeleton";
import "./PostList.css";

// 개별 포스트 아이템 컴포넌트 (실시간 날짜 업데이트용)
function PostItem({ post, onPostSelect }) {
  const relativeTime = useRealTimeDate(post.date, 30000); // 30초마다 업데이트

  return (
    <article className="post-card" onClick={() => onPostSelect(post)}>
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
      </div>

      <div className="post-footer">
        <div className="post-meta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{relativeTime}</span>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            <Tag size={14} />
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function PostList({
  posts,
  onPostSelect,
  isLoading,
  showAll = false,
  title = "최근 글",
}) {
  if (isLoading) {
    return (
      <>
        {!showAll && (
          <section className="posts-section">
            <div className="posts-container">
              <h2>{title}</h2>
            </div>
          </section>
        )}
        <PostListSkeleton count={showAll ? 5 : 2} />
      </>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="posts-section">
        <div className="posts-container">
          {!showAll && <h2>{title}</h2>}
          <p className="no-posts">아직 작성된 글이 없습니다.</p>
        </div>
      </section>
    );
  }

  // showAll이 true면 모든 포스트, false면 최근 2개만
  const displayPosts = showAll ? posts : posts.slice(0, 2);

  return (
    <section className="posts-section">
      <div className="posts-container">
        {!showAll && <h2>{title}</h2>}
        <div className="posts-grid">
          {displayPosts.map((post) => (
            <PostItem key={post.id} post={post} onPostSelect={onPostSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PostList;
