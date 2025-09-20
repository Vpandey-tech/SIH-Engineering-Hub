import { Router } from 'express';
import { getResources } from '../controller/resources.controller.js';

const ResourcesRouter = Router();
ResourcesRouter.get('/folders', getResources);

export default ResourcesRouter;
