# Inventory Hub

Build a complete, modern, professional and highly interactive Inventory Management System frontend for my existing Spring Boot REST API.

IMPORTANT:

This is an EXISTING backend project. DO NOT create a new backend.

DO NOT create a Supabase backend.

DO NOT create Firebase.

DO NOT create a new database.

DO NOT replace my Spring Boot backend.

DO NOT modify or invent backend APIs.

The frontend must communicate with my existing Spring Boot REST APIs using HTTP/REST.

TECH STACK:

- React

- Vite

- JavaScript or TypeScript

- Tailwind CSS

- Modern component architecture

- Lucide icons or another clean icon library

- Axios or fetch for REST API communication

- Responsive design for desktop, tablet and mobile

BACKEND:

Spring Boot REST API

Base URL:

http://localhost:8080

DATABASE:

MySQL

The backend uses:

- Spring Boot

- JdbcTemplate

- MySQL

- REST APIs

==================================================

APPLICATION NAME

==================================================

Inventory Management System

Create a professional SaaS-style inventory dashboard.

The application should look like a real production inventory management product, not a basic student CRUD application.

Design inspiration:

- Modern SaaS dashboard

- Clean enterprise UI

- Professional inventory software

- Minimal but visually impressive

- Excellent spacing and typography

- Rounded cards

- Subtle shadows

- Clean tables

- Smooth hover effects

- Interactive charts

- Responsive layout

- Dark/light mode support

Use a professional color palette with a primary blue/indigo accent and neutral backgrounds.

Avoid excessive gradients, excessive animations, childish colors, or overly decorative UI.

==================================================

MAIN LAYOUT

==================================================

Create:

1. Fixed/collapsible left sidebar

2. Top navigation bar

3. Main content area

4. Responsive mobile navigation

Sidebar:

- Dashboard

- Products

- Categories

- Suppliers

- Warehouses

- Inventory

- Purchases

- Sales

At the bottom:

- Settings

- User profile

Sidebar should have icons and labels.

Allow the sidebar to collapse into icon-only mode on desktop.

On mobile, use a slide-out navigation drawer.

Top navigation should contain:

- Search

- Notification icon

- Theme toggle

- User avatar/profile

- Current page title/breadcrumb

==================================================

DASHBOARD

==================================================

Create a visually impressive dashboard.

Dashboard header:

"Good morning 👋"

"Here's what's happening with your inventory today."

Display summary cards:

1. Total Products

2. Total Inventory Stock

3. Total Purchases

4. Total Sales

Each card should contain:

- Icon

- Current value

- Small comparison/trend indicator

- Short description

- Hover animation

Example:

Total Products

125

+12% this month

Inventory Stock

2,450

Units available

Purchases

₹4,85,000

This month

Sales

₹6,72,000

This month

IMPORTANT:

Do not invent statistics if they cannot be obtained from the backend.

Use available API data to calculate dashboard values.

Create charts:

1. Sales Overview

2. Purchase Overview

3. Inventory Distribution

4. Low Stock Products

Use a chart library such as Recharts.

Charts should be responsive and interactive with tooltips.

==================================================

PRODUCT MANAGEMENT

==================================================

Route:

/products

Create a professional product management page.

Header:

Products

"Manage your products and pricing."

Buttons:

+ Add Product

Search input:

"Search products..."

Filters:

- Category

- Supplier

- Status

Product table columns:

- ID

- Product Name

- SKU

- Barcode

- Purchase Price

- Selling Price

- Minimum Stock

- Category

- Supplier

- Status

- Actions

Actions:

- View

- Edit

- Delete

Use dropdown action menus instead of cluttering the table.

Add Product should open a beautiful modal or side drawer.

Form fields:

- Product Name

- SKU

- Barcode

- Purchase Price

- Selling Price

- Minimum Stock

- Category

- Supplier

- Status

Use proper validation.

Show validation messages below fields.

After successful creation:

- Show toast notification

- Close modal

- Refresh product list

Edit should use the same form.

Delete must show a confirmation dialog.

Never delete immediately without confirmation.

==================================================

CATEGORY MANAGEMENT

==================================================

Route:

/categories

Create category management UI.

