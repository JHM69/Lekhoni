 
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
    href: "/write/chat-bot",
    icon: "analytics",
    label: "Ai Helper",
  },

  {
    title: "Story",
    href: "/write/Stories",
    icon: "story",
    label: "Stories",
  },
 
  {
    title: "Setting",
    href: "/trip/settings",
    icon: "Settings",
    label: "setting",
  },
 
 
];

 