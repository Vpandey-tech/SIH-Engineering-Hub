import express from 'express';
import { verifyFirebaseToken, requireAdmin } from '../middlewares/verifyFirebaseToken.js';
import * as ctrl from '../controller/lecture.controller.js';

const router = express.Router();

router.get('/', ctrl.listLectures);                       
router.post('/:id/view', ctrl.incrementView);             

router.post('/:id/enroll', verifyFirebaseToken, ctrl.enrollLecture);
router.post('/:id/progress', verifyFirebaseToken, ctrl.saveProgress);
router.get('/:id/progress', verifyFirebaseToken, ctrl.getUserProgress);

router.get('/users/me/progress', verifyFirebaseToken, ctrl.listUserProgress);

router.post('/', verifyFirebaseToken, requireAdmin, ctrl.createLecture);
router.put('/:id', verifyFirebaseToken, requireAdmin, ctrl.updateLecture);
router.delete('/:id', verifyFirebaseToken, requireAdmin, ctrl.deleteLecture);

router.get('/:id', ctrl.getLecture);

export default router;
