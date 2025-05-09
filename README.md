# College Hierarchy Tree API

A RESTful API built with Express, TypeScript, and PostgreSQL to manage a multi-level college hierarchy (Principal → HOD → Professor → Student). Includes full CRUD, soft-deletions, input validation, and Jest test coverage.

---

## Features

- **Hierarchical CRUD**: Create, read, update, delete (soft) for each level  
- **Tree-format GET**: Fetch a principal (or HOD/professor) and all descendants in a single call  
- **Soft Deletion**: `deletedDate` flags instead of hard delete  
- **Express-Validator**: Input sanitization & validation  
- **TypeScript**: Strong typing throughout  
- **Jest**: Unit + integration tests  
- **Structured Layers**: `config`, `controllers`, `routes`, `services`, `repositories`, `interfaces`

---

## Tech Stack

- **Node.js** & **Express**  
- **TypeScript**  
- **PostgreSQL**  
- **pg** (node-postgres)  
- **express-validator**  
- **Jest** & **Supertest**  

---

## Prerequisites

- Node.js v16+  
- npm or Yarn  
- PostgreSQL v12+  

---

## Getting Started

### Clone & Install

```bash

npm install
# or
yarn


npm run build       # compile TS to JS
npm start           # run compiled JS
# or for dev:
npm run dev         # ts-node + nodemon


npm run test


