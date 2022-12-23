import express from 'express';
import { addMembers, createWorkspace, getWorkspace } from '../controller/workspaceController.js';
const router = express.Router();

// router.use(isUser)
router.post('/create', createWorkspace)
router.get('/getData', getWorkspace)
router.patch('/addMember/:id', addMembers)



export default router
