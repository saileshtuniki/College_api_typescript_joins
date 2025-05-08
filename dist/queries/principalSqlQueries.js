"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const principalQueries = {
    // addPrincipalProc: `call addPrincipalProc($1)`,
    addPrincipalProc: `call addPrincipalProc($1)`,
    updatePrincipalProc: `call updatePrincipalProc($1, $2)`,
    principalView: `select * from principalView`,
    fetchPrincipalByIdQuery: `select * from fetchPrincipalById($1)`,
    fetchAllById: `select * from fetchAllById($1)`,
    deletePrincipalProc: `CALL deletePrincipalProc($1)`
};
exports.default = principalQueries;
