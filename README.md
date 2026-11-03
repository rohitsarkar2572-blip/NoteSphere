# NoteSphere - Student Notes Sharing Platform (Frontend)

NoteSphere is a modern, responsive, educational SaaS platform built for university students to share, search, and download peer-verified lecture notes, exam cheat sheets, and study materials.

---

## 🚀 Tech Stack

- **React 18** + **Vite**
- **JavaScript (ES Modules)**
- **Tailwind CSS** (White, Blue `#2563eb`, and Light-Slate SaaS theme)
- **React Router DOM v6**
- **Lucide React** (Modern clean icons)
- **Supabase JS SDK** (Configured for easy backend plug-in)

---

## 📁 Project Structure

```
NoteSphere/
├── .env.example                     # Environment template for Supabase credentials
├── index.html                       # HTML entry point with Inter font
├── package.json                     # Dependencies & scripts
├── tailwind.config.js               # SaaS theme design system & colors
├── vite.config.js                   # Vite config with optimized manual vendor chunking
└── src/
    ├── main.jsx                     # App entry point with BrowserRouter
    ├── App.jsx                      # Route definitions & global providers
    ├── index.css                    # Tailwind directives & base styles
    ├── services/                    # Clean Backend Integration Layer
    │   ├── supabase.js              # Supabase client instantiation & config checker
    │   ├── authService.js           # Student sign-up, sign-in, session, & profile logic
    │   ├── notesService.js          # Notes CRUD, filtering, pagination, & queries
    │   └── storageService.js        # Supabase Storage PDF upload & removal
    ├── context/
    │   ├── AuthContext.jsx          # Auth state provider with optional Dev UI preview
    │   └── NotesContext.jsx         # Global notes & filter state (isolated dev sample fallback)
    ├── data/
    │   └── sampleNotes.js           # Clearly isolated development preview samples
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx           # Responsive header with Supabase status pill
    │   │   ├── Footer.jsx           # Clean SaaS educational footer
    │   │   ├── Button.jsx           # Reusable button with variants & loading state
    │   │   ├── Input.jsx            # Form input with validation & icon support
    │   │   ├── Badge.jsx            # Tag & status badges
    │   │   ├── Modal.jsx            # Accessible dialog modal
    │   │   ├── Loader.jsx           # Spinners & card skeleton placeholders
    │   │   └── EmptyState.jsx       # Informative empty states
    │   ├── notes/
    │   │   ├── NoteCard.jsx         # Card with metadata, dev sample badge, & preview
    │   │   ├── NoteFilter.jsx       # Course, subject, semester, and sort filters
    │   │   ├── PdfPreviewModal.jsx  # Interactive PDF preview modal
    │   │   └── NoteUploadZone.jsx   # Drag-and-drop PDF zone with progress bar
    │   └── auth/
    │       └── ProtectedRoute.jsx   # Auth guard for student-only routes
    └── pages/
        ├── HomePage.jsx             # Hero, popular subjects, recent notes, workflow
        ├── ExplorePage.jsx          # Full repository, search, filters & pagination
        ├── LoginPage.jsx            # Student login with password toggle & validation
        ├── RegisterPage.jsx         # Full registration with course/semester validation
        ├── UploadPage.jsx           # Note publish form with PDF drag-drop & preview
        ├── DashboardPage.jsx        # Stats cards, recent uploads, & stream shortcuts
        ├── MyUploadsPage.jsx        # Note management with Edit, Delete & Preview
        ├── ProfilePage.jsx          # Student profile view and edit interface
        └── NotFoundPage.jsx         # 404 page
```

---

## 🏃 Getting Started (Run Locally)

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```
   The production-ready assets are bundled in the `/dist` directory.

---

## 🛠️ How to Connect Your Supabase Backend

As requested, the frontend integration is completely prepared and decoupled. To connect your Supabase backend:

### Step 1: Create a `.env` file
Duplicate `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your project credentials from your [Supabase Dashboard](https://supabase.com/dashboard) under **Project Settings > API**:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-public-key
```

### Step 2: Create the `notes` Storage Bucket
1. In your Supabase Dashboard, navigate to **Storage**.
2. Click **New Bucket**, name it `notes`.
3. Set it to **Public** (or configure signed URL policies if keeping private).
4. Add a policy allowing authenticated users to upload (`INSERT`) and public users to view (`SELECT`).

### Step 3: Create the `notes` Table in Supabase
In Supabase's **SQL Editor**, run the following schema:

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  course text not null,
  subject text not null,
  semester text not null,
  file_url text,
  file_path text,
  file_name text,
  file_size text,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  downloads_count integer default 0,
  views_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- Allow public read access to all notes
create policy "Notes are viewable by everyone" 
  on public.notes for select using (true);

-- Allow authenticated users to create notes
create policy "Users can upload notes" 
  on public.notes for insert 
  with check (auth.uid() = user_id);

-- Allow users to update their own notes
create policy "Users can update their own notes" 
  on public.notes for update 
  using (auth.uid() = user_id);

-- Allow users to delete their own notes
create policy "Users can delete their own notes" 
  on public.notes for delete 
  using (auth.uid() = user_id);
```

### Step 4: Restart Vite Dev Server
```bash
npm run dev
```

The application will automatically detect the valid credentials, switch from dev preview mode to live Supabase data, and enable real user registration, authentication, storage uploads, and database operations!
