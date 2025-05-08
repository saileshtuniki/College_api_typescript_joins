--new procedure for add hod current below one (working)
-- CREATE OR REPLACE PROCEDURE addHodProc(
--     IN hod_name TEXT,
--     IN parent_id INT,
--     OUT new_id INT,
--     OUT new_name TEXT,
--     OUT new_role TEXT,
--     OUT new_parentId INT
-- )
-- LANGUAGE plpgsql AS $$
-- BEGIN
--     -- Ensure the parent is a Principal
--     IF NOT EXISTS (SELECT 1 FROM college_hierarchy_tree WHERE id = parent_id AND role = 'Principal') THEN
--         RAISE EXCEPTION 'Invalid parent ID. HOD must be assigned under a Principal.';
--     END IF;

--     -- Insert the HOD and return the inserted row
--     INSERT INTO college_hierarchy_tree (name, role, parentId)
--     VALUES (hod_name, 'HOD', parent_id)
--     RETURNING id, name, role, parentId 
--     INTO new_id, new_name, new_role, new_parentId;
-- END;
-- $$;


-- 3.1 Stored Procedure to add a HOD (parent must be an existing Principal)

CREATE OR REPLACE PROCEDURE addHodProc(
    IN hod_name TEXT,
    IN parent_id INT
)
LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Principal WHERE id = parent_id) THEN
        RAISE EXCEPTION 'Invalid parent ID. HOD must be assigned under a Principal.';
    END IF;

    INSERT INTO Hod(name, principalId)
    VALUES (hod_name, parent_id);
END;
$$;


-- 3.2 Stored Procedure to update a HOD
CREATE OR REPLACE PROCEDURE updateHodProc(hodId INT, hodName TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE Hod
    SET name = hodName
    WHERE id = hodId;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'HOD with ID % not found, update failed', hodId;
    END IF;
END;
$$;



-- delete operation
-- DELETE operation of HOD and related child nodes.
-- CREATE OR REPLACE PROCEDURE deleteHodProc(hod_id INT)
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
-- 	-- Delete Hod (Cascade will delete related records)
-- 	DELETE FROM college_hierarchy_tree where id = hod_id;

-- 	--confirm deletion
-- 	RAISE NOTICE 'Hod with ID % and related records deleted successfully', hod_id;
-- END;
-- $$;