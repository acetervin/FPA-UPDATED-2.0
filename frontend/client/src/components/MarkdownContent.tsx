import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const markdownClass = "prose prose-slate max-w-none dark:prose-invert prose-headings:font-poppins prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-p:text-base prose-p:leading-7 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:my-8 prose-pre:bg-muted prose-pre:p-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-ul:list-disc prose-ol:list-decimal"

  return (
    <div className={markdownClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
