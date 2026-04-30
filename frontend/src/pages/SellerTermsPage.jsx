import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'

export function SellerTermsPage() {
  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />

      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <section>
          <h1 className="text-3xl font-black tracking-tight text-teal-900">Seller Terms and Conditions</h1>
          <p className="mt-2 text-sm font-semibold text-teal-900">(Business to Business)</p>
          <p className="mt-3 text-sm font-semibold text-teal-900">Last updated: April 2026</p>
        </section>

        <section className="space-y-6 text-sm leading-relaxed text-teal-900">
          <div>
            <h2 className="text-lg font-bold text-teal-900">1. Definitions and Interpretation</h2>
            <p className="mt-2">In these Seller Terms and Conditions, the following definitions apply:</p>
            <div className="mt-2 space-y-1">
              <p>“Administration Fee” means the non refundable administrative fee of £150.</p>
              <p>
                “Business Day” means a day other than a Saturday, Sunday or public holiday in England when banks in
                London are open for business.
              </p>
              <p>
                “Cancellation Period” means ten (10) Business Days following receipt of a Preview Payment in cleared
                funds.
              </p>
              <p>“Commission” means the percentage of the Preview Payment specified in the Particulars.</p>
              <p>“Commencement Date” means the date on which Acceptance occurs.</p>
              <p>“Conditions” means these Seller Terms and Conditions as amended from time to time.</p>
              <p>“Contract” means the agreement formed under clause 2 between the Introducer and the Seller.</p>
              <p>“Information” means all information supplied by the Seller relating to the Property.</p>
              <p>“Information Sheet” means the detailed property information released to an Interested Party.</p>
              <p>
                “Interested Party” means any party that pays a Preview Payment to access the Information Sheet.
              </p>
              <p>“Platform” means the digital platform operated at www.globcalproperties.co.uk (or any replacement domain).</p>
              <p>“Preview” means the redacted summary of the Property prior to release of the Information Sheet.</p>
              <p>“Preview Payment” means the payment made by an Interested Party.</p>
              <p>“Property” means the property specified in the Particulars.</p>
              <p>“Seller” means the business entity submitting Property Information to the Platform.</p>
              <p>“Services” means the services described in clause 3.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">2. Basis of Contract</h2>
            <div className="mt-2 space-y-2">
              <p>
                2.1 Submission of Information by the Seller constitutes an offer to engage the Services subject to these
                Conditions.
              </p>
              <p>
                2.2 The Contract is formed when the Preview is uploaded to the Platform by the Introducer (“Acceptance”).
              </p>
              <p>2.3 These Conditions apply to the exclusion of any other terms or conditions.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">3. Supply of Services</h2>
            <div className="mt-2 space-y-2">
              <p>3.1 The Introducer shall, acting with reasonable care and skill:</p>
              <div className="mt-2 space-y-1 pl-4">
                <p>(a) publish and maintain the Preview during the designated listing period;</p>
                <p>(b) receive Preview Payments from Interested Parties;</p>
                <p>(c) release the Information Sheet following expiry of the Cancellation Period;</p>
                <p>(d) account to the Seller for Preview Payments subject to these Conditions;</p>
                <p>
                  (e) reserve the right to withhold release or payment where reasonably required for compliance, fraud
                  prevention, or risk mitigation.
                </p>
              </div>
              <p>3.2 The Introducer may amend, suspend, or remove any listing at its discretion and without liability.</p>
              <p>3.3 The Seller acknowledges that the Services are limited to platform facilitation only.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">4. Status of the Introducer</h2>
            <div className="mt-2 space-y-2">
              <p>4.1 The Introducer acts solely as a digital platform provider.</p>
              <p>4.2 The Introducer does not:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>act as an estate agent within the meaning of the Estate Agents Act 1979;</li>
                <li>negotiate, market, arrange or conclude any property transaction;</li>
                <li>provide legal, financial, tax or investment advice;</li>
                <li>act as agent, fiduciary, broker, or representative of the Seller.</li>
              </ul>
              <p>4.3 Nothing in this Contract creates a partnership, agency, or joint venture.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">5. Seller Obligations</h2>
            <div className="mt-2 space-y-2">
              <p>5.1 The Seller warrants and represents that:</p>
              <div className="mt-2 space-y-1 pl-4">
                <p>(a) all Information supplied is true, accurate, complete and not misleading;</p>
                <p>(b) it has full legal authority to market the Property;</p>
                <p>(c) no restrictions prevent the lawful disposal of the Property;</p>
                <p>(d) it is not breaching any third party or estate agency agreement;</p>
                <p>(e) all financial figures can be substantiated on request.</p>
              </div>
              <p>5.2 The Seller shall:</p>
              <div className="mt-2 space-y-1 pl-4">
                <p>(a) act in good faith;</p>
                <p>(b) comply with all applicable legal and regulatory obligations;</p>
                <p>(c) promptly notify the Introducer of any material change affecting the Property or Information.</p>
              </div>
              <p>
                5.3 During the listing period, the Seller shall not market or dispose of the Property outside the
                Platform without prior written consent.
              </p>
              <p>
                5.4 Failure to comply may result in suspension, removal of the listing, administrative charges, or
                permanent removal from the Platform.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">6. Preview Payments</h2>
            <div className="mt-2 space-y-2">
              <p>6.1 Preview Payments shall be held during the Cancellation Period.</p>
              <p>
                6.2 Where a substantiated material factual inaccuracy in the Preview is established, the Preview Payment
                shall be refunded to the Interested Party.
              </p>
              <p>
                6.3 Subject to clause 6.2, Preview Payments shall be accounted to the Seller less Commission and the
                Administration Fee.
              </p>
              <p>
                6.4 The Introducer may delay or withhold payment where required to comply with anti money laundering
                legislation or where suspicious activity is identified.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">7. Commission and Non Circumvention</h2>
            <div className="mt-2 space-y-2">
              <p>7.1 Commission shall be deducted as specified in the Particulars.</p>
              <p>
                7.2 For a period of twelve (12) months from the date of introduction, the Seller shall not directly or
                indirectly enter into any transaction with an Interested Party introduced via the Platform without
                accounting to the Introducer for Commission.
              </p>
              <p>7.3 This clause survives termination of the Contract.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">8. Intellectual Property</h2>
            <p className="mt-2">
              All intellectual property rights in the Platform, Services, and associated materials remain the property
              of the Introducer. The Seller is granted no rights other than as necessary to use the Services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">9. Data Protection</h2>
            <div className="mt-2 space-y-2">
              <p>9.1 For the purposes of UK data protection legislation, the data controller is:</p>
              <div className="mt-2 space-y-1">
                <p>Adamas Aureum Deal Sourcing Ltd, trading as Globcal Properties (Company Number: 17174020)</p>
                <p>
                  Registered Office: 2nd Floor College House, 17 King Edwards Road, Ruislip, London, United Kingdom,
                  HA4 7AE
                </p>
              </div>
              <p>9.2 Personal data shall be processed in accordance with the Privacy Policy published on the Platform.</p>
              <p>9.3 Each party shall comply with UK GDPR and the Data Protection Act 2018.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">10. Liability and Indemnity</h2>
            <div className="mt-2 space-y-2">
              <p>10.1 The Introducer shall not be liable for:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>indirect or consequential loss;</li>
                <li>loss of profit, goodwill or opportunity;</li>
                <li>reliance on any Information supplied by the Seller.</li>
              </ul>
              <p>
                10.2 The total aggregate liability of the Introducer shall not exceed the Commission received under the
                Contract.
              </p>
              <p>
                10.3 The Seller shall indemnify the Introducer against all losses arising from inaccurate, misleading,
                or unlawful Information supplied.
              </p>
              <p>10.4 Nothing limits liability for fraud or death or personal injury caused by negligence.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">11. Termination</h2>
            <div className="mt-2 space-y-2">
              <p>11.1 Either party may terminate the Contract on five (5) Business Days’ written notice.</p>
              <p>11.2 The Introducer may terminate immediately in the event of material breach.</p>
              <p>11.3 Termination shall not affect accrued rights or clause 7.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">12. General</h2>
            <div className="mt-2 space-y-2">
              <p>12.1 Entire agreement.</p>
              <p>12.2 Force majeure.</p>
              <p>12.3 No assignment without prior written consent.</p>
              <p>12.4 Confidentiality obligations apply.</p>
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

