import { db, admin } from '../config/firebase.js';

const LECTURES = 'lectures';
const USER_PROGRESS_ROOT = 'userProgress'; 
const lectureDocRef = (id) => db.collection(LECTURES).doc(id);

export async function createLecture(req, res) {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    let { title, description = "", youtubeId, courseId, tags = [], isPublished = true } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });
    if (!youtubeId) return res.status(400).json({ error: "youtubeId required" });

    if (!courseId || courseId === "undefined") courseId = null;

    const ref = db.collection(LECTURES).doc();
    const payload = {
      title,
      description,
      youtubeId,
      courseId,
      tags,
      createdBy: user.uid,
      isPublished,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 0,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    };

    await ref.set(payload);

    if (courseId) {
      await db.collection("courses").doc(courseId).set({
        lectures: admin.firestore.FieldValue.arrayUnion(ref.id),
      }, { merge: true });
    }

    return res.status(201).json({ id: ref.id, ...payload });
  } catch (err) {
    console.error("createLecture error", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function listLectures(req, res) {
  try {
    const { courseId, limit = 200 } = req.query;
    let q = db.collection(LECTURES).where('isPublished', '==', true).orderBy('createdAt', 'desc');

    if (courseId) {
      q = db.collection(LECTURES)
        .where('courseId', '==', courseId)
        .where('isPublished', '==', true)
        .orderBy('createdAt', 'desc');
    }

    const snap = await q.limit(Number(limit)).get();
    const lectures = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(lectures);
  } catch (err) {
    console.error("listLectures error", err);
    return res.status(500).json({ error: err.message });
  }
}


export async function getLecture(req, res) {
  try {
    const id = req.params.id;
    const snap = await lectureDocRef(id).get();
    if (!snap.exists) return res.status(404).json({ error: 'Lecture not found' });
    return res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error('getLecture error', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function updateLecture(req, res) {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") return res.status(403).json({ error: 'Forbidden' });

    const id = req.params.id;
    const updates = req.body;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await lectureDocRef(id).update(updates);
    const snap = await lectureDocRef(id).get();
    return res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error('updateLecture error', err);
    return res.status(500).json({ error: err.message });
  }
}


export async function deleteLecture(req, res) {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const id = req.params.id;
    await lectureDocRef(id).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteLecture error', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function incrementView(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Lecture ID missing" });

    const lectureSnap = await lectureDocRef(id).get();
    if (!lectureSnap.exists) return res.status(404).json({ error: "Lecture not found" });

    await lectureDocRef(id).update({
      views: admin.firestore.FieldValue.increment(1),
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("incrementView error", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function enrollLecture(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const lectureId = req.params.id;
    const lectureSnap = await lectureDocRef(lectureId).get();
    if (!lectureSnap.exists) return res.status(404).json({ error: 'Lecture not found' });

    const userLectureRef = db.collection(USER_PROGRESS_ROOT).doc(user.uid)
      .collection('lectures').doc(lectureId);

    await userLectureRef.set({
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
      progressSeconds: 0,
      completed: false,
      lastSeenAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.json({ success: true });
  } catch (err) {
    console.error('enrollLecture error', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function saveProgress(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const lectureId = req.params.id;
    const { progressSeconds = 0, completed = false } = req.body;

    const userLectureRef = db.collection(USER_PROGRESS_ROOT).doc(user.uid)
      .collection('lectures').doc(lectureId);

    const existingSnap = await userLectureRef.get();
    const existing = existingSnap.exists ? existingSnap.data() : {};
    const currentSeconds = Number(existing.progressSeconds || 0);
    const newSeconds = Math.max(currentSeconds, Number(progressSeconds || 0));
    const shouldComplete = completed || !!existing.completed;

    await userLectureRef.set({
      progressSeconds: newSeconds,
      completed: shouldComplete,
      lastSeenAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.json({ success: true });
  } catch (err) {
    console.error('saveProgress error', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getUserProgress(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const lectureId = req.params.id;
    const userLectureSnap = await db.collection(USER_PROGRESS_ROOT).doc(user.uid)
      .collection('lectures').doc(lectureId).get();

    if (!userLectureSnap.exists) return res.json({ progress: null });

    return res.json({ progress: userLectureSnap.data() });
  } catch (err) {
    console.error('getUserProgress error', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function listUserProgress(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const snap = await db.collection(USER_PROGRESS_ROOT).doc(user.uid).collection('lectures').get();
    const progress = snap.docs.map(d => ({ lectureId: d.id, ...d.data() }));
    return res.json({ progress });
  } catch (err) {
    console.error('listUserProgress error', err);
    return res.status(500).json({ error: err.message });
  }
}
