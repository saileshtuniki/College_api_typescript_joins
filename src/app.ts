// import { JsonObject } from './../node_modules/@types/swagger-ui-express/index.d';
// import { QueryResult } from './../node_modules/@types/pg/index.d';
import express, {Application, Request, Response} from 'express';
import routes from './routes/index'; 
import {Pool} from 'pg';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import  swaggerDocument from './swagger/swagger.json';



dotenv.config();

// type QueryResult = {now: string};

const app: Application = express(); 
// const PORT : number = Number(process.env.PORT) || 8000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
})

app.use(express.json());

// Server Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

app.get('/testconnection', async(req: Request, res: Response)=>{
    try {
        const result = await pool.query<{now: string}>(`SELECT NOW()`);
        res.status(200).json({
            success: true,
            message: `Database connection successfully`,
            current_time: result.rows[0].now,
        })
    } catch (error) {
        console.error(`Database connection failed`,(error as Error).message);
        res.status(500).json({
            success: false,
            message: `Database connection failed`,
            error: (error as Error).message,
        });
        
    }
});

// app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));

export {app, pool};


// {
//     "compilerOptions": {
//       "resolveJsonModule": true,
//       "esModuleInterop": true,
//       "allowSyntheticDefaultImports": true,
//       "moduleResolution": "node"
//     }
//   }
  