/*
  Typed endpoint functions mapping every route in the K-12 School Management
  Postman collection. Grouped by domain. Each function returns a typed promise
  from the shared `api` client.
*/

import { api, type QueryParams } from "./client";
import type {
  Announcement,
  AttendanceEntry,
  AttendanceStatus,
  AuditLog,
  CalendarEvent,
  DashboardSummary,
  Discount,
  DisciplineRecord,
  Enrollment,
  FeeStructure,
  Grade,
  GradeLevel,
  GradingPeriod,
  GuidanceRecord,
  HealthRecord,
  ID,
  IEP,
  Invoice,
  LearningRecoveryPlan,
  LoginResponse,
  Message,
  Notification,
  Paginated,
  Payment,
  Room,
  Scholarship,
  SchoolClass,
  SchoolYear,
  Section,
  StudentFee,
  Subject,
  Track,
  User,
} from "./types";

/* 01 — Authentication */
export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/login", { email, password }),
  me: () => api.get<User>("/user"),
  logout: () => api.post<void>("/logout"),
};

/* 02 — User Management */
export const usersApi = {
  list: (params?: QueryParams) => api.get<Paginated<User>>("/users", params),
  create: (payload: Partial<User> & { password: string; password_confirmation: string }) =>
    api.post<User>("/users", payload),
  get: (id: ID) => api.get<User>(`/users/${id}`),
  update: (id: ID, payload: Partial<User>) => api.put<User>(`/users/${id}`, payload),
  remove: (id: ID) => api.del<void>(`/users/${id}`),
};

/* 03 — Academic Setup */
export const academicApi = {
  schoolYears: {
    list: () => api.get<Paginated<SchoolYear>>("/school-years"),
    create: (p: Partial<SchoolYear>) => api.post<SchoolYear>("/school-years", p),
    get: (id: ID) => api.get<SchoolYear>(`/school-years/${id}`),
    update: (id: ID, p: Partial<SchoolYear>) => api.put<SchoolYear>(`/school-years/${id}`, p),
    remove: (id: ID) => api.del<void>(`/school-years/${id}`),
  },
  gradeLevels: {
    list: () => api.get<Paginated<GradeLevel>>("/grade-levels"),
    create: (p: Partial<GradeLevel>) => api.post<GradeLevel>("/grade-levels", p),
    get: (id: ID) => api.get<GradeLevel>(`/grade-levels/${id}`),
    update: (id: ID, p: Partial<GradeLevel>) => api.put<GradeLevel>(`/grade-levels/${id}`, p),
    remove: (id: ID) => api.del<void>(`/grade-levels/${id}`),
  },
  sections: {
    list: () => api.get<Paginated<Section>>("/sections"),
    create: (p: Partial<Section>) => api.post<Section>("/sections", p),
    get: (id: ID) => api.get<Section>(`/sections/${id}`),
    update: (id: ID, p: Partial<Section>) => api.put<Section>(`/sections/${id}`, p),
    remove: (id: ID) => api.del<void>(`/sections/${id}`),
  },
  subjects: {
    list: () => api.get<Paginated<Subject>>("/subjects"),
    create: (p: Partial<Subject>) => api.post<Subject>("/subjects", p),
    get: (id: ID) => api.get<Subject>(`/subjects/${id}`),
    update: (id: ID, p: Partial<Subject>) => api.put<Subject>(`/subjects/${id}`, p),
    remove: (id: ID) => api.del<void>(`/subjects/${id}`),
  },
};

