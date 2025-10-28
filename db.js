import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    user: 'sport_user',
    host: 'localhost',
    database: 'sport_team',
    password: '12345',
    port: 5432,
});
