import Task from '../Models/task.models.js';
import moment from 'moment';

export const createTask = async (req, res) => {
    try {
        const { title, priority, checklist, dueDate, assignTo } = req.body;
        const userId = req.userId; // Assuming userId is extracted from the token in authMiddleware

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized access. Please provide valid authentication.",
                success: false
            });
        }

        if (!title || !priority || !checklist) {
            return res.status(400).json({
                message: "Please provide all required details.",
                success: false
            });
        }

        const taskData = {
            title,
            section: 'todo',
            priority,
            checklist,
            refUserId: userId ,
            assignTo 
        };

        if (dueDate) {
            taskData.dueDate = dueDate;
        }

        const newTask = new Task(taskData);
        const response = await newTask.save();

        res.status(200).json({ message: "Task added successfully!", response });

    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const getAllTasks = async (req, res) => {
    try {
        const { frequency } = req.query;
        const { userId } = req;

        let filter = { refUserId: userId };

        if (frequency) {
            filter.createdAt = {
                $gt: moment().subtract(frequency, 'd').toDate()
            };
        }

        const taskData = await Task.find(filter);

        if (!taskData || taskData.length === 0) {
            return res.status(404).json({ message: "No tasks found" });
        }

        res.status(200).json(taskData);

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        if (!taskId) {
            return res.status(400).json({
                message: "Task ID not provided.",
                success: false
            });
        }

        const taskDetails = await Task.findById(taskId);
        if (!taskDetails) {
            return res.status(404).json({
                message: "Task not found.",
                success: false
            });
        }

        res.status(200).json(taskDetails);

    } catch (error) {
        console.error("Error fetching task by ID:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const deleteTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Task deleted successfully.",
            deletedTask
        });

    } catch (error) {
        console.error("Error deleting task by ID:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { title, priority, checklist, dueDate, section, itemId, itemChecked, assignTo } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found.",
                success: false
            });
        }

        if (itemId && itemChecked !== undefined) {
            const checklistItem = task.checklist.find(item => item._id.toString() === itemId);
            if (checklistItem) {
                checklistItem.checked = itemChecked;
            }
        }

        if (section) {
            if (section === 'done') {
                task.section = section;
                task.checklist.forEach(item => {
                    item.checked = true;
                });
            } else {
                task.section = section;
            }
        }

        if (title) {
            task.title = title;
        }

        if (priority) {
            task.priority = priority;
        }

        if (checklist) {
            task.checklist = checklist;
        }

        if (dueDate) {
            task.dueDate = dueDate;
        }
        if (assignTo) {
            task.assignTo = assignTo;
        }

        await task.save();

        res.status(200).json({
            message: "Task updated successfully.",
            task
        });

    } catch (error) {
        console.error("Error updating task by ID:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