/* 04 — Enrollment */
export const enrollmentApi = {
  list: (params?: QueryParams) => api.get<Paginated<Enrollment>>("/enrollments", params),
  create: (p: Partial<Enrollment>) => api.post<Enrollment>("/enrollments", p),
  get: (id: ID) => api.get<Enrollment>(`/enrollments/${id}`),
  approve: (id: ID) => api.patch<Enrollment>(`/enrollments/${id}/approve`),
  reject: (id: ID, reason: string) =>
    api.patch<Enrollment>(`/enrollments/${id}/reject`, { reason }),
  history: (studentId: ID) =>
    api.get<Paginated<Enrollment>>(`/students/${studentId}/enrollment-history`),
  selectTrack: (id: ID, trackId: ID) =>
    api.post<Enrollment>(`/enrollments/${id}/select-track`, { track_id: trackId }),
  selectElectives: (id: ID, subjectIds: ID[]) =>
    api.post<Enrollment>(`/enrollments/${id}/select-electives`, { subject_ids: subjectIds }),
  subjects: (id: ID) => api.get<Paginated<Subject>>(`/enrollments/${id}/subjects`),
  availableElectives: (id: ID) =>
    api.get<Paginated<Subject>>(`/enrollments/${id}/available-electives`),
};

/* 05 — SHS Tracks */
export const tracksApi = {
  list: () => api.get<Paginated<Track>>("/tracks"),
  get: (id: ID) => api.get<Track>(`/tracks/${id}`),
  subjects: (id: ID) => api.get<Paginated<Subject>>(`/tracks/${id}/subjects`),
};

/* 06 — Classes & Grading */
export const classesApi = {
  create: (p: Partial<SchoolClass>) => api.post<SchoolClass>("/classes", p),
  myClasses: () => api.get<Paginated<SchoolClass>>("/teachers/me/classes"),
  students: (id: ID) => api.get<Paginated<Enrollment>>(`/classes/${id}/students`),
  submitGrades: (id: ID, gradingPeriod: GradingPeriod, grades: { enrollment_id: ID; grade: number }[]) =>
    api.post<void>(`/classes/${id}/grades`, { grading_period: gradingPeriod, grades }),
  myGrades: (params?: QueryParams) =>
    api.get<Paginated<Grade>>("/students/me/grades", params),
};

/* 07 — Attendance */
export const attendanceApi = {
  mark: (classId: ID, date: string, attendance: { enrollment_id: ID; status: AttendanceStatus }[]) =>
    api.post<void>(`/classes/${classId}/attendance`, { date, attendance }),
  forClass: (classId: ID, date: string) =>
    api.get<Paginated<AttendanceEntry>>(`/classes/${classId}/attendance`, { date }),
  myAttendance: () => api.get<Paginated<AttendanceEntry>>("/students/me/attendance"),
};

/* 08 — DepEd Reports (return URLs/blobs/JSON depending on backend) */
export const reportsApi = {
  form137: (studentId: ID) => api.get<unknown>(`/reports/form-137/${studentId}`),
  form138: (studentId: ID) => api.get<unknown>(`/reports/form-138/${studentId}`),
  sf9: (studentId: ID) => api.get<unknown>(`/reports/sf9/${studentId}`),
  sf5: (sectionId: ID) => api.get<unknown>(`/reports/sf5/${sectionId}`),
  sf6: (sectionId: ID) => api.get<unknown>(`/reports/sf6/${sectionId}`),
  attendanceSummary: (id: ID) => api.get<unknown>(`/reports/attendance-summary/${id}`),
  certificateEnrollment: (studentId: ID) =>
    api.get<unknown>(`/reports/certificate-enrollment/${studentId}`),
  certificateGoodMoral: (studentId: ID) =>
    api.get<unknown>(`/reports/certificate-good-moral/${studentId}`),
  transcript: (studentId: ID) => api.get<unknown>(`/reports/transcript/${studentId}`),
};

/* 09 — Advisory Dashboard (Teacher) */
export const advisoryApi = {
  dashboard: () => api.get<Record<string, unknown>>("/advisory/dashboard"),
  sectionPerformance: (sectionId: ID) =>
    api.get<Record<string, unknown>>(`/advisory/section/${sectionId}/performance`),
  sectionAttendance: (sectionId: ID) =>
    api.get<Record<string, unknown>>(`/advisory/section/${sectionId}/attendance`),
  honorStudents: (sectionId: ID) =>
    api.get<Paginated<unknown>>(`/advisory/section/${sectionId}/honor-students`),
  failingStudents: (sectionId: ID) =>
    api.get<Paginated<unknown>>(`/advisory/section/${sectionId}/failing-students`),
  studentSummary: (studentId: ID) =>
    api.get<Record<string, unknown>>(`/advisory/student/${studentId}/summary`),
};

