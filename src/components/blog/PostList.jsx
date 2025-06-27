import { Calendar, Clock, Tag } from "lucide-react";
import "./PostList.css";

function PostList({ posts, onPostSelect, isLoading }) {
  if (isLoading) {
    return (
      <section className="posts-section">
        <div className="posts-container">
          <h2>최근 글</h2>
          <div className="loading-spinner">로딩 중...</div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="posts-section">
        <div className="posts-container">
          <h2>최근 글</h2>
          <p className="no-posts">아직 작성된 글이 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="posts-section">
      <div className="posts-container">
        <h2>최근 글</h2>
        <div className="posts-grid">
          {posts.map((post) => (
            <article
              key={post.id}
              className="post-card"
              onClick={() => onPostSelect(post)}
            >
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
              </div>

              <div className="post-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{post.date}</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PostList;
