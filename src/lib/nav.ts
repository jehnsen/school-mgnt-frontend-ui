import {
  LayoutDashboard,
  GraduationCap,
  ClipboardCheck,
  BookOpenCheck,
  CalendarRange,
  FileText,
  Files,
  BarChart3,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "My Portal", href: "/portal", icon: UserCircle },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Enrollment", href: "/enrollment", icon: GraduationCap, badge: "Open" },
      { label: "Advising", href: "/advising", icon: ClipboardCheck },
      { label: "Grading", href: "/grading", icon: BookOpenCheck },
      { label: "Faculty Loading", href: "/faculty-loading", icon: CalendarRange },
    ],
  },
  {
    title: "Records & Insights",
    items: [
      { label: "Registrar", href: "/registrar", icon: FileText },
      { label: "Reports & Forms", href: "/reports", icon: Files },
      { label: "Data Analysis", href: "/analytics", icon: BarChart3 },
    ],
  },
];
