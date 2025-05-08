-- 5.4 Function to fetch Student by ID
CREATE OR REPLACE FUNCTION fetchStudentByIdFunc(studentId INTEGER)
RETURNS TABLE(id INTEGER, name TEXT, professorId INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.name, s.professorId FROM Student s
    WHERE s.id = studentId;
END;
$$ LANGUAGE plpgsql;
