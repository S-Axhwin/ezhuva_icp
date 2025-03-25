# Uptime Monitoring System

## Overview
This project is a **decentralized uptime monitoring system** built using **React** for the frontend and **Rust (using the Internet Computer Protocol - ICP)** for the backend. It allows users to monitor the availability of various services and receive alerts when downtime is detected.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Backend:** Rust, Internet Computer Protocol (ICP)
- **Blockchain:** Dfinity Canisters

## File Structure
```
/src
│── spotify3_backend/  # Backend logic (Rename as needed for uptime monitoring system)
│   ├── src/           # Source code for backend (Rust)
│   ├── Cargo.toml     # Rust dependencies and configurations
│   ├── spotify3_backend.did  # Interface definition file for canisters
│
│── spotify3_frontend/ # Frontend logic
│   ├── public/        # Static assets
│   ├── src/           # Source code for frontend (React)
│   ├── components.json # JSON config for UI components
│   ├── index.html     # Main HTML file
│   ├── package.json   # Dependencies and scripts for frontend
│   ├── tsconfig.json  # TypeScript configuration
│   ├── vite.config.js # Vite configuration
│
│── .gitignore        # Files to be ignored by Git
│── Cargo.lock        # Cargo lock file for Rust dependencies
│── Cargo.toml        # Rust project configuration
│── dfx.json          # Configuration for ICP canisters
│── canister_ids.json # Deployed canister IDs
│── OLDcanister_ids.json # Backup of older canister IDs
│── bun.lockb         # Lock file for Bun package manager
│── README.md         # Project documentation
```

## Running the Project
1. **Install DFX** from the official website: [DFX Installation Guide](https://internetcomputer.org/docs/building-apps/getting-started/install)
2. **Clone or Fork** the project: [GitHub Repository](https://github.com/S-Axhwin/ezhuva_icp)
3. Navigate to the project directory:
   ```sh
   cd ezhuva_icp
   ```
4. **Start the local blockchain server**:
   ```sh
   dfx start
   ```
5. **Deploy the canister to the local blockchain**:
   ```sh
   dfx deploy
   ```

This will launch the backend canisters and make the frontend available for use. 🚀
