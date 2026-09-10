import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const coursesData = [
  { code: "BTECH_CSE", name: "B.Tech Computer Science & Engineering", degree: "B.Tech", stream: "Engineering", durationYears: 4 },
  { code: "BTECH_ECE", name: "B.Tech Electronics & Communication", degree: "B.Tech", stream: "Engineering", durationYears: 4 },
  { code: "BTECH_MECH", name: "B.Tech Mechanical Engineering", degree: "B.Tech", stream: "Engineering", durationYears: 4 },
  { code: "BTECH_EE", name: "B.Tech Electrical Engineering", degree: "B.Tech", stream: "Engineering", durationYears: 4 },
  { code: "BTECH_AI_DS", name: "B.Tech AI & Data Science", degree: "B.Tech", stream: "Engineering", durationYears: 4 },
  { code: "MBA_GEN", name: "Master of Business Administration (General)", degree: "MBA", stream: "Management", durationYears: 2 },
  { code: "MBA_BA", name: "MBA in Business Analytics", degree: "MBA", stream: "Management", durationYears: 2 },
  { code: "MBA_FIN", name: "MBA in Finance", degree: "MBA", stream: "Management", durationYears: 2 },
  { code: "MBBS", name: "Bachelor of Medicine, Bachelor of Surgery (MBBS)", degree: "MBBS", stream: "Medical", durationYears: 5 },
  { code: "MD_GEN", name: "Doctor of Medicine (MD)", degree: "MD", stream: "Medical", durationYears: 3 },
  { code: "BALLB", name: "B.A. LL.B. (Hons)", degree: "Integrated Law", stream: "Law", durationYears: 5 },
  { code: "BDES", name: "Bachelor of Design (B.Des)", degree: "B.Des", stream: "Design", durationYears: 4 },
  { code: "BA_ECON", name: "B.A. (Hons) Economics", degree: "B.A.", stream: "Arts & Science", durationYears: 3 },
  { code: "BSC_CS", name: "B.Sc (Hons) Computer Science", degree: "B.Sc", stream: "Arts & Science", durationYears: 3 },
];

interface RawCollege {
  slug: string;
  name: string;
  shortName: string;
  overview: string;
  establishedYear: number;
  collegeType: string;
  ownership: string;
  affiliation: string;
  accreditation: string;
  rating: number;
  reviewCount: number;
  minFees: number;
  maxFees: number;
  city: string;
  state: string;
  address: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  courses: { courseCode: string; annualFees: number; eligibility: string; seats: number }[];
  placement: { year: number; highestPackage: number; averagePackage: number; medianPackage: number; placementRate: number; topRecruiters: string };
  facilities: string[];
  reviews: { reviewerName: string; rating: number; title: string; pros: string; cons: string; courseName: string; batchYear: string }[];
}

