/**
 * Interface representing a single study resource with optional YouTube link.
 * @property {string} title - The title of the resource.
 * @property {string} url - The URL of the resource.
 * @property {string} [description] - Optional description of the resource.
 * @property {boolean} [isWorking] - Optional flag indicating if the link is working.
 * @property {string} [youtubeLink] - Optional YouTube link placeholder for video resources.
 */
export interface StudyResource {
  title: string;
  url: string;
  description?: string;
  isWorking?: boolean;
  youtubeLink?: string;
}

/**
 * Interface representing a set of study resources categorized by type.
 * @property {StudyResource[]} videos - Array of video resources.
 * @property {StudyResource[]} articles - Array of article resources.
 * @property {StudyResource[]} books - Array of book resources.
 * @property {string[]} [guidance] - Optional study guidance for the subject.
 */
export interface StudyResourceSet {
  videos: StudyResource[];
  articles: StudyResource[];
  books: StudyResource[];
  guidance?: string[];
}

// Verified YouTube resources with placeholders (unique keys)
export const youtubeResources: Record<string, StudyResource[]> = {
  // First Year Common Subjects
  "engineering mathematics-1": [{ title: "Engineering maths-1", url: "https://www.youtube.com/watch?v=1PVFyR1vKEs&list=PLPIwNooIb9vggJy5A46ciuWU8yrmCidkV" }],
  "engineering mathematics-2": [{ title: "Engineering maths-2", url: "https://www.youtube.com/watch?v=TH4Kd9mfIgI&list=PLT3bOBUU3L9iEPG5c4X5GPEHG1snemTEp" }],
  "engineering physics-1": [{ title: "First year physics-1", url: "https://www.youtube.com/watch?v=mDh7KWFBPXQ&list=PLnU_6InKwomFPUn1k5np6NtnoU38TW2PT" }],
  "engineering physics-2": [{ title: "First year physics-2", url: "https://www.youtube.com/watch?v=Wz43vL2oFwE&list=PLnU_6InKwomGNmvUunw-3G2FLNNQJJA8S" }],
  "engineering chemistry": [{ title: "FE chemistry", url: "https://www.youtube.com/watch?v=I_ALnsSg7ak&list=PLjgyGylma3IHGxlf7iP6JDi73GKfc4ekB" }],
  "basic electrical engineering": [{ title: "BEE", url: "https://www.youtube.com/watch?v=bSfzpZECbXI&list=PLT3bOBUU3L9iiGuBr2C05V7S1AnIFUnSE" }],
  "engineering mechanics": [{ title: "Engineering mechanics", url: "https://www.youtube.com/watch?v=Vb1aMHC1_BM&list=PLDN15nk5uLiAyM7MbRBF1eIFC8y5vMRxI" }],
  "engineering graphics": [{ title: "Engineering Graphics", url: "https://www.youtube.com/watch?v=gp3oKSEnEFM&list=PLDN15nk5uLiD3MEUiqsYPnZOHcVu7um6_" }],
  "basic electronics": [{ title: "Basic electronics", url: "https://www.youtube.com/watch?v=icrAf1us2IQ&list=PL3qvHcrYGy1uF5KAGntUITTJ85Dm3Dtdy" }],
  "workshop practice": [{ title: "", url: "" }],

  // Computer Engineering
  "data structures and algorithm": [{ title: "DSA ", url: "https://www.youtube.com/watch?v=AT14lCXuMKI&list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU" }],
  "computer organization": [{ title: "DLCA", url: "https://www.youtube.com/watch?v=L9X7XXfHYdU&list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX" }],
  "discrete mathematics": [{ title: "Discrete mathematics", url: "https://www.youtube.com/watch?v=iZ3g7JdSjbw&list=PLT3bOBUU3L9j_VG5CICyWK_a4M0-nwwxy" }],
  "digital logic design": [{ title: "Digital logic", url: "https://www.youtube.com/watch?v=O0gtKDu_cJc&list=PLxCzCOWd7aiGmXg4NoX6R31AsC5LeCPHe" }], // Consolidated
  "operating systems": [{ title: "OS", url: "https://www.youtube.com/watch?v=xw_OuOhjauw&list=PLmXKhU9FNesSFvj6gASuWmQd23Ul5omtD" }],
  "database management systems": [{ title: "DBMS", url: "https://www.youtube.com/watch?v=YRnjGeQbsHQ&list=PLmXKhU9FNesR1rSES7oLdJaNFgmuj0SYV" }],
  "computer networks": [{ title: "Computer networks", url: "https://www.youtube.com/watch?v=q3Z3Qa1UNBA" }],
  "software engineering": [{ title: "software engineering", url: "https://www.youtube.com/watch?v=NlLM3sVF8wY" }],
  "machine learning": [{ title: "machine learning", url: "https://www.youtube.com/watch?v=2oGsCHlfBUg" }],
  "cloud computing": [{ title: "cloud computing", url: "https://www.youtube.com/watch?v=HhStJ7FDBpc&list=PLYwpaL_SFmcCyQH0n9GHfwviu6KeJ46BV" }],
  "cryptography and system security": [{ title: "CSS", url: "https://www.youtube.com/watch?v=9X1rSWLFhLY&list=PL9FuOtXibFjV77w2eyil4Xzp8eooqsPp8" }],
  "project work": [{ title: "", url: "" }],

  // Information Technology
  "web programming": [{ title: "web computing/programming ", url: "https://www.youtube.com/watch?v=6mbwJ2xhgzM&list=PLu0W_9lII9agiCUZYRsvtGTXdxkzPyItg" }],
  "discrete structures": [{ title: "Discrete structure", url: "https://www.youtube.com/watch?v=r8G6dxvBDmg&list=PLT3bOBUU3L9i_pVVExjnghQn5AQygFZnh" }],
  "mobile computing": [{ title: "Mobile computing", url: "https://www.youtube.com/watch?v=GT-tYP8RGIs&list=PLV8vIYTIdSnZMKTQSTxWbx4NGNfxyZq_N" }],
  "system administration": [{ title: "", url: "" }],
  "cloud services": [{ title: "Cloud computing ", url: "https://www.youtube.com/watch?v=Dv0sjAYnVCY&list=PL9FuOtXibFjUE8MpVv6uiAWfj5E3dsBZR" }],
  "Artifical intelligence": [{ title: "AI", url: "https://www.youtube.com/watch?v=yiXAmkimZRQ" }],
  "enterprise resource planning": [{ title: "ERP", url: "https://www.youtube.com/watch?v=CGuPxCPTLNw&list=PL0s3O6GgLL5d039EMNDG0aO2AUVkbpne" }],

  // CSE
  "c programming": [{ title: "c programming", url: "https://www.youtube.com/watch?v=C5GCFEMcIGQ&list=PLqleLpAMfxGBn9v-K17ztBfNXHzPnX5sN" }],
  "algorithms": [{ title: "DSA", url: "https://www.youtube.com/watch?v=AT14lCXuMKI&list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU" }],
  "database systems": [{ title: "DBMS", url: "https://www.youtube.com/watch?v=YRnjGeQbsHQ&list=PLmXKhU9FNesR1rSES7oLdJaNFgmuj0SYV" }],
  "computer architecture": [{ title: "COA", url: "https://www.youtube.com/watch?v=DsK35f8wyUw&list=PLmXKhU9FNesS4B30OmgxP7nrzq1UhiMiv" }],
  "blockchain": [{ title: "BLOckchain", url: "https://www.youtube.com/watch?v=RZFjrI0oWyw&list=PLPIwNooIb9vgfXs-QkRYqqZbDXX-yLf59" }],
  "big data": [{ title: "BIg data analytics", url: "https://www.youtube.com/watch?v=I_ku0D4uQzQ&list=PLPIwNooIb9vi4f8tVkzLnr1tll6Pubbqh" }],
  "capstone project": [{ title: "", url: "" }],

  // EXTC
  "signals and systems": [{ title: "", url: "https://www.youtube.com/watch?v=EzO0wqgScSQ&list=PLufrisVwaCGtHlqlsYSEWuxB4_Q2UJ54W" }],
  "analog circuits": [{ title: "https://www.youtube.com/watch?v=b8-Q9ypooHA&list=PL3qvHcrYGy1uF5KAGntUITTJ85Dm3Dtdy", url: "" }],
  "network analysis": [{ title: "", url: "https://www.youtube.com/watch?v=wzG_4Cq7Uz4&list=PL0s3O6GgLL5dUA063r1FbOs-SQJ8KjrOK" }],
  // "digital logic design" already consolidated
  "digital communication": [{ title: "", url: "https://www.youtube.com/watch?v=Z0Ylnk8zXRo&list=PLgwJf8NK-2e5PngHbdEadEun5XPvnn00N" }],
  "control systems": [{ title: "", url: "https://www.youtube.com/watch?v=EtMRJkCqJN0&list=PLufrisVwaCGtHlqlsYSEWuxB4_Q2UJ54W" }],
  "microprocessor": [{ title: "", url: "https://www.youtube.com/watch?v=RP2sWt_oAWo&list=PLgwJf8NK-2e5vHwmowy_kGtjq9Ih0FzwN" }],
  "emi/emc": [{ title: "", url: "" }],
  "wireless communication": [{ title: "", url: "https://www.youtube.com/watch?v=qU49jUvxW00&list=PLm_MSClsnwm9u9UCi58RsSx9VnbvHh6OQ" }],
  "microwave engineering": [{ title: "", url: "https://www.youtube.com/watch?v=P9y-r4kRVao&list=PLm_MSClsnwm8-xZSNbH3Am_AAs1QSffdM" }],
  "iot systems": [{ title: "", url: "https://www.youtube.com/watch?v=ahZYZPFoHq4&list=PLPIwNooIb9viDc9TZ4Kx206NDMmquLlGc" }],

  // Mechanical
  "thermodynamics": [{ title: "", url: "https://www.youtube.com/watch?v=gG9mzVV9FYA&list=PL9RcWoqXmzaK6AHCCyL_J6gqc02RN-w-D" }],
  "strength of materials": [{ title: "", url: "https://www.youtube.com/watch?v=geqRGNIZGq8&list=PL9RcWoqXmzaLlfmNg2Ku1SdZtvXnYrLbc" }],
  "material science": [{ title: "", url: "https://www.youtube.com/watch?v=qTarpUR-Wy4&list=PLbjTnj-t5Gkk0XBg7Kr9oklxrXIzTKHoA" }],
  "fluid mechanics": [{ title: "", url: "https://www.youtube.com/watch?v=iTanaNwMDKo&list=PL9RcWoqXmzaLnlGN39w2-1jyFyI_ALVa3" }],
  "machine design": [{ title: "", url: "https://www.youtube.com/watch?v=Iwx9_LLpqXw&list=PLm_MSClsnwm8K7HRzHYPd_ljW_vHFzxlF" }],
  "heat transfer": [{ title: "", url: "https://www.youtube.com/watch?v=qa-PQOjS3zA&list=PL5F4F46C1983C6785" }],
  "manufacturing technology": [{ title: "", url: "https://www.youtube.com/watch?v=YJ-Qe6tbpmw&list=PLg9TnucUbzBXOYwQb8piU7JLa6_CxDSAD" }],
  "theory of machines": [{ title: "", url: "https://www.youtube.com/watch?v=aqcFHk0jgMA&list=PL9RcWoqXmzaKlY_V5x74DJjogb_ZwiVpv" }],
  "robotics": [{ title: "", url: "" }],
  "automobile engineering": [{ title: "", url: "" }],
  "refrigeration & ac": [{ title: "", url: "https://www.youtube.com/watch?v=nlsNmhiID74&list=PLJjrv2_3aFXdh1PQVeO1RRl_NmXiiPZh0" }]
};

