import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 마크다운 컴포넌트 설정
export const markdownComponents = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    return !inline && match ? (
      <SyntaxHighlighter
        style={isDark ? oneDark : oneLight}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: '1rem 0',
          borderRadius: '8px',
          fontSize: '0.9rem',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  
  // 헤딩 스타일링
  h1: ({ children }) => (
    <h1 style={{ 
      fontSize: '2rem', 
      fontWeight: '700', 
      marginTop: '2rem', 
      marginBottom: '1rem',
      borderBottom: '2px solid var(--border-color)',
      paddingBottom: '0.5rem'
    }}>
      {children}
    </h1>
  ),
  
  h2: ({ children }) => (
    <h2 style={{ 
      fontSize: '1.5rem', 
      fontWeight: '600', 
      marginTop: '1.5rem', 
      marginBottom: '0.75rem' 
    }}>
      {children}
    </h2>
  ),
  
  h3: ({ children }) => (
    <h3 style={{ 
      fontSize: '1.25rem', 
      fontWeight: '600', 
      marginTop: '1.25rem', 
      marginBottom: '0.5rem' 
    }}>
      {children}
    </h3>
  ),
  
  // 단락 스타일링
  p: ({ children }) => (
    <p style={{ 
      marginBottom: '1rem', 
      lineHeight: '1.7',
      color: 'var(--text-primary)'
    }}>
      {children}
    </p>
  ),
  
  // 링크 스타일링
  a: ({ href, children }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: 'var(--primary-color)',
        textDecoration: 'underline',
        textDecorationColor: 'var(--accent-color)',
      }}
    >
      {children}
    </a>
  ),
  
  // 리스트 스타일링
  ul: ({ children }) => (
    <ul style={{ 
      marginBottom: '1rem', 
      paddingLeft: '1.5rem',
      listStyle: 'disc'
    }}>
      {children}
    </ul>
  ),
  
  ol: ({ children }) => (
    <ol style={{ 
      marginBottom: '1rem', 
      paddingLeft: '1.5rem',
      listStyle: 'decimal'
    }}>
      {children}
    </ol>
  ),
  
  li: ({ children }) => (
    <li style={{ 
      marginBottom: '0.25rem',
      lineHeight: '1.6'
    }}>
      {children}
    </li>
  ),
  
  // 인용문 스타일링
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '4px solid var(--primary-color)',
      paddingLeft: '1rem',
      margin: '1rem 0',
      fontStyle: 'italic',
      color: 'var(--text-secondary)',
      backgroundColor: 'var(--bg-secondary)',
      padding: '1rem',
      borderRadius: '0 8px 8px 0'
    }}>
      {children}
    </blockquote>
  ),
  
  // 테이블 스타일링
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid var(--border-color)'
      }}>
        {children}
      </table>
    </div>
  ),
  
  th: ({ children }) => (
    <th style={{
      padding: '0.75rem',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      fontWeight: '600',
      textAlign: 'left'
    }}>
      {children}
    </th>
  ),
  
  td: ({ children }) => (
    <td style={{
      padding: '0.75rem',
      border: '1px solid var(--border-color)'
    }}>
      {children}
    </td>
  ),
}; 