 
import { NavItem } from "@/types";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

 
 

export const navItems: NavItem[] = [
  
  {
    title: "Write",
    href: "/write",
    icon: "write",
    label: "write",
  }, 
  
  {
    title: "Chat",
    href: "/chat-bot",
    icon: "analytics",
    label: "Ai Helper",
  },

  {
    title: "Story",
    href: "/stories",
    icon: "story",
    label: "Stories",
  },
 
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
    label: "setting",
  },

  {
    title: "Feedbacks",
    href: "/feedbacks",
    icon: "validate",
    label: "feedbacks",
  },

  {
    title: "Analytics",
    href: "/analytics",
    icon: "help",
    label: "analytics",
  },
 
 
];

 