/* 10 — Dashboard Analytics */
export const dashboardApi = {
  summary: (params?: QueryParams) => api.get<DashboardSummary>("/dashboard/summary", params),
  enrollmentStatistics: (params?: QueryParams) =>
    api.get<Record<string, unknown>>("/dashboard/enrollment-statistics", params),
  enrollmentTrends: (params?: QueryParams) =>
    api.get<Record<string, unknown>>("/dashboard/enrollment-trends", params),
  gradeAnalytics: (params?: QueryParams) =>
    api.get<Record<string, unknown>>("/dashboard/grade-analytics", params),
  sectionComparison: (params?: QueryParams) =>
    api.get<Record<string, unknown>>("/dashboard/section-comparison", params),
  financialAnalytics: (params?: QueryParams) =>
    api.get<Record<string, unknown>>("/dashboard/financial-analytics", params),
  retention: () => api.get<Record<string, unknown>>("/dashboard/retention"),
  attendanceAnalytics: (params?: QueryParams) =>
    api.get<Record<string, unknown>>("/dashboard/attendance-analytics", params),
};

/* 11 — Rooms & Scheduling */
export const roomsApi = {
  list: () => api.get<Paginated<Room>>("/rooms"),
  create: (p: Partial<Room>) => api.post<Room>("/rooms", p),
  get: (id: ID) => api.get<Room>(`/rooms/${id}`),
  update: (id: ID, p: Partial<Room>) => api.put<Room>(`/rooms/${id}`, p),
  remove: (id: ID) => api.del<void>(`/rooms/${id}`),
  schedule: (id: ID) => api.get<Paginated<unknown>>(`/rooms/${id}/schedule`),
};

export const schedulingApi = {
  generate: (schoolYearId: ID) =>
    api.post<unknown>("/scheduling/generate", { school_year_id: schoolYearId }),
  view: (schoolYearId: ID) => api.get<Paginated<unknown>>(`/scheduling/${schoolYearId}`),
  conflicts: () => api.get<Paginated<unknown>>("/scheduling/conflicts"),
  unresolvedConflicts: () => api.get<Paginated<unknown>>("/scheduling/conflicts/unresolved"),
  resolveConflict: (id: ID, notes: string) =>
    api.patch<unknown>(`/scheduling/conflicts/${id}/resolve`, { resolution_notes: notes }),
  teacherSchedule: (teacherId: ID) =>
    api.get<Paginated<unknown>>(`/scheduling/teachers/${teacherId}`),
  sectionSchedule: (sectionId: ID) =>
    api.get<Paginated<unknown>>(`/scheduling/sections/${sectionId}`),
};

/* 12 — Financial Management */
export const feesApi = {
  structures: {
    list: (params?: QueryParams) => api.get<Paginated<FeeStructure>>("/fees/structures", params),
    create: (p: Partial<FeeStructure>) => api.post<FeeStructure>("/fees/structures", p),
    get: (id: ID) => api.get<FeeStructure>(`/fees/structures/${id}`),
    update: (id: ID, p: Partial<FeeStructure>) =>
      api.put<FeeStructure>(`/fees/structures/${id}`, p),
    remove: (id: ID) => api.del<void>(`/fees/structures/${id}`),
  },
  discounts: {
    list: () => api.get<Paginated<Discount>>("/fees/discounts"),
    create: (p: Partial<Discount>) => api.post<Discount>("/fees/discounts", p),
    update: (id: ID, p: Partial<Discount>) => api.put<Discount>(`/fees/discounts/${id}`, p),
    remove: (id: ID) => api.del<void>(`/fees/discounts/${id}`),
  },
  assign: (enrollmentId: ID, schoolYearId: ID, gradeLevelId: ID) =>
    api.post<void>("/fees/assign", {
      enrollment_id: enrollmentId,
      school_year_id: schoolYearId,
      grade_level_id: gradeLevelId,
    }),
  forEnrollment: (enrollmentId: ID) =>
    api.get<Paginated<StudentFee>>(`/fees/enrollment/${enrollmentId}`),
  applyDiscount: (studentFeeId: ID, discountId: ID, notes?: string) =>
    api.post<void>(`/fees/student-fee/${studentFeeId}/apply-discount`, {
      discount_id: discountId,
      notes,
    }),
  recordPayment: (p: Partial<Payment> & { student_fee_id: ID; amount: number }) =>
    api.post<Payment>("/fees/payments", p),
  paymentsForFee: (studentFeeId: ID) =>
    api.get<Paginated<Payment>>(`/fees/student-fee/${studentFeeId}/payments`),
  summary: (params?: QueryParams) =>
    api.get<Record<string, unknown>>("/fees/summary", params),
};

