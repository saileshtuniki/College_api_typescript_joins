
import pkg from 'pg';
import 'dotenv/config';

const {Pool} = pkg;

const pool = new Pool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
});

// Verify connection immediately
if(process.env.NODE_ENV !== "test"){
    pool.connect()
    .then(() => {
        console.log('Database connection successful!');
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err.message);
    });
}

export default pool;