// Verified article resources with placeholders (unique keys)
export const articleResources: Record<string, StudyResource[]> = {
  // First Year Common Subjects
  "engineering mathematics-1": [{ title: "Math I - GeeksforGeeks", url: "https://www.geeksforgeeks.org/engineering-mathematics/", description: "Calculus basics", isWorking: true }],
  "engineering mathematics-2": [{ title: "Math II - GeeksforGeeks", url: "https://www.geeksforgeeks.org/engineering-mathematics/", description: "Advanced calculus", isWorking: true }],
  "engineering physics-1": [{ title: "Physics I - Physics Classroom", url: "https://www.physicsclassroom.com/", description: "Mechanics basics", isWorking: true }],
  "engineering physics-2": [{ title: "Physics II - Physics Classroom", url: "https://www.physicsclassroom.com/", description: "Electromagnetism", isWorking: true }],
  "engineering chemistry": [{ title: "Chemistry - Khan Academy", url: "https://www.khanacademy.org/science/chemistry", description: "Chemical principles", isWorking: true }],
  "basic electrical engineering": [{ title: "Electrical - All About Circuits", url: "https://www.allaboutcircuits.com/textbook/", description: "Electrical basics", isWorking: true }],
  "engineering mechanics": [{ title: "Mechanics - Engineering Toolbox", url: "https://www.engineeringtoolbox.com/stress-strain-d_950.html", description: "Mechanics fundamentals", isWorking: true }],
  "engineering graphics": [{ title: "Graphics - MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/", description: "Technical drawing", isWorking: true }],
  "basic electronics": [{ title: "Electronics - Electronics-Tutorials", url: "https://www.electronics-tutorials.ws/", description: "Electronics basics", isWorking: true }],
  "workshop practice": [{ title: "Workshop - MECHOVIS", url: "https://mechovision.com/manufacturing-processes/", description: "Workshop techniques", isWorking: true }],

  // Computer Engineering
  "data structures and algorithm": [{ title: "Data Structures - GeeksforGeeks", url: "https://www.geeksforgeeks.org/data-structures/", description: "DS guide", isWorking: true }],
  "computer organization": [{ title: "Comp Org - GeeksforGeeks", url: "https://www.geeksforgeeks.org/computer-organization-and-architecture/", description: "Architecture basics", isWorking: true }],
  "discrete mathematics": [{ title: "Discrete Math - GeeksforGeeks", url: "https://www.geeksforgeeks.org/discrete-mathematics/", description: "Math fundamentals", isWorking: true }],
  "digital logic design": [{ title: "Digital Logic - Electronics-Tutorials", url: "https://www.electronics-tutorials.ws/digital/", description: "Logic circuits (Comp Eng)", isWorking: true }], // Consolidated
  "operating systems": [{ title: "OS - Tutorialspoint", url: "https://www.tutorialspoint.com/operating_system/", description: "OS concepts", isWorking: true }],
  "database management systems": [{ title: "DBMS - W3Schools", url: "https://www.w3schools.com/sql/", description: "Database systems", isWorking: true }],
  "computer networks": [{ title: "Networks - GeeksforGeeks", url: "https://www.geeksforgeeks.org/computer-network-tutorials/", description: "Networking basics", isWorking: true }],
  "software engineering": [{ title: "Soft Eng - Tutorialspoint", url: "https://www.tutorialspoint.com/software_engineering/", description: "Software development", isWorking: true }],
  "machine learning": [{ title: "ML - GeeksforGeeks", url: "https://www.geeksforgeeks.org/machine-learning/", description: "ML concepts", isWorking: true }],
  "cloud computing": [{ title: "Cloud - GeeksforGeeks", url: "https://www.geeksforgeeks.org/cloud-computing/", description: "Cloud basics", isWorking: true }],
  "cryptography and system security": [{ title: "Cyber Sec - GeeksforGeeks", url: "https://www.geeksforgeeks.org/information-security-and-cyber-laws/", description: "Security fundamentals", isWorking: true }],
  "project work": [{ title: "Projects - GeeksforGeeks", url: "https://www.geeksforgeeks.org/projects/", description: "Project ideas", isWorking: true }],

  // Information Technology
  "web programming": [{ title: "Web Tech - W3Schools", url: "https://www.w3schools.com/html/", description: "Web development", isWorking: true }],
  "discrete structures": [{ title: "Discrete Struct - GeeksforGeeks", url: "https://www.geeksforgeeks.org/discrete-mathematics/", description: "Math fundamentals", isWorking: true }],
  "mobile computing": [{ title: "Mobile Comp - GeeksforGeeks", url: "https://www.geeksforgeeks.org/mobile-computing/", description: "Mobile tech", isWorking: true }],
  "system administration": [{ title: "Sys Admin - Tutorialspoint", url: "https://www.tutorialspoint.com/system-administration/", description: "Admin basics", isWorking: true }],
  "cloud services": [{ title: "Cloud Serv - GeeksforGeeks", url: "https://www.geeksforgeeks.org/cloud-computing/", description: "Cloud services", isWorking: true }],
  "Artifical intelligence": [{ title: "AI/ML - GeeksforGeeks", url: "https://www.geeksforgeeks.org/machine-learning/", description: "AI/ML basics", isWorking: true }],
  "enterprise resource planning": [{ title: "ERP - GeeksforGeeks", url: "https://www.geeksforgeeks.org/enterprise-resource-planning-erp/", description: "ERP concepts", isWorking: true }],

  // CSE
  "c programming": [{ title: "C Prog - Tutorialspoint", url: "https://www.tutorialspoint.com/cprogramming/", description: "C basics", isWorking: true }],
  "algorithms": [{ title: "Algorithms - GeeksforGeeks", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/", description: "Algorithm design", isWorking: true }],
  "database systems": [{ title: "DB Sys - W3Schools", url: "https://www.w3schools.com/sql/", description: "Database systems", isWorking: true }],
  "computer architecture": [{ title: "Comp Arch - GeeksforGeeks", url: "https://www.geeksforgeeks.org/computer-organization-and-architecture/", description: "Architecture basics", isWorking: true }],
  "blockchain": [{ title: "Blockchain - GeeksforGeeks", url: "https://www.geeksforgeeks.org/blockchain-technology/", description: "Blockchain fundamentals", isWorking: true }],
  "big data": [{ title: "Big Data - GeeksforGeeks", url: "https://www.geeksforgeeks.org/big-data/", description: "Big data concepts", isWorking: true }],
  "capstone project": [{ title: "Capstone - GeeksforGeeks", url: "https://www.geeksforgeeks.org/projects/", description: "Project guide", isWorking: true }],

  // EXTC
  "signals and systems": [{ title: "Signals - DSPRelated", url: "https://www.dsprelated.com/freebooks/sasp/", description: "Signal basics", isWorking: true }],
  "analog circuits": [{ title: "Analog - Electronics-Tutorials", url: "https://www.electronics-tutorials.ws/analog/", description: "Analog circuits", isWorking: true }],
  "network analysis": [{ title: "Network - Electronics-Tutorials", url: "https://www.electronics-tutorials.ws/accircuits/network-analysis.html", description: "Network basics", isWorking: true }],
  // "digital logic design" already consolidated
  "digital communication": [{ title: "Digital Comm - GeeksforGeeks", url: "https://www.geeksforgeeks.org/digital-communication/", description: "Comm systems", isWorking: true }],
  "control systems": [{ title: "Control Sys - Control Tutorials", url: "https://ctms.engin.umich.edu/CTMS/index.php", description: "Control basics", isWorking: true }],
  "microprocessors": [{ title: "Microproc - Tutorialspoint", url: "https://www.tutorialspoint.com/microprocessor/", description: "Microprocessor systems", isWorking: true }],
  "emi/emc": [{ title: "EMI/EMC - GeeksforGeeks", url: "https://www.geeksforgeeks.org/emi-emc/", description: "EMI/EMC concepts", isWorking: true }],
  "wireless communication": [{ title: "Wireless - GeeksforGeeks", url: "https://www.geeksforgeeks.org/wireless-communication/", description: "Wireless tech", isWorking: true }],
  "microwave engineering": [{ title: "Microwave - GeeksforGeeks", url: "https://www.geeksforgeeks.org/microwave-engineering/", description: "Microwave basics", isWorking: true }],
  "iot systems": [{ title: "IoT - GeeksforGeeks", url: "https://www.geeksforgeeks.org/internet-of-things-iot/", description: "IoT concepts", isWorking: true }],

  // Mechanical
  "thermodynamics": [{ title: "Thermo - Engineering Toolbox", url: "https://www.engineeringtoolbox.com/thermodynamics-d_323.html", description: "Thermo basics", isWorking: true }],
  "strength of materials": [{ title: "Strength - Engineering Toolbox", url: "https://www.engineeringtoolbox.com/stress-strain-d_950.html", description: "Material strength", isWorking: true }],
  "material science": [{ title: "Mat Sci - Engineering LibreTexts", url: "https://eng.libretexts.org/Bookshelves/Materials_Science", description: "Material properties", isWorking: true }],
  "fluid mechanics": [{ title: "Fluid Mech - Engineering LibreTexts", url: "https://eng.libretexts.org/Bookshelves/Civil_Engineering/Fluid_Mechanics_(Bar-Meir)", description: "Fluid dynamics", isWorking: true }],
  "machine design": [{ title: "Machine Design - Machine Design Online", url: "https://www.machinedesign.com/", description: "Design principles", isWorking: true }],
  "heat transfer": [{ title: "Heat Trans - MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/2-005-thermal-fluids-engineering-i-fall-2006/", description: "Heat transfer", isWorking: true }],
  "manufacturing technology": [{ title: "Manuf Tech - MECHOVIS", url: "https://mechovision.com/manufacturing-processes/", description: "Manufacturing basics", isWorking: true }],
  "theory of machines": [{ title: "Theory of Machines - Engineering Toolbox", url: "https://www.engineeringtoolbox.com/", description: "Machine theory", isWorking: true }],
  "robotics": [{ title: "Robotics - GeeksforGeeks", url: "https://www.geeksforgeeks.org/robotics/", description: "Robotics basics", isWorking: true }],
  "automobile engineering": [{ title: "Auto Eng - GeeksforGeeks", url: "https://www.geeksforgeeks.org/automobile-engineering/", description: "Auto concepts", isWorking: true }],
  "refrigeration & ac": [{ title: "Ref/AC - Engineering Toolbox", url: "https://www.engineeringtoolbox.com/refrigeration-d_396.html", description: "Refrigeration tech", isWorking: true }]
};

// Study guidance for all subjects (unique keys)
export const studyGuidance: Record<string, string[]> = {
  // First Year Common Subjects
  "engineering mathematics-1": ["Master calculus basics", "Practice differentiation", "Understand matrices", "Solve daily problems", "Use graphing tools"],
  "engineering mathematics-2": ["Learn differential equations", "Practice complex numbers", "Understand probability", "Solve numericals", "Use MATLAB"],
  "engineering physics-1": ["Focus on mechanics", "Practice optics", "Understand experiments", "Solve problems", "Relate to applications"],
  "engineering physics-2": ["Study electromagnetism", "Practice wave theory", "Learn lab techniques", "Solve numericals", "Explore real-world uses"],
  "engineering chemistry": ["Learn chemical bonding", "Practice stoichiometry", "Understand materials", "Study environmental chemistry", "Perform lab work"],
  "basic electrical engineering": ["Understand Ohm’s Law", "Practice circuit analysis", "Learn AC/DC basics", "Study safety", "Use simulation tools"],
  "engineering mechanics": ["Master statics", "Practice dynamics", "Understand forces", "Solve structural problems", "Use software tools"],
  "engineering graphics": ["Learn orthographic projections", "Practice isometric views", "Use CAD software", "Understand sections", "Follow standards"],
  "basic electronics": ["Understand diodes", "Practice transistor circuits", "Learn amplifiers", "Study logic gates", "Use simulators"],
  "workshop practice": ["Learn tool usage", "Practice welding", "Understand machining", "Follow safety protocols", "Build small projects"],

  // Computer Engineering
  "data structures and algorithm": ["Start with arrays", "Practice linked lists", "Master trees", "Learn graphs", "Analyze complexity"],
  "computer organization": ["Understand CPU design", "Study memory", "Learn pipelining", "Practice assembly", "Analyze performance"],
  "discrete mathematics": ["Master sets and logic", "Practice combinatorics", "Understand graphs", "Solve proofs", "Use applications"],
  "digital logic design": ["Learn gates", "Practice flip-flops", "Understand counters", "Study registers", "Use simulation tools"], // Consolidated
  "operating systems": ["Understand processes", "Practice scheduling", "Learn memory management", "Study file systems", "Simulate concepts"],
  "database management systems": ["Master ER modeling", "Practice SQL", "Understand normalization", "Learn transactions", "Design databases"],
  "computer networks": ["Learn OSI model", "Practice subnetting", "Understand routing", "Study security", "Simulate networks"],
  "software engineering": ["Learn SDLC", "Practice UML", "Study testing", "Use Git", "Work on projects"],
  "machine learning": ["Master regression", "Practice datasets", "Learn neural networks", "Use TensorFlow", "Analyze models"],
  "cloud computing": ["Understand models", "Practice with AWS", "Learn virtualization", "Study security", "Deploy apps"],
  "cryptography and system security": ["Learn encryption", "Practice secure coding", "Understand attacks", "Study policies", "Simulate defenses"],
  "project work": ["Define objectives", "Plan timeline", "Implement solution", "Test thoroughly", "Document results"],

  // Information Technology
  "web programming": ["Learn HTML/CSS", "Practice JavaScript", "Understand frameworks", "Build websites", "Learn APIs"],
  "discrete structures": ["Master logic", "Practice sets", "Understand graphs", "Solve problems", "Apply to IT"],
  "mobile computing": ["Learn mobile OS", "Practice app development", "Understand sensors", "Build apps", "Study trends"],
  "system administration": ["Learn server setup", "Practice networking", "Understand backups", "Study security", "Manage systems"],
  "cloud services": ["Understand services", "Practice with platforms", "Learn deployment", "Study scalability", "Secure apps"],
  "Artifical intelligence": ["Learn AI basics", "Practice ML models", "Understand neural nets", "Use tools", "Analyze data"],
  "enterprise resource planning": ["Understand ERP systems", "Practice modules", "Learn implementation", "Study integration", "Analyze business processes"],

  // CSE
  "c programming": ["Learn syntax", "Practice loops", "Understand pointers", "Write programs", "Debug code"],
  "algorithms": ["Master sorting", "Practice searching", "Learn DP", "Analyze complexity", "Solve challenges"],
  "database systems": ["Learn ERD", "Practice SQL", "Understand normalization", "Manage transactions", "Design databases"],
  "computer architecture": ["Understand CPU", "Study memory", "Learn pipelining", "Practice assembly", "Analyze performance"],
  "blockchain": ["Learn basics", "Practice smart contracts", "Understand consensus", "Study security", "Build apps"],
  "big data": ["Learn Hadoop", "Practice with datasets", "Understand analytics", "Use tools", "Analyze trends"],
  "capstone project": ["Define goals", "Plan phases", "Implement code", "Test rigorously", "Present findings"],

  // EXTC
  "signals and systems": ["Master signals", "Practice transforms", "Learn sampling", "Study filtering", "Use MATLAB"],
  "analog circuits": ["Understand amplifiers", "Practice biasing", "Learn op-amps", "Study circuits", "Use simulators"],
  "network analysis": ["Learn theorems", "Practice circuits", "Understand networks", "Study resonance", "Use tools"],
  // "digital logic design" already consolidated
  "digital communication": ["Learn modulation", "Practice coding", "Understand channels", "Study protocols", "Simulate systems"],
  "control systems": ["Understand feedback", "Practice stability", "Learn PID", "Study state space", "Use tools"],
  "microprocessors": ["Learn architecture", "Practice assembly", "Understand interfacing", "Build projects", "Use debuggers"],
  "emi/emc": ["Understand EMI", "Practice shielding", "Learn EMC", "Study regulations", "Simulate effects"],
  "wireless communication": ["Learn standards", "Practice modulation", "Understand antennas", "Study protocols", "Simulate networks"],
  "microwave engineering": ["Learn waveguides", "Practice design", "Understand components", "Study applications", "Use tools"],
  "iot systems": ["Learn IoT basics", "Practice with devices", "Understand protocols", "Build projects", "Study security"],

  // Mechanical
  "thermodynamics": ["Master laws", "Practice cycles", "Learn energy", "Study entropy", "Use simulators"],
  "strength of materials": ["Learn stress", "Practice beams", "Understand strain", "Study failure", "Use FEA"],
  "material science": ["Learn properties", "Practice testing", "Understand alloys", "Study processing", "Use labs"],
  "fluid mechanics": ["Understand properties", "Practice Bernoulli", "Learn flow", "Study pipes", "Simulate dynamics"],
  "machine design": ["Learn principles", "Practice gears", "Understand shafts", "Study failure", "Use software"],
  "heat transfer": ["Master modes", "Practice exchangers", "Learn radiation", "Study systems", "Use tools"],
  "manufacturing technology": ["Learn processes", "Practice machining", "Understand casting", "Study welding", "Use CAD"],
  "theory of machines": ["Learn mechanisms", "Practice kinematics", "Understand dynamics", "Study vibrations", "Use software"],
  "robotics": ["Learn basics", "Practice control", "Understand sensors", "Build robots", "Use simulation"],
  "automobile engineering": ["Learn engines", "Practice design", "Understand systems", "Study safety", "Use tools"],
  "refrigeration & ac": ["Learn cycles", "Practice design", "Understand components", "Study efficiency", "Use software"]
};

/**
 * Retrieves a set of study resources for a given subject.
 * @param {string} subject - The subject to search for (case-insensitive).
 * @returns {StudyResourceSet & { guidance?: string[] }} - A resource set including videos, articles, books, and guidance.
 */
export function getResourcesForSubject(subject: string): StudyResourceSet & { guidance?: string[] } {
  const normalizedSubject = subject.toLowerCase().trim();

  // Find exact or partial match
  const findBestMatch = (resources: Record<string, StudyResource[]>) => {
    // Try exact match first
    if (resources[normalizedSubject]) {
      return resources[normalizedSubject];
    }

    // Try partial match
    const partialMatch = Object.keys(resources).find(key =>
      normalizedSubject.includes(key) || key.includes(normalizedSubject)
    );

    return partialMatch ? resources[partialMatch] : [];
  };

  const videos = findBestMatch(youtubeResources).map(resource => {
    // Simulate YouTube link validation (e.g., check if URL is valid or returns 404)
    // In a real app, use fetch or an API to check the URL status
    const isValidYouTubeLink = resource.url.startsWith("https://www.youtube.com/") && resource.url.includes("watch?v=");
    if (!isValidYouTubeLink || !resource.url) {
      // Fallback to a default or backup link if the original is invalid
      const fallbackLink = youtubeResources[normalizedSubject]?.find(r => r.url) || { title: "Fallback Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }; // Default fallback
      return { ...resource, url: fallbackLink.url, title: fallbackLink.title || resource.title };
    }
    return resource;
  });

  const articles = findBestMatch(articleResources);
  const guidance = studyGuidance[normalizedSubject] || studyGuidance[Object.keys(studyGuidance).find(key =>
    normalizedSubject.includes(key) || key.includes(normalizedSubject)
  )] || [];

  return {
    videos,
    articles,
    books: [], // Simplified - focusing on videos and articles
    guidance
  };
}

/**
 * Generates study advice for a given subject and goal.
 * @param {string} subject - The subject to generate advice for.
 * @param {string} goal - The learning goal to tailor the advice.
 * @returns {string[]} - Array of study advice tailored to the subject and goal.
 */
export function generateStudyAdvice(subject: string, goal: string): string[] {
  const normalizedSubject = subject.toLowerCase();

  // Get subject-specific guidance
  const subjectGuidance = studyGuidance[normalizedSubject] ||
    studyGuidance[Object.keys(studyGuidance).find(key =>
      normalizedSubject.includes(key) || key.includes(normalizedSubject)
    )] || [];

  if (subjectGuidance.length > 0) {
    return subjectGuidance.map(advice => advice.replace("achieve", `achieve: "${goal}"`));
  }

  // Fallback general advice
  return [
    `Focus on understanding ${subject} fundamentals first`,
    `Practice regularly to achieve: "${goal}"`,
    "Use active recall and spaced repetition",
    "Solve previous year questions",
    "Form study groups for better understanding"
  ];
}