import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['High', 'Moderate', 'Low'],
        required: true
    },
    checklist: [{
        name: { type: String, required: true },
        checked: { type: Boolean, default: false }
    }],
    dueDate: {
        type: Date,
        default: null
    },
    section: {
        type: String,
        enum: ['todo', 'backlog', 'inprogress', 'done'],
        required: true
    },
    refUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    assignTo: {
        type: String,  // Assuming this will be an email ID
        required: false  // Optional field
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

export default mongoose.model('Task', taskSchema);
