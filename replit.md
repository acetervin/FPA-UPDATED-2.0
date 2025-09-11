# Family Peace Association Website

## Overview

The Family Peace Association website is a full-stack web application designed to support families through counseling services, conflict resolution programs, and community engagement. The platform serves as both an informational resource and a functional interface for volunteer applications, contact submissions, and newsletter subscriptions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for robust form processing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API endpoints with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon Database
- **ORM**: Drizzle ORM with schema-first approach
- **Migration Management**: Drizzle Kit for database schema migrations
- **Fallback Storage**: In-memory storage implementation for development/testing

## Key Components

### Database Schema
- **Users**: Authentication and user management
- **Blog Posts**: Content management with categories and featured posts
- **Team Members**: Staff profiles with specialties and contact information
- **Causes**: Community initiatives with fundraising goals and volunteer needs
- **Applications**: Volunteer application submissions
- **Contact Submissions**: Contact form data collection
- **Newsletter Subscriptions**: Email subscription management

### UI Components
- **Design System**: Custom theme system supporting golden and blue color schemes
- **Component Library**: Comprehensive shadcn/ui components (buttons, forms, cards, etc.)
- **Animations**: Custom scroll animations with intersection observer
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

### Application Features
- **Content Management**: Blog posts, team profiles, and cause management
- **Form Processing**: Volunteer applications, contact forms, newsletter subscriptions
- **Theme System**: Dynamic theme switching between color schemes
- **SEO Optimization**: React Helmet for meta tags and social media optimization

## Data Flow

1. **Client Requests**: React frontend makes API calls using TanStack Query
2. **API Processing**: Express.js server handles requests and validates data
3. **Database Operations**: Drizzle ORM executes type-safe database queries
4. **Response Handling**: JSON responses sent back to client with error handling
5. **State Management**: TanStack Query caches responses and manages loading states
6. **UI Updates**: React components re-render based on data changes

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Forms**: React Hook Form, Hookform Resolvers, Zod
- **Routing**: Wouter for client-side navigation
- **Query Management**: TanStack React Query
- **Utilities**: Class Variance Authority, clsx, date-fns

### Backend Dependencies
- **Server**: Express.js, Node.js types
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Session Management**: Express Session, connect-pg-simple
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Build Tools
- **Development**: Vite with React plugin and runtime error overlay
- **Production**: esbuild for server bundling, Vite for client bundling
- **TypeScript**: Strict type checking with modern ES modules

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Development database connection via environment variables
- **Asset Handling**: Vite handles static assets and images

### Production Environment
- **Build Process**: 
  1. Client build using Vite (outputs to `dist/public`)
  2. Server build using esbuild (outputs to `dist`)
- **Static Serving**: Express serves built client assets in production
- **Database**: Production PostgreSQL database via DATABASE_URL environment variable
- **Process Management**: Node.js application with environment-based configuration

### Environment Configuration
- **Development**: NODE_ENV=development with tsx for TypeScript execution
- **Production**: NODE_ENV=production with compiled JavaScript
- **Database**: Configurable via DATABASE_URL environment variable
- **Build Commands**: Separate build processes for client and server code

## Changelog
- July 04, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.
