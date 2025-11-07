# Project Overview

This is a web project built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS. It appears to be an e-commerce website for customizable t-shirts. The application uses `@react-three/fiber` and `@react-three/drei`, which suggests that it may include 3D models of the t-shirts.

The project is structured with a `src` directory containing the source code, a `public` directory for static assets, and a `components` directory for reusable UI components. The application uses `react-router-dom` for routing, and has pages for the index, product details, and a shopping cart.

# Building and Running

To get started with this project, you will need to have Node.js and npm installed.

1.  **Install dependencies:**

    ```sh
    npm install
    ```

2.  **Run the development server:**

    ```sh
    npm run dev
    ```

    This will start the development server at `http://localhost:8080`.

3.  **Build for production:**

    ```sh
    npm run build
    ```

    This will create a `dist` directory with the production-ready files.

4.  **Lint the code:**

    ```sh
    npm run lint
    ```

# Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling, with some additional custom styles in `src/App.css` and `src/index.css`.
*   **Components:** The project uses `shadcn-ui` for its UI components, which are located in `src/components/ui`.
*   **State Management:** The project uses React Context for managing the shopping cart state.
*   **Routing:** The project uses `react-router-dom` for routing.
*   **Linting:** The project uses ESLint for linting, with the configuration in `eslint.config.js`.
