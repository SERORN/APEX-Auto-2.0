
# Apex Auto - E-Commerce Platform

## About This Project

Apex Auto is a modern, feature-rich e-commerce frontend for an auto parts store. This project was built with React and Tailwind CSS to be fast, responsive, and user-friendly. It serves as a comprehensive prototype and a solid foundation for building a full-stack commercial application.

## Key Features

- **Interactive Vehicle Selector:** Users can find parts compatible with their specific vehicle (Brand, Model, Year, Version).
- **Dynamic Product Search:** Search for products by name or SKU.
- **Real-time Inventory Simulation:** Products can be marked as "Out of Stock" and will be visually disabled.
- **Multi-language & Multi-currency:** Supports English/Spanish and USD/MXN with on-the-fly conversion.
- **Complete Shopping Flow:** Add to cart, view cart, and a simulated checkout process.
- **Guest Checkout:** Users can purchase without creating an account.
- **Responsive Design:** Looks great on desktop, tablets, and mobile devices.

---

## Getting Started (For Developers)

To run this project on your local machine, you don't need a complex setup.

1.  **Download the files:** Make sure you have all the project files in a single folder.
2.  **Start a local server:** The easiest way is to use `npx`. Open your terminal in the project folder and run:
    ```bash
    npx serve
    ```
3.  **Open in browser:** The terminal will give you a local URL (usually `http://localhost:3000`). Open this in your web browser.

---

## How to Manage Inventory

For this prototype, the product inventory is managed in a single file. This makes it easy for non-developers to update stock and product details.

**File to Edit:** `data/products.ts`

### Example: Adding a New Product

Copy an existing product block and change the details:

```javascript
{
  id: 9, // <-- Use a new, unique ID
  sku: 'FILTER-CABIN-01',
  name: 'Filtro de Cabina de Carbón Activado',
  description: 'Filtra el polvo y los alérgenos para un aire más limpio dentro del vehículo.',
  price: 350.00,
  imageUrl: 'https://picsum.photos/seed/FILTER-CABIN-01/400/400',
  brand: 'PureAir',
  stock: 75, // <-- Set the initial stock quantity
  compatibility: [
      { brand: 'Honda', model: 'Civic', years: [2021, 2022, 2023] },
  ],
},
```

### Example: Marking a Product "Out of Stock"

Find the product you want to update and set its `stock` to `0`:

```javascript
{
  id: 2,
  sku: 'AF-H2O',
  name: 'Filtro de Aire de Motor',
  // ...
  stock: 0, // <-- This product will now show as "Agotado" / "Out of Stock"
  // ...
},
```

---

## Next Steps: Backend Integration Plan

This frontend is ready to be connected to a real backend system (ERP, payment gateways, etc.). Here are the key integration points:

### 1. Real-time Inventory (ERP Integration)

-   **Current State:** Product data is statically loaded from `data/products.ts`.
-   **Action:** Replace the static import with an API call to your ERP or database.
-   **File to Modify:** `App.tsx`
-   **Location:** Inside the `AppContent` component, replace `useState<Product[]>(PRODUCTS_DATA)` with a `useEffect` hook that fetches products from your backend API.

    ```javascript
    // In App.tsx

    // BEFORE:
    // const [allProducts] = useState<Product[]>(PRODUCTS_DATA);

    // AFTER (Example):
    // const [allProducts, setAllProducts] = useState<Product[]>([]);
    // useEffect(() => {
    //   fetch('https://your-api.com/products')
    //     .then(res => res.json())
    //     .then(data => setAllProducts(data));
    // }, []);
    ```

### 2. Payment Processing (Bank Integration)

-   **Current State:** The checkout form simulates a payment.
-   **Action:** Integrate a payment provider like Stripe, PayPal, or a local equivalent.
-   **File to Modify:** `components/CheckoutView.tsx`
-   **Location:** Inside the `handleSubmit` function.

    ```javascript
    // In components/CheckoutView.tsx

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // --- INTEGRATION POINT ---
        // 1. Send formState and cart details to your backend.
        // 2. Your backend communicates with the payment provider (e.g., Stripe).
        // 3. On successful payment response from your backend:
        //      console.log('Payment successful!');
        //      dispatch({ type: 'CLEAR_CART' });
        //      onNavigate('confirmation');
        // 4. On failure:
        //      Show an error message to the user.
        // -------------------------

        // Current simulation code to be replaced:
        console.log('Simulating payment with data:', formState);
        dispatch({ type: 'CLEAR_CART' });
        onNavigate('confirmation');
    };
    ```

### 3. Invoicing and Accounting

-   **Current State:** A simulated "Download Invoice" button is shown on the confirmation page.
-   **Action:** This should be triggered by a successful payment on the backend. The backend can generate a PDF invoice and either email it to the user or provide a secure download link.
-   **File to Modify:** `components/ConfirmationView.tsx`
-   **Action:** The `onClick` handler for the download button should be updated to call your backend endpoint that provides the invoice.

---

## Sharing the Project (Deployment)

To share a live, clickable version of this website via WhatsApp or email, you need to host the files online.

**Recommended Services:** [Vercel](https://vercel.com), [Netlify](https://netlify.com), or [GitHub Pages](https://pages.github.com/).

These services offer free tiers for hosting static websites like this one. Once deployed, you will get a public URL (e.g., `https://apex-auto.vercel.app`) that you can share with anyone.
