# Next Store

Next Store is a demo storefront built for a Noroff front-end development assignment. It lets shoppers browse the Noroff product catalogue, search for products, manage a cart, and complete a simulated checkout.

[Live app on Vercel](https://mia-stubb-olsen-jsf-mar25ft.vercel.app/) · [GitHub repository](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft)

## Features

- Browse a responsive, paginated product catalogue with images, prices, discounts, and ratings. Product detail pages show descriptions, tags, and reviews.
- Search by product name or tag as you type. Open a matching product directly or choose **View all results** to see the full results page.
- Add products from their detail pages and get a toast confirmation. The header shows the cart item count, and both the mini-cart and full cart support quantity changes and item removal. The cart persists across reloads.
- Complete a demo checkout with customer details, standard or express shipping, an order summary, and a confirmation page. Completing checkout clears the cart. The flow simulates an order without processing payment.
- Use the contact form to validate a full name, subject, email address, and message. A successful submission confirms client-side validation only.

## Stack and API

- **App** · Next.js 16 App Router, React 19, and TypeScript
- **Styling** · Tailwind CSS 4 and React Icons
- **Quality checks** · ESLint, Vitest, React Testing Library, and jsdom

The [Noroff Online Shop API v2](https://v2.api.noroff.dev/online-shop) supplies the catalogue. [The product service](services/products.ts) fetches paginated listings from `/online-shop` and individual products from `/online-shop/{id}`. The live search loads the catalogue through the app's [`/api/products` route](app/api/products/route.ts). Product requests use the public API without credentials.

## Local setup

Install Node.js and npm. Node.js 24 is a suitable choice for this project.

```bash
git clone https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft.git
cd Mia_Stubb-olsen_jsf_mar25ft
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Product browsing and search require access to the Noroff API.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Serves the production build locally after it has been built. |
| `npm run lint` | Runs ESLint. |
| `npm test` | Runs the Vitest suite once. |
| `npm run check` | Runs TypeScript checking without emitting files, then linting, tests, and the production build. |

## Testing and quality checks

The Vitest suite covers title and tag filtering, contact form validation, cart quantity limits, browser storage, and price and discount calculations. React Testing Library tests cover shared cart behavior and mini-cart quantity controls, removal, and focus after removal.

Run `npm run check` for the full verification pipeline. The commands run in order and stop at the first failure.

## Accessibility and implementation

- A keyboard-visible skip link moves focus to the main content. The header search and mini-cart support Escape to close, and the mini-cart returns focus to its trigger when closed with Escape.
- The contact form associates labels and inline errors with their fields. Invalid submissions focus the first invalid field, and validation success is announced through a live status region.
- Shared cart state persists in browser `localStorage`. The cart and checkout use shared pricing logic that performs product subtotal and discount calculations in whole øre.
- The mini-cart keeps the header count visible on the full cart page, where quantity and removal controls are available directly.

## Deployment

The demo is hosted on Vercel. The production build uses `npm run build`. To preview that build locally, run `npm run build` followed by `npm run start`.
