"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const studentQureis = {
    studentView: `select * from studentView`,
    fetchStudentByIdFunc: `select * from fetchStudentByIdFunc($1)`,
    addStudentProc: `call addStudentProc($1, $2)`,
    updateStudentProc: `call updateStudentProc($1, $2)`,
    deleteStudentProc: `call deleteStudentProc($1)`
};
exports.default = studentQureis;
