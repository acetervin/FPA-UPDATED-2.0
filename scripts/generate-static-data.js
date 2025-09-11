#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDataDir = join(__dirname, '../client/public/data');

// Ensure data directory exists
mkdirSync(publicDataDir, { recursive: true });

async function fetchWithTimeout(url, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function generateStaticData() {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  
  try {
    console.log('🚀 Generating static data files...');
    
    // Fetch data from API endpoints
    const endpoints = [
      { path: '/api/blog-posts', filename: 'blog-posts.json' },
      { path: '/api/blog-posts/featured', filename: 'featured-posts.json' },
      { path: '/api/gallery', filename: 'gallery.json' },
      { path: '/api/causes/active', filename: 'active-causes.json' },
      { path: '/api/events', filename: 'events.json' }
    ];
    
    for (const { path, filename } of endpoints) {
      try {
        console.log(`📥 Fetching ${path}...`);
        const response = await fetchWithTimeout(`${baseUrl}${path}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const outputPath = join(publicDataDir, filename);
        
        writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log(`✅ Generated ${filename}`);
        
      } catch (error) {
        console.error(`❌ Failed to generate ${filename}:`, error.message);
        process.exit(1);
      }
    }
    
    console.log('🎉 Static data generation complete!');
    console.log(`📁 Files saved to: ${publicDataDir}`);
    
  } catch (error) {
    console.error('❌ Static data generation failed:', error);
    process.exit(1);
  }
}

generateStaticData();