export const scholarshipsApi = {
  list: (params?: QueryParams) => api.get<Paginated<Scholarship>>("/scholarships", params),
  create: (p: Partial<Scholarship>) => api.post<Scholarship>("/scholarships", p),
  update: (id: ID, p: Partial<Scholarship>) => api.put<Scholarship>(`/scholarships/${id}`, p),
  remove: (id: ID) => api.del<void>(`/scholarships/${id}`),
  award: (id: ID, p: { student_id: ID; enrollment_id: ID; awarded_date: string; expiry_date?: string; remarks?: string }) =>
    api.post<void>(`/scholarships/${id}/award`, p),
  forStudent: (studentId: ID) =>
    api.get<Paginated<Scholarship>>(`/scholarships/student/${studentId}`),
  revoke: (studentScholarshipId: ID) =>
    api.patch<void>(`/scholarships/student-scholarship/${studentScholarshipId}/revoke`),
};

export const invoicesApi = {
  generate: (p: { enrollment_id: ID; due_date: string; notes?: string }) =>
    api.post<Invoice>("/invoices", p),
  get: (id: ID) => api.get<Invoice>(`/invoices/${id}`),
  forEnrollment: (enrollmentId: ID) =>
    api.get<Paginated<Invoice>>(`/invoices/enrollment/${enrollmentId}`),
  updateStatus: (id: ID, status: string) =>
    api.patch<Invoice>(`/invoices/${id}/status`, { status }),
};

/* 13 — Parent Portal + Comms */
export const parentApi = {
  children: () => api.get<Paginated<unknown>>("/parent/children"),
  childGrades: (childId: ID, params?: QueryParams) =>
    api.get<Paginated<Grade>>(`/parent/children/${childId}/grades`, params),
  childAttendance: (childId: ID, params?: QueryParams) =>
    api.get<Paginated<AttendanceEntry>>(`/parent/children/${childId}/attendance`, params),
  childFees: (childId: ID, params?: QueryParams) =>
    api.get<Paginated<StudentFee>>(`/parent/children/${childId}/fees`, params),
};

export const messagesApi = {
  inbox: () => api.get<Paginated<Message>>("/messages/inbox"),
  sent: () => api.get<Paginated<Message>>("/messages/sent"),
  send: (p: { receiver_id: ID; subject: string; body: string }) =>
    api.post<Message>("/messages", p),
  get: (id: ID) => api.get<Message>(`/messages/${id}`),
  markRead: (id: ID) => api.patch<void>(`/messages/${id}/read`),
};

export const announcementsApi = {
  list: () => api.get<Paginated<Announcement>>("/announcements"),
  create: (p: Partial<Announcement>) => api.post<Announcement>("/announcements", p),
  update: (id: ID, p: Partial<Announcement>) => api.put<Announcement>(`/announcements/${id}`, p),
  remove: (id: ID) => api.del<void>(`/announcements/${id}`),
};

