# IMIS – Integrated Medical Information System (Frontend)

A React + TypeScript frontend application for managing a medical clinic. It provides role-based dashboards and CRUD interfaces for patients, doctors, appointments, invoices, and more.

## Tech Stack

- **React 18** with TypeScript
- **Vite** – build tool and dev server
- **Material UI (MUI v7)** – UI components, data grids, and charts
- **React Router v6** – client-side routing
- **Axios** – HTTP client for backend API communication
- **TinyMCE** – rich text editor for CMS content

## Features

- **Role-based access control** – separate views and permissions for Admin, Manager, Receptionist, Doctor, and Patient roles
- **Authentication** – login / register with JWT-based auth context
- **CMS Pages** – Home, About, Contact, and Services pages with rich text content editable by admins
- **Patient management** – add, edit, view profiles, and schedule appointments
- **Doctor management** – profiles, specializations, schedules, and appointment tracking
- **Appointments** – full lifecycle management including types and statuses
- **Invoices** – create, edit, manage items and buyer details, with payment methods and invoice statuses
- **Departments & Specializations** – administrative configuration
- **Price lists & Discounts** – billing configuration
- **Document Templates** – TinyMCE-powered template editor
- **Settings** – system-wide configuration
- **Light / Dark theme** – persistent theme switcher

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env_example` to `.env` and fill in the values:

```bash
cp .env_example .env
```

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `VITE_API_BASE_URL`   | Base URL of the backend REST API     |
| `VITE_TINYMCE_API_KEY`| API key for the TinyMCE editor       |

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/           # Axios API client functions
├── components/    # Reusable UI components (layout, forms, tables, routing)
├── config/        # App-wide configuration
├── constants/     # Shared constants
├── contexts/      # React contexts (Auth, Theme)
├── hooks/         # Custom React hooks
├── interfaces/    # TypeScript interfaces and types
├── pages/         # Route-level page components grouped by feature
├── routes/        # Route path definitions
└── utils/         # Utility functions
```

## User Roles

| Role          | Key Permissions                                                       |
|---------------|-----------------------------------------------------------------------|
| Admin         | Full access to all modules including users, roles, and system settings |
| Manager       | Appointments, doctors, patients, invoices, price lists, discounts     |
| Receptionist  | Appointments, patients, invoices                                      |
| Doctor        | Own appointments, own schedule, patient profiles                      |
| Patient       | Own appointments, own schedule, own profile                           |
