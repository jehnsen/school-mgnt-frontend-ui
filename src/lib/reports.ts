/*
  Report/document data for Akademya360.

  Akademya360 is modeled as an integrated institution, so it issues both:
   - a collegiate Transcript of Records (1.00–5.00 system), and
   - DepEd basic-education School Forms:
       SF9 (formerly Form 138) — Learner's Progress Report Card
       SF10 (formerly Form 137) — Learner's Permanent Academic Record

  DepEd K-12 grading reference used below:
    90–100  Outstanding              (O)
    85–89   Very Satisfactory        (VS)
    80–84   Satisfactory             (S)
    75–79   Fairly Satisfactory      (FS)
    < 75    Did Not Meet Expectations(DNME)
    Passing grade = 75
*/

/* ----------------------------- Institution ----------------------------- */

export const institution = {
  name: "AKADEMYA360 INTEGRATED SCHOOL",
  region: "Region IV-A (CALABARZON)",
  division: "Division of Calamba City",
  district: "District III",
  schoolId: "305412",
  address: "123 Mabini Street, Calamba City, Laguna",
  registrar: "Dr. Elena Marquez",
  principal: "Dr. Ricardo Salonga",
};

/* ----------------------- DepEd grade descriptor ------------------------ */

export function gradeDescriptor(grade: number) {
  if (grade >= 90) return { label: "Outstanding", short: "O", tone: "success" as const };
  if (grade >= 85) return { label: "Very Satisfactory", short: "VS", tone: "brand" as const };
  if (grade >= 80) return { label: "Satisfactory", short: "S", tone: "info" as const };
  if (grade >= 75) return { label: "Fairly Satisfactory", short: "FS", tone: "warning" as const };
  return { label: "Did Not Meet Expectations", short: "DNME", tone: "danger" as const };
}

export const avg = (nums: number[]) =>
  Math.round(nums.reduce((s, n) => s + n, 0) / nums.length);

/* ============================================================ */
/*  TRANSCRIPT OF RECORDS (collegiate)                          */
/* ============================================================ */

export interface TorSubject {
  code: string;
  title: string;
  units: number;
  grade: string; // 1.00–5.00 PH system
  credit: number;
}

export interface TorTerm {
  schoolYear: string;
  semester: string;
  subjects: TorSubject[];
}

export const transcript = {
  student: {
    name: "ANDREA M. SALCEDO",
    studentNo: "2026-00184",
    program: "Bachelor of Science in Computer Science",
    dateOfBirth: "March 21, 2004",
    placeOfBirth: "Calamba City, Laguna",
    sex: "Female",
    dateAdmitted: "August 2022",
    dateGraduated: "—",
    entranceCredentials: "Form 138 (SHS Report Card), STEM Strand",
  },
  terms: [
    {
      schoolYear: "2022–2023",
      semester: "First Semester",
      subjects: [
        { code: "GE 101", title: "Understanding the Self", units: 3, grade: "1.50", credit: 3 },
        { code: "CS 101", title: "Introduction to Computing", units: 3, grade: "1.25", credit: 3 },
        { code: "CS 102", title: "Computer Programming I", units: 3, grade: "1.50", credit: 3 },
        { code: "MATH 101", title: "Calculus I", units: 3, grade: "1.75", credit: 3 },
        { code: "FIL 101", title: "Kontekstwalisadong Komunikasyon", units: 3, grade: "1.25", credit: 3 },
        { code: "PE 101", title: "Physical Fitness", units: 2, grade: "1.00", credit: 2 },
      ],
    },
    {
      schoolYear: "2022–2023",
      semester: "Second Semester",
      subjects: [
        { code: "CS 103", title: "Computer Programming II", units: 3, grade: "1.50", credit: 3 },
        { code: "CS 221", title: "Data Structures & Algorithms", units: 3, grade: "1.75", credit: 3 },
        { code: "MATH 102", title: "Calculus II", units: 3, grade: "2.00", credit: 3 },
        { code: "GE 102", title: "Readings in Philippine History", units: 3, grade: "1.50", credit: 3 },
        { code: "MATH 201", title: "Discrete Mathematics", units: 3, grade: "1.75", credit: 3 },
        { code: "PE 102", title: "Rhythmic Activities", units: 2, grade: "1.25", credit: 2 },
      ],
    },
    {
      schoolYear: "2023–2024",
      semester: "First Semester",
      subjects: [
        { code: "CS 211", title: "Object-Oriented Programming", units: 3, grade: "1.25", credit: 3 },
        { code: "CS 231", title: "Information Management", units: 3, grade: "1.50", credit: 3 },
        { code: "CS 241", title: "Computer Organization", units: 3, grade: "1.75", credit: 3 },
        { code: "GE 103", title: "The Contemporary World", units: 3, grade: "1.50", credit: 3 },
        { code: "STAT 201", title: "Probability & Statistics", units: 3, grade: "1.75", credit: 3 },
      ],
    },
    {
      schoolYear: "2023–2024",
      semester: "Second Semester",
      subjects: [
        { code: "CS 311", title: "Design & Analysis of Algorithms", units: 3, grade: "1.50", credit: 3 },
        { code: "CS 321", title: "Operating Systems", units: 3, grade: "1.75", credit: 3 },
        { code: "CS 331", title: "Software Engineering", units: 3, grade: "1.25", credit: 3 },
        { code: "CS 341", title: "Computer Networks", units: 3, grade: "1.50", credit: 3 },
        { code: "GE 104", title: "Ethics", units: 3, grade: "1.25", credit: 3 },
      ],
    },
  ] satisfies TorTerm[],
};

/* ============================================================ */
/*  SF9 — LEARNER'S PROGRESS REPORT CARD (Form 138)            */
/* ============================================================ */

