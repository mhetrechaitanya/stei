import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | stei",
  description: "Privacy Policy for stei - Learn how we collect, use, and protect your information.",
}

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="bg-white">
      {/* Header Banner */}
      <div className="bg-[#D40F14] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg opacity-90">How we collect, use, and protect your information</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-right text-gray-500 mb-6">Last Updated: {currentDate}</p>

            <h2 className="text-2xl font-bold text-[#D40F14] mb-4">Introduction</h2>
            <p>
              Welcome to stei! Your privacy is important to us. Whether you want to learn a new skill, train your teams,
              or share what you know with the world, you're in the right place. As an online empowering platform, we're
              here to help you achieve your goals and transform yourself. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website and use our services, including
              accessing our pre- recorded online training workshops.
            </p>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">1. Information We Collect</h2>
            <p>We may collect and process the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and payment details when you
                register or purchase access to our workshops.
              </li>
              <li>
                <strong>Account Information:</strong> Login credentials and preferences related to your stei account.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with our website, including pages
                visited, time spent on pages, and access logs.
              </li>
              <li>
                <strong>Device Information:</strong> IP address, browser type, device type, and operating system.
              </li>
              <li>
                <strong>Payment Information:</strong> If you purchase any services, we may collect payment details
                through a secure third-party payment gateway.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our website and services.</li>
              <li>Process transactions and manage subscriptions.</li>
              <li>Personalise your learning experience and recommend relevant workshops.</li>
              <li>Communicate with you regarding account updates, promotions, and support.</li>
              <li>Prevent fraud, enforce our Terms of Service, and comply with legal obligations.</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">3. Sharing Your Information</h2>
            <p>We do not sell or rent your personal information. However, we may share it with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Service Providers:</strong> Third-party companies assisting in payment processing, analytics,
                customer support, and marketing.
              </li>
              <li>
                <strong>Legal Compliance:</strong> If required by law or to protect the rights and safety of stei and
                its users.
              </li>
              <li>
                <strong>Business Transfers:</strong> In case of a merger, acquisition, or asset sale, your information
                may be transferred.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">4. Data Security</h2>
            <p>
              We take appropriate measures to protect your information from unauthorised access, alteration, disclosure,
              or destruction. However, no method of data transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">5. Your Rights and Choices</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access & Correction:</strong> You may request access to your personal data and correct
                inaccuracies.
              </li>
              <li>
                <strong>Opt-Out:</strong> You can unsubscribe from promotional emails at any time.
              </li>
              <li>
                <strong>Account Deletion:</strong> You may request account deletion by contacting us.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">6. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance user experience, analyse traffic, and improve
              our services. You can manage cookie preferences through your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for their privacy practices.
              We encourage you to review their policies before providing personal data.
            </p>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated
              revision date. Your continued use of our services after changes take effect constitutes acceptance of the
              revised policy.
            </p>

            <h2 className="text-2xl font-bold text-[#D40F14] mt-8 mb-4">9. Contact Us</h2>
            <p>If you have any questions regarding this Privacy Policy, please contact us at:</p>
            <p className="mt-2">
              <strong>Email:</strong>{" "}
              <a href="mailto:support@stei.pro" className="text-[#D40F14] hover:underline">
                support@stei.pro
              </a>
              <br />
              <strong>Website:</strong>{" "}
              <a href="https://stei.pro/" className="text-[#D40F14] hover:underline">
                https://stei.pro/
              </a>
              <br />
              <strong>Phone:</strong> +91 98765 43210
            </p>

            <p className="mt-8 font-medium">By using stei, you consent to the terms of this Privacy Policy.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
