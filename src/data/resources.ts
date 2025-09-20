export interface Resource {
  name: string;
  url: string;
  description: string;
  branch: string;
  semester: string;
  isMostImportant?: boolean;
}

export const branches = ["All", "Computer Engineering", "IT", "Mechanical", "EXTC", "CSE (AI&ML&DS)"];
export const semesters = ["All", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export const syllabusPDFs: Resource[] = [
  {
    name: "CSE Syllabus 2024",
    url: "/pdfs/syllabus-cse-2024.pdf",
    description: "Full Mumbai University CSE syllabus PDF 2024.",
    branch: "Computer Engineering",
    semester: "All",
  },
  {
    name: "IT Syllabus 2024",
    url: "/pdfs/syllabus-it-2024.pdf",
    description: "Full Mumbai University IT syllabus PDF 2024.",
    branch: "IT",
    semester: "All",
  },
  {
    name: "CSE (AI&ML&DS) Syllabus 2024",
    url: "/pdfs/syllabus-cse-aiml-ds-2024.pdf", // Replace with actual URL or Google Drive link
    description: "Full Mumbai University CSE (AI&ML&DS) syllabus PDF 2024.",
    branch: "CSE (AI&ML&DS)",
    semester: "All",
  },
];

export const pyqPDFs: Resource[] = [
  {
    name: "PYQ May 2023 - Sem 4 CSE",
    url: "/pdfs/pyq-may2023.pdf",
    description: "Previous Year Question Paper (May 2023).",
    isMostImportant: true,
    branch: "Computer Engineering",
    semester: "Semester 4",
  },
  {
    name: "PYQ Dec 2022 - Sem 3 CSE",
    url: "/pdfs/pyq-dec2022.pdf",
    description: "Previous Year Question Paper (Dec 2022).",
    isMostImportant: false,
    branch: "Computer Engineering",
    semester: "Semester 3",
  },
  {
    name: "MOS/IMP Questions - Sem 4 CSE",
    url: "/pdfs/mos-important.pdf",
    description: "Handpicked Most Important PYQs for passing semester exams.",
    isMostImportant: true,
    branch: "Computer Engineering",
    semester: "Semester 4",
  },
  {
    name: "PYQ May 2023 - Sem 4 IT",
    url: "/pdfs/pyq-it-may2023.pdf",
    description: "Previous Year Question Paper for IT (May 2023).",
    isMostImportant: true,
    branch: "IT",
    semester: "Semester 4",
  },
  {
    name: "PYQ May 2023 - Sem 4 CSE (AI&ML&DS)",
    url: "/pdfs/pyq-cse-aiml-ds-may2023.pdf", // Replace with actual URL or Google Drive link
    description: "Previous Year Question Paper for CSE (AI&ML&DS) (May 2023).",
    isMostImportant: true,
    branch: "CSE (AI&ML&DS)",
    semester: "Semester 4",
  },
  {
    name: "PYQ Dec 2022 - Sem 3 CSE (AI&ML&DS)",
    url: "/pdfs/pyq-cse-aiml-ds-dec2022.pdf", // Replace with actual URL or Google Drive link
    description: "Previous Year Question Paper for CSE (AI&ML&DS) (Dec 2022).",
    isMostImportant: false,
    branch: "CSE (AI&ML&DS)",
    semester: "Semester 3",
  },
];

export const studyMaterialsPDFs: Resource[] = [
  {
    name: "Data Structures Notes - Sem 3 CSE",
    url: "/pdfs/ds-notes.pdf",
    description: "Comprehensive notes for Data Structures.",
    branch: "Computer Engineering",
    semester: "Semester 3",
  },
  {
    name: "Data Structures Notes - Sem 3 IT",
    url: "/pdfs/ds-notes-it.pdf",
    description: "Comprehensive notes for Data Structures for IT.",
    branch: "IT",
    semester: "Semester 3",
  },
  {
    name: "Machine Learning Notes - Sem 5 CSE (AI&ML&DS)",
    url: "/pdfs/ml-notes-cse-aiml-ds.pdf", // Replace with actual URL or Google Drive link
    description: "Comprehensive notes for Machine Learning.",
    branch: "CSE (AI&ML&DS)",
    semester: "Semester 5",
  },
];