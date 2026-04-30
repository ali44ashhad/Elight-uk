import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

export function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', icon: 'M13.5 8.25H15V6h-1.5A3.75 3.75 0 0 0 9.75 9.75V11H8v2.25h1.75V18h2.25v-4.75H15V11h-3V9.75c0-.83.67-1.5 1.5-1.5Z' },
    { name: 'Instagram', icon: 'M8 5.25A2.75 2.75 0 0 0 5.25 8v8A2.75 2.75 0 0 0 8 18.75h8A2.75 2.75 0 0 0 18.75 16V8A2.75 2.75 0 0 0 16 5.25H8Zm0-1.5h8A4.25 4.25 0 0 1 20.25 8v8A4.25 4.25 0 0 1 16 20.25H8A4.25 4.25 0 0 1 3.75 16V8A4.25 4.25 0 0 1 8 3.75Zm4 3A4.25 4.25 0 1 0 16.25 11 4.25 4.25 0 0 0 12 6.75Zm0 1.5A2.75 2.75 0 1 1 9.25 11 2.75 2.75 0 0 1 12 8.25Zm4.13-2.02a.88.88 0 1 0 .87.88.88.88 0 0 0-.87-.88Z' },
    { name: 'LinkedIn', icon: 'M6.06 6a1.56 1.56 0 1 1-3.12 0 1.56 1.56 0 0 1 3.12 0ZM3 9h3v9H3Zm5 0h2.88v1.26h.04A3.16 3.16 0 0 1 14.6 9c3.17 0 3.75 2.08 3.75 4.8V18H15v-3.6c0-.86-.02-1.97-1.2-1.97-1.2 0-1.38.94-1.38 1.9V18H8Z' },
    { name: 'YouTube', icon: 'M9.75 15.02v-6l4.5 3-4.5 3ZM4.5 6.75h15c.83 0 1.5.67 1.5 1.5v7.5c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.75v-7.5c0-.83.67-1.5 1.5-1.5Z' },
    { name: 'WhatsApp', icon: 'M12.04 3.5A8.5 8.5 0 0 0 4.3 16.72L3 21l4.4-1.27A8.5 8.5 0 1 0 12.04 3.5Zm0 1.5a7 7 0 1 1-3.6 13.02l-.26-.15-2.6.75.77-2.5-.17-.26A7 7 0 0 1 12.04 5Zm-2.2 2.75c-.2 0-.5.06-.78.37-.27.3-1.02.99-1.02 2.4 0 1.4 1.04 2.75 1.19 2.94.15.2 2.03 3.22 5.02 4.2 2.48.83 2.98.7 3.52.65.54-.06 1.74-.7 1.98-1.37.25-.68.25-1.26.18-1.37-.07-.12-.27-.19-.57-.34-.3-.16-1.78-.9-2.06-1.01-.27-.1-.47-.16-.67.17-.2.32-.77 1-1 1.21-.18.17-.36.19-.66.05-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.32-.02-.48.12-.63.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.16-.62-1.5-.86-2.06-.22-.53-.44-.54-.64-.55Z' }
  ];

  const productTypes = [ 
    [ 'Buy To Let Single','R2RSA', 'R2RHMO', 'Buy To Let HMO', 'Buy To Let SA', 'FLIP', 'BRRR']
  ];

  const footerLinks = [
    'Home',
    'About us',
    'Bespoke Property Connect',
    'Buyer Terms',
    'Seller Terms',
    'Privacy Policy',
    'Property Connect',
    'Refunds'
  ];

  return (
    <footer className="relative bg-slate-900 text-slate-300"> 
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

      <div className="mx-auto max-w-7xl px-4 py-16"> 
        <div className="flex flex-col items-center gap-12 border-b border-slate-800 pb-12 md:flex-row md:items-start md:justify-between">
 
          <div className="text-center md:text-left">
            <img src={logo} alt="Global Deal Sourcing" className="mx-auto h-16 w-auto md:mx-0" />
            <p className="mt-3 text-xs font-light tracking-wider text-slate-400">
              Buying or Renting Property For Business
            </p>
          </div>
 
          <div className="space-y-3 text-center md:text-right">
            {productTypes.map((row, idx) => (
              <div key={idx} className="flex flex-wrap justify-center gap-3 text-xs md:justify-end">
                {row.map((item, i) => (
                  <span key={i} className="inline-flex items-center">
                    <span className="text-emerald-400 mx-1 last:hidden">•</span>
                    <span className="font-medium text-slate-200 hover:text-emerald-400 transition-colors cursor-default">
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div> 
        <div className="flex flex-col items-center gap-8 border-b border-slate-800 py-12 md:flex-row md:justify-between">
 
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
            {footerLinks.map((link, idx) => (
              <span key={link} className="inline-flex items-center gap-x-3">
                <Link
                  to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-slate-400 transition-colors hover:text-emerald-400"
                >
                  {link}
                </Link>
                {idx < footerLinks.length - 1 ? (
                  <span aria-hidden="true" className="text-slate-600">
                    |
                  </span>
                ) : null}
              </span>
            ))}
          </nav> 
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href="#"
                aria-label={social.name}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 transition-all hover:border-emerald-500 hover:bg-emerald-500/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-slate-400 transition-colors group-hover:fill-emerald-400"
                >
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div> 
        <div className="pt-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-800/50 px-4 py-1.5">
            <span className="text-xs font-medium text-slate-300">PIMS</span>
            <span className="h-4 w-px bg-slate-700" />
            <span className="text-xs text-slate-400">Registered</span>
          </div>

          <p className="mx-auto max-w-3xl text-xs font-light leading-relaxed text-slate-400">
          Globcal Properties is a trading name of Adamas Aureum Deal Sourcing Ltd Registered in England and Wales No.17174020. Registered Office: 2nd Floor College House, 17 King Edwards Road, Ruislip, London, United Kingdom, HA4 7AE.  Contact: dealsourcing@globcalproperties.co.uk ------------ 
          </p>

          <div className="mt-6 text-xs text-slate-500">
            © {year} ALL RIGHTS ARE RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}