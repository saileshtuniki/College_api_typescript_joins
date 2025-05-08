-- 2.4 Function to fetch Principal by ID
CREATE OR REPLACE FUNCTION fetchPrincipalById(principal_id INT)
RETURNS TABLE(id INT, name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.name 
    FROM Principal p
    WHERE p.id = principal_id;
END;
$$ LANGUAGE plpgsql;


-- FUNCTION to fetchAllById():

CREATE OR REPLACE FUNCTION fetchAllById(principalId_num INT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH student_json AS (
        SELECT
            pr.hodId,
            json_agg(json_build_object('student_id', s.id, 'student_name', s.name)) AS students
        FROM Student s
        JOIN Professor pr ON s.professorId = pr.id
        GROUP BY pr.hodId
    ),
    professor_json AS (
        SELECT
            pr.hodId,
            json_agg(json_build_object(
                'professor_id', pr.id,
                'professor_name', pr.name,
                'students', COALESCE(s.students, '[]'::json)
            )) AS professors
        FROM Professor pr
        LEFT JOIN student_json s ON pr.id = s.hodId
        GROUP BY pr.hodId
    ),
    hod_json AS (
        SELECT
            h.principalId,
            json_agg(json_build_object(
                'hod_id', h.id,
                'hod_name', h.name,
                'professors', COALESCE(p.professors, '[]'::json)
            )) AS hods
        FROM HOD h
        LEFT JOIN professor_json p ON h.id = p.hodId
        GROUP BY h.principalId
    )
    SELECT json_build_object(
        'principal_id', p.id,
        'principal_name', p.name,
        'hods', COALESCE(h.hods, '[]'::json)
    ) INTO result
    FROM Principal p
    LEFT JOIN hod_json h ON p.id = h.principalId
    WHERE p.id = principalId_num;

    RETURN result;
END;
$$ LANGUAGE plpgsql;



-- The []::jsonb represents an empty JSON array cast to the jsonb data type. Here's the breakdown:

-- []: This is the literal representation of an empty array in JSON.

-- ::jsonb: This is a PostgreSQL cast operator that converts the preceding value to the jsonb data type.

-- jsonb: A specialized data type in PostgreSQL for storing JSON data in a binary format for efficient storage and retrieval.

-- In the context of the table, [null]::jsonb in the parentid column indicates that the corresponding person has no parent in the hierarchy represented by the table. 
-- It's important to remember that the jsonb format is designed to store JSON data, and in this case, an empty array is used to represent the absence of a parent.

