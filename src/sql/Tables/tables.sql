-- Principal table
CREATE TABLE Principal (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- HOD table (each HOD belongs to one Principal)
CREATE TABLE Hod (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    principalId INT NOT NULL,
    CONSTRAINT fk_principal
      FOREIGN KEY(principalId)
        REFERENCES Principal(id)
        ON DELETE CASCADE
);

-- Professor table (each Professor belongs to one HOD)
CREATE TABLE Professor (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    hodId INT NOT NULL,
    CONSTRAINT fk_hod
      FOREIGN KEY(hodId)
        REFERENCES Hod(id)
        ON DELETE CASCADE
);

-- Student table (each Student belongs to one Professor)
CREATE TABLE Student (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    professorId INT NOT NULL,
    CONSTRAINT fk_professor
      FOREIGN KEY(professorId)
        REFERENCES Professor(id)
        ON DELETE CASCADE
);