Display:

- Category ID

- Category Name

- Description if available

- Actions

Features:

- Search

- Add Category

- Edit

- Delete

Use modal/side drawer forms.

==================================================

SUPPLIER MANAGEMENT

==================================================

Route:

/suppliers

Create supplier management UI.

Display supplier records in a professional table/card layout.

Features:

- Search supplier

- Add supplier

- Edit supplier

- Delete supplier

- View supplier details

Use clean forms and confirmation dialogs.

==================================================

WAREHOUSE MANAGEMENT

==================================================

Route:

/warehouses

Display:

- Warehouse ID

- Warehouse Name

- Location/details if available

- Actions

Features:

- Search

- Add Warehouse

- Edit

- Delete

If the backend does not provide a field, DO NOT invent it.

Only display fields actually returned by the API.

==================================================

INVENTORY

==================================================

Route:

/inventory

This is one of the most important screens.

Create a professional inventory dashboard.

Top summary cards:

- Total Stock

- Low Stock

- Out of Stock

- Number of Warehouses

Main table:

- Inventory ID

- Product

- Warehouse

- Quantity

- Last Updated

- Stock Status

- Actions

Stock status should be visually represented:

Healthy

Low Stock

Out of Stock

Determine status using the product's minimum_stock value where available.

Use badges:

Green = Healthy

Yellow/Orange = Low Stock

Red = Out of Stock

Create inventory details drawer/modal.

Display:

Product

Warehouse

Current Quantity

Minimum Stock

Stock Status

Last Updated

Add a visual stock level indicator/progress bar.

IMPORTANT:

Inventory is connected to Products and Warehouses.

Use actual backend data.

==================================================

PURCHASES

==================================================

Route:

/purchases

Create a professional purchase management page.

Header:

Purchases

"Track incoming stock and supplier purchases."

Table:

- Purchase ID

- Supplier

- Product

- Warehouse

- Quantity

- Purchase Price

- Purchase Date

- Actions

Features:

- Search

- Filter by supplier

- Filter by warehouse

- Date filtering if possible

- Add Purchase

- View

- Edit

- Delete

Purchase form:

Supplier

Product

Warehouse

Quantity

Purchase Price

Purchase Date

IMPORTANT BUSINESS RULE:

When a purchase is created, the backend automatically increases inventory.

The frontend should clearly communicate this to the user.

After successful purchase:

Show toast:

"Purchase recorded successfully. Inventory updated."

Do not manually modify inventory from the frontend.

The backend handles inventory updates.

==================================================

SALES

==================================================

Route:

/sales

Create a professional sales management page.

Header:

Sales

"Track outgoing stock and sales."

Table:

- Sale ID

- Product

- Warehouse

- Quantity

- Selling Price

- Sale Date

- Actions

Features:

- Search

- Filter

- Add Sale

- View

- Edit

- Delete

Sale form:

Product

Warehouse

Quantity

Selling Price

Sale Date

IMPORTANT BUSINESS RULE:

The backend validates inventory before creating a sale.

If there is insufficient stock, show a clear error message:

"Insufficient stock available."

Do not bypass backend validation.

When a sale is successfully created:

The backend deducts the quantity from inventory.

Show toast:

"Sale recorded successfully. Inventory updated."

==================================================

API INTEGRATION

==================================================

Create a centralized API service.

Base URL:

http://localhost:8080

Use these endpoints:

Categories:

GET /api/categories

POST /api/categories

GET /api/categories/{id}

PUT /api/categories/{id}

DELETE /api/categories/{id}

Suppliers:

GET /api/suppliers

POST /api/suppliers

GET /api/suppliers/{id}

PUT /api/suppliers/{id}

DELETE /api/suppliers/{id}

Warehouses:

GET /api/warehouses

POST /api/warehouses

GET /api/warehouses/{id}

PUT /api/warehouses/{id}

DELETE /api/warehouses/{id}

Products:

GET /api/products

POST /api/products

GET /api/products/{id}

PUT /api/products/{id}

DELETE /api/products/{id}

Inventory:

GET /api/inventory

POST /api/inventory

GET /api/inventory/{id}

PUT /api/inventory/{id}