const rawColleges: RawCollege[] = [
  {
    slug: "iit-bombay",
    name: "Indian Institute of Technology Bombay",
    shortName: "IIT Bombay",
    overview: "IIT Bombay is a globally recognized public technical and research university located in Powai, Mumbai. Recognized as an Institute of Eminence by the Government of India, it is famed for pioneering research, world-class faculty, and outstanding campus placements.",
    establishedYear: 1958,
    collegeType: "Engineering",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #3 Engineering 2024",
    rating: 4.9,
    reviewCount: 420,
    minFees: 220000,
    maxFees: 250000,
    city: "Mumbai",
    state: "Maharashtra",
    address: "Powai, Mumbai, Maharashtra 400076",
    website: "https://www.iitb.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 230000, eligibility: "10+2 with 75% + Top rank in JEE Advanced", seats: 140 },
      { courseCode: "BTECH_ECE", annualFees: 230000, eligibility: "10+2 with 75% + JEE Advanced Rank", seats: 120 },
      { courseCode: "BTECH_AI_DS", annualFees: 230000, eligibility: "10+2 with 75% + JEE Advanced Rank", seats: 60 },
      { courseCode: "BDES", annualFees: 220000, eligibility: "UCEED Qualified", seats: 40 }
    ],
    placement: { year: 2024, highestPackage: 85.0, averagePackage: 23.5, medianPackage: 19.8, placementRate: 94.5, topRecruiters: "Google, Microsoft, Apple, Qualcomm, Optiver, Goldman Sachs, McKinsey & Company" },
    facilities: ["High Performance Computing Lab", "Olympic Size Swimming Pool", "Hostel & Dining", "24x7 Central Library", "Incubation Center"],
    reviews: [
      { reviewerName: "Aarav Sharma", rating: 5.0, title: "Unbeatable academic rigor and vibrant campus life", pros: "Top-tier peer group, endless extracurricular clubs, stellar placements.", cons: "High academic stress and competition during midterms.", courseName: "B.Tech CSE", batchYear: "2024" },
      { reviewerName: "Pooja Patel", rating: 4.8, title: "Life-changing ecosystem for tech innovators", pros: "Exceptional research grants, modern labs, supportive professors.", cons: "Hostel rooms in older wings need modernization.", courseName: "B.Tech ECE", batchYear: "2023" }
    ]
  },
  {
    slug: "iit-delhi",
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    overview: "IIT Delhi is a premier public institute located in Hauz Khas, New Delhi. Known as a powerhouse of entrepreneurship and cutting-edge engineering, its alumni have founded some of India's largest unicorns and technology enterprises.",
    establishedYear: 1961,
    collegeType: "Engineering",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #2 Engineering 2024",
    rating: 4.9,
    reviewCount: 380,
    minFees: 215000,
    maxFees: 245000,
    city: "New Delhi",
    state: "Delhi",
    address: "Hauz Khas, New Delhi 110016",
    website: "https://home.iitd.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 220000, eligibility: "10+2 with 75% + JEE Advanced Top Rank", seats: 120 },
      { courseCode: "BTECH_MECH", annualFees: 220000, eligibility: "10+2 with 75% + JEE Advanced Rank", seats: 130 },
      { courseCode: "BTECH_EE", annualFees: 220000, eligibility: "10+2 with 75% + JEE Advanced Rank", seats: 110 }
    ],
    placement: { year: 2024, highestPackage: 82.0, averagePackage: 24.2, medianPackage: 20.1, placementRate: 96.0, topRecruiters: "Microsoft, Jane Street, Texas Instruments, Uber, Boston Consulting Group" },
    facilities: ["Advanced Microelectronics Lab", "Sports Arena", "Digital Library", "Maker Space", "Hostels"],
    reviews: [
      { reviewerName: "Rohan Varma", rating: 5.0, title: "The entrepreneurial capital of Indian colleges", pros: "Proximity to industry leaders, unmatched alumni network, top funding support.", cons: "Campus is slightly compact compared to other IITs.", courseName: "B.Tech CSE", batchYear: "2024" }
    ]
  },
  {
    slug: "iit-madras",
    name: "Indian Institute of Technology Madras",
    shortName: "IIT Madras",
    overview: "Ranked #1 overall in the NIRF rankings for multiple consecutive years, IIT Madras is celebrated for its lush 630-acre campus, pioneering research park, and world-class faculty in Chennai.",
    establishedYear: 1959,
    collegeType: "Engineering",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #1 Overall 2024",
    rating: 4.9,
    reviewCount: 450,
    minFees: 210000,
    maxFees: 240000,
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Sardar Patel Road, Chennai, Tamil Nadu 600036",
    website: "https://www.iitm.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 220000, eligibility: "10+2 + JEE Advanced Top 150 rank", seats: 110 },
      { courseCode: "BTECH_ECE", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 100 },
      { courseCode: "BTECH_AI_DS", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 50 }
    ],
    placement: { year: 2024, highestPackage: 88.0, averagePackage: 23.8, medianPackage: 19.5, placementRate: 95.0, topRecruiters: "Qualcomm, NVIDIA, Amazon, Bain, Jane Street, Google" },
    facilities: ["IITM Research Park", "Wildlife Sanctuaries Inside Campus", "Central Library", "Supercomputing Cluster", "Sports Complex"],
    reviews: [
      { reviewerName: "Sneha Sundaram", rating: 4.9, title: "Unbeatable research atmosphere and peaceful campus", pros: "Research park is unmatched in Asia. Very strong coding culture.", cons: "Chennai summer can be quite hot.", courseName: "B.Tech CSE", batchYear: "2024" }
    ]
  },
  {
    slug: "iit-kanpur",
    name: "Indian Institute of Technology Kanpur",
    shortName: "IIT Kanpur",
    overview: "IIT Kanpur is renowned for introducing computer science education to India. Featuring its own airstrip, flight lab, and high-energy physics facilities, it remains a global cornerstone in deep tech and engineering research.",
    establishedYear: 1959,
    collegeType: "Engineering",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #4 Engineering 2024",
    rating: 4.8,
    reviewCount: 310,
    minFees: 215000,
    maxFees: 245000,
    city: "Kanpur",
    state: "Uttar Pradesh",
    address: "Kalyanpur, Kanpur, Uttar Pradesh 208016",
    website: "https://www.iitk.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 225000, eligibility: "10+2 + JEE Advanced Top 200 rank", seats: 125 },
      { courseCode: "BTECH_MECH", annualFees: 225000, eligibility: "10+2 + JEE Advanced rank", seats: 130 },
      { courseCode: "BTECH_EE", annualFees: 225000, eligibility: "10+2 + JEE Advanced rank", seats: 110 }
    ],
    placement: { year: 2024, highestPackage: 84.0, averagePackage: 23.1, medianPackage: 18.9, placementRate: 93.0, topRecruiters: "Google, Citadel, Oracle, Intel, Texas Instruments" },
    facilities: ["Private Airstrip & Glider Club", "Computer Centre", "Olympic Pool", "Hostels", "Gymkhana"],
    reviews: [
      { reviewerName: "Aditya Mishra", rating: 4.8, title: "The gold standard for theoretical computer science and research", pros: "Open campus policy, highly intellectual culture, freedom of thought.", cons: "Located somewhat away from main Kanpur city.", courseName: "B.Tech CSE", batchYear: "2023" }
    ]
  },
  {
    slug: "iit-kharagpur",
    name: "Indian Institute of Technology Kharagpur",
    shortName: "IIT KGP",
    overview: "As the first IIT established in India, IIT Kharagpur spans an immense 2,100-acre township. It offers diverse departments ranging from computer science and aerospace to intellectual property law and medical science.",
    establishedYear: 1951,
    collegeType: "Engineering",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #5 Engineering 2024",
    rating: 4.8,
    reviewCount: 390,
    minFees: 210000,
    maxFees: 240000,
    city: "Kharagpur",
    state: "West Bengal",
    address: "Kharagpur, West Bengal 721302",
    website: "https://www.iitkgp.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 130 },
      { courseCode: "BTECH_ECE", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 110 },
      { courseCode: "BALLB", annualFees: 240000, eligibility: "IIT KGP Law Entrance Examination", seats: 50 }
    ],
    placement: { year: 2024, highestPackage: 78.0, averagePackage: 21.8, medianPackage: 17.5, placementRate: 91.0, topRecruiters: "Microsoft, Honeywell, Samsung, Shell, Barclays, Flipkart" },
    facilities: ["2100-Acre Campus", "Central Library", "Technology Students Gymkhana", "Multi-Speciality Hospital", "Hostels"],
    reviews: [
      { reviewerName: "Debashis Roy", rating: 4.7, title: "Vast campus with unmatched festival culture (Spring Fest & Kshitij)", pros: "Massive campus, life-long bonding in halls of residence, incredible placements.", cons: "Distance from Kolkata airport requires 2 hour train ride.", courseName: "B.Tech CSE", batchYear: "2024" }
    ]
  },
  {
    slug: "iim-ahmedabad",
    name: "Indian Institute of Management Ahmedabad",
    shortName: "IIM Ahmedabad",
    overview: "IIM Ahmedabad is India's crown jewel in management education. Famous for its rigorous Louis Kahn campus, Harvard-pioneered case study method, and influential global alumni network.",
    establishedYear: 1961,
    collegeType: "Management",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #1 Management 2024 / EQUIS Accredited",
    rating: 5.0,
    reviewCount: 340,
    minFees: 1250000,
    maxFees: 1500000,
    city: "Ahmedabad",
    state: "Gujarat",
    address: "Vastrapur, Ahmedabad, Gujarat 380015",
    website: "https://www.iima.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "MBA_GEN", annualFees: 1350000, eligibility: "Bachelor Degree with 50% + CAT 99.5+ percentile + WAT/PI", seats: 390 },
      { courseCode: "MBA_BA", annualFees: 1400000, eligibility: "Bachelor Degree + CAT / GMAT + Interview", seats: 60 }
    ],
    placement: { year: 2024, highestPackage: 92.0, averagePackage: 34.5, medianPackage: 32.0, placementRate: 100.0, topRecruiters: "McKinsey, BCG, Bain, Blackstone, Goldman Sachs, Morgan Stanley, TAS" },
    facilities: ["Louis Kahn Heritage Architecture", "Vikram Sarabhai Library", "Executive Residence", "Bloomberg Terminals", "Auditorium"],
    reviews: [
      { reviewerName: "Vikram Singhania", rating: 5.0, title: "The ultimate proving ground for business leadership", pros: "Case method pedagogy is transformative, top global salary offers, prestigious tag.", cons: "Sleep deprivation during Term 1 is real.", courseName: "MBA (PGP)", batchYear: "2024" }
    ]
  },
  {
    slug: "iim-bangalore",
    name: "Indian Institute of Management Bangalore",
    shortName: "IIM Bangalore",
    overview: "Located in India's technology capital, IIM Bangalore is known for its iconic stone-architecture campus designed by B.V. Doshi, leading faculty in analytics and digital strategy, and venture creation.",
    establishedYear: 1973,
    collegeType: "Management",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #2 Management 2024 / EQUIS Accredited",
    rating: 4.9,
    reviewCount: 290,
    minFees: 1200000,
    maxFees: 1450000,
    city: "Bengaluru",
    state: "Karnataka",
    address: "Bannerghatta Road, Bengaluru, Karnataka 560076",
    website: "https://www.iimb.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "MBA_GEN", annualFees: 1300000, eligibility: "Bachelor Degree + CAT 99+ percentile + PI", seats: 410 },
      { courseCode: "MBA_BA", annualFees: 1350000, eligibility: "Bachelor Degree in Tech/Math + CAT/GMAT", seats: 75 }
    ],
    placement: { year: 2024, highestPackage: 86.0, averagePackage: 35.3, medianPackage: 33.0, placementRate: 100.0, topRecruiters: "Bain, McKinsey, Strategy&, Amazon, Microsoft, Kearney, Citibank" },
    facilities: ["Doshi Stone Architecture", "NSRCEL Incubation Center", "Sports Grounds", "Hostels", "Modern Library"],
    reviews: [
      { reviewerName: "Priyanka Nambiar", rating: 5.0, title: "Bengaluru advantage and unbeatable consulting cohorts", pros: "Proximity to startup ecosystem, world-class professors, high placements.", cons: "Heavy workload throughout the first year.", courseName: "MBA", batchYear: "2024" }
    ]
  },
  {
    slug: "iim-calcutta",
    name: "Indian Institute of Management Calcutta",
    shortName: "IIM Calcutta",
    overview: "Set among seven scenic lakes in Joka, Kolkata, IIM Calcutta is revered as India's premier finance and quantitative business school. It is the first Triple-Crown accredited management institute in India.",
    establishedYear: 1961,
    collegeType: "Management",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "Triple Crown (AACSB, AMBA, EQUIS)",
    rating: 4.9,
    reviewCount: 310,
    minFees: 1150000,
    maxFees: 1400000,
    city: "Kolkata",
    state: "West Bengal",
    address: "Diamond Harbour Road, Joka, Kolkata 700104",
    website: "https://www.iimcal.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "MBA_GEN", annualFees: 1250000, eligibility: "Graduate Degree + CAT 99.2+ percentile", seats: 460 },
      { courseCode: "MBA_FIN", annualFees: 1300000, eligibility: "Graduate Degree + CAT score + Finance interview", seats: 80 }
    ],
    placement: { year: 2024, highestPackage: 90.0, averagePackage: 35.1, medianPackage: 32.5, placementRate: 100.0, topRecruiters: "Goldman Sachs, J.P. Morgan, Avendus Capital, Barclays, BCG, Google" },
    facilities: ["7 Lakes Campus", "Finance Lab with Bloomberg Terminals", "Hostels", "Auditorium", "Library"],
    reviews: [
      { reviewerName: "Ananya Ghosh", rating: 4.9, title: "Mecca for investment banking and quantitative finance", pros: "Investment banking desk placements are top in Asia. Serene lakeside campus.", cons: "Distance from central Kolkata nightlife.", courseName: "MBA", batchYear: "2024" }
    ]
  },
  {
    slug: "aiims-new-delhi",
    name: "All India Institute of Medical Sciences New Delhi",
    shortName: "AIIMS Delhi",
    overview: "AIIMS New Delhi is India's apex medical institution. Providing subsidized healthcare and cutting-edge clinical research, it trains the nation's finest physicians, surgeons, and medical researchers.",
    establishedYear: 1956,
    collegeType: "Medical",
    ownership: "Public",
    affiliation: "Autonomous Medical Institute of National Importance",
    accreditation: "NIRF #1 Medical 2024",
    rating: 5.0,
    reviewCount: 520,
    minFees: 1500,
    maxFees: 6000,
    city: "New Delhi",
    state: "Delhi",
    address: "Ansari Nagar, New Delhi 110029",
    website: "https://www.aiims.edu",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "MBBS", annualFees: 1628, eligibility: "10+2 with PCB (60%) + NEET-UG Top Rank (AIR 1-50)", seats: 125 },
      { courseCode: "MD_GEN", annualFees: 2500, eligibility: "MBBS + INI-CET Rank", seats: 90 }
    ],
    placement: { year: 2024, highestPackage: 36.0, averagePackage: 20.0, medianPackage: 18.0, placementRate: 98.0, topRecruiters: "Max Healthcare, Apollo Hospitals, Fortis Healthcare, Mayo Clinic Fellowship, NHS UK" },
    facilities: ["Advanced Surgery Simulation Labs", "2500+ Bed Hospital", "BB Dikshit Central Medical Library", "Hostels", "Trauma Center"],
    reviews: [
      { reviewerName: "Dr. Kunal Sengupta", rating: 5.0, title: "Unrivaled clinical exposure and world-class mentors", pros: "Virtually zero tuition fee, exposure to the rarest clinical cases in the subcontinent.", cons: "Exhausting 36-hour clinical shifts during internship year.", courseName: "MBBS", batchYear: "2023" }
    ]
  },
  {
    slug: "cmc-vellore",
    name: "Christian Medical College Vellore",
    shortName: "CMC Vellore",
    overview: "CMC Vellore is one of India's most respected private medical schools and tertiary care hospitals. Renowned for its service-oriented healthcare, state-of-the-art organ transplants, and compassionate care.",
    establishedYear: 1900,
    collegeType: "Medical",
    ownership: "Private",
    affiliation: "The Tamil Nadu Dr. M.G.R. Medical University",
    accreditation: "NIRF #3 Medical 2024 / NAAC A",
    rating: 4.9,
    reviewCount: 260,
    minFees: 52000,
    maxFees: 120000,
    city: "Vellore",
    state: "Tamil Nadu",
    address: "Ida Scudder Road, Vellore, Tamil Nadu 632004",
    website: "https://www.cmch-vellore.edu",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "MBBS", annualFees: 55000, eligibility: "10+2 with PCB + NEET-UG score", seats: 100 },
      { courseCode: "MD_GEN", annualFees: 80000, eligibility: "MBBS + NEET-PG / INI-CET", seats: 60 }
    ],
    placement: { year: 2024, highestPackage: 30.0, averagePackage: 17.5, medianPackage: 15.0, placementRate: 98.0, topRecruiters: "CMC Vellore Network, Apollo Hospitals, Manipal Hospitals, Global Fellowships" },
    facilities: ["Multi-Speciality 2800-Bed Hospital", "Simulation Lab", "Bagayam Rural Campus", "Hostels", "Library"],
    reviews: [
      { reviewerName: "Dr. Rachel Thomas", rating: 4.9, title: "The spiritual and clinical heart of Indian medicine", pros: "Ethical medical training, high diagnostic independence, low fees for a private college.", cons: "Strict mandatory rural service bond.", courseName: "MBBS", batchYear: "2023" }
    ]
  },
  {
    slug: "bits-pilani",
    name: "Birla Institute of Technology and Science Pilani",
    shortName: "BITS Pilani",
    overview: "BITS Pilani is India's most prestigious private technical institute and an Institute of Eminence. Famous for its 'Zero Attendance' policy, merit-only admissions via BITSAT, and Practice School internship program.",
    establishedYear: 1964,
    collegeType: "Engineering",
    ownership: "Private",
    affiliation: "Deemed to be University / Institute of Eminence",
    accreditation: "NAAC A / NIRF #20 Overall",
    rating: 4.8,
    reviewCount: 460,
    minFees: 540000,
    maxFees: 590000,
    city: "Pilani",
    state: "Rajasthan",
    address: "Vidya Vihar, Pilani, Rajasthan 333031",
    website: "https://www.bits-pilani.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 560000, eligibility: "10+2 with PCM (75% aggregate) + High BITSAT score", seats: 150 },
      { courseCode: "BTECH_ECE", annualFees: 560000, eligibility: "10+2 with PCM + BITSAT score", seats: 140 },
      { courseCode: "BTECH_MECH", annualFees: 560000, eligibility: "10+2 with PCM + BITSAT score", seats: 120 }
    ],
    placement: { year: 2024, highestPackage: 60.5, averagePackage: 20.8, medianPackage: 17.5, placementRate: 94.0, topRecruiters: "Google, Microsoft, DE Shaw, Uber, Amazon, Nvidia, Texas Instruments" },
    facilities: ["Clock Tower Heritage Campus", "Pilani BITS Innovation Nest", "Hostels for all", "Practice School Industry Connect", "Sports Grounds"],
    reviews: [
      { reviewerName: "Varun Khandelwal", rating: 4.8, title: "Zero attendance policy unlocks unbelievable self-growth", pros: "Freedom to pursue startups, stellar 6-month Practice School internships, top tier peer group.", cons: "Tuition fees have risen significantly in recent years.", courseName: "B.Tech CSE", batchYear: "2024" }
    ]
  },
  {
    slug: "vit-vellore",
    name: "Vellore Institute of Technology",
    shortName: "VIT Vellore",
    overview: "VIT Vellore is one of India's largest and most technologically advanced private universities. Recognized as an Institution of Eminence, it features a sprawling campus, dynamic semester abroad programs, and massive corporate placement drives.",
    establishedYear: 1984,
    collegeType: "Engineering",
    ownership: "Private",
    affiliation: "Deemed University / Institute of Eminence",
    accreditation: "NAAC A++ (Score 3.66) / NIRF #11 Engineering",
    rating: 4.4,
    reviewCount: 580,
    minFees: 198000,
    maxFees: 495000,
    city: "Vellore",
    state: "Tamil Nadu",
    address: "Katpadi, Vellore, Tamil Nadu 632014",
    website: "https://vit.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 380000, eligibility: "10+2 with 60% in PCM + VITEEE Rank", seats: 1200 },
      { courseCode: "BTECH_AI_DS", annualFees: 380000, eligibility: "10+2 with 60% + VITEEE Rank", seats: 400 },
      { courseCode: "BTECH_ECE", annualFees: 290000, eligibility: "10+2 with 60% + VITEEE Rank", seats: 600 }
    ],
    placement: { year: 2024, highestPackage: 59.0, averagePackage: 9.8, medianPackage: 8.5, placementRate: 88.0, topRecruiters: "Microsoft, Amazon, TCS Digital, Cognizant, Wipro, Intel, Cisco" },
    facilities: ["Smart Classrooms", "Modern AC Hostels", "Central Library", "Food Courts & Cafes", "Outdoor Stadium"],
    reviews: [
      { reviewerName: "Rishabh Goel", rating: 4.3, title: "Great infrastructure and ocean of placement opportunities", pros: "Superb lab facilities, FFCS (Fully Flexible Credit System) lets you choose teachers.", cons: "Large batch size creates fierce competition for dream offers.", courseName: "B.Tech CSE", batchYear: "2024" }
    ]
  },
  {
    slug: "iit-roorkee",
    name: "Indian Institute of Technology Roorkee",
    shortName: "IIT Roorkee",
    overview: "Originating in 1847 as Thomason College of Civil Engineering, IIT Roorkee is Asia's oldest technical institution. Situated at the foothills of the Himalayas, it is celebrated for structural engineering, computer science, and serene beauty.",
    establishedYear: 1847,
    collegeType: "Engineering",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #6 Engineering 2024",
    rating: 4.7,
    reviewCount: 290,
    minFees: 215000,
    maxFees: 245000,
    city: "Roorkee",
    state: "Uttarakhand",
    address: "Roorkee, Haridwar District, Uttarakhand 247667",
    website: "https://www.iitr.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 115 },
      { courseCode: "BTECH_ECE", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 105 },
      { courseCode: "BTECH_MECH", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 120 }
    ],
    placement: { year: 2024, highestPackage: 80.0, averagePackage: 22.0, medianPackage: 18.0, placementRate: 92.0, topRecruiters: "Google, Microsoft, Oracle, Goldman Sachs, Sprinklr, Flipkart" },
    facilities: ["Heritage Main Building", "Olympic Pool", "Mahatma Gandhi Central Library", "Hostels", "Himalayan Treks Base"],
    reviews: [
      { reviewerName: "Manish Negi", rating: 4.8, title: "Rich heritage, Himalayan breezes, and top-tier opportunities", pros: "Stunning architecture, strong sports culture, strong core and IT placements.", cons: "Haridwar-Roorkee weather is extreme in winters.", courseName: "B.Tech CSE", batchYear: "2024" }
    ]
  },
  {
    slug: "nlsiu-bengaluru",
    name: "National Law School of India University",
    shortName: "NLSIU",
    overview: "NLSIU Bengaluru is India's premier law university and has ranked #1 among law colleges since the inception of the NIRF rankings. It revolutionized legal education through the 5-year integrated B.A. LL.B. model.",
    establishedYear: 1987,
    collegeType: "Law",
    ownership: "Public",
    affiliation: "Autonomous State University",
    accreditation: "NIRF #1 Law 2024 / NAAC A",
    rating: 4.9,
    reviewCount: 180,
    minFees: 320000,
    maxFees: 380000,
    city: "Bengaluru",
    state: "Karnataka",
    address: "Nagarbhavi, Bengaluru, Karnataka 560072",
    website: "https://www.nls.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BALLB", annualFees: 350000, eligibility: "10+2 with 45% + CLAT Top 100 Rank", seats: 240 }
    ],
    placement: { year: 2024, highestPackage: 24.0, averagePackage: 16.5, medianPackage: 15.0, placementRate: 98.0, topRecruiters: "Shardul Amarchand Mangaldas, Cyril Amarchand Mangaldas, Trilegal, AZB & Partners, Khaitan & Co" },
    facilities: ["Sri Narayan Rao Melgiri Memorial Law Library", "Moot Court Halls", "Residential Campus", "Sports Courts"],
    reviews: [
      { reviewerName: "Kavya Deshmukh", rating: 4.9, title: "The Harvard of the East for law aspirants", pros: "Rigorous trimester system, top tier law firm domestic & magic circle international placements.", cons: "Trimester system leaves little breathing room between exams.", courseName: "B.A. LL.B. (Hons)", batchYear: "2024" }
    ]
  },
  {
    slug: "nid-ahmedabad",
    name: "National Institute of Design Ahmedabad",
    shortName: "NID Ahmedabad",
    overview: "NID is internationally acclaimed as one of the finest design institutes in the world. Established following the famous Eames Report, it pioneers industrial, communication, and textile design education.",
    establishedYear: 1961,
    collegeType: "Design",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "National Design Council Recognized",
    rating: 4.9,
    reviewCount: 150,
    minFees: 380000,
    maxFees: 450000,
    city: "Ahmedabad",
    state: "Gujarat",
    address: "Paldi, Ahmedabad, Gujarat 380007",
    website: "https://www.nid.edu",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BDES", annualFees: 410000, eligibility: "10+2 in any stream + NID DAT Prelims & Mains", seats: 125 }
    ],
    placement: { year: 2024, highestPackage: 32.0, averagePackage: 15.2, medianPackage: 13.5, placementRate: 92.0, topRecruiters: "Google UX, Microsoft IDC, Samsung Design, Tata Motors, Adobe, Ikea" },
    facilities: ["Prototyping & Woodwork Workshops", "Textile Looms", "Knowledge Management Centre", "Open Studio Culture"],
    reviews: [
      { reviewerName: "Tanya Kapoor", rating: 5.0, title: "Where creativity meets human-centric problem solving", pros: "Free studio access 24/7, exceptional faculty critique, top design leadership roles.", cons: "Material costs for prototypes can add up.", courseName: "B.Des Product Design", batchYear: "2024" }
    ]
  },
  {
    slug: "srcc-delhi",
    name: "Shri Ram College of Commerce",
    shortName: "SRCC",
    overview: "SRCC is India's premier institution for commerce and economics education under the University of Delhi. Known for sky-high cutoffs, distinguished alumni in banking, politics, and industry, and vibrant corporate societies.",
    establishedYear: 1926,
    collegeType: "Arts & Science",
    ownership: "Public",
    affiliation: "University of Delhi",
    accreditation: "NAAC A++ (Score 3.65)",
    rating: 4.8,
    reviewCount: 410,
    minFees: 30000,
    maxFees: 45000,
    city: "New Delhi",
    state: "Delhi",
    address: "Maurice Nagar, University Enclave, Delhi 110007",
    website: "https://www.srcc.edu",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BA_ECON", annualFees: 35000, eligibility: "10+2 with Mathematics + CUET-UG 99+ percentile", seats: 180 }
    ],
    placement: { year: 2024, highestPackage: 35.0, averagePackage: 12.8, medianPackage: 11.0, placementRate: 90.0, topRecruiters: "Bain Capability Network, DE Shaw, McKinsey & Co, EY Parthenon, Deutsche Bank" },
    facilities: ["Air-Conditioned Classrooms", "Olympic Standard Indoor Sports Complex", "Resource Rich Library", "Hostels"],
    reviews: [
      { reviewerName: "Sarthak Jain", rating: 4.8, title: "The unmatched launchpad for finance and consulting", pros: "Phenomenal society culture, top consulting placements straight out of undergrad.", cons: "Campus hostel seats are limited.", courseName: "B.A. (Hons) Economics", batchYear: "2024" }
    ]
  },
  {
    slug: "manipal-academy",
    name: "Manipal Academy of Higher Education",
    shortName: "MAHE Manipal",
    overview: "MAHE Manipal is a world-class private deemed university and Institute of Eminence in coastal Karnataka. It offers a vibrant, cosmopolitan university town experience with stellar medical, engineering, and humanities programs.",
    establishedYear: 1953,
    collegeType: "Engineering",
    ownership: "Private",
    affiliation: "Deemed University / Institute of Eminence",
    accreditation: "NAAC A++ / NIRF #6 University",
    rating: 4.5,
    reviewCount: 370,
    minFees: 360000,
    maxFees: 520000,
    city: "Manipal",
    state: "Karnataka",
    address: "Tiger Circle, Manipal, Udupi, Karnataka 576104",
    website: "https://manipal.edu",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 430000, eligibility: "10+2 with 50% in PCM + MET Exam", seats: 350 },
      { courseCode: "BTECH_ECE", annualFees: 390000, eligibility: "10+2 with 50% in PCM + MET Exam", seats: 200 },
      { courseCode: "MBBS", annualFees: 1750000, eligibility: "10+2 + NEET UG score", seats: 250 }
    ],
    placement: { year: 2024, highestPackage: 54.0, averagePackage: 12.2, medianPackage: 9.8, placementRate: 91.0, topRecruiters: "Microsoft, Amazon, Cisco, Goldman Sachs, Philips, Dell Technologies" },
    facilities: ["MARENA World Class Sports Complex", "Central Library", "Manipal University Town Living", "Simulation Centers"],
    reviews: [
      { reviewerName: "Dhruv Rao", rating: 4.6, title: "Unmatched student freedom and cosmopolitan campus", pros: "Whole town belongs to students, incredible infrastructure, great coding groups.", cons: "Cost of living and tuition is on the higher side.", courseName: "B.Tech CSE", batchYear: "2024" }
    ]
  },
  {
    slug: "iit-hyderabad",
    name: "Indian Institute of Technology Hyderabad",
    shortName: "IIT Hyderabad",
    overview: "IIT Hyderabad is the fastest rising second-generation IIT. Renowned for its state-of-the-art Japanese architecture, focus on AI, semiconductor innovation, and liberal fractal academic curriculum.",
    establishedYear: 2008,
    collegeType: "Engineering",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #8 Engineering 2024",
    rating: 4.7,
    reviewCount: 240,
    minFees: 210000,
    maxFees: 240000,
    city: "Hyderabad",
    state: "Telangana",
    address: "Kandi, Sangareddy, Telangana 502284",
    website: "https://www.iith.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 220000, eligibility: "10+2 + JEE Advanced Top 600 rank", seats: 90 },
      { courseCode: "BTECH_AI_DS", annualFees: 220000, eligibility: "10+2 + JEE Advanced Top 700 rank", seats: 60 },
      { courseCode: "BDES", annualFees: 220000, eligibility: "UCEED Qualified", seats: 30 }
    ],
    placement: { year: 2024, highestPackage: 72.0, averagePackage: 21.4, medianPackage: 18.0, placementRate: 93.0, topRecruiters: "Google, Microsoft, TSMC, Rakuten, Micron, Goldman Sachs" },
    facilities: ["Fractal Academic System", "Japanese Design Hostels", "Clean Rooms", "High Speed AI Supercomputer", "Sports Complex"],
    reviews: [
      { reviewerName: "Varun Teja", rating: 4.7, title: "Frontrunner in Artificial Intelligence and modern academics", pros: "Fractal academics gives tremendous elective freedom. Excellent Japanese company tie-ups.", cons: "Campus is still undergoing minor expansion work.", courseName: "B.Tech AI & Data Science", batchYear: "2024" }
    ]
  },
  {
    slug: "iit-bhu-varanasi",
    name: "Indian Institute of Technology (BHU) Varanasi",
    shortName: "IIT BHU",
    overview: "Located inside the holy campus of Banaras Hindu University, IIT BHU has a century-long legacy in chemical, metallurgical, and computer engineering. It combines rich cultural roots with modern research.",
    establishedYear: 1919,
    collegeType: "Engineering",
    ownership: "Public",
    affiliation: "Institute of National Importance",
    accreditation: "NIRF #10 Engineering 2024",
    rating: 4.6,
    reviewCount: 280,
    minFees: 210000,
    maxFees: 240000,
    city: "Varanasi",
    state: "Uttar Pradesh",
    address: "Banaras Hindu University, Varanasi, UP 221005",
    website: "https://www.iitbhu.ac.in",
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BTECH_CSE", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 110 },
      { courseCode: "BTECH_ECE", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 100 },
      { courseCode: "BTECH_MECH", annualFees: 220000, eligibility: "10+2 + JEE Advanced rank", seats: 120 }
    ],
    placement: { year: 2024, highestPackage: 75.0, averagePackage: 20.6, medianPackage: 17.2, placementRate: 91.0, topRecruiters: "Uber, Google, Samsung R&D, Amazon, Wells Fargo, Cisco" },
    facilities: ["BHU Sprawling Green Campus", "Vishwanath Temple inside campus", "Main Library", "Hostels", "Gymkhana"],
    reviews: [
      { reviewerName: "Abhishek Singh", rating: 4.6, title: "Century-old heritage with outstanding coding culture", pros: "Active competitive programming culture, rich BHU traditions, loyal alumni.", cons: "Open campus means external traffic passes through.", courseName: "B.Tech CSE", batchYear: "2024" }
    ]
  },
  {
    slug: "ashoka-university",
    name: "Ashoka University",
    shortName: "Ashoka",
    overview: "Ashoka University is India's leading liberal arts and sciences private university located in Sonipat, NCR. It emphasizes multidisciplinary inquiry, critical thinking, world-class international faculty, and cutting-edge biosciences.",
    establishedYear: 2014,
    collegeType: "Arts & Science",
    ownership: "Private",
    affiliation: "Private UGC Recognized University",
    accreditation: "NAAC A / Top Liberal Arts University",
    rating: 4.7,
    reviewCount: 160,
    minFees: 850000,
    maxFees: 1050000,
    city: "Sonipat",
    state: "Delhi",
    address: "Plot No. 2, Rajiv Gandhi Education City, Sonipat, NCR 131029",
    website: "https://www.ashoka.edu.in",
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
    courses: [
      { courseCode: "BA_ECON", annualFees: 920000, eligibility: "10+2 + Ashoka Aptitude Assessment + Interview", seats: 150 },
      { courseCode: "BSC_CS", annualFees: 920000, eligibility: "10+2 with Math + Ashoka Assessment", seats: 100 }
    ],
    placement: { year: 2024, highestPackage: 30.0, averagePackage: 11.5, medianPackage: 10.0, placementRate: 88.0, topRecruiters: "McKinsey & Co, Boston Consulting Group, Bain Capability, Dalberg, Google" },
    facilities: ["Red Brick Campus", "24/7 Library", "Performing Arts Center", "Dining Hall & Cafes", "Modern Residence Halls"],
    reviews: [
      { reviewerName: "Rhea Sen", rating: 4.8, title: "Unparalleled liberal arts education and critical thinking", pros: "Global faculty, cross-disciplinary flexibility, incredible campus discussions.", cons: "Tuition is steep unless you secure need-based financial aid.", courseName: "B.A. Economics", batchYear: "2024" }
    ]
  }
];

