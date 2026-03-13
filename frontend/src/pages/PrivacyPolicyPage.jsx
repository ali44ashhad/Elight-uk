import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />

      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <section>
          <h1 className="text-3xl font-black tracking-tight text-teal-900">Privacy Policy</h1>
          <p className="mt-3 text-sm text-teal-800">
            This Privacy Policy explains how we collect, use, and protect your personal information when you use our
            website and services.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-teal-900">
          <div>
            <h2 className="text-lg font-bold text-teal-900">1. Information we collect</h2>
            <p className="mt-2">
              We collect the information you provide directly to us, such as your name, email address, phone number,
              budget, and any messages you submit via our contact forms or property enquiry forms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">2. How we use your information</h2>
            <p className="mt-2">
              We use your information to respond to your enquiries, provide information about property opportunities,
              manage relationships with investors, and operate and improve our services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">3. Sharing of information</h2>
            <p className="mt-2">
              We do not sell your personal data. We may share your information with carefully selected partners,
              professional advisers, or service providers where this is necessary to deliver our services or meet legal
              obligations.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">4. Data retention</h2>
            <p className="mt-2">
              We keep your information only for as long as necessary to fulfil the purposes described in this policy or
              as required by law and regulation.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-teal-900">5. Your rights</h2>
            <p className="mt-2">
              Depending on your location, you may have rights to access, update, or delete your personal data, or to
              object to certain types of processing. To exercise these rights, please contact us using the details on
              our website.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

