/*
  Mock data layer for Akademya360.
  Frontend-only — all data lives here so module pages can render realistic UI
  without a backend. Types are exported for reuse across components.
*/

export type StudentStatus = "Enrolled" | "Irregular" | "Pending" | "Not Enrolled";
export type GradeStatus = "Posted" | "Draft" | "Incomplete";
export type DocStatus = "Released" | "Processing" | "Requested" | "On Hold";

export interface Student {
  id: string;
  name: string;
  program: string;
  yearLevel: number;
  section: string;
  type: "Regular" | "Irregular";
  status: StudentStatus;
  gpa: number;
  units: number;
  email: string;
  avatarColor: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  rank: string;
  loadUnits: number;
  maxUnits: number;
  sections: number;
  email: string;
  avatarColor: string;
}

export interface Course {
  code: string;
  title: string;
  units: number;
  program: string;
  yearLevel: number;
  semester: string;
  prerequisite?: string;
  slots: number;
  enrolled: number;
  schedule: string;
  room: string;
  faculty: string;
}

export interface GradeRow {
  studentId: string;
  studentName: string;
  course: string;
  prelim: number | null;
  midterm: number | null;
  finals: number | null;
  status: GradeStatus;
}

export interface DocumentRequest {
  id: string;
  student: string;
  type: string;
  purpose: string;
  requested: string;
  status: DocStatus;
  copies: number;
}

const colors = [
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#0ea5e9",
  "#f43f5e",
  "#14b8a6",
];
const color = (i: number) => colors[i % colors.length];

export const programs = [
  "BS Computer Science",
  "BS Information Technology",
  "BS Accountancy",
  "BS Business Administration",
  "BS Nursing",
  "BS Civil Engineering",
  "BS Psychology",
  "BS Education",
];

export const students: Student[] = [
  { id: "2026-00184", name: "Andrea Salcedo", program: "BS Computer Science", yearLevel: 3, section: "CS-3A", type: "Regular", status: "Enrolled", gpa: 1.45, units: 21, email: "a.salcedo@akademya.edu", avatarColor: color(0) },
  { id: "2026-00231", name: "Marcus Villanueva", program: "BS Information Technology", yearLevel: 2, section: "IT-2B", type: "Irregular", status: "Irregular", gpa: 1.92, units: 15, email: "m.villanueva@akademya.edu", avatarColor: color(1) },
  { id: "2026-00097", name: "Patricia Lim", program: "BS Accountancy", yearLevel: 4, section: "ACT-4A", type: "Regular", status: "Enrolled", gpa: 1.28, units: 24, email: "p.lim@akademya.edu", avatarColor: color(2) },
  { id: "2026-00312", name: "Joshua Reyes", program: "BS Civil Engineering", yearLevel: 1, section: "CE-1C", type: "Regular", status: "Pending", gpa: 0, units: 0, email: "j.reyes@akademya.edu", avatarColor: color(3) },
  { id: "2026-00056", name: "Bianca Tan", program: "BS Nursing", yearLevel: 3, section: "NUR-3A", type: "Regular", status: "Enrolled", gpa: 1.67, units: 22, email: "b.tan@akademya.edu", avatarColor: color(4) },
  { id: "2026-00408", name: "Rafael Mendoza", program: "BS Computer Science", yearLevel: 2, section: "CS-2A", type: "Irregular", status: "Irregular", gpa: 2.15, units: 18, email: "r.mendoza@akademya.edu", avatarColor: color(5) },
  { id: "2026-00123", name: "Kristine Aquino", program: "BS Psychology", yearLevel: 4, section: "PSY-4B", type: "Regular", status: "Enrolled", gpa: 1.51, units: 21, email: "k.aquino@akademya.edu", avatarColor: color(6) },
  { id: "2026-00367", name: "Daniel Cruz", program: "BS Business Administration", yearLevel: 1, section: "BA-1A", type: "Regular", status: "Not Enrolled", gpa: 0, units: 0, email: "d.cruz@akademya.edu", avatarColor: color(7) },
  { id: "2026-00289", name: "Sofia Ramos", program: "BS Education", yearLevel: 3, section: "EDU-3A", type: "Regular", status: "Enrolled", gpa: 1.39, units: 20, email: "s.ramos@akademya.edu", avatarColor: color(0) },
  { id: "2026-00445", name: "Gabriel Santos", program: "BS Information Technology", yearLevel: 4, section: "IT-4A", type: "Irregular", status: "Irregular", gpa: 1.88, units: 16, email: "g.santos@akademya.edu", avatarColor: color(1) },
  { id: "2026-00078", name: "Maria Delos Reyes", program: "BS Nursing", yearLevel: 2, section: "NUR-2B", type: "Regular", status: "Enrolled", gpa: 1.72, units: 23, email: "m.delosreyes@akademya.edu", avatarColor: color(2) },
  { id: "2026-00501", name: "Anton Bautista", program: "BS Computer Science", yearLevel: 1, section: "CS-1B", type: "Regular", status: "Pending", gpa: 0, units: 0, email: "a.bautista@akademya.edu", avatarColor: color(3) },
];

