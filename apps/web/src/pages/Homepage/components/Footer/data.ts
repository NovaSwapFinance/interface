import github from "../../assets/media/GI@2x.png";
import tg from "../../assets/media/TG@2x.png";
import x from "../../assets/media/X@2x.png";
import gitbook from "../../assets/media/gitbook@2x.png";
import email from "../../assets/media/email@2x.png";

export const mediaData = [
  {
    icon: github,
    link: "/",
  },
  {
    icon: tg,
    link: "/",
  },
  {
    icon: x,
    link: "/",
  },
  {
    icon: gitbook,
    link: "/",
  },
  {
    icon: email,
    link: "/",
  },
];

export const nav = [
  {
    title: "Ecodapps",
    children: [
      {
        href: "/",
        name: "Document",
        isBlank: true,
      },
      {
        href: "/",
        name: "Tokenomics",
        isBlank: true,
      },
    ],
  },
  {
    title: "Develpoers",
    children: [
      {
        href: "/",
        name: "Github",
        isBlank: true,
      },
      {
        href: "/",
        name: "Bug Bounty",
        isBlank: true,
      },
    ],
  },
  {
    title: "Support",
    children: [
      {
        href: "/",
        name: "FAQ",
        isBlank: true,
      },
      {
        href: "/",
        name: "User Guide",
        isBlank: true,
      },
      {
        href: "/",
        name: "Contact",
        isBlank: true,
      },
    ],
  },
];
