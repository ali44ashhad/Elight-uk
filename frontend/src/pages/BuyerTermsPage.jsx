import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'

export function BuyerTermsPage() {
  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />

      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <section>
          <h1 className="text-3xl font-black tracking-tight text-teal-900">Buyer Terms and Conditions</h1>
          <p className="mt-2 text-sm font-semibold text-teal-900">(Business to Business)</p>
          <p className="mt-3 text-sm font-semibold text-teal-900">Last updated: April 2026</p>
        </section>

        <section className="space-y-6 text-sm leading-relaxed text-teal-900">
          <div>
            <h2 className="text-lg font-bold text-teal-900">1. Definitions and Interpretation</h2>
            <p className="mt-2">In these Terms, the following definitions apply:</p>
            <div className="mt-2 space-y-1">
              <p>“Administration Fee” means the non refundable administrative fee of £150.</p>
              <p>
                “Business Day” means a day other than a Saturday, Sunday or public holiday in England when banks in
                London are open for business.
              </p>
              <p>
                “Cancellation Period” means ten (10) Business Days from receipt of the Preview Payment in cleared
                funds.
              </p>
              <p>“Commission” means the commission percentage specified in the Particulars.</p>
              <p>“Commencement Date” means the date on which Acceptance occurs in accordance with clause 2.2.</p>
              <p>“Conditions” means these Buyer Terms and Conditions as amended from time to time.</p>
              <p>“Contract” means the legally binding agreement formed under clause 2.</p>
              <p>“Customer” means the business entity submitting Information to the Platform.</p>
              <p>“Information” means all information supplied by the Customer in respect of the Property.</p>
              <p>
                “Information Sheet” means the detailed property information released following payment of the Preview
                Payment.
              </p>
              <p>“Interested Party” means any person or entity that pays the Preview Payment.</p>
              <p>“Platform” means the digital platform operated at www.globcalproperties.co.uk (or any replacement domain).</p>
              <p>“Preview” means the redacted property summary displayed prior to payment.</p>
              <p>“Preview Payment” means the payment required to access the Information Sheet.</p>
              <p>“Property” means the property described in the Particulars.</p>
              <p>“Services” means the services described in clause 3.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">2. Basis of Contract</h2>
            <div className="mt-2 space-y-2">
              <p>2.1 These Conditions apply exclusively to all Services provided.</p>
              <p>
                2.2 The Contract is formed when the Preview is uploaded to the Platform by the Introducer (“Acceptance”).
              </p>
              <p>2.3 Any other terms proposed by the Customer are rejected unless expressly agreed in writing.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">3. Supply of Services</h2>
            <div className="mt-2 space-y-2">
              <p>3.1 The Introducer shall, acting with reasonable care and skill:</p>
              <div className="mt-2 space-y-1 pl-4">
                <p>(a) publish and maintain the Preview during the designated listing period;</p>
                <p>(b) receive and temporarily hold Preview Payments during the Cancellation Period;</p>
                <p>(c) release the Information Sheet upon expiry of the Cancellation Period;</p>
                <p>(d) withhold release where reasonably required for compliance, fraud prevention or risk mitigation;</p>
                <p>(e) account to the Customer subject to these Terms.</p>
              </div>
              <p>
                3.2 The Introducer reserves the right to amend, suspend or remove any listing at its discretion and
                without liability.
              </p>
              <p>3.3 The Services are limited to platform facilitation and do not constitute estate agency services.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">4. Status of the Introducer</h2>
            <div className="mt-2 space-y-2">
              <p>4.1 The Introducer acts solely as a digital platform provider.</p>
              <p>4.2 The Introducer does not:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>act as estate agent within the meaning of the Estate Agents Act 1979;</li>
                <li>negotiate, market or arrange the sale of any Property;</li>
                <li>provide legal, financial or investment advice;</li>
                <li>act as agent, broker, fiduciary or representative of any party.</li>
              </ul>
              <p>4.3 No authority is granted to bind any party.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">5. Customer Obligations</h2>
            <div className="mt-2 space-y-2">
              <p>5.1 The Customer warrants that all Information supplied is accurate, complete, lawful and not misleading.</p>
              <p>5.2 The Customer confirms it holds full authority to market the Property.</p>
              <p>5.3 The Customer shall comply with all applicable legal and regulatory obligations.</p>
              <p>
                5.4 The Customer shall promptly notify the Introducer of any material change affecting the Property or
                Information.
              </p>
              <p>
                5.5 During the listing period, the Customer shall not market or dispose of the Property outside the
                Platform without written consent.
              </p>
              <p>5.6 Failure to comply may result in suspension, removal, and charge of an Administration Fee.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">6. Preview Payments</h2>
            <div className="mt-2 space-y-2">
              <p>6.1 Preview Payments shall be held during the Cancellation Period.</p>
              <p>6.2 Where a substantiated material inaccuracy is established, the Preview Payment shall be refunded.</p>
              <p>
                6.3 Subject to compliance, payments shall be accounted to the Customer less Commission and
                Administration Fee.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">7. Commission and Non Circumvention</h2>
            <div className="mt-2 space-y-2">
              <p>7.1 Commission shall be deducted as specified in the Particulars.</p>
              <p>
                7.2 For twelve (12) months following introduction, the Customer shall not transact directly or
                indirectly with any Interested Party introduced via the Platform without accounting to the Introducer
                for Commission.
              </p>
              <p>7.3 This clause survives termination.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">8. Intellectual Property</h2>
            <p className="mt-2">
              All intellectual property rights in the Platform and Services remain the property of the Introducer. No
              licence is granted except as necessary to use the Services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">9. Data Protection</h2>
            <div className="mt-2 space-y-2">
              <p>9.1 The data controller is:</p>
              <div className="mt-2 space-y-1">
                <p>
                  Adamas Aureum Deal Sourcing Ltd, trading as Globcal Properties{'  '}
                  (Company Number: 17174020)
                </p>
                <p>
                  Registered Office: 2nd Floor College House, 17 King Edwards Road, Ruislip, London, United Kingdom,
                  HA4 7AE
                </p>
              </div>
              <p>9.2 All personal data shall be processed in accordance with the Privacy Policy available on the Platform.</p>
              <p>9.3 Each party shall comply with UK GDPR and the Data Protection Act 2018.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">10. Liability and Indemnity</h2>
            <div className="mt-2 space-y-2">
              <p>
                10.1 The Introducer shall not be liable for indirect or consequential loss, loss of profit, or reliance
                on Information.
              </p>
              <p>10.2 Total aggregate liability shall not exceed the Commission received.</p>
              <p>
                10.3 The Customer shall indemnify the Introducer against losses arising from inaccurate or unlawful
                Information.
              </p>
              <p>10.4 Nothing excludes liability for fraud or death or personal injury caused by negligence.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">11. Termination</h2>
            <div className="mt-2 space-y-2">
              <p>11.1 Either party may terminate on five (5) Business Days’ written notice.</p>
              <p>11.2 The Introducer may terminate immediately for material breach.</p>
              <p>11.3 Termination does not affect accrued rights or clause 7.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">12. General</h2>
            <div className="mt-2 space-y-2">
              <p>12.1 Entire agreement.</p>
              <p>12.2 Force majeure applies.</p>
              <p>12.3 No assignment without consent.</p>
              <p>12.4 Confidentiality applies.</p>
              <p>12.5 Independent contractors; no partnership or agency.</p>
              <p>12.6 Governing law: England and Wales.</p>
              <p>12.7 Exclusive jurisdiction: Courts of England and Wales.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