export const faculty: Faculty[] = [
  { id: "FAC-1042", name: "Dr. Elena Marquez", department: "Computer Science", rank: "Professor", loadUnits: 21, maxUnits: 24, sections: 5, email: "e.marquez@akademya.edu", avatarColor: color(0) },
  { id: "FAC-2087", name: "Prof. Ramon Castillo", department: "Information Technology", rank: "Assoc. Professor", loadUnits: 18, maxUnits: 24, sections: 4, email: "r.castillo@akademya.edu", avatarColor: color(1) },
  { id: "FAC-3310", name: "Dr. Cecilia Fonseca", department: "Accountancy", rank: "Professor", loadUnits: 24, maxUnits: 24, sections: 6, email: "c.fonseca@akademya.edu", avatarColor: color(2) },
  { id: "FAC-1188", name: "Prof. Miguel Torres", department: "Civil Engineering", rank: "Asst. Professor", loadUnits: 12, maxUnits: 21, sections: 3, email: "m.torres@akademya.edu", avatarColor: color(3) },
  { id: "FAC-4521", name: "Dr. Angela Pascual", department: "Nursing", rank: "Professor", loadUnits: 20, maxUnits: 24, sections: 5, email: "a.pascual@akademya.edu", avatarColor: color(4) },
  { id: "FAC-2904", name: "Prof. Victor Aguilar", department: "Business Admin", rank: "Instructor", loadUnits: 15, maxUnits: 21, sections: 4, email: "v.aguilar@akademya.edu", avatarColor: color(5) },
  { id: "FAC-3672", name: "Dr. Lourdes Gamboa", department: "Psychology", rank: "Assoc. Professor", loadUnits: 9, maxUnits: 21, sections: 2, email: "l.gamboa@akademya.edu", avatarColor: color(6) },
];

export const courses: Course[] = [
  { code: "CS 311", title: "Design & Analysis of Algorithms", units: 3, program: "BS Computer Science", yearLevel: 3, semester: "1st", prerequisite: "CS 221", slots: 40, enrolled: 38, schedule: "MWF 9:00–10:00", room: "Lab 4", faculty: "Dr. Elena Marquez" },
  { code: "CS 312", title: "Software Engineering", units: 3, program: "BS Computer Science", yearLevel: 3, semester: "1st", prerequisite: "CS 221", slots: 40, enrolled: 40, schedule: "TTh 10:30–12:00", room: "Rm 305", faculty: "Dr. Elena Marquez" },
  { code: "IT 241", title: "Web Systems & Technologies", units: 3, program: "BS Information Technology", yearLevel: 2, semester: "1st", slots: 45, enrolled: 31, schedule: "MWF 13:00–14:00", room: "Lab 2", faculty: "Prof. Ramon Castillo" },
  { code: "ACT 401", title: "Auditing & Assurance", units: 6, program: "BS Accountancy", yearLevel: 4, semester: "1st", prerequisite: "ACT 311", slots: 35, enrolled: 35, schedule: "MWF 8:00–10:00", room: "Rm 210", faculty: "Dr. Cecilia Fonseca" },
  { code: "CE 101", title: "Engineering Mechanics", units: 5, program: "BS Civil Engineering", yearLevel: 1, semester: "1st", slots: 50, enrolled: 47, schedule: "TTh 7:30–10:00", room: "Rm 118", faculty: "Prof. Miguel Torres" },
  { code: "NUR 301", title: "Medical-Surgical Nursing", units: 4, program: "BS Nursing", yearLevel: 3, semester: "1st", prerequisite: "NUR 201", slots: 40, enrolled: 39, schedule: "MWF 10:00–12:00", room: "Skills Lab", faculty: "Dr. Angela Pascual" },
  { code: "GE 105", title: "Purposive Communication", units: 3, program: "General Education", yearLevel: 1, semester: "1st", slots: 60, enrolled: 52, schedule: "TTh 14:30–16:00", room: "Rm 401", faculty: "Prof. Victor Aguilar" },
  { code: "PSY 412", title: "Psychological Assessment", units: 3, program: "BS Psychology", yearLevel: 4, semester: "1st", prerequisite: "PSY 311", slots: 35, enrolled: 28, schedule: "MWF 11:00–12:00", room: "Rm 502", faculty: "Dr. Lourdes Gamboa" },
];

