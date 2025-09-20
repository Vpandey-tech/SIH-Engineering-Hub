import React from "react";

interface TeamMember {
  name: string;
  img: string;
  link?: string;
  role: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Vivek Pandey",
    img: "../images/vivek.avif",
    link: "https://vp5846113.wixstudio.com/portfolio",
    role: "Data Scientist Intern",
    description:
       " Machine learning specialist and full-stack engineer building intelligent solutions",
  },
  {
    name: "Omkar Chandra",
    img: "../images/Omkar.jpg",
    role: "Frontend Developer Intern",
    description:
      "Frontend specialist crafting exceptional user experiences and interface designs for our platform.",
  },
  {
    name: "Shreyansh Rai",
    img: "../images/Shreyansh1.jpg",
    role: "MERN Stack Developer Intern",
    description:
      "Full-stack engineer delivering end-to-end application development excellence",
  },
  {
    name: "Sagar Gupta",
    img: "../images/Sagar.jpg",
    role: "Software Tester",
    description:
      "Cybersecurity expert ensuring robust protection and security compliance across all platforms",
  },
  {
    name: "Zaeem Pathan",
    img: "/images/team4.jpg",
    role: "Data Scientist Intern",
    description:
      "Zaeem assists in analyzing large datasets, helping the team make informed decisions",
  },
  {
    name: "Taruna Gupta",
    img: "/images/team4.jpg",
    role: "Marketing & Presentation Expert",
    description:
      "Taruna crafts compelling presentations and develops marketing strategies",
  },
];

const OurAim: React.FC = () => {
  return (
    <section className="bg-[#f4f6fb] py-16 px-4 md:px-20">
      {/* Website Aim Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">
          Our Aim
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
          Our mission is to empower engineering students under Mumbai University
          by providing a centralized hub of resources like past year questions, 
          syllabi, and a personalized dashboard to enhance their learning experience. 
          We strive to bridge the gap between knowledge and application, 
          helping students excel in academics and practical projects.
        </p>
      </div>

      {/* Team Members Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-purple-700 mb-8">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              {member.link ? (
                <a href={member.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-40 h-40 object-cover rounded-full mx-auto shadow-lg mb-4 hover:scale-105 transition-transform"
                  />
                </a>
              ) : (
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-40 h-40 object-cover rounded-full mx-auto shadow-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-purple-700 mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-2">
                {member.role}
              </p>
              <p className="text-gray-700 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurAim;
