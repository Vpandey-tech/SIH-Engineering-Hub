// backend/routes/lms.routes.js
import { Router } from 'express';
import { verifyFirebaseToken, requireAdmin } from '../middlewares/verifyFirebaseToken.js';
import * as coursesCtrl from '../controller/courses.controller.js';
import * as lectureCtrl from '../controller/lecture.controller.js';

const router = Router();

// PUBLIC: Courses listing & course detail (includes lectures)
router.get('/courses', coursesCtrl.listCourses);
router.get('/courses/:id', coursesCtrl.getCourse);

// ADMIN: create / update / delete courses
router.post('/courses', verifyFirebaseToken, requireAdmin, coursesCtrl.createCourse);
router.put('/courses/:id', verifyFirebaseToken, requireAdmin, coursesCtrl.updateCourse);
router.delete('/courses/:id', verifyFirebaseToken, requireAdmin, coursesCtrl.deleteCourse);

// USER: Get logged-in user's progress for all lectures (protected)
router.get('/users/me/progress', verifyFirebaseToken, lectureCtrl.listUserProgress);

export default router;
