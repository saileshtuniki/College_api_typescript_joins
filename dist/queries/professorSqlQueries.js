"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const professorQueries = {
    professorView: `select * from professorView`,
    fetchProfessorByIdFunc: `select * from fetchProfessorByIdFunc($1)`,
    addProfessorProc: `call addProfessorProc($1, $2)`,
    updateProfessorProc: `call updateProfessorProc($1, $2)`,
    deleteProfessorProc: `call deleteProfessorProc($1)`,
    fetchAllProfByIdFunc: `select * from fetchAllProfessorById($1)`
};
exports.default = professorQueries;
