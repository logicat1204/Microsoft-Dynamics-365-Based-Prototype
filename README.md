# SIS315-Prototipo Microsoft Dynamics 365

A web application clone based on Microsoft Dynamics 365 ERP modules.

## Project Structure

- ackend/ - Node.js/Express server with MongoDB
- rontend/ - React application with Vite

## Features

This prototype includes clones of the following Dynamics 365 ERP modules:

1. **Finance Dynamics 365** - General ledger, accounts payable/receivable, budgeting, cash flow, fixed assets, bank reconciliation, multi-currency support
2. **Supply Chain Management** - Warehouse management, inventory control, MRP, purchasing, quality control, asset maintenance, demand forecasting
3. **Commerce** - POS, product catalog, pricing/promotions, inventory synchronization, BOPIS, loyalty programs, payment gateway integration
4. **Project Operations** - Project planning with Gantt charts, resource allocation, timesheets, project budgeting, invoicing, contract management, profitability tracking
5. **Human Resources** - Employee records, compensation/benefits, time off/attendance, self-service portal, organizational structure, recruitment/onboarding, performance evaluations
6. **Business Central** - Advanced financial management, CRM, supply chain management, project/service management, manufacturing/production planning

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   `
   cd backend
   `

2. Install dependencies:
   `
   npm install
   `

3. Start the server:
   `
   npm start
   `

### Frontend

1. Navigate to the frontend directory:
   `
   cd frontend
   `

2. Install dependencies:
   `
   npm install
   `

3. Start the development server:
   `
   npm run dev
   `

## Deployment to Render

This application is configured for deployment on Render with the free tier:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to: 
pm install && cd frontend && npm install && npm run build
4. Set the start command to: cd backend && npm start
5. Add environment variables:
   - PORT: 5000 (or leave blank for default)
   - MONGODB_URI: Your MongoDB connection string

## Technology Stack

- **Backend**: Node.js, Express, MongoDB/Mongoose
- **Frontend**: React, React Router, Vite
- **Styling**: CSS
- **Database**: MongoDB (can be replaced with any compatible database)

## API Endpoints

The API follows REST conventions with the following base paths:
- /api/finance - Finance module endpoints
- /api/supplychain - Supply Chain Management endpoints
- /api/commerce - Commerce module endpoints
- /api/project - Project Operations endpoints
- /api/hr - Human Resources endpoints
- /api/businesscentral - Business Central endpoints

Each module has CRUD endpoints for its respective entities.

