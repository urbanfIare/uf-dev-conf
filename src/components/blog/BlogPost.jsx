import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatDate } from "../../utils/date";
import { useRealTimeDate } from "../../hooks/useRealTimeDate";
import "./BlogPost.css";

function BlogPost({ post, onBack, isLoading }) {
  const relativeTime = useRealTimeDate(post?.date, 30000); // 30초마다 업데이트
  if (isLoading) {
    return (
      <article className="blog-post">
        <div className="post-container">
          <div className="loading-spinner">로딩 중...</div>
        </div>
      </article>
    );
  }

  if (!post) {
    return (
      <article className="blog-post">
        <div className="post-container">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            목록으로 돌아가기
          </button>
          <div className="error-message">
            <h2>포스트를 불러올 수 없습니다</h2>
            <p>요청하신 포스트를 찾을 수 없습니다.</p>
          </div>
        </div>
      </article>
    );
  }

  // 다크모드 감지
  const isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";

  return (
    <article className="blog-post">
      <div className="post-container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          목록으로 돌아가기
        </button>

        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>

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

          {post.description && (
            <p className="post-description">{post.description}</p>
          )}
        </header>

        <div className="post-content">
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={isDarkMode ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}

export default BlogPost;
