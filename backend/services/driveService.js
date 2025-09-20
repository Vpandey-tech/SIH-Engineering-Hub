import drive from '../config/googleDrive.js';

const getFolderUrl = async (year, category, semester) => {
  try {
    // Step 1: Find the year folder (e.g., "CSE (AI&ML&DS)") inside the top-level folder
    const yearResponse = await drive.files.list({
      q: `'${process.env.TOP_LEVEL_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    const yearFolder = yearResponse.data.files.find(file => file.name.toLowerCase() === year.toLowerCase());
    if (!yearFolder) throw new Error(`Year folder '${year}' not found`);
    console.log(`Found ${year} folder with ID: ${yearFolder.id}`); // Debug log

    // Step 2: Find the category folder (e.g., "Pyq" or "Syllabus") inside the year folder
    const categoryResponse = await drive.files.list({
      q: `'${yearFolder.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });
    console.log(`Folders in ${year}:`, categoryResponse.data.files.map(file => file.name)); // Debug log

    const categoryFolder = categoryResponse.data.files.find(file => file.name.toLowerCase() === category.toLowerCase());
    if (!categoryFolder) throw new Error(`Category folder '${category}' not found in ${year}`);
    console.log(`Found ${category} folder with ID: ${categoryFolder.id}`); // Debug log

    // Step 3: Handle "Syllabus" category (contains PDFs directly)
    if (category.toLowerCase() === 'syllabus') {
      const pdfResponse = await drive.files.list({
        q: `'${categoryFolder.id}' in parents and mimeType='application/pdf' and trashed=false`,
        fields: 'files(id, name, webViewLink)',
      });
      console.log(`PDFs in ${year} ${category}:`, pdfResponse.data.files.map(file => file.name)); // Debug log

      const pdfs = pdfResponse.data.files.map(file => ({
        name: file.name,
        url: file.webViewLink,
      }));

      if (pdfs.length === 0) throw new Error(`No PDFs found in ${year} ${category} folder`);
      return { folderId: categoryFolder.id, pdfs };
    }

    // Step 4: For "Pyq", find the semester folder (e.g., "Sem3")
    const semesterResponse = await drive.files.list({
      q: `'${categoryFolder.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, webViewLink)',
    });

    const semesterFolder = semesterResponse.data.files.find(file => file.name.toLowerCase() === semester.toLowerCase());
    if (!semesterFolder) throw new Error(`Semester folder '${semester}' not found in ${year} ${category}`);
    console.log(`Found ${semester} folder with ID: ${semesterFolder.id}`); // Debug log

    // Step 5: Return the semester folder URL
    const folderUrl = `https://drive.google.com/drive/folders/${semesterFolder.id}`;
    return { folderId: semesterFolder.id, url: folderUrl };
  } catch (error) {
    console.error("Detailed Error:", error.message); // Enhanced debug log
    throw new Error(`Failed to fetch folder for ${year}, ${category}, ${semester}: ${error.message}`);
  }
};

export default { getFolderUrl };