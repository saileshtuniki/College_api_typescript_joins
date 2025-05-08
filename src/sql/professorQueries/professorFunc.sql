

-- Function to fetch Professor by Id
-- 4.4 Function to fetch Professor by ID
CREATE OR REPLACE FUNCTION fetchProfessorByIdFunc(professorId INTEGER)
RETURNS TABLE(id INTEGER, name TEXT, hodId INTEGER) AS $$
BEGIN
    RETURN QUERY 
    SELECT pr.id, pr.name, pr.hodId 
	FROM Professor pr
    WHERE pr.id = professorId;
END;
$$ LANGUAGE plpgsql;


-- 4.5 Function to fetch Professor with its Students (Pending)
CREATE OR REPLACE FUNCTION fetchAllProfessorById(professorId_num INT)
RETURNS JSON AS $$
DECLARE
	result JSON;
BEGIN
    SELECT json_build_object(
		'professor_id',p.id,
		'professor_name',p.name,
		'students', COALESCE(
			(
				SELECT json_agg(
					json_build_object(
						'student_id',s.id,
						'student_name', s.name
					)
				)
				FROM Student s
				WHERE s.professorId = p.id
			),
			'[]'::json
		)
	)
	INTO result
	FROM Professor p
	WHERE p.id = professorId_num;

	RETURN result;
END;
$$ LANGUAGE plpgsql;