// Generate additional 40 realistic colleges across India to hit 55+ total colleges
const additionalCollegesData = [
  { slug: "iit-guwahati", name: "Indian Institute of Technology Guwahati", shortName: "IIT Guwahati", city: "Guwahati", state: "Assam", type: "Engineering", ownership: "Public", rating: 4.7, minFees: 215000, maxFees: 245000, avgPkg: 21.0, highPkg: 70.0, courses: ["BTECH_CSE", "BTECH_ECE", "BDES"], acc: "NIRF #7 Engineering" },
  { slug: "iit-ropar", name: "Indian Institute of Technology Ropar", shortName: "IIT Ropar", city: "Rupnagar", state: "Punjab", type: "Engineering", ownership: "Public", rating: 4.5, minFees: 210000, maxFees: 235000, avgPkg: 18.5, highPkg: 62.0, courses: ["BTECH_CSE", "BTECH_EE"], acc: "NIRF #22 Engineering" },
  { slug: "iit-indore", name: "Indian Institute of Technology Indore", shortName: "IIT Indore", city: "Indore", state: "Madhya Pradesh", type: "Engineering", ownership: "Public", rating: 4.6, minFees: 210000, maxFees: 240000, avgPkg: 19.8, highPkg: 68.0, courses: ["BTECH_CSE", "BTECH_MECH"], acc: "NIRF #16 Engineering" },
  { slug: "iit-bhubaneswar", name: "Indian Institute of Technology Bhubaneswar", shortName: "IIT BBS", city: "Bhubaneswar", state: "Odisha", type: "Engineering", ownership: "Public", rating: 4.4, minFees: 205000, maxFees: 230000, avgPkg: 17.5, highPkg: 55.0, courses: ["BTECH_CSE", "BTECH_ECE"], acc: "NIRF #27 Engineering" },
  { slug: "iit-gandhinagar", name: "Indian Institute of Technology Gandhinagar", shortName: "IITGN", city: "Gandhinagar", state: "Gujarat", type: "Engineering", ownership: "Public", rating: 4.6, minFees: 210000, maxFees: 240000, avgPkg: 18.2, highPkg: 60.0, courses: ["BTECH_CSE", "BTECH_AI_DS"], acc: "NIRF #18 Engineering" },
  { slug: "iim-lucknow", name: "Indian Institute of Management Lucknow", shortName: "IIM Lucknow", city: "Lucknow", state: "Uttar Pradesh", type: "Management", ownership: "Public", rating: 4.8, minFees: 1050000, maxFees: 1250000, avgPkg: 31.5, highPkg: 72.0, courses: ["MBA_GEN", "MBA_BA"], acc: "NIRF #7 Management" },
  { slug: "iim-kozhikode", name: "Indian Institute of Management Kozhikode", shortName: "IIMK", city: "Kozhikode", state: "Kerala", type: "Management", ownership: "Public", rating: 4.8, minFees: 1100000, maxFees: 1300000, avgPkg: 31.0, highPkg: 67.0, courses: ["MBA_GEN", "MBA_FIN"], acc: "NIRF #3 Management" },
  { slug: "iim-indore", name: "Indian Institute of Management Indore", shortName: "IIM Indore", city: "Indore", state: "Madhya Pradesh", type: "Management", ownership: "Public", rating: 4.7, minFees: 1000000, maxFees: 1200000, avgPkg: 28.5, highPkg: 65.0, courses: ["MBA_GEN"], acc: "NIRF #8 Management" },
  { slug: "fms-delhi", name: "Faculty of Management Studies University of Delhi", shortName: "FMS Delhi", city: "New Delhi", state: "Delhi", type: "Management", ownership: "Public", rating: 4.9, minFees: 100000, maxFees: 120000, avgPkg: 34.1, highPkg: 75.0, courses: ["MBA_GEN", "MBA_FIN"], acc: "Best ROI B-School" },
  { slug: "xlri-jamshedpur", name: "XLRI Xavier School of Management", shortName: "XLRI", city: "Jamshedpur", state: "Jharkhand", type: "Management", ownership: "Private", rating: 4.9, minFees: 1350000, maxFees: 1550000, avgPkg: 32.7, highPkg: 78.0, courses: ["MBA_GEN"], acc: "NIRF #9 Management" },
  { slug: "spjimr-mumbai", name: "SP Jain Institute of Management and Research", shortName: "SPJIMR", city: "Mumbai", state: "Maharashtra", type: "Management", ownership: "Private", rating: 4.8, minFees: 1150000, maxFees: 1350000, avgPkg: 33.0, highPkg: 77.0, courses: ["MBA_GEN", "MBA_BA"], acc: "Top 5 Private B-School" },
  { slug: "nit-trichy", name: "National Institute of Technology Tiruchirappalli", shortName: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", type: "Engineering", ownership: "Public", rating: 4.7, minFees: 140000, maxFees: 180000, avgPkg: 15.5, highPkg: 52.0, courses: ["BTECH_CSE", "BTECH_ECE", "BTECH_MECH"], acc: "NIRF #9 Engineering" },
  { slug: "nit-surathkal", name: "National Institute of Technology Karnataka Surathkal", shortName: "NITK", city: "Mangaluru", state: "Karnataka", type: "Engineering", ownership: "Public", rating: 4.7, minFees: 145000, maxFees: 185000, avgPkg: 16.0, highPkg: 54.0, courses: ["BTECH_CSE", "BTECH_AI_DS"], acc: "NIRF #12 Engineering" },
  { slug: "nit-warangal", name: "National Institute of Technology Warangal", shortName: "NITW", city: "Warangal", state: "Telangana", type: "Engineering", ownership: "Public", rating: 4.6, minFees: 140000, maxFees: 180000, avgPkg: 15.2, highPkg: 50.0, courses: ["BTECH_CSE", "BTECH_EE"], acc: "NIRF #21 Engineering" },
  { slug: "iiit-hyderabad", name: "International Institute of Information Technology Hyderabad", shortName: "IIIT-H", city: "Hyderabad", state: "Telangana", type: "Engineering", ownership: "Private", rating: 4.9, minFees: 380000, maxFees: 430000, avgPkg: 32.0, highPkg: 74.0, courses: ["BTECH_CSE", "BTECH_ECE"], acc: "Top Coding Institute in Asia" },
  { slug: "iiit-delhi", name: "Indraprastha Institute of Information Technology Delhi", shortName: "IIIT-D", city: "New Delhi", state: "Delhi", type: "Engineering", ownership: "Public", rating: 4.7, minFees: 410000, maxFees: 460000, avgPkg: 23.7, highPkg: 58.0, courses: ["BTECH_CSE", "BTECH_AI_DS"], acc: "NIRF #75 / State Autonomous" },
  { slug: "dtu-delhi", name: "Delhi Technological University", shortName: "DTU", city: "New Delhi", state: "Delhi", type: "Engineering", ownership: "Public", rating: 4.6, minFees: 190000, maxFees: 230000, avgPkg: 15.8, highPkg: 64.0, courses: ["BTECH_CSE", "BTECH_MECH", "BTECH_ECE"], acc: "Formerly DCE" },
  { slug: "nsut-delhi", name: "Netaji Subhas University of Technology", shortName: "NSUT", city: "New Delhi", state: "Delhi", type: "Engineering", ownership: "Public", rating: 4.5, minFees: 185000, maxFees: 225000, avgPkg: 15.0, highPkg: 60.0, courses: ["BTECH_CSE", "BTECH_AI_DS"], acc: "State University" },
  { slug: "thapar-patiala", name: "Thapar Institute of Engineering and Technology", shortName: "TIET Thapar", city: "Patiala", state: "Punjab", type: "Engineering", ownership: "Private", rating: 4.4, minFees: 450000, maxFees: 520000, avgPkg: 11.5, highPkg: 45.0, courses: ["BTECH_CSE", "BTECH_ECE"], acc: "NAAC A+ / NIRF #24" },
  { slug: "jadavpur-university", name: "Jadavpur University Faculty of Engineering", shortName: "JU Kolkata", city: "Kolkata", state: "West Bengal", type: "Engineering", ownership: "Public", rating: 4.7, minFees: 10000, maxFees: 25000, avgPkg: 14.8, highPkg: 58.0, courses: ["BTECH_CSE", "BTECH_EE"], acc: "NIRF #10 Overall" },
  { slug: "coep-pune", name: "College of Engineering Pune", shortName: "COEP", city: "Pune", state: "Maharashtra", type: "Engineering", ownership: "Public", rating: 4.6, minFees: 120000, maxFees: 150000, avgPkg: 12.5, highPkg: 48.0, courses: ["BTECH_CSE", "BTECH_MECH"], acc: "Established 1854" },
  { slug: "vjti-mumbai", name: "Veermata Jijabai Technological Institute", shortName: "VJTI", city: "Mumbai", state: "Maharashtra", type: "Engineering", ownership: "Public", rating: 4.6, minFees: 90000, maxFees: 120000, avgPkg: 13.2, highPkg: 50.0, courses: ["BTECH_CSE", "BTECH_ECE"], acc: "Autonomous Mumbai" },
  { slug: "rvce-bengaluru", name: "R.V. College of Engineering", shortName: "RVCE", city: "Bengaluru", state: "Karnataka", type: "Engineering", ownership: "Private", rating: 4.6, minFees: 250000, maxFees: 450000, avgPkg: 14.5, highPkg: 53.0, courses: ["BTECH_CSE", "BTECH_AI_DS"], acc: "Top VTU Private College" },
  { slug: "pes-university", name: "PES University", shortName: "PESU", city: "Bengaluru", state: "Karnataka", type: "Engineering", ownership: "Private", rating: 4.4, minFees: 420000, maxFees: 480000, avgPkg: 12.0, highPkg: 47.0, courses: ["BTECH_CSE", "BTECH_ECE"], acc: "State Private University" },
  { slug: "bmsce-bengaluru", name: "B.M.S. College of Engineering", shortName: "BMSCE", city: "Bengaluru", state: "Karnataka", type: "Engineering", ownership: "Private", rating: 4.5, minFees: 240000, maxFees: 420000, avgPkg: 11.8, highPkg: 48.0, courses: ["BTECH_CSE", "BTECH_MECH"], acc: "NAAC A++" },
  { slug: "msrit-bengaluru", name: "Ramaiah Institute of Technology", shortName: "MSRIT", city: "Bengaluru", state: "Karnataka", type: "Engineering", ownership: "Private", rating: 4.4, minFees: 230000, maxFees: 400000, avgPkg: 11.2, highPkg: 46.0, courses: ["BTECH_CSE", "BTECH_EE"], acc: "NAAC A+" },
  { slug: "srm-chennai", name: "SRM Institute of Science and Technology", shortName: "SRM Kattankulathur", city: "Chennai", state: "Tamil Nadu", type: "Engineering", ownership: "Private", rating: 4.3, minFees: 280000, maxFees: 450000, avgPkg: 9.5, highPkg: 44.0, courses: ["BTECH_CSE", "BTECH_AI_DS"], acc: "NAAC A++" },
  { slug: "psg-tech-coimbatore", name: "PSG College of Technology", shortName: "PSG Tech", city: "Coimbatore", state: "Tamil Nadu", type: "Engineering", ownership: "Public", rating: 4.6, minFees: 80000, maxFees: 120000, avgPkg: 12.0, highPkg: 42.0, courses: ["BTECH_CSE", "BTECH_MECH"], acc: "Autonomous Tamil Nadu" },
  { slug: "ssn-chennai", name: "Sri Sivasubramaniya Nadar College of Engineering", shortName: "SSN", city: "Chennai", state: "Tamil Nadu", type: "Engineering", ownership: "Private", rating: 4.5, minFees: 150000, maxFees: 200000, avgPkg: 10.8, highPkg: 40.0, courses: ["BTECH_CSE", "BTECH_ECE"], acc: "Founded by Shiv Nadar" },
  { slug: "sastra-thanjavur", name: "SASTRA Deemed University", shortName: "SASTRA", city: "Thanjavur", state: "Tamil Nadu", type: "Engineering", ownership: "Private", rating: 4.5, minFees: 160000, maxFees: 210000, avgPkg: 10.5, highPkg: 38.0, courses: ["BTECH_CSE", "BALLB"], acc: "NAAC A+++" },
  { slug: "st-stephens-delhi", name: "St. Stephen's College", shortName: "St. Stephen's", city: "New Delhi", state: "Delhi", type: "Arts & Science", ownership: "Public", rating: 4.8, minFees: 40000, maxFees: 55000, avgPkg: 11.5, highPkg: 32.0, courses: ["BA_ECON", "BSC_CS"], acc: "NIRF #14 Colleges" },
  { slug: "hindu-college-delhi", name: "Hindu College University of Delhi", shortName: "Hindu College", city: "New Delhi", state: "Delhi", type: "Arts & Science", ownership: "Public", rating: 4.9, minFees: 25000, maxFees: 35000, avgPkg: 11.2, highPkg: 34.0, courses: ["BA_ECON", "BSC_CS"], acc: "NIRF #1 Colleges 2024" },
  { slug: "miranda-house-delhi", name: "Miranda House University of Delhi", shortName: "Miranda House", city: "New Delhi", state: "Delhi", type: "Arts & Science", ownership: "Public", rating: 4.9, minFees: 20000, maxFees: 30000, avgPkg: 10.5, highPkg: 28.0, courses: ["BA_ECON", "BSC_CS"], acc: "NIRF #2 Colleges 2024" },
  { slug: "loyola-college-chennai", name: "Loyola College Chennai", shortName: "Loyola", city: "Chennai", state: "Tamil Nadu", type: "Arts & Science", ownership: "Private", rating: 4.7, minFees: 45000, maxFees: 75000, avgPkg: 8.8, highPkg: 25.0, courses: ["BA_ECON", "BSC_CS"], acc: "NIRF #8 Colleges" },
  { slug: "st-xaviers-mumbai", name: "St. Xavier's College Mumbai", shortName: "St. Xavier's", city: "Mumbai", state: "Maharashtra", type: "Arts & Science", ownership: "Private", rating: 4.7, minFees: 35000, maxFees: 60000, avgPkg: 9.0, highPkg: 26.0, courses: ["BA_ECON", "BSC_CS"], acc: "Heritage College" },
  { slug: "christ-university-bengaluru", name: "Christ (Deemed to be University)", shortName: "Christ University", city: "Bengaluru", state: "Karnataka", type: "Arts & Science", ownership: "Private", rating: 4.4, minFees: 180000, maxFees: 290000, avgPkg: 7.8, highPkg: 22.0, courses: ["BA_ECON", "BALLB", "MBA_GEN"], acc: "NAAC A+" },
  { slug: "nalsar-hyderabad", name: "NALSAR University of Law", shortName: "NALSAR", city: "Hyderabad", state: "Telangana", type: "Law", ownership: "Public", rating: 4.8, minFees: 280000, maxFees: 340000, avgPkg: 16.0, highPkg: 22.0, courses: ["BALLB"], acc: "NIRF #3 Law 2024" },
  { slug: "nujs-kolkata", name: "The West Bengal National University of Juridical Sciences", shortName: "WBNUJS", city: "Kolkata", state: "West Bengal", type: "Law", ownership: "Public", rating: 4.7, minFees: 270000, maxFees: 330000, avgPkg: 15.5, highPkg: 22.0, courses: ["BALLB"], acc: "NIRF #4 Law 2024" },
  { slug: "nlu-delhi", name: "National Law University Delhi", shortName: "NLU Delhi", city: "New Delhi", state: "Delhi", type: "Law", ownership: "Public", rating: 4.9, minFees: 290000, maxFees: 350000, avgPkg: 16.2, highPkg: 23.0, courses: ["BALLB"], acc: "NIRF #2 Law 2024 / AILET" },
  { slug: "jipmer-puducherry", name: "Jawaharlal Institute of Postgraduate Medical Education & Research", shortName: "JIPMER", city: "Puducherry", state: "Puducherry", type: "Medical", ownership: "Public", rating: 4.8, minFees: 12000, maxFees: 25000, avgPkg: 18.0, highPkg: 32.0, courses: ["MBBS", "MD_GEN"], acc: "NIRF #5 Medical" }
];

async function main() {
  console.log("Starting database cleanup and seeding...");

  // Clean existing records in reverse dependency order
  await prisma.savedCollege.deleteMany({});
  await prisma.facility.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.collegeCourse.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Creating standard demo user...");
  const hashedPassword = await bcrypt.hash("Password123", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "student@example.com",
      name: "Rahul Sharma",
      passwordHash: hashedPassword,
      role: "student",
    },
  });

  console.log("Seeding Master Courses...");
  const courseMap = new Map<string, string>();
  for (const c of coursesData) {
    const created = await prisma.course.create({
      data: c,
    });
    courseMap.set(c.code, created.id);
  }

  console.log("Seeding Tier-1 Detailed Colleges...");
  for (const c of rawColleges) {
    const college = await prisma.college.create({
      data: {
        slug: c.slug,
        name: c.name,
        shortName: c.shortName,
        overview: c.overview,
        establishedYear: c.establishedYear,
        collegeType: c.collegeType,
        ownership: c.ownership,
        affiliation: c.affiliation,
        accreditation: c.accreditation,
        rating: c.rating,
        reviewCount: c.reviewCount,
        minFees: c.minFees,
        maxFees: c.maxFees,
        city: c.city,
        state: c.state,
        address: c.address,
        website: c.website,
        logoUrl: c.logoUrl,
        bannerUrl: c.bannerUrl,
      },
    });

    // Seed college courses
    for (const courseItem of c.courses) {
      const courseId = courseMap.get(courseItem.courseCode);
      if (courseId) {
        await prisma.collegeCourse.create({
          data: {
            collegeId: college.id,
            courseId: courseId,
            annualFees: courseItem.annualFees,
            eligibility: courseItem.eligibility,
            seats: courseItem.seats,
          },
        });
      }
    }

    // Seed placement
    await prisma.placement.create({
      data: {
        collegeId: college.id,
        year: c.placement.year,
        highestPackage: c.placement.highestPackage,
        averagePackage: c.placement.averagePackage,
        medianPackage: c.placement.medianPackage,
        placementRate: c.placement.placementRate,
        topRecruiters: c.placement.topRecruiters,
      },
    });

    // Seed facilities
    for (const fac of c.facilities) {
      await prisma.facility.create({
        data: {
          collegeId: college.id,
          name: fac,
          icon: fac.toLowerCase().replace(/\s+/g, "-"),
          description: `State of the art ${fac} facility maintained at international standards.`,
        },
      });
    }

    // Seed reviews
    for (const rev of c.reviews) {
      await prisma.review.create({
        data: {
          collegeId: college.id,
          reviewerName: rev.reviewerName,
          rating: rev.rating,
          title: rev.title,
          pros: rev.pros,
          cons: rev.cons,
          courseName: rev.courseName,
          batchYear: rev.batchYear,
          verifiedStudent: true,
        },
      });
    }
  }

  console.log("Seeding Additional 40 National Premier Colleges...");
  for (const c of additionalCollegesData) {
    const college = await prisma.college.create({
      data: {
        slug: c.slug,
        name: c.name,
        shortName: c.shortName,
        overview: `${c.name} is one of the premier institutions in ${c.city}, ${c.state}. It is widely recognized for excellence in ${c.type.toLowerCase()} education, research, distinguished alumni, and robust industry campus placements.`,
        establishedYear: 1960 + Math.floor(Math.random() * 45),
        collegeType: c.type,
        ownership: c.ownership,
        affiliation: c.ownership === "Public" ? "Autonomous / Central / State University" : "Deemed / Recognized University",
        accreditation: c.acc,
        rating: c.rating,
        reviewCount: Math.floor(100 + Math.random() * 250),
        minFees: c.minFees,
        maxFees: c.maxFees,
        city: c.city,
        state: c.state,
        address: `${c.name} Campus, ${c.city}, ${c.state}`,
        website: `https://${c.slug}.ac.in`,
        logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      },
    });

    // Associate courses
    for (const code of c.courses) {
      const courseId = courseMap.get(code);
      if (courseId) {
        await prisma.collegeCourse.create({
          data: {
            collegeId: college.id,
            courseId: courseId,
            annualFees: Math.round((c.minFees + c.maxFees) / 2),
            eligibility: "Merit-based admission via national entrance examination or 10+2 scores",
            seats: 60 + Math.floor(Math.random() * 60),
          },
        });
      }
    }

    // Seed placement
    await prisma.placement.create({
      data: {
        collegeId: college.id,
        year: 2024,
        highestPackage: c.highPkg,
        averagePackage: c.avgPkg,
        medianPackage: Math.round(c.avgPkg * 0.85 * 10) / 10,
        placementRate: 85.0 + Math.floor(Math.random() * 12),
        topRecruiters: "Microsoft, Amazon, TCS, Infosys, Deloitte, Accenture, Cognizant, Ernst & Young",
      },
    });

    // Seed standard facilities
    const defaultFacilities = ["Library", "Wi-Fi Campus", "Hostels", "Sports Ground", "Modern Labs", "Cafeteria"];
    for (const fac of defaultFacilities) {
      await prisma.facility.create({
        data: {
          collegeId: college.id,
          name: fac,
          icon: fac.toLowerCase().replace(/\s+/g, "-"),
          description: `${fac} equipped with modern amenities.`,
        },
      });
    }

    // Seed 1-2 realistic reviews
    await prisma.review.create({
      data: {
        collegeId: college.id,
        reviewerName: `Alumnus (${c.city})`,
        rating: c.rating,
        title: `Comprehensive educational experience at ${c.shortName}`,
        pros: "Knowledgeable faculty, supportive peer atmosphere, active college fests and technical clubs.",
        cons: "Campus administration processes can take time during peak admissions.",
        courseName: c.type === "Engineering" ? "B.Tech" : c.type === "Management" ? "MBA" : "Undergraduate",
        batchYear: "2023",
        verifiedStudent: true,
      },
    });
  }

  // Pre-seed 2 saved colleges for demoUser
  const firstCollege = await prisma.college.findUnique({ where: { slug: "iit-bombay" } });
  const secondCollege = await prisma.college.findUnique({ where: { slug: "iim-ahmedabad" } });
  if (firstCollege) {
    await prisma.savedCollege.create({
      data: {
        userId: demoUser.id,
        collegeId: firstCollege.id,
      },
    });
  }
  if (secondCollege) {
    await prisma.savedCollege.create({
      data: {
        userId: demoUser.id,
        collegeId: secondCollege.id,
      },
    });
  }

  const totalColleges = await prisma.college.count();
  console.log(`Successfully seeded ${totalColleges} colleges, along with courses, placements, facilities, reviews, and test user!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
