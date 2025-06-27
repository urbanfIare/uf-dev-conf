import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getPostBySlug } from "./utils/posts";
import { usePostsCache } from "./hooks/usePostsCache";
import "./App.css";

// 컴포넌트 imports
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HeroSection from "./components/common/HeroSection";
import PostList from "./components/blog/PostList";
import BlogPost from "./components/blog/BlogPost";

// 홈 페이지 컴포넌트
function HomePage() {
  const { posts, isLoading } = usePostsCache("all");
  const navigate = useNavigate();

  // 포스트 선택 핸들러
  const handlePostSelect = (post) => {
    navigate(`/posts/${post.slug}`);
  };

  return (
    <>
      <HeroSection />
      <PostList
        posts={posts}
        onPostSelect={handlePostSelect}
        isLoading={isLoading}
      />
    </>
  );
}

// 전체 포스트 목록 페이지 컴포넌트
function AllPostsPage() {
  const navigate = useNavigate();
  const { posts, isLoading } = usePostsCache("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  // 포스트 선택 핸들러
  const handlePostSelect = (post) => {
    navigate(`/posts/${post.slug}`);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(term.toLowerCase()) ||
          post.description.toLowerCase().includes(term.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(term.toLowerCase())
          )
      );
      setFilteredPosts(filtered);
    }
  };

  // 포스트가 로드되면 필터링된 포스트 업데이트
  useEffect(() => {
    setFilteredPosts(posts);
    setSearchTerm(""); // 페이지 이동 시 검색어 초기화
  }, [posts]);

  if (isLoading) {
    return (
      <>
        <section className="all-posts-section">
          <div className="posts-container">
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "600",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              전체 글 목록
            </h1>
            <div
              style={{
                textAlign: "center",
                marginBottom: "2rem",
                opacity: 0.5,
              }}
            >
              로딩 중...
            </div>
          </div>
        </section>
        <PostList
          posts={[]}
          onPostSelect={handlePostSelect}
          isLoading={true}
          showAll={true}
        />
      </>
    );
  }

  return (
    <>
      <section className="all-posts-section">
        <div className="posts-container">
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            전체 글 목록
          </h1>
          <p
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              opacity: 0.8,
            }}
          >
            총 {posts.length}개의 글이 있습니다
          </p>

          {/* 검색 박스 */}
          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto 2rem",
              position: "relative",
            }}
          >
            <input
              type="text"
              placeholder="제목, 내용, 태그로 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>
      </section>

      {/* 검색 결과가 없을 때 메시지만 표시 */}
      {filteredPosts.length === 0 && searchTerm ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            opacity: 0.6,
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
          <p style={{ fontSize: "0.9rem" }}>다른 검색어를 시도해보세요.</p>
        </div>
      ) : (
        <PostList
          posts={filteredPosts}
          onPostSelect={handlePostSelect}
          isLoading={false}
          showAll={true}
        />
      )}
    </>
  );
}

// 카테고리 페이지 컴포넌트
function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { posts, isLoading } = usePostsCache(category);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  // 포스트 선택 핸들러
  const handlePostSelect = (post) => {
    navigate(`/posts/${post.slug}`);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(term.toLowerCase()) ||
          post.description.toLowerCase().includes(term.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(term.toLowerCase())
          )
      );
      setFilteredPosts(filtered);
    }
  };

  // 포스트가 로드되면 필터링된 포스트 업데이트
  useEffect(() => {
    setFilteredPosts(posts);
    setSearchTerm(""); // 카테고리 변경 시 검색어 초기화
  }, [posts, category]);

  // 카테고리명 변환
  const getCategoryName = (cat) => {
    switch (cat) {
      case "dev":
        return "기술";
      case "life":
        return "일상";
      default:
        return cat;
    }
  };

  if (isLoading) {
    return (
      <>
        <section className="category-section">
          <div className="posts-container">
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "600",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {getCategoryName(category)} 글 목록
            </h1>
            <div
              style={{
                textAlign: "center",
                marginBottom: "2rem",
                opacity: 0.5,
              }}
            >
              로딩 중...
            </div>
          </div>
        </section>
        <PostList
          posts={[]}
          onPostSelect={handlePostSelect}
          isLoading={true}
          showAll={true}
        />
      </>
    );
  }

  return (
    <>
      <section className="category-section">
        <div className="posts-container">
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {getCategoryName(category)} 글 목록
          </h1>
          <p
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              opacity: 0.8,
            }}
          >
            총 {posts.length}개의 글이 있습니다
          </p>

          {/* 검색 박스 */}
          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto 2rem",
              position: "relative",
            }}
          >
            <input
              type="text"
              placeholder="제목, 내용, 태그로 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>
      </section>

      {/* 검색 결과가 없을 때 메시지만 표시 */}
      {filteredPosts.length === 0 && searchTerm ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            opacity: 0.6,
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
          <p style={{ fontSize: "0.9rem" }}>다른 검색어를 시도해보세요.</p>
        </div>
      ) : (
        <PostList
          posts={filteredPosts}
          onPostSelect={handlePostSelect}
          isLoading={false}
          showAll={true}
        />
      )}
    </>
  );
}

// 포스트 상세 페이지 컴포넌트
function PostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 홈으로 돌아가기
  const handleBackToHome = () => {
    navigate("/");
  };

  // 포스트 로드
  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      try {
        const fullPost = await getPostBySlug(slug);
        setPost(fullPost);
      } catch (error) {
        console.error("포스트 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  return (
    <BlogPost post={post} onBack={handleBackToHome} isLoading={isLoading} />
  );
}

// 메인 앱 컴포넌트
function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // 다크모드 토글
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.setAttribute(
        "data-theme",
        newMode ? "dark" : "light"
      );
      return newMode;
    });
  };

  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    navigate("/");
  };

  // 현재 페이지가 포스트 상세 페이지인지 확인
  const isPostPage = location.pathname.startsWith("/posts/");

  // 초기 테마 설정
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldUseDark);
    document.documentElement.setAttribute(
      "data-theme",
      shouldUseDark ? "dark" : "light"
    );
  }, []);

  // 테마 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div className="app">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogoClick={handleLogoClick}
        showBackButton={isPostPage}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<AllPostsPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