export interface LearningArea {
  area: string;
  q: [number, number, number, number];
  components?: { name: string; q: [number, number, number, number] }[];
}

export const reportCard = {
  learner: {
    name: "SALCEDO, ANDREA MENDOZA",
    lrn: "136548120093",
    grade: "Grade 10",
    section: "Rizal",
    schoolYear: "2019–2020",
    adviser: "Mrs. Carmela B. Lopez",
    age: 15,
    sex: "Female",
  },
  learningAreas: [
    { area: "Filipino", q: [88, 90, 89, 91] },
    { area: "English", q: [91, 92, 90, 93] },
    { area: "Mathematics", q: [89, 87, 90, 92] },
    { area: "Science", q: [90, 91, 92, 93] },
    { area: "Araling Panlipunan", q: [90, 89, 91, 90] },
    { area: "Edukasyon sa Pagpapakatao", q: [92, 93, 91, 94] },
    { area: "Technology and Livelihood Education (TLE)", q: [90, 91, 92, 91] },
    {
      area: "MAPEH",
      q: [89, 90, 90, 91],
      components: [
        { name: "Music", q: [90, 91, 90, 92] },
        { name: "Arts", q: [88, 90, 91, 90] },
        { name: "Physical Education", q: [90, 89, 91, 92] },
        { name: "Health", q: [89, 90, 89, 91] },
      ],
    },
  ] satisfies LearningArea[],
  coreValues: [
    {
      value: "1. Maka-Diyos",
      statements: [
        "Expresses one's spiritual beliefs while respecting the spiritual beliefs of others.",
        "Shows adherence to ethical principles by upholding truth.",
      ],
      marks: ["AO", "AO", "AO", "AO"] as const,
    },
    {
      value: "2. Makatao",
      statements: [
        "Is sensitive to individual, social, and cultural differences.",
        "Demonstrates contributions toward solidarity.",
      ],
      marks: ["AO", "SO", "AO", "AO"] as const,
    },
    {
      value: "3. Makakalikasan",
      statements: ["Cares for the environment and utilizes resources wisely, judiciously, and economically."],
      marks: ["AO", "AO", "AO", "SO"] as const,
    },
    {
      value: "4. Makabansa",
      statements: [
        "Demonstrates pride in being a Filipino; exercises the rights and responsibilities of a Filipino citizen.",
        "Demonstrates appropriate behavior in carrying out activities in school, community, and country.",
      ],
      marks: ["AO", "AO", "SO", "AO"] as const,
    },
  ],
  attendance: [
    { month: "Aug", days: 22, present: 22, absent: 0 },
    { month: "Sep", days: 20, present: 20, absent: 0 },
    { month: "Oct", days: 21, present: 20, absent: 1 },
    { month: "Nov", days: 19, present: 19, absent: 0 },
    { month: "Dec", days: 15, present: 15, absent: 0 },
    { month: "Jan", days: 21, present: 21, absent: 0 },
    { month: "Feb", days: 20, present: 19, absent: 1 },
    { month: "Mar", days: 22, present: 22, absent: 0 },
  ],
};

/* ============================================================ */
/*  SF10 — LEARNER'S PERMANENT ACADEMIC RECORD (Form 137)     */
/* ============================================================ */

export interface ScholasticRecord {
  gradeLevel: string;
  schoolYear: string;
  section: string;
  adviser: string;
  areas: { area: string; q: [number, number, number, number] }[];
  actionTaken: string;
}

export const permanentRecord = {
  learner: {
    name: "SALCEDO, ANDREA MENDOZA",
    lrn: "136548120093",
    dateOfBirth: "March 21, 2004",
    sex: "Female",
    placeOfBirth: "Calamba City, Laguna",
    motherTongue: "Tagalog",
    parentGuardian: "Mr. & Mrs. Roberto Salcedo",
  },
  eligibility: {
    type: "Junior High School Completer",
    school: "Akademya360 Integrated School",
    schoolId: "305412",
    schoolYear: "2019–2020",
    gradeCompleted: "Grade 10",
  },
  records: [
    {
      gradeLevel: "Grade 9",
      schoolYear: "2018–2019",
      section: "Bonifacio",
      adviser: "Mr. Antonio R. Cruz",
      areas: [
        { area: "Filipino", q: [87, 88, 89, 88] },
        { area: "English", q: [90, 89, 91, 90] },
        { area: "Mathematics", q: [88, 89, 87, 90] },
        { area: "Science", q: [89, 90, 91, 90] },
        { area: "Araling Panlipunan", q: [88, 89, 90, 89] },
        { area: "Edukasyon sa Pagpapakatao", q: [91, 92, 90, 93] },
        { area: "TLE", q: [89, 90, 91, 90] },
        { area: "MAPEH", q: [88, 89, 90, 90] },
      ],
      actionTaken: "Promoted to Grade 10",
    },
    {
      gradeLevel: "Grade 10",
      schoolYear: "2019–2020",
      section: "Rizal",
      adviser: "Mrs. Carmela B. Lopez",
      areas: [
        { area: "Filipino", q: [88, 90, 89, 91] },
        { area: "English", q: [91, 92, 90, 93] },
        { area: "Mathematics", q: [89, 87, 90, 92] },
        { area: "Science", q: [90, 91, 92, 93] },
        { area: "Araling Panlipunan", q: [90, 89, 91, 90] },
        { area: "Edukasyon sa Pagpapakatao", q: [92, 93, 91, 94] },
        { area: "TLE", q: [90, 91, 92, 91] },
        { area: "MAPEH", q: [89, 90, 90, 91] },
      ],
      actionTaken: "Promoted / JHS Completer",
    },
  ] satisfies ScholasticRecord[],
};
