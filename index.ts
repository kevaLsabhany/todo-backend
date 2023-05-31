import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import {users} from "./users";
dotenv.config()
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {return res.status(200).json({ message:"hello world"})})

// login
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if(user.password !== password) {
	return res.status(401).json({ message: 'Invalid credentials' });
  }
    const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: "1h"});
    return res.json({ token, firstname:user.firstname, lastname:user.lastname});
  });

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ message: "Internal Server Error" });
});

app.listen(5000, () => console.log('listening on port 5000'))
