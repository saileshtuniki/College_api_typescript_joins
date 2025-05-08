
-- 4.6 View for Professor details
CREATE OR REPLACE VIEW professorView AS
SELECT pr.id, pr.name, pr.hodId
FROM Professor pr;