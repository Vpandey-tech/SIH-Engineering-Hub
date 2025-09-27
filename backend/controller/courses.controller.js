import { db, admin } from '../config/firebase.js';

const COURSES = 'courses';
const LECTURES = 'lectures';

export async function listCourses(req, res) {
  try {
    const snap = await db.collection(COURSES).orderBy('createdAt', 'desc').get();
    const courses = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json({ courses });
  } catch (err) {
    console.error('listCourses error', err);
    return res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
}

export async function createCourse(req, res) {
  try {
    const { title, description = '' } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const ref = db.collection(COURSES).doc();
    await ref.set({
      title,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({ message: 'Course created', id: ref.id });
  } catch (err) {
    console.error('createCourse error', err);
    return res.status(500).json({ message: 'Failed to create course', error: err.message });
  }
}

export async function getCourse(req, res) {
  try {
    const { id } = req.params;
    const courseSnap = await db.collection(COURSES).doc(id).get();
    if (!courseSnap.exists) return res.status(404).json({ message: 'Course not found' });

    const course = { id: courseSnap.id, ...courseSnap.data() };

    const lecturesSnap = await db.collection(LECTURES)
      .where('courseId', '==', id)
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'asc')
      .get();

    const lectures = lecturesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    course.lectures = lectures;

    return res.json({ course });
  } catch (err) {
    console.error('getCourse error', err);
    return res.status(500).json({ message: 'Failed to fetch course', error: err.message });
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await db.collection(COURSES).doc(id).update(updates);
    return res.json({ message: 'Course updated' });
  } catch (err) {
    console.error('updateCourse error', err);
    return res.status(500).json({ message: 'Failed to update course', error: err.message });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COURSES).doc(id).delete();
    return res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error('deleteCourse error', err);
    return res.status(500).json({ message: 'Failed to delete course', error: err.message });
  }
}
