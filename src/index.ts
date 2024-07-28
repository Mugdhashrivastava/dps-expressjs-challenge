import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import dbService from './../src/services/db.service';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Define a simple route for the root URL
app.get('/', (req: Request, res: Response) => {
	res.send('Hello, World!');
});

app.post('/create-project', (req: Request, res: Response) => {
	console.log(req.body);
	const { name, description } = req.body;

	try {
		const sql = `
      INSERT INTO projects (name, description)
      VALUES (:name, :description)
    `;
		dbService.run(sql, { name, description }); // Correctly accessing run method
		res.send({ message: 'Project created successfully!' });
	} catch (error) {
		console.error('Error creating project:', error);
		res.status(500).send({ error: 'Failed to create project' });
	}
});

// Get project details
app.get('/get-project-by-id', (req: Request, res: Response) => {
	console.log(req.query); // Using req.query for GET parameters

	// You can use req.query to get parameters like project ID or name
	const { id } = req.query;

	try {
		let sql = 'SELECT * FROM projects ';
		let params: { [key: string]: string | number } = {};

		if (id) {
			sql += `WHERE id =${id}`;
			params = { id: Number(id) };
		}
		console.log(sql);
		const projects = dbService.query(sql, params); // Using query to fetch data

		res.send({ data: projects });
	} catch (error) {
		console.error('Error fetching project:', error);
		res.status(500).send({ error: 'Failed to fetch project' });
	}
});

// Get project details
app.get('/get-project-by-name', (req: Request, res: Response) => {
	console.log(req.query); // Using req.query for GET parameters

	// You can use req.query to get parameters like project ID or name
	const { name } = req.query;

	try {
		let sql = 'SELECT * FROM projects ';
		const params: { [key: string]: string | number } = {};

		if (name) {
			sql += `WHERE name =${name}`;
		}

		const projects = dbService.query(sql, params); // Using query to fetch data

		res.send({ data: projects });
	} catch (error) {
		console.error('Error fetching project:', error);
		res.status(500).send({ error: 'Failed to fetch project' });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
