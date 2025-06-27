import { useState, useEffect } from 'react';
import { getAllPosts, getPostBySlug } from '../utils/posts';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = getAllPosts();
        setPosts(allPosts);
      } catch (err) {
        setError('포스트를 불러오는데 실패했습니다.');
        console.error('포스트 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return {
    posts,
    isLoading,
    error,
  };
};

export const usePost = (slug) => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const postData = await getPostBySlug(slug);
        setPost(postData);
      } catch (err) {
        setError('포스트를 불러오는데 실패했습니다.');
        console.error('포스트 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  return {
    post,
    isLoading,
    error,
  };
}; 