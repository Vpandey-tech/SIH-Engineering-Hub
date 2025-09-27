import { Router } from 'express';
import { getResources } from '../controller/resources.controller.js';

const ResourcesRouter = Router();
ResourcesRouter.get('/', getResources);

export default ResourcesRouter;
