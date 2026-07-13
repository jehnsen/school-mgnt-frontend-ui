/*
  TypeScript shapes for the K-12 School Management API.

  Response envelopes follow Laravel API Resources. Field names mirror the
  Postman collection payloads. Where the backend's exact shape is uncertain,
  fields are made optional so the UI degrades gracefully.
*/

/* ----------------------------- envelopes ------------------------------- */

export interface Paginated<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: { first?: string; last?: string; prev?: string; next?: string };
}

/** Some endpoints wrap a single resource as { data: T }, others return T raw. */
export interface Wrapped<T> {
  data: T;
}

export type ID = number | string;

/* ------------------------------- roles --------------------------------- */

// Roles as returned by the backend (snake_case).
export type Role =
  | "super_admin"
  | "admin"
  | "principal"
  | "registrar"
  | "teacher"
  | "student"
  | "parent"
  | "cashier"
  | "guidance";

export interface Profile {
  id?: ID;
  user_id?: ID;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  full_name?: string;
  address?: string;
  contact_number?: string;
  dob?: string;
  profile_picture_url?: string | null;
}

/* ------------------------------- core ---------------------------------- */

export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
  is_active?: boolean;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  /** Personal details are nested under `profile`. */
  profile?: Profile | null;
  // Convenience fields some create/update payloads accept at top level.
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  contact_number?: string;
  address?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | string;
}

/** Inner `data` payload of POST /login (after envelope unwrap). */
export interface LoginResponse {
  user: User;
  token: string;
  token_type?: string;
}

export interface SchoolYear {
  id: ID;
  year_start: number;
  year_end: number;
  status: "active" | "inactive" | string;
  label?: string;
}

export interface GradeLevel {
  id: ID;
  name: string;
  education_level: "elementary" | "junior_high" | "senior_high" | string;
}

export interface Section {
  id: ID;
  name: string;
  grade_level_id: ID;
  grade_level?: GradeLevel;
  teacher_id?: ID;
  teacher?: User;
  capacity: number;
  students_count?: number;
}

export interface Subject {
  id: ID;
  name: string;
  code: string;
  grade_level_ids?: ID[];
}

export interface Track {
  id: ID;
  name: string;
  description?: string;
  code?: string;
}

export interface Student {
  id: ID;
  user_id?: ID;
  lrn?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  name?: string;
  gender?: string;
  date_of_birth?: string;
  grade_level?: GradeLevel;
  section?: Section;
}

export type EnrollmentStatus = "pending" | "approved" | "rejected" | string;

export interface Enrollment {
  id: ID;
  student_id: ID;
  student?: Student;
  school_year_id: ID;
  school_year?: SchoolYear;
  grade_level_id: ID;
  grade_level?: GradeLevel;
  section_id?: ID;
  section?: Section;
  track_id?: ID;
  track?: Track;
  status: EnrollmentStatus;
  created_at?: string;
}

export interface SchoolClass {
  id: ID;
  subject_id: ID;
  subject?: Subject;
  teacher_id: ID;
  teacher?: User;
  section_id: ID;
  section?: Section;
  school_year_id: ID;
  room_id?: ID;
  time_slot_id?: ID;
  students_count?: number;
}

export type GradingPeriod =
  | "1st_quarter"
  | "2nd_quarter"
  | "3rd_quarter"
  | "4th_quarter"
  | string;

