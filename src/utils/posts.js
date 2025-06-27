// 마크다운 파일에서 포스트 데이터를 추출하는 유틸리티

/**
 * Front matter를 파싱하는 함수
 * @param {string} content - 마크다운 파일 전체 내용
 * @returns {Object} { metadata, content } 객체
 */
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return { metadata: {}, content };
  }
  
  const [, frontMatter, markdownContent] = match;
  const metadata = {};
  
  // YAML-like parsing (간단한 버전)
  frontMatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // 따옴표 제거
      value = value.replace(/^["']|["']$/g, '');
      
      // 배열 처리 (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => 
          item.trim().replace(/^["']|["']$/g, '')
        );
      }
      
      metadata[key] = value;
    }
  });
  
  return { metadata, content: markdownContent };
}

/**
 * 마크다운 내용에서 요약문 생성
 * @param {string} content - 마크다운 내용
 * @param {number} maxLength - 최대 길이
 * @returns {string} 요약문
 */
function generateExcerpt(content, maxLength = 150) {
  // 마크다운 헤더와 코드 블록 제거
  const cleanContent = content
    .replace(/#{1,6}\s/g, '') // 헤더 제거
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/`[^`]*`/g, '') // 인라인 코드 제거
    .replace(/\*\*([^*]*)\*\*/g, '$1') // 볼드 제거
    .replace(/\*([^*]*)\*/g, '$1') // 이탤릭 제거
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 제거
    .replace(/\n+/g, ' ') // 개행을 공백으로
    .trim();
    
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength) + '...';
}

/**
 * 모든 포스트 데이터를 가져오는 함수
 * @returns {Promise<Array>} 포스트 배열
 */
export async function getAllPosts() {
  // 사용할 수 있는 포스트 목록
  const postSlugs = ['react-vite-setup', 'typescript-alternative', 'daily-reflection'];
  const posts = [];

  for (const slug of postSlugs) {
    try {
      // 각 마크다운 파일을 동적으로 import
      const module = await import(`../content/posts/${slug}.md?raw`);
      const content = module.default;
      
      // frontmatter 파싱
      const { metadata, content: markdownContent } = parseFrontMatter(content);
      
      // 포스트 객체 생성
      const post = {
        id: slug,
        slug: slug,
        title: metadata.title || '',
        date: metadata.date || '',
        readTime: metadata.readTime || '',
        category: metadata.category || 'dev',
        description: metadata.description || '',
        tags: metadata.tags || [],
        excerpt: generateExcerpt(markdownContent)
      };
      
      posts.push(post);
    } catch (error) {
      console.error(`Error loading post ${slug}:`, error);
    }
  }

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * 특정 포스트의 전체 내용을 가져오는 함수
 * @param {string} postId - 포스트 ID
 * @returns {Promise<Object|null>} 포스트 객체 또는 null
 */
export async function getPostBySlug(postId) {
  try {
    const posts = await getAllPosts();
    const post = posts.find(p => p.slug === postId);
    
    if (!post) {
      return null;
    }
    
    const markdownContent = await getMarkdownContent(postId);
    
    return {
      ...post,
      content: markdownContent
    };
  } catch (error) {
    console.error('포스트 로딩 실패:', error);
    return null;
  }
}

/**
 * 마크다운 내용을 가져오는 함수
 * @param {string} postId - 포스트 ID
 * @returns {string} 마크다운 내용
 */
async function getMarkdownContent(postId) {
  try {
    // Vite에서 동적 import로 마크다운 파일 불러오기
    const module = await import(`../content/posts/${postId}.md?raw`);
    const rawContent = module.default;
    
    // frontmatter 파싱하여 본문만 추출
    const { content } = parseFrontMatter(rawContent);
    return content;
  } catch (error) {
    console.error(`마크다운 파일을 불러올 수 없습니다: ${postId}`, error);
    return '# 포스트를 불러올 수 없습니다\n\n죄송합니다. 요청하신 포스트를 불러오는 중 오류가 발생했습니다.';
  }
}

/**
 * 카테고리별 포스트 필터링
 * @param {string} category - 필터링할 카테고리 ('dev', 'life')
 * @returns {Promise<Array>} 필터링된 포스트 배열
 */
export async function getPostsByCategory(category) {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.category === category);
}

/**
 * 태그별 포스트 필터링
 * @param {Array} posts - 전체 포스트 배열
 * @param {string} tag - 필터링할 태그
 * @returns {Array} 필터링된 포스트 배열
 */
export function getPostsByTag(posts, tag) {
  return posts.filter(post => 
    post.tags && post.tags.includes(tag)
  );
}

/**
 * 포스트 검색
 * @param {Array} posts - 전체 포스트 배열
 * @param {string} query - 검색어
 * @returns {Array} 검색 결과 포스트 배열
 */
export function searchPosts(posts, query) {
  if (!query.trim()) {
    return posts;
  }
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    (post.tags && post.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    ))
  );
}

export { parseFrontMatter, generateExcerpt }; 