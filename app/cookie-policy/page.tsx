export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose max-w-none">
        <p>
          At stei, we are committed to protecting your privacy and ensuring a transparent user experience. This Cookie
          Policy explains how and why we use cookies on our website. By continuing to browse or use our website, you
          agree to our use of cookies in accordance with this policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device (computer, smartphone, or tablet) when you visit a website.
          They help websites recognise your device, enhance functionality, and improve the user experience. Cookies may
          be temporary (session cookies) or permanent (persistent cookies).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
        <p>We use cookies for several reasons, including:</p>
        <ul className="list-disc pl-6 mt-4 mb-4">
          <li>
            <strong>Essential Cookies:</strong> These are necessary for the website to function properly, enabling core
            features such as secure login and account management.
          </li>
          <li>
            <strong>Performance and Analytics Cookies:</strong> These cookies help us understand how visitors interact
            with our website, allowing us to improve usability and performance.
          </li>
          <li>
            <strong>Functional Cookies:</strong> These cookies enable enhanced functionality, such as remembering user
            preferences and personalisation.
          </li>
          <li>
            <strong>Advertising and Third-Party Cookies:</strong> These cookies are used by third-party services to
            deliver relevant advertisements and track the effectiveness of marketing campaigns.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
        <p>Our website may use the following types of cookies:</p>

        <div className="overflow-x-auto mt-4 mb-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Type of Cookie</th>
                <th className="border border-gray-300 px-4 py-2">Purpose</th>
                <th className="border border-gray-300 px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Session Cookies</td>
                <td className="border border-gray-300 px-4 py-2">Essential for navigation and security</td>
                <td className="border border-gray-300 px-4 py-2">Expires when you close the browser</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Persistent Cookies</td>
                <td className="border border-gray-300 px-4 py-2">Saves preferences and improves experience</td>
                <td className="border border-gray-300 px-4 py-2">Remains on your device until deleted</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Analytics Cookies</td>
                <td className="border border-gray-300 px-4 py-2">Tracks website usage for performance improvements</td>
                <td className="border border-gray-300 px-4 py-2">Varies (Google Analytics: up to 2 years)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Third-Party Cookies</td>
                <td className="border border-gray-300 px-4 py-2">Used for advertising and social media integration</td>
                <td className="border border-gray-300 px-4 py-2">Varies by provider</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Managing and Disabling Cookies</h2>
        <p>You have the right to control and disable cookies. You can manage your cookie preferences by:</p>
        <ul className="list-disc pl-6 mt-4 mb-4">
          <li>
            Adjusting your browser settings to block or delete cookies. Most browsers provide options to refuse or
            delete cookies.
          </li>
          <li>Opting out of third-party advertising cookies</li>
        </ul>
        <p>
          Please note that disabling cookies may impact the functionality of our website and certain features may not
          work as intended.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Third-Party Cookies</h2>
        <p>
          Some third-party services we use may place cookies on your device for tracking and analytics purposes. These
          include:
        </p>
        <ul className="list-disc pl-6 mt-4 mb-4">
          <li>
            <strong>Google Analytics</strong> – To analyse website traffic and user behaviour.
          </li>
          <li>
            <strong>Facebook Pixel</strong> – For marketing and advertising optimisation.
          </li>
          <li>
            <strong>Payment Gateways</strong> – To facilitate secure transactions.
          </li>
        </ul>
        <p>We encourage you to review their privacy policies for more information on how they handle your data.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Updates to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated
          revision date. We encourage you to review this policy periodically to stay informed about our cookie
          practices.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
        <p>If you have any questions about our Cookie Policy or data practices, please contact us.</p>
        <p>By using our website, you consent to our use of cookies in accordance with this policy.</p>

        <p className="mt-8 text-sm text-gray-600">Last updated: March 27, 2025</p>
      </div>
    </div>
  )
}
