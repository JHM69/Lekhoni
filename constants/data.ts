 
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
    title: "Chat Bot",
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
    title: "Setting",
    href: "/settings",
    icon: "Settings",
    label: "setting",
  },
 
 
];

 