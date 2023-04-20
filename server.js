//pkg imports
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import 'express-async-errors';
import cors from "cors"
// API DOcumenATion
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
// security pkg
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from "express-mongo-sanitize";
// file import
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js"
import jobsRoutes from "./routes/jobsRoute.js";

// dotenv config
dotenv.config()
const app = express()

// mongodb connection
connectDB()

const PORT = process.env.PORT || 5000
const DEV_MODE = process.env.DEV_MODE

// Swagger api config
// swagger api options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal Application",
            description: "Node Expressjs Job Portal Application",
        },
        servers: [
            {
                //         url: "http://localhost:8080",
                url: "http://localhost:4000"
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);
// middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
// routes
app.use('/api/v1/test', testRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use("/api/v1/job", jobsRoutes);

// validation middleware
app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('<h1>the backend is live</h1>')
})

app.listen(PORT, () => {

    console.log(`server is running in ${DEV_MODE} on port ${PORT}`.rainbow)
})

