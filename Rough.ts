// /College_API
// │
// ├── /src
// │   ├── /config
// │   │   └── dbConnect.ts
// │   │
// │   ├── /controllers
// │   │   └── principalController.ts
// │   │   └── hodController.ts
// │   │   └── professorController.ts
// │   │   └── studentController.ts
// │   │
// │   ├── /services
// │   │   └── principalService.ts
// │   │   └── hodService.ts
// │   │   └── professorService.ts
// │   │   └── studentService.ts
// │   │
// │   ├── /repository
// │   │   └── principalRepository.ts
// │   │   └── hodRepository.ts
// │   │   └── professorRepository.ts
// │   │   └── studentRepository.ts
// │   │
// │   ├── /routes
// │   │   └── index.ts
// │   │   └── principal.ts
// │   │   └── hod.ts
// │   │   └── professor.ts
// │   │   └── student.ts
// │   │
// │   ├── /models
// │   │   └── principalModel.ts
// │   │   └── hodModel.ts
// │   │   └── professorModel.ts
// │   │   └── studentModel.ts
// │   │
// │   ├── /sql
// │   │   ├── principalQueries.sql
// │   │   ├── hodQueries.sql
// │   │   ├── professorQueries.sql
// │   │   ├── studentQueries.sql
// │   │   ├── views
// │   │   │   ├── principalView.sql
// │   │   │   ├── hodView.sql
// │   │   │   ├── professorView.sql
// │   │   │   ├── studentView.sql
// │   │   ├── functions
// │   │   │   ├── principalFunctions.sql
// │   │   │   ├── hodFunctions.sql
// │   │   │   ├── professorFunctions.sql
// │   │   │   ├── studentFunctions.sql
// │   │   ├── procedures
// │   │       ├── principalProcedures.sql
// │   │       ├── hodProcedures.sql
// │   │       ├── professorProcedures.sql
// │   │       ├── studentProcedures.sql
// │   │
// │   ├── /utils
// │   │   └── helpers.ts
// │   │   └── constants.ts
// │   │
// │   ├── index.ts   (Main entry point)
// │
// ├── /dist  (Generated TypeScript compiled output)
// │   ├── (Generated .js files)
// │
// ├── tsconfig.json
// ├── server.ts  (Starts the server)
// ├── .env
// ├── package.json
// ├── package-lock.json
// ├── nodemon.json  (For hot-reloading with TypeScript)





/////////////////////////

// ├── src/
// │   ├── controllers/
// │   │   └── user.controller.ts
// │   ├── services/
// │   │   └── user.service.ts
// │   ├── repositories/
// │   │   └── user.repository.ts
// │   └── models/
// │       └── user.model.ts
// └── tests/
//     ├── unit/
//     │   ├── controllers/
//     │   │   └── user.controller.test.ts
//     │   ├── services/
//     │   │   └── user.service.test.ts
//     │   └── repositories/
//     │       └── user.repository.test.ts
//     ├── integration/
//     │   └── user.api.test.ts
//     └── setup.ts