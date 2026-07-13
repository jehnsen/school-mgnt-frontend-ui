/*
  Shared report/document helpers for Akademya360.

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
