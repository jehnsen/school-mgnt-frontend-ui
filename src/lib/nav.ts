import {
  LayoutDashboard,
  GraduationCap,
  BookOpenCheck,
  CalendarCheck,
  Users,
  SlidersHorizontal,
  Files,
  UserCircle,
  Wallet,
  Award,
  ReceiptText,
  MessageSquare,
  Megaphone,
  HeartPulse,
  ShieldAlert,
  LifeBuoy,
  Sparkles,
  CalendarRange,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/api/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  /** Roles allowed to see this item. Omit = visible to all authenticated users. */
  roles?: Role[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const ADMIN: Role[] = ["super_admin", "admin", "principal", "registrar"];

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: [...ADMIN, "cashier", "guidance"] },
      { label: "My Portal", href: "/portal", icon: UserCircle, roles: ["student"] },
      { label: "Parent Portal", href: "/parent", icon: Users, roles: ["parent"] },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Enrollment", href: "/enrollment", icon: GraduationCap, roles: [...ADMIN], badge: "Open" },
      { label: "Classes & Grading", href: "/classes", icon: BookOpenCheck, roles: ["teacher", ...ADMIN] },
      { label: "Attendance", href: "/attendance", icon: CalendarCheck, roles: ["teacher", ...ADMIN] },
      { label: "Academic Setup", href: "/academic-setup", icon: SlidersHorizontal, roles: ["super_admin", "admin", "principal"] },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Fees & Payments", href: "/finance", icon: Wallet, roles: ["cashier", "admin", "super_admin"] },
      { label: "Scholarships", href: "/scholarships", icon: Award, roles: ["cashier", "admin", "super_admin"] },
      { label: "Invoices", href: "/invoices", icon: ReceiptText, roles: ["cashier", "admin", "super_admin"] },
    ],
  },
  {
    title: "Student Services",
    items: [
      { label: "Discipline", href: "/discipline", icon: ShieldAlert, roles: ["guidance", "teacher", ...ADMIN] },
      { label: "Guidance", href: "/guidance", icon: LifeBuoy, roles: ["guidance", ...ADMIN] },
      { label: "Health Records", href: "/health", icon: HeartPulse, roles: ["guidance", "admin", "super_admin"] },
      { label: "Learning Recovery", href: "/learning-recovery", icon: Sparkles, roles: ["teacher", "guidance", ...ADMIN] },
      { label: "IEP / SPED", href: "/iep", icon: LifeBuoy, roles: ["guidance", "admin", "super_admin"] },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Messages", href: "/messages", icon: MessageSquare },
      { label: "Announcements", href: "/announcements", icon: Megaphone, roles: ["teacher", ...ADMIN] },
    ],
  },
  {
    title: "Records & Insights",
    items: [
      { label: "Users", href: "/users", icon: Users, roles: ["super_admin", "admin"] },
      { label: "Reports & Forms", href: "/reports", icon: Files, roles: [...ADMIN] },
      { label: "Academic Calendar", href: "/calendar", icon: CalendarRange },
    ],
  },
];

/** Filter the nav for a given role, dropping empty sections. */
export function navForRole(role: Role | undefined): NavSection[] {
  return navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((i) => !i.roles || (role && i.roles.includes(role))),
    }))
    .filter((section) => section.items.length > 0);
}
