import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

const __dirname = path.resolve();
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // allows us to accept JSON data in the req.body

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});