export const gradeRows: GradeRow[] = [
  { studentId: "2026-00184", studentName: "Andrea Salcedo", course: "CS 311", prelim: 92, midterm: 95, finals: 94, status: "Posted" },
  { studentId: "2026-00408", studentName: "Rafael Mendoza", course: "CS 311", prelim: 84, midterm: 80, finals: 88, status: "Posted" },
  { studentId: "2026-00184", studentName: "Andrea Salcedo", course: "CS 312", prelim: 90, midterm: 88, finals: null, status: "Draft" },
  { studentId: "2026-00097", studentName: "Patricia Lim", course: "ACT 401", prelim: 96, midterm: 94, finals: 97, status: "Posted" },
  { studentId: "2026-00056", studentName: "Bianca Tan", course: "NUR 301", prelim: 88, midterm: 91, finals: 89, status: "Posted" },
  { studentId: "2026-00123", studentName: "Kristine Aquino", course: "PSY 412", prelim: 93, midterm: null, finals: null, status: "Draft" },
  { studentId: "2026-00231", studentName: "Marcus Villanueva", course: "IT 241", prelim: 78, midterm: 72, finals: null, status: "Incomplete" },
  { studentId: "2026-00445", studentName: "Gabriel Santos", course: "IT 241", prelim: 85, midterm: 87, finals: 83, status: "Posted" },
];

export const documentRequests: DocumentRequest[] = [
  { id: "DOC-90231", student: "Patricia Lim", type: "Transcript of Records", purpose: "Board Exam Application", requested: "Jun 06, 2026", status: "Processing", copies: 2 },
  { id: "DOC-90228", student: "Andrea Salcedo", type: "Certificate of Enrollment", purpose: "Scholarship Renewal", requested: "Jun 05, 2026", status: "Released", copies: 1 },
  { id: "DOC-90215", student: "Gabriel Santos", type: "Diploma (Re-issuance)", purpose: "Employment", requested: "Jun 03, 2026", status: "On Hold", copies: 1 },
  { id: "DOC-90244", student: "Bianca Tan", type: "Good Moral Certificate", purpose: "Transfer", requested: "Jun 08, 2026", status: "Requested", copies: 3 },
  { id: "DOC-90250", student: "Kristine Aquino", type: "Transcript of Records", purpose: "Graduate School", requested: "Jun 08, 2026", status: "Requested", copies: 2 },
  { id: "DOC-90199", student: "Marcus Villanueva", type: "Certified True Copy of Grades", purpose: "Personal", requested: "Jun 01, 2026", status: "Released", copies: 1 },
];

/* ----- Dashboard / analytics aggregates ----- */

export const enrollmentTrend = [
  { term: "1st 2023", students: 3120 },
  { term: "2nd 2023", students: 3260 },
  { term: "1st 2024", students: 3540 },
  { term: "2nd 2024", students: 3680 },
  { term: "1st 2025", students: 3910 },
  { term: "2nd 2025", students: 4080 },
  { term: "1st 2026", students: 4312 },
];

