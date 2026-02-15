import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recon Helper - Penetration Testing Command Builder",
  description:
    "Build and customize penetration testing commands for recon phase - nmap, ffuf, gobuster, and more",
};

const navItems = [
  {
    href: "/port-scan",
    icon: "nf nf-md-serial_port",
    label: "Port Scan",
  },
  {
    href: "/fuzzing",
    icon: "nf nf-cod-search_fuzzy",
    label: "Fuzzing",
  },
  {
    href: "/subdomain",
    icon: "nf nf-md-dns",
    label: "Subdomains",
  },
  {
    href: "/vuln-scan",
    icon: "nf nf-md-shield_search",
    label: "Vuln Scan",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="drawer drawer-open">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content p-4 md:p-6">
            <div className="flex flex-col gap-4">{children}</div>
          </div>

          <div className="drawer-side is-drawer-close:overflow-visible">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            />
            <div className="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-200 flex flex-col items-start min-h-full">
              {/* App title */}
              <div className="p-4 is-drawer-close:p-2 border-b border-base-300 w-full">
                <h1 className="font-bold text-lg is-drawer-close:hidden">
                  Recon Helper
                </h1>
                <span className="is-drawer-open:hidden text-xl font-bold flex items-center justify-center w-full aspect-square">
                  R
                </span>
              </div>

              {/* Navigation */}
              <ul className="menu w-full grow">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip={item.label}
                    >
                      <i
                        className={`inline-block size-4 my-1.5 ${item.icon}`}
                      />
                      <span className="is-drawer-close:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="p-2 border-t border-base-300 w-full">
                <div
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Toggle sidebar"
                >
                  <label
                    htmlFor="my-drawer-4"
                    className="btn btn-ghost btn-sm w-full justify-start drawer-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2"
                      fill="none"
                      stroke="currentColor"
                      className="inline-block size-4 transition-transform is-drawer-open:scale-x-[-1]"
                      aria-hidden="true"
                    >
                      <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                      <path d="M9 4v16" />
                      <path d="M14 10l2 2l-2 2" />
                    </svg>
                    <span className="is-drawer-close:hidden ml-2">
                      Collapse
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
