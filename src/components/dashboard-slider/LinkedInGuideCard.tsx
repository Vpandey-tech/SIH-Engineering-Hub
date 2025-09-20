
import React from "react";
import { Linkedin, Youtube, FileText } from "lucide-react";

const proTips = [
  "Professional, friendly profile photo (front-facing, good lighting, no group/fun pictures).",
  "Headline: Go beyond 'Student' — e.g. 'Aspiring Software Engineer | 2nd Yr CSE @ MU'.",
  "Write a concise 'About' summary: skills, interests, career goals (2–3 lines).",
  "Add *all* projects, internships & leadership roles; provide impact/results, links if available.",
  "Skills: List only those you're confident discussing; match tech terms to desired roles.",
  "Get endorsements from classmates, professors, colleagues, and add relevant certifications.",
  "Customize your LinkedIn URL (e.g. linkedin.com/in/yourname), add it to your resume.",
  "Network! Connect with alumni, peers, and recruiters. Join and engage in engineering groups.",
  "Share achievements and comment thoughtfully; active profiles attract recruiters.",
  "Proofread! Errors or unfinished sections reduce credibility (use Grammarly, ask mentors)."
];

const bestDocs = [
  {
    title: "LinkedIn — Official Guide for Students",
    url: "https://careers.linkedin.com/content/dam/me/careers/StudentCareers/about/LI-Students-Guide-To-LinkedIn.pdf",
    icon: <FileText className="inline w-4 h-4 ml-1 text-blue-800" />
  },
  {
    title: "LinkedIn Profile Checklist (PDF)",
    url: "https://careered.stanford.edu/sites/g/files/sbiybj22801/files/media/file/linkedin-profile-checklist.pdf",
    icon: <FileText className="inline w-4 h-4 ml-1 text-blue-800" />
  },
  {
    title: "LinkedIn Tips for Software Engineers ",
    url: "https://www.linkedin.com/pulse/software-engineers-guide-writing-stand-out-linkedin-profile-wang",
    icon: <FileText className="inline w-4 h-4 ml-1 text-purple-700" />
  },
];

const linkedinLinks = [
  {
    title: "Ultimate LinkedIn Profile for Engineers (BEST Guide)",
    url: "https://www.youtube.com/watch?v=HgPpTdi8vl0",
    icon: <Youtube className="inline w-4 h-4 ml-1 text-red-600" />
  },
  {
    title: "Create LinkedIn Profile for College Students",
    url: "https://www.pearsonaccelerated.com/blog/how-to-make-a-linkedin-profile-as-a-college-student.html",
    icon: <FileText className="inline w-4 h-4 ml-1 text-green-700" />
  },
  {
    title: "LinkedIn Profile Examples (SWE — Gaurav Sen)",
    url: "https://in.linkedin.com/in/gkcs",
    icon: <Linkedin className="inline w-4 h-4 ml-1 text-blue-700" />
  },
  {
    title: "LinkedIn Profile Tips & Makeover Playlist (2024, YouTube)",
    url: "https://www.youtube.com/playlist?list=PLo-kPya_Ww2zqOZVXMNQCJeTNAaan8GcW",
    icon: <Youtube className="inline w-4 h-4 ml-1 text-red-600" />
  },
];

const LinkedInGuideCard: React.FC = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Linkedin className="w-6 h-6 text-blue-700" />
      <h3 className="text-lg font-bold text-blue-900">LinkedIn Profile Guide</h3>
    </div>
    {/* Pro Tips */}
    <div className="mb-4">
      <div className="font-semibold text-blue-800 mb-1">Pro Tips for LinkedIn Success</div>
      <ul className="list-disc ml-6 text-sm text-blue-900 dark:text-blue-100 space-y-1">
        {proTips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
    {/* Best LinkedIn Documentation & Guides */}
    <div className="mb-4">
      <div className="font-semibold text-blue-800 mb-1">Best LinkedIn Guides & Docs</div>
      <ul className="list-disc ml-6 text-sm space-y-1">
        {bestDocs.map((doc, idx) => (
          <li key={idx}>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-medium hover:underline flex items-center"
            >
              {doc.title} {doc.icon}
            </a>
          </li>
        ))}
      </ul>
    </div>
    {/* Video & Profile Example Links */}
    <div>
      <div className="font-semibold mb-1">Watch / Read / See Examples</div>
      <ul className="space-y-2">
        {linkedinLinks.map((link, idx) => (
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

export default LinkedInGuideCard;