DELETE /api/inventory/{id}

Purchases:

GET /api/purchases

POST /api/purchases

GET /api/purchases/{id}

PUT /api/purchases/{id}

DELETE /api/purchases/{id}

Sales:

GET /api/sales

POST /api/sales

GET /api/sales/{id}

PUT /api/sales/{id}

DELETE /api/sales/{id}

IMPORTANT:

Do not assume response fields that are not provided by the API.

If an API response differs from the assumed structure, adapt the frontend based on the actual response.

Centralize all API calls.

Do not scatter fetch/axios calls throughout components.

==================================================

ERROR HANDLING

==================================================

Implement proper error handling.

Handle:

400 Bad Request

404 Not Found

409 Conflict

500 Internal Server Error

Network errors

Backend unavailable

Display friendly messages.

Never show raw technical errors to normal users.

For example:

Instead of:

"DataIntegrityViolationException..."

show:

"Unable to save this record because it is referenced by another record."

For insufficient stock:

"Insufficient stock available for this product."

For backend unavailable:

"Unable to connect to the server. Please make sure the Spring Boot application is running."

==================================================

LOADING STATES

==================================================

Every API operation must have proper loading states.

Examples:

Loading table:

Skeleton rows

Submitting form:

Button:

"Saving..."

Deleting:

"Deleting..."

Refreshing:

"Refreshing..."

Never leave the UI frozen without feedback.

==================================================

EMPTY STATES

==================================================

Every table should have a professional empty state.

Example:

"No products found"

"Add your first product to get started."

Include an appropriate icon and action button.

==================================================

TOAST NOTIFICATIONS

==================================================

Use toast notifications for:

Create success

Update success

Delete success

Purchase success

Sale success

Inventory update success

API errors

Examples:

"Product created successfully"

"Product updated successfully"

"Product deleted successfully"

"Purchase recorded successfully"

"Sale recorded successfully"

==================================================

CONFIRMATION DIALOGS

==================================================

For destructive operations:

Delete Product

Delete Category

Delete Supplier

Delete Warehouse

Delete Inventory

Delete Purchase

Delete Sale

Always show:

"Are you sure?"

with:

Cancel

Delete

Do not delete immediately.

==================================================

SEARCH AND FILTERING

==================================================

Implement responsive search inputs.

Search should feel instant and smooth.

If filtering must be done on the backend, use API calls.

If the dataset is already loaded, client-side filtering is acceptable.

Do not make unnecessary API requests for every keystroke.

Use debounce where appropriate.

==================================================

TABLE DESIGN

==================================================

Tables should be modern and responsive.

Features:

- Sticky header where appropriate

- Hover rows

- Zebra rows only if visually useful

- Pagination if needed

- Responsive horizontal scrolling

- Proper column alignment

- Currency formatting

- Date formatting

- Status badges

- Action dropdown

For currency display:

Use Indian currency format:

₹50,000.00

For dates:

10 Aug 2026

==================================================

FORMS

==================================================

Forms should look professional.

Use:

- Labels

- Placeholder text

- Validation

- Required indicators

- Helpful error messages

- Proper input types

- Select dropdowns

- Number inputs

- Date picker

When selecting:

Product

Supplier

Warehouse

Category

load the actual options from the backend.

Do not make users manually type IDs when a dropdown can be used.

==================================================

RESPONSIVE DESIGN

==================================================

The entire application must work on:

Desktop

Laptop

Tablet

Mobile

Desktop:

Sidebar + large tables

Tablet:

Collapsible sidebar

Mobile:

Hamburger menu

Cards instead of overly wide tables where appropriate

Bottom/side action menus

==================================================

DARK MODE

==================================================

Implement a polished dark mode.

Persist the user's theme preference.

Both light and dark modes must have good contrast.

Do not simply invert colors.

==================================================

USER EXPERIENCE

==================================================

Add subtle animations:

- Page transitions

- Card hover

- Button hover

- Modal opening

- Sidebar transitions

- Toast animations

- Table loading skeletons

Keep animations subtle and professional.

Do not over-animate.

==================================================

COMPONENT ARCHITECTURE

==================================================

Use reusable components.

