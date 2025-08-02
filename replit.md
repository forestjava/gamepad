# Overview

This is a fullstack web application built with React and Express.js that demonstrates gamepad/controller functionality. The application features a gamepad demo interface that can detect connected controllers, display their inputs, and log events in real-time. It's structured as a monorepo with a React frontend using modern UI components and an Express backend with database integration capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL session store using connect-pg-simple
- **Development**: Hot reloading with tsx for server-side development

## Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle migrations stored in `/migrations` directory
- **Type Safety**: Shared schema definitions between frontend and backend
- **In-Memory Fallback**: MemStorage class for development/testing without database

## Authentication & Authorization
- **Session-based**: Express sessions with PostgreSQL store
- **User Model**: Basic username/password authentication structure
- **Shared Types**: Type definitions shared between client and server for consistency

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: TypeScript ORM with PostgreSQL dialect

### UI & Styling
- **Radix UI**: Headless component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Font Awesome**: Additional icon library
- **Google Fonts**: Inter font family

### Development Tools
- **Vite**: Frontend build tool and development server
- **Replit Integration**: Custom Replit plugins for development environment
- **ESBuild**: JavaScript bundler for production builds

### Utilities & Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **Date-fns**: Date manipulation utilities
- **Class Variance Authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS class utilities