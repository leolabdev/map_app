import express from "express";
import Joi from "joi";

const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Joi validation schema
const clientSchema = Joi.object({
    clientUsername: Joi.string().required(),
    name: Joi.string().optional(),
    addressId: Joi.number().integer().optional()
});

// Asynchronous validation middleware
const validateClient = asyncHandler(async (req, res, next) => {
    try {
        await clientSchema.validateAsync(req.body);
        next();
    } catch (error) {
        error.status = 400;  // Optional: Add a status code for the error
        throw error;  // This will be caught by Express and forwarded to the error handler
    }
});

// Asynchronous controller
const clientController = asyncHandler(async (req, res, next) => {
    try {
        // Process the request, e.g., database operations
        const result = { message: "Client successfully processed" };
        res.result = result;  // Store result for the response sender
        next();
    } catch (error) {
        error.status = 500;  // Set error status
        throw error;  // Forward error to the error handler
    }
});

// Response sender middleware
const responseSender = (req, res) => {
    res.json({
        errors: [],
        result: res.result || {}
    });
};

// Central error handling middleware
export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        errors: [err.message || 'An unknown error occurred'],
        result: {}
    });
};

const router = express.Router();
router.post('/', clientController, validateClient, responseSender);
export default router;