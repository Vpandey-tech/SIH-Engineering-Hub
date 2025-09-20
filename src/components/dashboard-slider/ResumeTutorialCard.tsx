import React from "react";
import { FileText, Youtube, Linkedin } from "lucide-react";

const proTips = [
  "Use quantifiable achievements (e.g. 'Improved API response time by 40%')—numbers stand out.",
  "Show impact, not just tasks. What did you build/change/lead? Use bullet points.",
  "Tailor your resume with keywords/skills from the job description—many companies use ATS filtering.",
  "Highlight internships, major projects, hackathons, and open source contributions.",
  "Keep it to 1 page (unless senior, then max 2). Focus on recent, relevant work.",
  "Skip fancy graphics; use a clean, modern format (Google Docs, Overleaf or Novoresume template).",
  "Include working GitHub and LinkedIn profile links (short URLs).",
  "Mention only technologies/tools you can discuss in-depth in interviews.",
  "Add a short summary statement—2-3 lines stating your unique value and goals.",
  "Get feedback from mentors or professionals. Typos or vague wording = instant rejection.",
];

const bestDocs = [
  {
    title: "Stanford's Official Tech Resume Tips (PDF)",
    url: "https://careered.stanford.edu/sites/g/files/sbiybj22801/files/media/file/resume-and-cover-letter-examples.pdf",
  },
  {
    title: "Y Combinator: How to Write Your Resume",
    url: "https://www.linkedin.com/pulse/chapter-4-writing-great-resume-workatastartup?trk=public_post_reshare_feed-article-content",
  },
  {
    title: "Harvard CS50 Resume Advice",
    url: "https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/",
  },
  {
    title: "Indeed - How To Make a Resume (With Examples)",
    url: "https://in.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume-with-examples",
  },
];

const resumeLinks = [
  {
    title: "Top Resume Example for SWE (Video Guide, Google ex-Interviewer)",
    url: "https://www.youtube.com/watch?v=31EWjB_9Jig",
    icon: <Youtube className="inline w-4 h-4 ml-1 text-red-600" />
  },
  {
    title: "GitHub: Best Student Engineer Resume (Template + Advice)",
    url: "https://github.com/topics/resume-template",
    icon: <FileText className="inline w-4 h-4 ml-1 text-purple-800" />
  },
  {
    title: "Superb LinkedIn Examples for Engineers",
    url: "https://www.linkedin.com/in/gauravsen-dev/",
    icon: <Linkedin className="inline w-4 h-4 ml-1 text-blue-700" />
  },
  {
    title: "College Resume Templates for Engineering",
    url: "https://www.naukri.com/campus/career-guidance/resume-for-engineering-students-freshers",
    icon: <Youtube className="inline w-4 h-4 ml-1 text-red-600" />
  },
];

const ResumeTutorialCard: React.FC = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <FileText className="w-6 h-6 text-purple-700" />
      <h3 className="text-lg font-bold text-purple-800">Modern SWE Resume Pro Tips (2024)</h3>
    </div>
    {/* Pro Tips */}
    <div className="mb-4">
      <div className="font-semibold text-purple-800 mb-1">Pro Tips for Resume Success</div>
      <ul className="list-disc ml-6 text-sm text-purple-900 dark:text-purple-100 space-y-1">
        {proTips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
    {/* Best Documentation Guides */}
    <div className="mb-4">
      <div className="font-semibold text-purple-800 mb-1">Best Documentation & Guides</div>
      <ul className="list-disc ml-6 text-sm space-y-1">
        {bestDocs.map((doc, idx) => (
          <li key={idx}>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-medium hover:underline"
            >
              {doc.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
    {/* Video & LinkedIn Example Links */}
    <div>
      <div className="font-semibold mb-1">Watch / Read / See Examples</div>
      <ul className="space-y-2">
        {resumeLinks.map((link, idx) => (
          <li key={link.title}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-medium hover:underline flex items-center"
            >
              {link.title} {link.icon}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ResumeTutorialCard;
