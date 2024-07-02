import express from 'express';
import { createTask, getAllTasks, getTaskById, deleteTaskById, updateTaskById } from '../Controllers/task.controllers.js';
import authMiddleware from '../Middlewares/requireAuth.middlewares.js';

const router = express.Router();

router.post('/addtask', authMiddleware, createTask);
router.get('/getalltask', authMiddleware, getAllTasks);
router.get('/gettaskbyid/:taskId', getTaskById);
router.delete('/deletetask/:taskId', authMiddleware, deleteTaskById);
router.put('/updatetask/:taskId', authMiddleware, updateTaskById);

export default router;