export const notificationsApi = {
  list: (params?: QueryParams) => api.get<Paginated<Notification>>("/notifications", params),
  markAllRead: () => api.patch<void>("/notifications/read-all"),
  markRead: (id: ID) => api.patch<void>(`/notifications/${id}/read`),
  remove: (id: ID) => api.del<void>(`/notifications/${id}`),
};

/* 14 — Conduct & Discipline */
export const disciplineApi = {
  list: (params?: QueryParams) => api.get<Paginated<DisciplineRecord>>("/discipline/records", params),
  create: (p: Partial<DisciplineRecord>) => api.post<DisciplineRecord>("/discipline/records", p),
  get: (id: ID) => api.get<DisciplineRecord>(`/discipline/records/${id}`),
  update: (id: ID, p: Partial<DisciplineRecord>) =>
    api.patch<DisciplineRecord>(`/discipline/records/${id}`, p),
  addAction: (id: ID, p: { action_type: string; description: string; action_date: string }) =>
    api.post<void>(`/discipline/records/${id}/actions`, p),
  forStudent: (studentId: ID) =>
    api.get<Paginated<DisciplineRecord>>(`/discipline/student/${studentId}`),
  statistics: () => api.get<Record<string, unknown>>("/discipline/statistics"),
  mine: () => api.get<Paginated<DisciplineRecord>>("/students/me/discipline"),
};

/* 15 — Academic Calendar */
export const calendarApi = {
  list: (params?: QueryParams) => api.get<Paginated<CalendarEvent>>("/academic-calendar", params),
  upcoming: (limit = 5) => api.get<Paginated<CalendarEvent>>("/academic-calendar/upcoming", { limit }),
  create: (p: Partial<CalendarEvent>) => api.post<CalendarEvent>("/academic-calendar", p),
  get: (id: ID) => api.get<CalendarEvent>(`/academic-calendar/${id}`),
  update: (id: ID, p: Partial<CalendarEvent>) => api.put<CalendarEvent>(`/academic-calendar/${id}`, p),
  remove: (id: ID) => api.del<void>(`/academic-calendar/${id}`),
};

/* 16 — Student Health Records */
export const healthApi = {
  mine: () => api.get<HealthRecord>("/students/me/health"),
  forStudent: (studentId: ID) => api.get<HealthRecord>(`/health/student/${studentId}`),
  upsert: (studentId: ID, p: Partial<HealthRecord>) =>
    api.put<HealthRecord>(`/health/student/${studentId}`, p),
  incidents: (studentId: ID) =>
    api.get<Paginated<unknown>>(`/health/student/${studentId}/incidents`),
  recordIncident: (studentId: ID, p: Record<string, unknown>) =>
    api.post<unknown>(`/health/student/${studentId}/incidents`, p),
  updateIncident: (incidentId: ID, p: Record<string, unknown>) =>
    api.patch<unknown>(`/health/incidents/${incidentId}`, p),
};

/* 18 — Audit Logs */
export const auditApi = {
  list: (params?: QueryParams) => api.get<Paginated<AuditLog>>("/audit-logs", params),
  forModel: (model: string, id: ID) => api.get<Paginated<AuditLog>>(`/audit-logs/${model}/${id}`),
};

/* 19 — Bulk Import & Export */
export const bulkApi = {
  importStudents: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.upload<unknown>("/bulk/import/students", fd);
  },
  templateUrl: () => `${"/bulk/import/template"}`,
  exportStudents: () => api.get<unknown>("/bulk/export/students"),
  exportGrades: (params?: QueryParams) => api.get<unknown>("/bulk/export/grades", params),
  exportAttendance: (params?: QueryParams) => api.get<unknown>("/bulk/export/attendance", params),
};

/* 20 — Student Self-Service */
export const studentApi = {
  dashboard: () => api.get<Record<string, unknown>>("/students/me/dashboard"),
  schedule: () => api.get<Paginated<unknown>>("/students/me/schedule"),
  currentEnrollment: () => api.get<Enrollment>("/students/me/enrollment"),
  updateProfile: (p: Partial<User>) => api.put<User>("/students/me/profile", p),
};

