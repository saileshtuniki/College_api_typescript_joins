

const hodQueries = {
    hodView: `select * from hodView;`,
    fetchHodByIdFunc:`select * from fetchHodByIdFunc($1)`,
    addHodProc:`CALL addHodProc($1, $2)`,
    // addHodProc:`call addHodProc($1,$2)`,
    // gethodbyname: `select * from gethodbyname` -> (SQL query PENDING ) name or ID lets deside later 
    updateHodProc:`call updateHodProc($1,$2)`,
    fetchAllHodByIdFunc: `select * from fetchAllByHodId($1)`,
    deleteHodProc:`call deleteHodProc($1)`
};

export default hodQueries;

