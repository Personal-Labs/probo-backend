"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res) => {
    console.error(error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status || 500,
        },
    });
});
exports.default = app;
