-- 4.1 Stored Procedure to add a Professor (parent must be an existing HOD)
CREATE OR REPLACE PROCEDURE addProfessorProc(professor_name TEXT, parentId_num INT)
LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Hod WHERE id = parentId_num) THEN
        RAISE EXCEPTION 'HOD with ID % does not exist.', parentId_num;
    END IF;

    INSERT INTO Professor(name, hodId)
    VALUES (professor_name, parentId_num);
END;
$$;

-- 4.2 Stored Procedure to update a Professor
CREATE OR REPLACE PROCEDURE updateProfessorProc(professorId INT, professorName TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE Professor
    SET name = professorName
    WHERE id = professorId;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Professor with ID % not found, update failed', professorId;
    END IF;
END;
$$;

-- 4.3 Stored Procedure to delete a Professor (Cascade deletes Students)
CREATE OR REPLACE PROCEDURE deleteProfessorProc(professor_id INT)
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM Professor WHERE id = professor_id;
    RAISE NOTICE 'Professor with ID % and related records deleted successfully', professor_id;
END;
$$;












-- Procedure to delete Professor

-- CREATE OR REPLACE PROCEDURE deleteProfessorProc(professor_id INT)
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
-- 	DELETE FROM college_hierarchy_tree where id = professor_id;

-- 	RAISE NOTICE 'professor with ID % and related records deleted successfully', professor_id;
-- END;
-- $$;

-- Procedure to delete Professor
-- CREATE OR REPLACE PROCEDURE deleteProfessorProc(professorId INT)
-- LANGUAGE plpgsql AS $$
-- BEGIN
--     -- Check if Professor exists
--     IF NOT EXISTS (SELECT 1 FROM college_hierarchy_tree WHERE id = professorId AND role = 'Professor') THEN
--         RAISE EXCEPTION 'Professor with ID % not found', professorId;
--     END IF;

--     -- Delete all Students under the Professor
--     DELETE FROM college_hierarchy_tree WHERE parentId = professorId;

--     -- Delete the Professor
--     DELETE FROM college_hierarchy_tree WHERE id = professorId;
-- END;
-- $$;