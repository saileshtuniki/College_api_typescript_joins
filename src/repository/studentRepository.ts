
import pool from '../config/dbConnect';
import studentQueries from '../queries/studentSqlQueries';
import { Student, StudentResponse } from '../exportInterfaces/studentInterface';

export const insertStudent = async (name: string, parentId: number): Promise<Student|null> => {
    try {
        await pool.query(studentQueries.addStudentProc, [name, parentId]);

        // store proc inserts student,  so we can fetch the student by id
        // const insertedStudent = await fetchStudent(); // fetching student by id
        // return insertedStudent;

        const inseertedStudent = await pool.query(
            `select * from Student where name=$1 and professorId=$2 order by id DESC LIMIT 1`,
            [name, parentId]
        )
        if(inseertedStudent.rows.length === 0){
        throw new Error(`Professor insertion failed`);
        }
        // return  result.rows[0] as Hod;
        return  inseertedStudent.rows[0] as Student;
        // return result.rows[0];
    } catch (error) {
        console.error('Error inserting student:', (error as Error).message);
        throw new Error('Failed to insert student: ' + (error as Error).message);
    }
};

export const fetchStudent = async (): Promise<Student[]> => {
    try {
        const result = await pool.query(studentQueries.studentView);
        return result.rows;
    } catch (error) {
        console.error('Error fetching students:', (error as Error).message);
        throw new Error('Failed to fetch students');
    }
};

export const fetchStudentById = async (id: number): Promise<Student> => {
    try {
        const result = await pool.query(studentQueries.fetchStudentByIdFunc, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching student by ID:', (error as Error).message);
        throw new Error('Failed to fetch student by ID');
    }
};

export const updateStudent = async (id: number, name: string): Promise<StudentResponse> => {
    try {
        // const result = await pool.query(studentQueries.updateStudentProc, [id, name]);
        await pool.query(studentQueries.updateStudentProc, [id, name]);
        // if(result.rowCount === 0){
        //     return {message: `Student with id: ${id} not found`}
        // }

        const updatedStudentDetails = await pool.query(studentQueries.fetchStudentByIdFunc,[id]);
        console.log(updatedStudentDetails);
        
        return {
            success: true,
            message: `Updated student with id:${id} successfully`,
            data: updatedStudentDetails.rows[0] as Student
        }
        // return { message: 'Student updated successfully' };
    } catch (error) {
        console.error('Error updating student:', (error as Error).message);
        throw new Error('Failed to update student');
    }
};

export const deleteAllStudentById = async(id: number):Promise<boolean>=>{
    try {
        const checkResult = await pool.query(`select id from college_hierarchy_tree where id=$1`,[id]);
        if(checkResult.rowCount === 0){
            return false;
        }

        await pool.query(studentQueries.deleteStudentProc,[id]);
        return true;
    } catch (error) {
        throw new Error(`(Repository) Error in deleting Student by Id: ${(error as Error).message}`);
    }
}

// export const removeStudent = async (id: number): Promise<{ message: string }> => {
//     try {
//         await pool.query(studentQueries.deleteStudentProc, [id]);
//         return { message: `Student ID ${id} deleted successfully` };
//     } catch (error) {
//         console.error('Error deleting student:', (error as Error).message);
//         throw new Error('Failed to remove student');
//     }
// };
