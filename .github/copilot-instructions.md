# Copilot Instructions for Garava-official

## Project Overview
This monorepo contains a client-side React app (`client/`) and a Node.js backend (`server/`). The architecture is modular, with clear separation of concerns between frontend features, shared utilities, and backend modules.

## Key Directories & Patterns
- `client/src/features/`: Domain-specific logic (e.g., `auth`, `cart`, `order`). Each feature typically contains its own slice, API integration, and related components.
- `client/src/shared/api/`: Centralized HTTP logic. See `http.js` for base URL and request setup.
- `client/src/components/`: Reusable UI components, organized by domain and function.
- `client/src/pages/`: Route-level components. Pages like `Checkout.jsx`, `Reviews.jsx` often orchestrate feature logic and UI.
- `server/src/`: Express backend, with modules for admin, config, cron jobs, middlewares, and templates.

## Developer Workflows
- **Frontend build:**
  - Use Vite (`client/vite.config.js`).
  - Install dependencies: `npm install` in `client/`.
  - Start dev server: `npm run dev` in `client/`.
- **Backend build:**
  - Install dependencies: `npm install` in `server/`.
  - Start server: `npm start` or `node src/app.js` in `server/`.
- **Styling:**
  - Tailwind CSS is configured via `client/tailwind.config.js` and `postcss.config.js`.
- **API Integration:**
  - Use dummy APIs in feature folders for development; replace with real endpoints as needed.
  - Shared base URL and HTTP logic in `client/src/shared/api/http.js`.

## Project-Specific Conventions
- New features should be added as folders under `client/src/features/`.
- For authentication, see `client/src/features/auth/` and `client/src/shared/auth/`.
- CRUD pages (e.g., reviews) should use fields as described in the README: `[username, description, stars]`.
- Use the shared `api` folder for HTTP utilities and base configuration.
- Organize reusable UI in `components/`, and domain-specific UI in feature folders.

## Pricing Architecture (Critical)
- **Backend Storage**: All prices stored in **paise** for precision (e.g., 1009 paise = ₹10.09)
- **API Responses**: All prices converted to **rupees** before sending to frontend  
- **Frontend**: Always receives and works with **rupees** (e.g., 10.09)
- **Conversion Functions**: Use `toPaise()` for storage, `toRupees()` for API responses
- **Consistency**: Cart and Order services both return prices in rupees to frontend
- **Key Files**: 
  - `server/src/modules/order/order.pricing.js` - Pricing utilities
  - `server/src/modules/cart/cart.service.js` - Cart price conversion
  - `server/src/modules/order/order.service.js` - Order price conversion

## Integration Points
- Frontend communicates with backend via REST APIs; endpoints are configured in shared HTTP utilities.
- External dependencies: React, Vite, Tailwind CSS, Express, Mongoose (backend).

## Examples
- To add a new feature (e.g., wishlist):
  1. Create `client/src/features/wishlist/` with `slice.js`, `api.js`, and related components.
  2. Register routes/pages in `client/src/pages/` as needed.
- To update API base URL, edit `client/src/shared/api/http.js`.

## References
- See `client/README.md` for additional developer notes and conventions.
- For backend integration, review `server/docs/` and `server/src/config/`.

---
For questions or unclear patterns, check the README files or ask for clarification.