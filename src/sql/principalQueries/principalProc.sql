
-- addProcedure (working)


CREATE OR REPLACE PROCEDURE addPrincipalProc(principal_name TEXT)
LANGUAGE plpgsql AS $$
DECLARE
    inserted_id INT;
BEGIN
    IF EXISTS (SELECT 1 FROM Principal) THEN
        RAISE EXCEPTION 'A Principal already exists. Only one Principal is allowed.';
    END IF;

    INSERT INTO Principal(name)
    VALUES (principal_name)
    RETURNING id INTO inserted_id;
END;
$$;


--  Stored Procedure to update a Principal
CREATE OR REPLACE PROCEDURE updatePrincipalProc(principalId INT, principalName TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE Principal 
    SET name = principalName 
    WHERE id = principalId;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Principal with ID % not found, update failed', principalId;
    END IF;
END;
$$;

--delete (pending)
-- 2.3 Stored Procedure to delete a Principal (Cascade deletes HODs, Professors, Students)
-- CREATE OR REPLACE PROCEDURE deletePrincipalProc(p_principal_id INT)
-- LANGUAGE plpgsql AS $$
-- BEGIN
--     DELETE FROM Principal WHERE id = p_principal_id;
--     RAISE NOTICE 'Principal with ID % and related records deleted successfully', p_principal_id;
-- END;
-- $$;







--Delete from principal to student
-- working

-- CREATE OR REPLACE PROCEDURE deletePrincipalProc(p_principal_id INT)
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- Delete Principal (Cascade will delete related records)
--     DELETE FROM college_hierarchy_tree WHERE id = p_principal_id;
    
--     -- Confirm deletion
--     RAISE NOTICE 'Principal with ID % and related records deleted successfully', p_principal_id;
-- END;
-- $$;
