

-- 5.1 Stored Procedure to add a Student (parent must be an existing Professor)
CREATE OR REPLACE PROCEDURE addStudentProc(studentName TEXT, parentId INT)
LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Professor WHERE id = parentId) THEN
        RAISE EXCEPTION 'Invalid parent ID. Student must be assigned under a Professor.';
    END IF;

    INSERT INTO Student(name, professorId)
    VALUES (studentName, parentId);
END;
$$;

-- 5.2 Stored Procedure to update a Student
CREATE OR REPLACE PROCEDURE updateStudentProc(studentId INT, studentName TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE Student
    SET name = studentName
    WHERE id = studentId;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Student with ID % not found, update failed', studentId;
    END IF;
END;
$$;

-- 5.3 Stored Procedure to delete a Student
CREATE OR REPLACE PROCEDURE deleteStudentProc(student_id INT)
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM Student WHERE id = student_id;
    RAISE NOTICE 'Student with ID % deleted successfully', student_id;
END;
$$;





-- Procedure to delete Student

-- CREATE OR REPLACE PROCEDURE deleteStudentProc(student_id INT)
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
-- 	DELETE FROM college_hierarchy_tree where id = student_id;

-- 	RAISE NOTICE 'student with ID % related records deleted successfully', student_id;
-- END;
-- $$;

