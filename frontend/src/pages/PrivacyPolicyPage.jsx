import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />

      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <section>
          <h1 className="text-3xl font-black tracking-tight text-teal-900">Privacy Policy</h1>
          <p className="mt-3 text-sm font-semibold text-teal-900">Last updated: April 2026</p>
        </section>

        <section className="space-y-6 text-sm leading-relaxed text-teal-900">
          <div>
            <h2 className="text-lg font-bold text-teal-900">1. Introduction</h2>
            <p className="mt-2">
              This Privacy Policy explains how personal data is collected, used, stored, and protected when you interact
              with this website or engage with our services. We are committed to protecting your privacy and to
              processing personal data lawfully, fairly, and transparently in accordance with the UK General Data
              Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">2. Company and Data Controller Details</h2>
            <p className="mt-2">For the purposes of UK data protection legislation, the data controller is:</p>
            <div className="mt-2 space-y-1">
              <p>Adamas Aureum Deal Sourcing Ltd, trading as Globcal Properties  (Company Number: 17174020)</p>
              <p>
                Registered Office: 2nd Floor College House, 17 King Edwards Road, Ruislip, London, United Kingdom,
                HA4 7AE
              </p>
              <p>
                “Globcal Properties” and “Globcal Property Connect” are trading names and not separate legal entities.
              </p>
              <p>
                References in this Privacy Policy to “we”, “us”, or “our” refer solely to Adamas-Aureum Deal Sourcing
                Ltd, in compliance with Companies Act 2006 disclosure requirements.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">3. Scope of This Privacy Policy</h2>
            <p className="mt-2">This policy applies to personal data collected through:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>The website www.globcalproperties.co.uk</li>
              <li>Business to business enquiries and communications</li>
              <li>Client, investor, and introducer relationships</li>
              <li>Email, telephone, or written correspondence</li>
            </ul>
            <p className="mt-2">
              It does not apply to third party websites or platforms which may be linked from our website.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">4. Personal Data We Collect</h2>
            <p className="mt-2">We may collect and process the following categories of personal data:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Identity data – name, business name, job title</li>
              <li>Contact data – email address, telephone number, business address</li>
              <li>Business information – property requirements, investment preferences, sourcing criteria</li>
              <li>Technical data – IP address, browser type, device and usage data</li>
              <li>Communications data – emails, messages, enquiry forms, and correspondence</li>
            </ul>
            <p className="mt-2">We do not intentionally collect personal data from children.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">5. Lawful Basis for Processing</h2>
            <p className="mt-2">We process personal data only where a lawful basis exists, including:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Contractual necessity – to enter into or perform a contract</li>
              <li>
                Legitimate interests – to operate and grow our business, provided such interests are not overridden by
                your rights
              </li>
              <li>Legal obligation – to comply with applicable laws and regulations</li>
              <li>Consent – where expressly provided (for example, marketing communications)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">6. How We Use Personal Data</h2>
            <p className="mt-2">Personal data may be used to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Respond to enquiries and provide requested information</li>
              <li>Deliver services and manage business relationships</li>
              <li>Conduct compliance checks and maintain business records</li>
              <li>Improve website performance and user experience</li>
              <li>Communicate updates relevant to our business relationship</li>
            </ul>
            <p className="mt-2">We do not sell, rent, or trade personal data.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">7. Data Sharing and Disclosure</h2>
            <p className="mt-2">We may share personal data with:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Professional advisers (legal, accounting, compliance)</li>
              <li>IT, hosting, and website service providers</li>
              <li>Regulatory, law enforcement, or governmental bodies where legally required</li>
            </ul>
            <p className="mt-2">
              Any third party processing personal data on our behalf is required to do so securely and lawfully.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">8. International Data Transfers</h2>
            <p className="mt-2">
              Personal data is primarily processed within the United Kingdom. Where data is transferred outside the UK,
              appropriate safeguards will be implemented to ensure compliance with UK GDPR.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">9. Data Retention</h2>
            <p className="mt-2">Personal data is retained only for as long as necessary to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Fulfil contractual and legal obligations</li>
              <li>Satisfy regulatory and accounting requirements</li>
              <li>Support legitimate business purposes</li>
            </ul>
            <p className="mt-2">Data is securely deleted when no longer required.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">10. Your Data Protection Rights</h2>
            <p className="mt-2">Under UK data protection law, you have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request erasure of personal data (where applicable)</li>
              <li>Object to or restrict processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-2">Requests should be made in writing using the contact details below.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">11. Data Security</h2>
            <p className="mt-2">
              We take appropriate technical and organisational measures to protect personal data against unauthorised
              access, loss, misuse, or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">12. Cookies</h2>
            <p className="mt-2">
              This website may use cookies or similar technologies to improve functionality and analytics. You can
              control cookie settings through your browser. A separate Cookie Policy may apply.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">13. Contact Information</h2>
            <p className="mt-2">For privacy related enquiries or to exercise your data rights, contact:</p>
            <div className="mt-2 space-y-1">
              <p>Adamas Aureum Deal Sourcing Ltd, trading as Globcal Properties (Company Number: 17174020)</p>
              <p>
                Registered Office: 2nd Floor College House, 17 King Edwards Road, Ruislip, London, United Kingdom,
                HA4 7AE
              </p>
              <p>Email: [privacy@glocalproperties.co.uk]</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">14. Changes to This Privacy Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. The most current version will always be published on
              our website.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

