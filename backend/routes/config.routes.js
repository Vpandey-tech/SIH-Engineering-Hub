import { Router } from 'express';
import { getConfig } from '../controller/config.controller.js';

const ConfigRouter = Router();
ConfigRouter.get('/config', getConfig);

export default ConfigRouter;