/* 21 — Guidance & Counseling */
export const guidanceApi = {
  list: () => api.get<Paginated<GuidanceRecord>>("/guidance/records"),
  create: (p: Partial<GuidanceRecord>) => api.post<GuidanceRecord>("/guidance/records", p),
  followUps: () => api.get<Paginated<GuidanceRecord>>("/guidance/records/follow-ups"),
  get: (id: ID) => api.get<GuidanceRecord>(`/guidance/records/${id}`),
  update: (id: ID, p: Partial<GuidanceRecord>) =>
    api.patch<GuidanceRecord>(`/guidance/records/${id}`, p),
  remove: (id: ID) => api.del<void>(`/guidance/records/${id}`),
  forStudent: (studentId: ID) => api.get<Paginated<GuidanceRecord>>(`/guidance/student/${studentId}`),
  referrals: () => api.get<Paginated<unknown>>("/guidance/referrals"),
  createReferral: (p: Record<string, unknown>) => api.post<unknown>("/guidance/referrals", p),
  pendingReferrals: () => api.get<Paginated<unknown>>("/guidance/referrals/pending"),
  statistics: () => api.get<Record<string, unknown>>("/guidance/statistics"),
  mine: () => api.get<Paginated<GuidanceRecord>>("/students/me/counseling"),
};

/* 22 — Conduct Grades (Core Values) */
export const conductApi = {
  forEnrollment: (enrollmentId: ID) =>
    api.get<Paginated<unknown>>(`/conduct-grades/enrollment/${enrollmentId}`),
  submit: (enrollmentId: ID, gradingPeriod: GradingPeriod, grades: { behavior: string; rating: string }[]) =>
    api.post<void>(`/conduct-grades/enrollment/${enrollmentId}`, {
      grading_period: gradingPeriod,
      grades,
    }),
};

/* 23 — Learning Recovery Plans */
export const learningRecoveryApi = {
  list: () => api.get<Paginated<LearningRecoveryPlan>>("/learning-recovery"),
  create: (p: Partial<LearningRecoveryPlan>) =>
    api.post<LearningRecoveryPlan>("/learning-recovery", p),
  get: (id: ID) => api.get<LearningRecoveryPlan>(`/learning-recovery/${id}`),
  update: (id: ID, p: Partial<LearningRecoveryPlan>) =>
    api.patch<LearningRecoveryPlan>(`/learning-recovery/${id}`, p),
  forStudent: (studentId: ID) =>
    api.get<Paginated<LearningRecoveryPlan>>(`/learning-recovery/student/${studentId}`),
  addIntervention: (id: ID, p: Record<string, unknown>) =>
    api.post<unknown>(`/learning-recovery/${id}/interventions`, p),
};

/* 24 — IEP / SPED Tracking */
export const iepApi = {
  list: () => api.get<Paginated<IEP>>("/iep"),
  create: (p: Partial<IEP>) => api.post<IEP>("/iep", p),
  statistics: () => api.get<Record<string, unknown>>("/iep/statistics"),
  get: (id: ID) => api.get<IEP>(`/iep/${id}`),
  update: (id: ID, p: Partial<IEP>) => api.patch<IEP>(`/iep/${id}`, p),
  forStudent: (studentId: ID) => api.get<Paginated<IEP>>(`/iep/student/${studentId}`),
  addGoal: (id: ID, p: Record<string, unknown>) => api.post<unknown>(`/iep/${id}/goals`, p),
  updateGoal: (goalId: ID, p: Record<string, unknown>) =>
    api.patch<unknown>(`/iep/goals/${goalId}`, p),
};

/* 25 — GDPR / Data Privacy */
export const gdprApi = {
  exportStudent: (studentId: ID) => api.get<unknown>(`/gdpr/export/student/${studentId}`),
  anonymizeStudent: (studentId: ID) => api.del<void>(`/gdpr/anonymize/student/${studentId}`),
  purge: () => api.del<void>("/gdpr/purge"),
};
