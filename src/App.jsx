import { useState, useEffect } from "react";
import { getAllPosts, getPostBySlug } from "./utils/posts";
import "./App.css";

// 컴포넌트 imports
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HeroSection from "./components/common/HeroSection";
import PostList from "./components/blog/PostList";
import BlogPost from "./components/blog/BlogPost";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // 포스트 선택 핸들러
  const handlePostSelect = async (post) => {
    setIsLoading(true);
    try {
      const fullPost = await getPostBySlug(post.slug);
      setSelectedPost(fullPost);
    } catch (error) {
      console.error("포스트 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 홈으로 돌아가기
  const handleBackToHome = () => {
    setSelectedPost(null);
  };

  // 초기 포스트 목록 로드
  useEffect(() => {
    try {
      const allPosts = getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error("포스트 목록 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        onLogoClick={handleBackToHome}
        showBackButton={!!selectedPost}
      />

      <main className="main-content">
        {selectedPost ? (
          <BlogPost
            post={selectedPost}
            onBack={handleBackToHome}
            isLoading={isLoading}
          />
        ) : (
          <>
            <HeroSection />
            <PostList
              posts={posts}
              onPostSelect={handlePostSelect}
              isLoading={isLoading}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
