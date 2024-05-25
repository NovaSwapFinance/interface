import github from "../../assets/media/GI@2x.png";
import tg from "../../assets/media/TG@2x.png";
import x from "../../assets/media/X@2x.png";
import gitbook from "../../assets/media/gitbook@2x.png";
import email from "../../assets/media/email@2x.png";

export const mediaData = [
  {
    icon: github,
    link: "https://github.com/NovaSwapFinance",
  },
  {
    icon: tg,
    link: "/",
  },
  {
    icon: x,
    link: "https://x.com/NovaSwap_fi",
  },
  {
    icon: gitbook,
    link: "https://docs.novaswap.fi/",
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
        href: "https://docs.novaswap.fi/future/tokenomics",
        name: "Tokenomics",
        isBlank: true,
      },
    ],
  },
  {
    title: "Develpoers",
    children: [
      {
        href: "https://github.com/NovaSwapFinance",
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
