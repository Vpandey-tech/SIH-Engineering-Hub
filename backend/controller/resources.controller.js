import { resourcesData } from '../data/resourcesData.js';

export const getResources = (req, res) => {
  try {
    const { year, category, semester } = req.query;
    if (!year || !category) {
      return res.status(400).json({ message: 'Year and category are required' });
    }

    const normalizedYear = decodeURIComponent(String(year)).trim();
    const yearData = Object.keys(resourcesData).find(
      key => key.toLowerCase() === normalizedYear.toLowerCase()
    )
      ? resourcesData[normalizedYear]
      : null;

    if (!yearData)
      return res.status(404).json({ message: `No resources found for ${normalizedYear}` });

    if (category === 'Syllabus') {
      const syllabus = yearData.Syllabus || [];
      const filtered = semester
        ? syllabus.filter(s => {
            const semMatch = s.name.match(/Sem (\d+)/);
            return !semMatch || semester === `Sem${semMatch[1]}`;
          })
        : syllabus;
      return res.status(200).json({ pdfs: filtered });
    }

    if (category === 'Pyq' || category === 'MostImportant') {
      if (!semester)
        return res.status(400).json({ message: 'Semester is required for this category' });

      const key = category === 'Pyq' ? 'Pyq' : 'MostImportant';
      const url = yearData[key][String(semester)];
      if (!url) return res.status(404).json({ message: `No resource found` });
      return res.status(200).json({ url });
    }

    return res.status(400).json({ message: 'Invalid category' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch resources', error: e.message });
  }
};
