import sanitizeHtml from 'sanitize-html';
import path from 'path';

const SANITIZE_HTML_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li',
    'b', 'i', 'strong', 'em', 'a', 'img'
  ],
  allowedAttributes: {
    'a': ['href', 'target', 'rel'],
    'img': ['src', 'alt']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    'a': (tagName: string, attribs: any) => ({
      tagName,
      attribs: {
        ...attribs,
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    })
  }
};

export const sanitizeHtmlContent = (content: string): string => {
  return sanitizeHtml(content, SANITIZE_HTML_OPTIONS);
};

export const sanitizeFilename = (filename: string): string => {
  // Remove any directory traversal attempts
  const sanitized = path.basename(filename);
  
  // Replace any non-alphanumeric characters (except dashes and underscores)
  return sanitized
    .replace(/[^a-zA-Z0-9-_\.]/g, '-')
    .replace(/\.{2,}/g, '.') // Remove consecutive dots
    .replace(/^[-_.]+|[-_.]+$/g, ''); // Remove leading/trailing special chars
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
