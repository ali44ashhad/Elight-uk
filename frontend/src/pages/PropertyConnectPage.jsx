import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'

export function PropertyConnectPage() {
  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />

      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <section>
          <h1 className="text-3xl font-black tracking-tight text-teal-900">Property Connect Terms and Conditions</h1>
          <p className="mt-2 text-sm font-semibold text-teal-900">(Business to Business – Information Access Only)</p>
          <p className="mt-3 text-sm font-semibold text-teal-900">Last updated: April 2026</p>
        </section>

        <section className="space-y-6 text-sm leading-relaxed text-teal-900">
          <div>
            <h2 className="text-lg font-bold text-teal-900">1. Background and Purpose</h2>
            <div className="mt-2 space-y-2">
              <p>1.1 These Terms govern access to anonymised property information made available via the Platform.</p>
              <p>
                1.2 The Introducer operates a digital platform facilitating access to property information supplied by
                third party owners or sellers.
              </p>
              <p>
                1.3 An anonymised Preview of a Property is made available together with the applicable Preview Payment.
              </p>
              <p>1.4 Payment of the Preview Payment constitutes unconditional acceptance of these Conditions.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">2. Definitions and Interpretation</h2>
            <div className="mt-2 space-y-1">
              <p>
                “Business Day” means a day other than a Saturday, Sunday or public holiday in England when banks in
                London are open.
              </p>
              <p>
                “Cancellation Period” means ten (10) Business Days following receipt of the Preview Payment in cleared
                funds.
              </p>
              <p>“Conditions” means these Deal Sourcing Terms and Conditions.</p>
              <p>“Information Sheet” means the property information supplied by the Owner and released to the User.</p>
              <p>
                “Introducer” means Globcal Properties Ltd (trading as Globcal Property Connect), registered in England
                and Wales (Company No. XXXXXXXX) with registered office at 205 Regent Street, London, W1B 4HB.
              </p>
              <p>
                “Objection” means a written allegation of a material factual inconsistency between the Preview and the
                Information Sheet.
              </p>
              <p>“Owner” means the party supplying the property information.</p>
              <p>“Platform” means www.globcalproperties.co.uk (or any replacement domain).</p>
              <p>“Preview” means the anonymised summary of the Property made available prior to purchase.</p>
              <p>“Preview Payment” means the payment required to access the Information Sheet.</p>
              <p>“Property” means the property described in the Preview.</p>
              <p>“User” means a person acting wholly in the course of business who pays the Preview Payment.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">3. Basis of Service</h2>
            <div className="mt-2 space-y-2">
              <p>3.1 Upon receipt of cleared funds, the Introducer shall grant the User access to the Information Sheet.</p>
              <p>
                3.2 The Preview Payment is payment for access to information only and does not constitute a deposit,
                reservation fee or part payment toward any transaction.
              </p>
              <p>
                3.3 The Introducer may request identification or verification documents and may delay or withhold access
                where required for compliance, fraud prevention, or risk mitigation.
              </p>
              <p>3.4 The User confirms it is acting wholly in the course of business and not as a consumer.</p>
              <p>3.5 Upon release of the Information Sheet, the Services are deemed fully performed.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">4. Status of the Introducer</h2>
            <div className="mt-2 space-y-2">
              <p>4.1 The Introducer acts solely as a digital platform provider.</p>
              <p>
                4.2 All Previews and Information Sheets are supplied by the Owner. The Introducer does not verify,
                audit or independently confirm their accuracy.
              </p>
              <p>4.3 The Introducer does not act as an estate agent within the meaning of the Estate Agents Act 1979.</p>
              <p>4.4 The Introducer does not provide legal, financial, tax or investment advice.</p>
              <p>
                4.5 The User must conduct independent due diligence and shall not rely on the Introducer when making
                any acquisition or investment decision.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">5. Liability</h2>
            <div className="mt-2 space-y-2">
              <p>5.1 To the fullest extent permitted by law, the Introducer shall not be liable for:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>indirect or consequential loss;</li>
                <li>loss of profit, opportunity or goodwill;</li>
                <li>reliance upon any Preview or Information Sheet.</li>
              </ul>
              <p>
                5.2 The total aggregate liability of the Introducer shall not exceed the Preview Payment received in
                respect of the relevant Property.
              </p>
              <p>5.3 Nothing limits liability for fraud or death or personal injury caused by negligence.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">6. Cancellation and Refunds</h2>
            <div className="mt-2 space-y-2">
              <p>6.1 The User may request cancellation within the Cancellation Period by written notice.</p>
              <p>6.2 Any Objection must:</p>
              <div className="mt-2 space-y-1 pl-4">
                <p>(a) be made in writing;</p>
                <p>(b) clearly identify the alleged material factual inconsistency; and</p>
                <p>(c) be supported by reasonable evidence.</p>
              </div>
              <p>6.3 The Introducer shall assess the Objection reasonably and in good faith.</p>
              <p>
                6.4 Where a material factual inconsistency attributable to the Owner is established, the Preview
                Payment shall be refunded in full.
              </p>
              <p>
                6.5 Where cancellation is requested without substantiated Owner default, 82% of the Preview Payment
                shall be refunded and 18% retained as a reasonable reflection of costs incurred, including compliance
                checks, platform operation, technical processing, and administration.
              </p>
              <p>6.6 No refund shall be due after expiry of the Cancellation Period.</p>
              <p>
                6.7 If a User receives any refund and subsequently acquires or participates in the acquisition of the
                Property, the User shall immediately repay the full Preview Payment upon demand.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">7. Chargeback Protection</h2>
            <div className="mt-2 space-y-2">
              <p>7.1 The User shall not initiate a chargeback except where a refund is expressly due under clause 6.4.</p>
              <p>7.2 Any unauthorised chargeback constitutes a material breach.</p>
              <p>7.3 The User shall indemnify the Introducer against all chargeback related losses, fees, and administrative costs.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">8. Confidentiality and Non Circumvention</h2>
            <div className="mt-2 space-y-2">
              <p>8.1 The Information Sheet and all related materials are confidential.</p>
              <p>8.2 The User shall not disclose the Information without prior written consent.</p>
              <p>
                8.3 Disclosure resulting in acquisition of the Property by the User or any connected party shall entitle
                the Introducer to recover the full Preview Payment and any applicable fees.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">9. Data Protection</h2>
            <div className="mt-2 space-y-2">
              <p>9.1 Personal data shall be processed in accordance with the Privacy Policy available on the Platform.</p>
              <p>9.2 Each party shall comply with UK GDPR and the Data Protection Act 2018.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">10. General</h2>
            <div className="mt-2 space-y-2">
              <p>10.1 Entire agreement.</p>
              <p>10.2 Nothing creates partnership, agency or joint venture.</p>
              <p>10.3 Force majeure applies.</p>
              <p>10.4 The User may not assign rights without consent.</p>
              <p>10.5 Governing law: England and Wales.</p>
              <p>10.6 Exclusive jurisdiction: Courts of England and Wales.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

