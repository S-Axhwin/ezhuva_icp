# Spotify3 - Decentralized Music Streaming

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Rust (Internet Computer Protocol - ICP)
- **Package Manager**: Bun / npm
- **Configuration & Build**: TypeScript, Vite, Cargo

## Project Structure

### Root Directory
- **`Cargo.toml` / `Cargo.lock`**: Rust package manager and dependency files.
- **`dfx.json`**: Configuration file for DFINITY canister setup.
- **`package.json`**: Contains dependencies and scripts for the frontend project.
- **`tsconfig.json`**: TypeScript configuration for the frontend.
- **`.gitignore`**: Specifies files to be ignored in version control.

### `spotify3_backend/`
This folder contains the backend logic written in Rust for ICP.
- **`src/`**: Contains Rust source code.
- **`Cargo.toml`**: Defines dependencies and settings for the Rust backend.
- **`spotify3_backend.did`**: Defines the backend's interface for interacting with frontend.

### `spotify3_frontend/`
This folder contains the frontend code built using React and Vite.
- **`public/`**: Static assets such as images, icons, and HTML files.
- **`src/`**: Contains React components, pages, and application logic.
- **`components.json`**: A JSON file related to frontend component organization.
- **`index.html`**: Entry point for the frontend application.
- **`vite.config.js`**: Configuration file for Vite.

### Other Files
- **`bun.lockb`**: Lock file for Bun package manager.
- **`canister_ids.json`**: Contains details about deployed canisters on the Internet Computer.
- **`OLDcanister_ids.json`**: Previous version of the `canister_ids.json` file.

This structure organizes the project into clear sections for backend, frontend, and configuration files, ensuring smooth development and deployment.

