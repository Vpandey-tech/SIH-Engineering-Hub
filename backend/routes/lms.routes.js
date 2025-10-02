import { Router } from 'express';
import { verifyFirebaseToken, requireAdmin } from '../middlewares/verifyFirebaseToken.js';
import * as coursesCtrl from '../controller/courses.controller.js';
import * as lectureCtrl from '../controller/lecture.controller.js';
import lectureRouter from './lectures.routes.js';

const router = Router();

router.get('/courses', coursesCtrl.listCourses);
router.get('/courses/:id', coursesCtrl.getCourse);

router.post('/courses', verifyFirebaseToken, requireAdmin, coursesCtrl.createCourse);
router.put('/courses/:id', verifyFirebaseToken, requireAdmin, coursesCtrl.updateCourse);
router.delete('/courses/:id', verifyFirebaseToken, requireAdmin, coursesCtrl.deleteCourse);
router.get('/admin/enrollments', verifyFirebaseToken, requireAdmin, coursesCtrl.getEnrollments);
router.get('/youtube-search', verifyFirebaseToken, requireAdmin, coursesCtrl.searchYouTube);

router.post('/courses/:courseId/enroll', verifyFirebaseToken, coursesCtrl.enrollCourse);

router.use('/lectures', lectureRouter);

router.get('/users/me/progress', verifyFirebaseToken, lectureCtrl.listUserProgress);

export default router;
