# TodoFlow 📝

A modern task management application built with Next.js, featuring role-based access control (RBAC) and a clean, intuitive interface.

## ✨ Features

- **🎨 Modern UI**: Clean design with Sage Green and Dusty Rose color palette
- **🔐 Role-Based Access Control**: Three distinct user roles with specific permissions
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Updates**: Instant task updates using TanStack Query
- **🗂️ List Management**: Organize tasks into customizable lists
- **🏷️ Tagging System**: Categorize tasks with tags
- **📅 Due Dates**: Set and track task deadlines
- **🔍 Smart Filtering**: Filter tasks by status, date, and more

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **State Management**: TanStack Query

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todoflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   POSTGRES_URL="postgresql://username:password@localhost:5432/todoflow"

   # Better Auth
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"

   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Push database schema
   npx drizzle-kit push

   # Create default admin and manager accounts
   node setup-accounts.js
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 👥 User Roles & Permissions

TodoFlow implements a simplified ABAC (Attribute-Based Access Control) model with three user roles:

### 🛡️ Admin Role
- **View**: Can see all todos from all users (with creator names)
- **Create**: ❌ Cannot create todos
- **Update**: ❌ Cannot update todos
- **Delete**: ✅ Can delete any todo, regardless of status

### 👔 Manager Role
- **View**: Can see all todos from all users (with creator names)
- **Create**: ❌ Cannot create todos
- **Update**: ❌ Cannot update todos
- **Delete**: ❌ Cannot delete todos

### 👤 User Role (Default)
- **View**: Can only see their own todos
- **Create**: ✅ Can create todos
- **Update**: ✅ Can update their own todos
- **Delete**: ✅ Can only delete their own todos in draft state

## 🧪 Testing Different Roles

### Default Test Accounts

The system comes with pre-configured test accounts:

**🛡️ Admin Account**
- Email: `admin@todoflow.com`
- Password: Use any password when signing up

**👔 Manager Account**
- Email: `manager@todoflow.com`
- Password: Use any password when signing up

### How to Test

1. **Test as Admin:**
   - Sign up with `admin@todoflow.com`
   - Create some tasks as a regular user first
   - Login as admin and notice the trash icon on all tasks
   - Try deleting tasks in any status

2. **Test as Manager:**
   - Open an incognito window or different browser
   - Sign up with `manager@todoflow.com`
   - Notice you can see all tasks with creator names
   - Observe that edit/delete buttons are hidden

3. **Test as Regular User:**
   - Sign up with any other email (e.g., `user@example.com`)
   - Create and manage your own tasks
   - Notice you only see your own tasks

### 📧 Email Verification Note

**Email verification is disabled for development** since email service providers require paid plans. Users can sign up and login immediately without email confirmation. In production, you would enable email verification through services like Resend or SendGrid.

## 🏗️ Project Structure

```
todoflow/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── today/            # Today view
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── providers/        # Context providers
├── drizzle/              # Database migrations
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── auth/             # Authentication utilities
│   ├── db/               # Database configuration
│   └── queries/          # Database queries
└── public/               # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Sage Green (`#86A789`)
- **Secondary**: Dusty Rose (`#D2A5A5`)
- **Supporting Colors**: Mint Green, Warm Yellow

### Key Features
- Clean, modern interface
- Consistent spacing and typography
- Responsive design principles
- Accessible color contrasts

## 🔧 Database Management

### Useful Commands

```bash
# View database in Drizzle Studio
npx drizzle-kit studio

# Push schema changes
npx drizzle-kit push

# Generate migrations
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

### Reset Default Accounts
If you need to recreate the default admin and manager accounts:

```bash
node setup-accounts.js
```

## 🚀 Deployment

### Environment Variables for Production

```env
POSTGRES_URL="your-production-database-url"
BETTER_AUTH_SECRET="strong-production-secret"
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Optional: Email service (for verification)
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@your-domain.com"
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Issues**
- Ensure PostgreSQL is running
- Check your `POSTGRES_URL` in `.env`
- Verify database exists and credentials are correct

**Role Permissions Not Working**
- Check if default accounts were created: `node setup-accounts.js`
- Verify user roles in database using Drizzle Studio
- Clear browser cache and refresh

**Build Errors**
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run build`
- Ensure environment variables are properly set

---

Built with ❤️ using Next.js and modern web technologies.
