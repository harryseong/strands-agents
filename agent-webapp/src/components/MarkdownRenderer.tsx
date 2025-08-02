import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Link, Typography } from '@mui/material';
import '../styles/MarkdownRenderer.scss';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Box className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <Typography variant="h4" component="h1" className="markdown-h1">
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h5" component="h2" className="markdown-h2">
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="h6" component="h3" className="markdown-h3">
              {children}
            </Typography>
          ),
          h4: ({ children }) => (
            <Typography variant="subtitle1" component="h4" className="markdown-h4">
              {children}
            </Typography>
          ),
          h5: ({ children }) => (
            <Typography variant="subtitle2" component="h5" className="markdown-h5">
              {children}
            </Typography>
          ),
          h6: ({ children }) => (
            <Typography variant="body1" component="h6" className="markdown-h6">
              {children}
            </Typography>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <Typography variant="body1" component="p" className="markdown-p">
              {children}
            </Typography>
          ),
          
          // Links - open in new tab
          a: ({ href, children }) => (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="markdown-link"
            >
              {children}
            </Link>
          ),
          
          // Code blocks
          code: ({ inline, className, children }) => {
            if (inline) {
              return (
                <code className="markdown-inline-code">
                  {children}
                </code>
              );
            }
            return (
              <pre className="markdown-code-block">
                <code className={className}>
                  {children}
                </code>
              </pre>
            );
          },
          
          // Lists
          ul: ({ children }) => (
            <ul className="markdown-ul">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="markdown-ol">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="markdown-li">
              {children}
            </li>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="markdown-table-container">
              <table className="markdown-table">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="markdown-thead">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="markdown-tbody">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="markdown-tr">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="markdown-th">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="markdown-td">
              {children}
            </td>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="markdown-blockquote">
              {children}
            </blockquote>
          ),
          
          // Horizontal rule
          hr: () => <hr className="markdown-hr" />,
          
          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="markdown-strong">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="markdown-em">
              {children}
            </em>
          ),
          
          // Strikethrough
          del: ({ children }) => (
            <del className="markdown-del">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;