Suggested structure:

src/

  components/

    layout/

    sidebar/

    navbar/

    cards/

    tables/

    modals/

    forms/

    charts/

    badges/

    loading/

  pages/

    Dashboard/

    Products/

    Categories/

    Suppliers/

    Warehouses/

    Inventory/

    Purchases/

    Sales/

  services/

    api.js

    categoryService.js

    supplierService.js

    warehouseService.js

    productService.js

    inventoryService.js

    purchaseService.js

    salesService.js

  hooks/

  utils/

  types/

Avoid duplicating code.

Create reusable:

DataTable

ConfirmDialog

FormModal

SearchBar

StatusBadge

LoadingSkeleton

EmptyState

Toast

==================================================

DASHBOARD DATA

==================================================

Use real API data.

Do not hardcode:

Product count

Inventory quantity

Sales totals

Purchase totals

Fetch data from backend and calculate values where necessary.

If a dashboard metric cannot be calculated accurately from the available APIs, do not invent it.

Instead, show an appropriate available metric.

==================================================

IMPORTANT BACKEND RULES

==================================================

The existing backend is the source of truth.

Do not duplicate business logic in React.

For example:

Purchase:

Frontend sends purchase request.

Backend updates inventory.

Frontend refreshes inventory.

Sales:

Frontend sends sale request.

Backend checks stock.

Backend deducts stock.

Frontend refreshes inventory.

Inventory:

Frontend should not independently calculate stock after purchase/sale.

Always refresh data from backend after mutations.

==================================================

NO FAKE DATA

==================================================

Do NOT use fake products, fake sales, fake purchases or fake inventory data in the final application.

During initial UI development, mock data can temporarily be used only if absolutely necessary, but replace it with API data before considering the application complete.

==================================================

API CONFIGURATION

==================================================

Create an environment variable:

VITE_API_BASE_URL=http://localhost:8080

Use:

import.meta.env.VITE_API_BASE_URL

Do not hardcode the API URL throughout the application.

==================================================

CORS

==================================================

Assume the Spring Boot backend runs on:

http://localhost:8080

The React frontend will run on a Vite development port.

If CORS prevents API communication, clearly identify the required Spring Boot CORS configuration rather than creating a fake backend.

==================================================

FINAL QUALITY REQUIREMENTS

==================================================

The application must feel like a real professional inventory management SaaS product.

It should NOT look like:

- A basic college project

- Plain HTML forms

- Generic CRUD dashboard

- Unstyled Bootstrap template

- AI-generated prototype with fake data

It should look like something that could be demonstrated in a software developer interview.

Prioritize:

1. Professional visual design

2. Excellent UX

3. Real API integration

4. Responsive design

5. Reusable components

6. Error handling

7. Loading states

8. Proper business workflows

9. Clean code

10. Maintainability

==================================================

FINAL CHECKLIST

==================================================

Before considering the frontend complete, verify:

[ ] Dashboard loads

[ ] Products CRUD works

[ ] Categories CRUD works

[ ] Suppliers CRUD works

[ ] Warehouses CRUD works

[ ] Inventory CRUD works

[ ] Purchases CRUD works

[ ] Sales CRUD works

[ ] Purchase updates inventory

[ ] Sales decrease inventory

[ ] Sale stock validation works

[ ] Delete sale restores inventory

[ ] Search works

[ ] Filters work

[ ] Forms validate correctly

[ ] Delete confirmation works

[ ] Toast notifications work

[ ] Loading states work

[ ] Empty states work

[ ] Error states work

[ ] Dark mode works

[ ] Responsive mobile layout works

[ ] No fake data remains

[ ] No Supabase/Firebase backend

[ ] Existing Spring Boot backend remains untouched

[ ] API base URL uses environment configuration

[ ] No unnecessary dependencies

[ ] No console errors

[ ] Production build succeeds

IMPORTANT FINAL INSTRUCTION:

Build the frontend incrementally and verify each page.

Do not rewrite or replace the existing Spring Boot backend.

The final result should be a polished, interactive React frontend connected directly to my existing Spring Boot REST API.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://assetarc-shine.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe242543-073c-466e-96cc-82ec5841a4f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
