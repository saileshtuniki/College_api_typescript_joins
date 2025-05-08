-- 5.5 View for Student details
CREATE OR REPLACE VIEW studentView AS
SELECT id, name, professorId
FROM Student;
