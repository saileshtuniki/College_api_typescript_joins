-- 3.4 Function to fetch HOD by ID
CREATE OR REPLACE FUNCTION fetchHodByIdFunc(hod_id INT)
RETURNS TABLE(id INT, name TEXT, principalId INT) AS $$
BEGIN
    RETURN QUERY
    SELECT h.id, h.name, h.principalId FROM Hod h
    WHERE h.id = hod_id;
END;
$$ LANGUAGE plpgsql;




-- 3.5 Function to fetch HOD with its Professors and Students

CREATE OR REPLACE FUNCTION fetchAllByHodId(hodId_num INT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH professor_students AS (
        -- For each professor under the given HOD, aggregate their students
        SELECT 
            p.hodId,
            json_agg(
                json_build_object(
                    'professor_id', p.id,
                    'professor_name', p.name,
                    'students', COALESCE(
                        (
                            SELECT json_agg(
                                     json_build_object(
                                        'student_id', s.id,
                                        'student_name', s.name
                                     )
                                   )
                            FROM Student s 
                            WHERE s.professorId = p.id
                        ),
                        '[]'::json
                    )
                )
            ) AS professors
        FROM Professor p
        WHERE p.hodId = hodId_num
        GROUP BY p.hodId
    )
    -- Aggregate the HOD details with its professors (and their students)
    SELECT json_build_object(
            'hod_id', h.id,
            'hod_name', h.name,
            'professors', COALESCE(ps.professors, '[]'::json)
        )
    INTO result
    FROM Hod h
    LEFT JOIN professor_students ps 
           ON h.id = ps.hodId
    WHERE h.id = hodId_num;

    RETURN result;
END;
$$ LANGUAGE plpgsql;