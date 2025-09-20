// import express from 'express';
// import driveService from '../services/driveService.js';

// const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     const { year, category, semester } = req.query;
//     if (!year || !category || !semester) {
//       return res.status(400).json({ message: 'Missing required query parameters: year, category, and semester' });
//     }

//     console.log(`Fetching resources: year=${year}, category=${category}, semester=${semester}`); // Debug log
//     const result = await driveService.getFolderUrl(year, category, semester);
//     res.json(result);
//   } catch (error) {
//     console.error('Route error:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;