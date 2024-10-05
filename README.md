# StockMate - Inventory Management System

## Project Overview

**StockMate** is a web-based Inventory Management System designed to streamline inventory operations and task assignments. The system provides user authentication, inventory management with CRUD functionalities, sales tracking, and comprehensive reports. Users can easily search for inventory items, manage customer information, record sales, and generate reports for items, sales, and customer transactions. Data export options are provided, including printing, Excel, PDF, and email.

## Current Progress

### Day 01

- Created UI components for:
  - Login Page
  - Register Page
  - Inventory Page
  - Customers Page
  - Modals
- Started backend development using Express.js.
- Backend architecture follows MVC (Model-View-Controller).
- MongoDB is being used as the database for storing user and inventory data.

### Day 02

- Completed full CRUD operations for inventory items.
- Implemented search functionality for inventory items.
- Followed REST HTTP patterns for API design.
- Added JWT token-based authentication (access and refresh tokens).
  - Tokens are stored in cookies with `httpOnly` and `secure` flags for improved security.