export const programDistribution = [
  { program: "Computer Science", students: 842, color: "#6366f1" },
  { program: "Information Tech", students: 715, color: "#a855f7" },
  { program: "Nursing", students: 690, color: "#ec4899" },
  { program: "Accountancy", students: 534, color: "#f59e0b" },
  { program: "Business Admin", students: 498, color: "#10b981" },
  { program: "Engineering", students: 463, color: "#0ea5e9" },
  { program: "Others", students: 570, color: "#94a3b8" },
];

export const gradeDistribution = [
  { band: "1.00–1.50", label: "Excellent", count: 1240, color: "#10b981" },
  { band: "1.51–2.00", label: "Very Good", count: 1580, color: "#6366f1" },
  { band: "2.01–2.50", label: "Good", count: 820, color: "#0ea5e9" },
  { band: "2.51–3.00", label: "Passing", count: 410, color: "#f59e0b" },
  { band: "5.00", label: "Failed", count: 98, color: "#ef4444" },
];

export const collegePerformance = [
  { college: "Computing", gwa: 1.72, passRate: 96 },
  { college: "Engineering", gwa: 2.04, passRate: 91 },
  { college: "Business", gwa: 1.88, passRate: 94 },
  { college: "Health Sciences", gwa: 1.66, passRate: 97 },
  { college: "Education", gwa: 1.79, passRate: 95 },
  { college: "Arts & Sciences", gwa: 1.95, passRate: 93 },
];

/* Curriculum checklist used in the advising module */
export const curriculum = [
  { code: "CS 101", title: "Introduction to Computing", units: 3, status: "Passed", grade: "1.25" },
  { code: "CS 102", title: "Computer Programming I", units: 3, status: "Passed", grade: "1.50" },
  { code: "CS 221", title: "Data Structures & Algorithms", units: 3, status: "Passed", grade: "1.75" },
  { code: "MATH 201", title: "Discrete Mathematics", units: 3, status: "Passed", grade: "2.00" },
  { code: "CS 311", title: "Design & Analysis of Algorithms", units: 3, status: "In Progress", grade: "—" },
  { code: "CS 312", title: "Software Engineering", units: 3, status: "In Progress", grade: "—" },
  { code: "CS 401", title: "Operating Systems", units: 3, status: "Not Taken", grade: "—" },
  { code: "CS 402", title: "Compiler Design", units: 3, status: "Not Taken", grade: "—" },
  { code: "CS 499", title: "Capstone Project", units: 6, status: "Locked", grade: "—" },
] as const;

/* Weekly schedule used in the student portal */
export const weeklySchedule = [
  { day: "Monday", classes: [{ code: "CS 311", time: "9:00–10:00", room: "Lab 4" }, { code: "GE 105", time: "14:30–16:00", room: "Rm 401" }] },
  { day: "Tuesday", classes: [{ code: "CS 312", time: "10:30–12:00", room: "Rm 305" }] },
  { day: "Wednesday", classes: [{ code: "CS 311", time: "9:00–10:00", room: "Lab 4" }, { code: "IT 241", time: "13:00–14:00", room: "Lab 2" }] },
  { day: "Thursday", classes: [{ code: "CS 312", time: "10:30–12:00", room: "Rm 305" }, { code: "GE 105", time: "14:30–16:00", room: "Rm 401" }] },
  { day: "Friday", classes: [{ code: "CS 311", time: "9:00–10:00", room: "Lab 4" }] },
];

export const announcements = [
  { title: "Enrollment for 2nd Semester now open", date: "Jun 09, 2026", tag: "Registrar", body: "Regular students may proceed to online enrollment until June 20." },
  { title: "Submission of final grades", date: "Jun 07, 2026", tag: "Faculty", body: "All faculty are reminded to encode and post final grades by June 15." },
  { title: "Dean's List recognition ceremony", date: "Jun 05, 2026", tag: "Academics", body: "Awarding for SY 2025–2026 will be held at the University Theater." },
];
