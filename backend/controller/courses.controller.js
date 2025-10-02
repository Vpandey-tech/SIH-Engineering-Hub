import { db, admin } from '../config/firebase.js';
import { google } from 'googleapis';


const COURSES = 'courses';
const LECTURES = 'lectures';
const USER_PROGRESS_ROOT = 'user_progress';

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


export async function createCourse(req, res) {
  try {
    const { title, description = '', lectures = [] } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (lectures.length === 0) return res.status(400).json({ message: 'At least one lecture is required' });

    const batch = db.batch();

    const courseRef = db.collection(COURSES).doc();
    batch.set(courseRef, {
      title,
      description,
      thumbnail: lectures[0].thumbnailUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    lectures.forEach((lecture, index) => {
      const lectureRef = db.collection(LECTURES).doc();
      batch.set(lectureRef, {
        courseId: courseRef.id,
        title: lecture.title,
        description: lecture.description,
        videoUrl: `https://www.youtube.com/watch?v=${lecture.videoId}`,
        
        // --- THIS IS THE FIX ---
        // Changed 'videoId' to 'youtubeId' to match your LecturePlayer.tsx component
        youtubeId: lecture.videoId, 
        
        thumbnailUrl: lecture.thumbnailUrl,
        order: index + 1,
        isPublished: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();

    return res.status(201).json({ message: 'Course and lectures created successfully', id: courseRef.id });

  } catch (err) {
    console.error('createCourse with lectures error', err);
    return res.status(500).json({ message: 'Failed to create course', error: err.message });
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

export async function enrollCourse(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { courseId } = req.params;
    const courseSnap = await db.collection(COURSES).doc(courseId).get();
    if (!courseSnap.exists) return res.status(404).json({ error: 'Course not found' });

    const lecturesSnap = await db.collection(LECTURES)
      .where('courseId', '==', courseId)
      .where('isPublished', '==', true)
      .get();

    if (lecturesSnap.empty) return res.status(400).json({ error: 'No lectures to enroll' });

    const batch = db.batch();
    lecturesSnap.docs.forEach(doc => {
      const lectureData = doc.data();
      const userLectureRef = db.collection(USER_PROGRESS_ROOT)
        .doc(user.uid)
        .collection('lectures')
        .doc(doc.id);

      batch.set(userLectureRef, {
        courseId,
        lectureTitle: lectureData.title,
        enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
        progressSeconds: 0,
        completed: false,
        lastSeenAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    await batch.commit();
    return res.json({ success: true, message: 'Successfully enrolled!' });
  } catch (err) {
    console.error('enrollCourse error', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function listUserProgress(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const lecturesSnap = await db.collection(USER_PROGRESS_ROOT)
      .doc(user.uid)
      .collection('lectures')
      .get();

    const lectures = lecturesSnap.docs.map(d => ({ lectureId: d.id, ...d.data() }));

    // Group by course
    const coursesMap = {};
    lectures.forEach(l => {
      if (!coursesMap[l.courseId]) coursesMap[l.courseId] = { courseId: l.courseId, lectures: [] };
      coursesMap[l.courseId].lectures.push(l);
    });

    // Add course titles
    const courseIds = Object.keys(coursesMap);
    for (const courseId of courseIds) {
      const courseSnap = await db.collection(COURSES).doc(courseId).get();
      coursesMap[courseId].courseTitle = courseSnap.exists ? courseSnap.data().title : 'Unknown Course';
    }

    return res.json({ courses: Object.values(coursesMap) });
  } catch (err) {
    console.error('listUserProgress error', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getEnrollments(req, res) {
  try {
    const coursesSnap = await db.collection(COURSES).get();
    const usersSnap = await db.collection('users').get();

    const enrollments = [];

    for (const courseDoc of coursesSnap.docs) {
      const courseId = courseDoc.id;
      const courseTitle = courseDoc.data()?.title || '';

      const students = [];

      for (const userDoc of usersSnap.docs) {
        const lecturesSnap = await db.collection(USER_PROGRESS_ROOT)
          .doc(userDoc.id)
          .collection('lectures')
          .where('courseId', '==', courseId)
          .get();

        if (!lecturesSnap.empty) {
          const lectures = lecturesSnap.docs.map(d => d.data());
          const totalProgress = Math.round(lectures.reduce((a,b)=>a+(b.progressSeconds||0),0)/60);

          students.push({
            uid: userDoc.id,
            name: userDoc.data()?.name || userDoc.data()?.displayName || '',
            email: userDoc.data()?.email || '',
            progress: totalProgress
          });
        }
      }

      enrollments.push({ courseId, courseTitle, students });
    }

    return res.json({ enrollments });
  } catch (err) {
    console.error('getEnrollments error', err);
    return res.status(500).json({ error: err.message });
  }
}


export async function searchYouTube(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });

    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      maxResults: 10, // We will fetch up to 10 results
      type: 'video',
    });

    const results = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
    }));

    return res.json({ results });

  } catch (err) {
    console.error('YouTube search error:', err.message);
    return res.status(500).json({ message: 'Failed to search YouTube', error: err.message });
  }
}