export interface Grade {
  id?: ID;
  enrollment_id: ID;
  student?: Student;
  subject?: Subject;
  grading_period: GradingPeriod;
  grade: number;
  remarks?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused" | string;

export interface AttendanceEntry {
  enrollment_id: ID;
  student?: Student;
  status: AttendanceStatus;
  date?: string;
}

/* ----------------------------- financial ------------------------------- */

export interface FeeStructure {
  id: ID;
  school_year_id: ID;
  grade_level_id?: ID;
  grade_level?: GradeLevel;
  fee_type: string;
  name: string;
  amount: number;
  description?: string;
}

export interface Discount {
  id: ID;
  name: string;
  value_type: "percentage" | "fixed" | string;
  value: number;
  description?: string;
}

export interface StudentFee {
  id: ID;
  enrollment_id: ID;
  fee_structure?: FeeStructure;
  name?: string;
  amount: number;
  discount_amount?: number;
  paid_amount?: number;
  balance?: number;
  status?: "unpaid" | "partial" | "paid" | string;
}

export interface Payment {
  id: ID;
  student_fee_id: ID;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference_number?: string;
}

export interface Scholarship {
  id: ID;
  name: string;
  description?: string;
  type: "percentage" | "fixed" | string;
  discount_percentage?: number;
  is_active: boolean;
  sponsored_by?: string;
}

export interface Invoice {
  id: ID;
  enrollment_id: ID;
  invoice_number?: string;
  total_amount?: number;
  due_date?: string;
  status: "unpaid" | "paid" | "overdue" | string;
  notes?: string;
}

/* ------------------------------ comms ---------------------------------- */

export interface Message {
  id: ID;
  sender_id: ID;
  sender?: User;
  receiver_id: ID;
  receiver?: User;
  subject: string;
  body: string;
  is_read?: boolean;
  created_at?: string;
}

export interface Announcement {
  id: ID;
  title: string;
  body: string;
  audience: string;
  is_published: boolean;
  created_at?: string;
}

export interface Notification {
  id: ID;
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
  read_at?: string | null;
  created_at?: string;
}

/* --------------------------- student services -------------------------- */

export interface DisciplineRecord {
  id: ID;
  student_id: ID;
  student?: Student;
  incident_date: string;
  incident_type: string;
  severity: "minor" | "major" | string;
  description: string;
  status?: "open" | "resolved" | string;
}

export interface GuidanceRecord {
  id: ID;
  student_id: ID;
  student?: Student;
  session_date: string;
  concern_type: string;
  description: string;
  action_taken?: string;
  follow_up_date?: string;
  status?: string;
}

export interface HealthRecord {
  id?: ID;
  student_id: ID;
  blood_type?: string;
  height_cm?: number;
  weight_kg?: number;
  allergies?: string;
  medical_conditions?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
}

export interface LearningRecoveryPlan {
  id: ID;
  student_id: ID;
  student?: Student;
  subject_id: ID;
  subject?: Subject;
  school_year_id: ID;
  plan_description: string;
  target_grade?: number;
  status?: string;
}

export interface IEP {
  id: ID;
  student_id: ID;
  student?: Student;
  school_year_id: ID;
  disability_type: string;
  accommodations?: string;
  goals?: string;
  status?: string;
  review_date?: string;
}

export interface Room {
  id: ID;
  name: string;
  building?: string;
  floor?: number;
  capacity: number;
  room_type?: string;
}

export interface CalendarEvent {
  id: ID;
  school_year_id: ID;
  event_name: string;
  event_type: string;
  date: string;
  description?: string;
}

export interface AuditLog {
  id: ID;
  user?: User;
  action?: string;
  model_type?: string;
  model_id?: ID;
  description?: string;
  created_at?: string;
}

/* ---------------------------- dashboard -------------------------------- */

export interface DashboardSummary {
  total_students?: number;
  total_teachers?: number;
  total_sections?: number;
  total_enrollments?: number;
  pending_enrollments?: number;
  [key: string]: unknown;
}

/* ------------------------------- reports -------------------------------- */

export interface ReportLearningArea {
  area: string;
  quarters: (number | null)[];
  final?: number;
  components?: { name: string; quarters: (number | null)[] }[];
}

export interface ReportCoreValue {
  value: string;
  statements: string[];
  marks: string[];
}

export interface ReportAttendanceMonth {
  month: string;
  days: number;
  present: number;
  absent: number;
}

/** GET /reports/form-137/{studentId} — SF10 Permanent Academic Record. */
export interface Form137Response {
  learner: {
    name: string;
    lrn?: string;
    date_of_birth?: string;
    sex?: string;
    place_of_birth?: string;
    mother_tongue?: string;
    parent_guardian?: string;
  };
  eligibility?: {
    type?: string;
    school?: string;
    school_id?: string;
    school_year?: string;
    grade_completed?: string;
  };
  records: {
    grade_level: string;
    school_year: string;
    section?: string;
    adviser?: string;
    areas: ReportLearningArea[];
    action_taken?: string;
  }[];
}

/** GET /reports/form-138/{studentId} — SF9 Learner's Progress Report Card. */
export interface Form138Response {
  learner: {
    name: string;
    lrn?: string;
    grade?: string;
    section?: string;
    school_year?: string;
    adviser?: string;
    age?: number;
    sex?: string;
  };
  learning_areas: ReportLearningArea[];
  core_values: ReportCoreValue[];
  attendance: ReportAttendanceMonth[];
}

/** GET /reports/transcript/{studentId} — collegiate Transcript of Records. */
export interface TranscriptResponse {
  student: {
    name: string;
    student_no?: string;
    program?: string;
    date_of_birth?: string;
    place_of_birth?: string;
    sex?: string;
    date_admitted?: string;
    date_graduated?: string;
    entrance_credentials?: string;
  };
  terms: {
    school_year: string;
    semester: string;
    subjects: { code: string; title: string; units: number; grade: string; credit: number }[];
  }[];
}
