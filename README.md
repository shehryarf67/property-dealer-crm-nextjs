# Property Dealer CRM System

A full-stack Customer Relationship Management (CRM) system for property dealers, built using Next.js, MongoDB, Mongoose, Tailwind CSS, and authentication with role-based access control.

This project is developed for CS-4032 Web Programming Assignment 03.

---

## Project Overview

Property dealers receive leads from multiple sources such as Facebook Ads, walk-in clients, and website inquiries. Managing these leads manually is inefficient.

This CRM system provides a centralized platform to:
- Store and manage leads
- Assign leads to agents
- Track lead status and activity
- Prioritize leads using scoring logic
- Provide analytics and insights

---

## Features

### Authentication System
- User signup and login
- Password hashing using bcrypt
- JWT or NextAuth authentication
- Protected routes

### Role-Based Access Control
- Admin: Full system access
- Agent: Only assigned leads access
- Route protection based on roles

### Lead Management (CRUD)
- Create, read, update, delete leads
- Assign and reassign leads
- Admin sees all leads
- Agents see only assigned leads

### Lead Scoring System
- Budget > 20M: High Priority
- Budget 10M–20M: Medium Priority
- Budget < 10M: Low Priority
- Automatically assigned on backend

### Real-Time Updates
- New lead creation
- Lead assignment/reassignment
- Status and priority updates
- Implemented via Socket.io or polling

### WhatsApp Integration
Click-to-chat format:
https://wa.me/<countrycode><number>

### Email Notifications
Triggered on:
- New lead creation
- Lead assignment

### Lead Activity Timeline
Tracks:
- Lead creation
- Status updates
- Assignments
- Notes changes

### Smart Follow-Up System
- Set follow-up dates
- Detect overdue leads
- Detect inactive leads
- Highlight stale leads

### Analytics Dashboard
- Total leads
- Leads by status
- Leads by priority
- Agent performance
- Progress tracking

### Middleware
- Validation middleware
- Authentication middleware
- Rate limiting

Agent limit: 50 requests per minute  
Admin: Higher or no limit

---

## Tech Stack

- Next.js (App Router)
- React
- MongoDB
- Mongoose
- Tailwind CSS
- bcrypt
- JWT / NextAuth
- Socket.io (or polling)
- Nodemailer (or equivalent)

---

## Folder Structure

property-dealer-crm-nextjs/

app/  
├── api/  
├── admin/  
├── agent/  
├── login/  
├── signup/  
└── page.jsx  

components/  
├── dashboard/  
├── leads/  
├── auth/  
└── ui/  

lib/  
├── db.js  
├── auth.js  
├── validation.js  
└── rateLimiter.js  

models/  
├── User.js  
├── Lead.js  
└── ActivityLog.js  

middleware.js  
.env.example  
package.json  
README.md  

---

## Database Models

### User
- name
- email
- password
- role (admin or agent)
- createdAt

### Lead
- name
- email
- phone
- propertyInterest
- budget
- status
- notes
- assignedTo
- score
- followUpDate
- lastActivityAt
- createdAt

### ActivityLog
- leadId
- userId
- action
- description
- createdAt

---

## Installation

Clone the repository:
git clone https://github.com/your-username/property-dealer-crm-nextjs.git

Go into the project folder:
cd property-dealer-crm-nextjs

Install dependencies:
npm install

Create environment file:
cp .env.example .env.local

Add environment variables:

MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
NEXTAUTH_SECRET=your_nextauth_secret  
NEXTAUTH_URL=http://localhost:3000  

EMAIL_HOST=your_email_host  
EMAIL_PORT=your_email_port  
EMAIL_USER=your_email_user  
EMAIL_PASS=your_email_password  

Run the development server:
npm run dev

Open in browser:
http://localhost:3000

---

## Suggested Development Branches

feature/project-setup  
feature/authentication  
feature/rbac  
feature/lead-management  
feature/lead-scoring  
feature/lead-assignment  
feature/activity-timeline  
feature/follow-up-system  
feature/analytics-dashboard  
feature/whatsapp-email-integration  
feature/realtime-updates  
feature/middleware  
feature/final-polish  

---

## Deployment

Recommended:
- Vercel for frontend and backend
- MongoDB Atlas for database

---

## Author

Faisal Safdar  
CS-4032 Web Programming  
Assignment 03  
Property Dealer CRM System
