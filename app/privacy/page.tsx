"use client";

import { motion } from "framer-motion";
import { slideInFromTop } from "@/lib/motion";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full pt-20">
      <section className="relative flex flex-col items-center justify-center py-20 px-4 md:px-8 lg:px-20 overflow-hidden">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInFromTop}
          className="relative z-10 text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-400">
            Last Updated: January 20, 2026
          </p>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="p-8 md:p-12 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm text-gray-300 leading-relaxed">
              
              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  1. Introduction
                </h2>
                <p className="mb-4">
                  M.D.N Tech FZE (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.mdntech.org and use our services.
                </p>
                <div className="bg-[#7042f810] p-6 rounded-lg border border-purple-500/20 my-6">
                  <p className="font-semibold text-white mb-3">Company Details:</p>
                  <ul className="list-none space-y-2 text-gray-300">
                    <li><span className="text-purple-400">Legal Name:</span> M.D.N Tech FZE</li>
                    <li><span className="text-purple-400">Registration:</span> UAQ Free Trade Zone, United Arab Emirates</li>
                    <li><span className="text-purple-400">Address:</span> Al Shmookh Business Center M 1003, One UAQ, UAQ Free Trade Zone, Umm Al Quwain, U.A.E</li>
                    <li><span className="text-purple-400">Contact:</span> contact@mdntech.org</li>
                    <li><span className="text-purple-400">Data Protection Contact:</span> Martin Jerabek (contact@mdntech.org)</li>
                  </ul>
                </div>
                <p>
                  This policy applies to all users globally, including those in the European Union (GDPR compliance) and the United Arab Emirates.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  2. Information We Collect
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">2.1 Information You Provide Directly</h3>
                    <p className="text-gray-300 mb-2">When you interact with our services, we may collect:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Contact Information:</span> Name, email address, phone number, company name</li>
                      <li><span className="font-semibold">Communication Data:</span> Information provided when you schedule a call, including preferred date/time and reason for contact</li>
                      <li><span className="font-semibold">Project Information:</span> Details about your project requirements, technical specifications, and business objectives</li>
                      <li><span className="font-semibold">Account Information:</span> Username, password, and preferences when you create a client account</li>
                      <li><span className="font-semibold">Business Documents:</span> Contracts, agreements, invoices, and other legally required documentation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">2.2 Information Collected Automatically</h3>
                    <p className="text-gray-300 mb-2">When you visit our website, we may automatically collect:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Technical Data:</span> IP address, browser type, device information, operating system</li>
                      <li><span className="font-semibold">Usage Data:</span> Pages visited, time spent on pages, navigation patterns, referral sources</li>
                      <li><span className="font-semibold">Analytics Data:</span> Through Google Analytics (when implemented), including session duration, bounce rates, and user interactions</li>
                      <li><span className="font-semibold">Cookies:</span> As described in our Cookie Policy section below</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">2.3 Information from Third Parties</h3>
                    <p className="text-gray-300 mb-2">We may receive information from:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Hosting Providers:</span> Vercel (frontend hosting) and Railway (backend hosting)</li>
                      <li><span className="font-semibold">Communication Tools:</span> Email service providers</li>
                      <li><span className="font-semibold">Business Partners:</span> Referral partners or collaborators with your consent</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-300 mb-6">
                  We use your personal data for the following purposes:
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.1 Service Delivery</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Providing IT services including AI/ML development, blockchain solutions, full-stack development, mobile app development, UI/UX design, and game development</li>
                      <li>Managing client accounts and project portals</li>
                      <li>Hosting development environments and providing access to work-in-progress projects</li>
                      <li>Storing and managing project files, source code, and deliverables</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.2 Business Operations</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Processing invoices and managing payments</li>
                      <li>Communicating about projects, updates, and service-related matters</li>
                      <li>Scheduling consultations and client calls</li>
                      <li>Maintaining business records and documentation as required by UAE law</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.3 Legal Compliance</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Complying with UAE legal obligations and UAQ Free Zone regulations</li>
                      <li>Maintaining records for tax and accounting purposes</li>
                      <li>Responding to legal requests and preventing fraud</li>
                      <li>Enforcing our Terms & Conditions</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.4 Service Improvement</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Analyzing website usage to improve user experience</li>
                      <li>Understanding client needs and preferences</li>
                      <li>Developing new services and features</li>
                      <li>Testing and optimizing our platform performance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.5 Marketing (with your consent)</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Sending newsletters about our services and industry insights</li>
                      <li>Providing information about new offerings</li>
                      <li>Sharing case studies and project updates (with client approval)</li>
                    </ul>
                  </div>
                  <div className="bg-[#7042f810] p-6 rounded-lg border border-purple-500/20">
                    <p className="font-semibold text-white mb-3">Legal Basis for Processing (GDPR):</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Contractual Necessity:</span> To fulfill our services agreement with you</li>
                      <li><span className="font-semibold">Legitimate Interest:</span> To improve our services and maintain security</li>
                      <li><span className="font-semibold">Legal Obligation:</span> To comply with UAE and international laws</li>
                      <li><span className="font-semibold">Consent:</span> For marketing communications and non-essential cookies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Storage and Security */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  4. Data Storage and Security
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">4.1 Where We Store Your Data</h3>
                    <p className="text-gray-300 mb-2">Your data is stored on secure servers located in:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Frontend Hosting:</span> Vercel&apos;s global infrastructure</li>
                      <li><span className="font-semibold">Backend Hosting:</span> Railway&apos;s secure cloud environment</li>
                      <li><span className="font-semibold">Development Environments:</span> Secure, isolated instances for active projects</li>
                      <li><span className="font-semibold">Document Storage:</span> Encrypted cloud storage for business documents</li>
                    </ul>
                    <p className="text-gray-300 mt-3">
                      We ensure that all data transfers comply with applicable data protection laws, including GDPR requirements for international data transfers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">4.2 Security Measures</h3>
                    <p className="text-gray-300 mb-2">We implement industry-standard security measures including:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Encryption:</span> Data encrypted in transit (TLS/SSL) and at rest</li>
                      <li><span className="font-semibold">Access Controls:</span> Role-based access with strong authentication</li>
                      <li><span className="font-semibold">24/7 Monitoring:</span> Continuous security monitoring of development environments</li>
                      <li><span className="font-semibold">Regular Backups:</span> Automated backup systems to prevent data loss</li>
                      <li><span className="font-semibold">Secure Development:</span> Following secure coding practices and regular security audits</li>
                      <li><span className="font-semibold">Confidentiality Agreements:</span> All team members bound by strict confidentiality obligations</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">4.3 Data Retention</h3>
                    <p className="text-gray-300 mb-2">We retain your personal data only as long as necessary:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Active Projects:</span> Duration of the project plus 2 years for warranty and support purposes</li>
                      <li><span className="font-semibold">Business Records:</span> 7 years as required by UAE commercial law</li>
                      <li><span className="font-semibold">Marketing Data:</span> Until you withdraw consent or request deletion</li>
                      <li><span className="font-semibold">Website Analytics:</span> Anonymized after 26 months (Google Analytics default)</li>
                    </ul>
                    <p className="text-gray-300 mt-3">
                      When data is no longer needed, it is securely deleted or anonymized.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sharing Your Information */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  5. Sharing Your Information
                </h2>
                <p className="text-gray-300 mb-6">
                  We do not sell, rent, or trade your personal information. We may share your data only in the following circumstances:
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.1 Service Providers</h3>
                    <p className="text-gray-300 mb-2">We may share data with trusted third parties who assist in:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Hosting Services:</span> Vercel and Railway for infrastructure</li>
                      <li><span className="font-semibold">Communication:</span> Email service providers for business correspondence</li>
                      <li><span className="font-semibold">Payment Processing:</span> Payment processors for invoice payments (when implemented)</li>
                    </ul>
                    <p className="text-gray-300 mt-3">
                      All service providers are contractually obligated to protect your data and use it only for specified purposes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.2 Legal Requirements</h3>
                    <p className="text-gray-300 mb-2">We may disclose information when required by:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>UAE law or UAQ Free Trade Zone regulations</li>
                      <li>Court orders, legal processes, or government requests</li>
                      <li>Protection of our legal rights or safety of others</li>
                      <li>Investigation of fraud or security issues</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.3 Business Transfers</h3>
                    <p className="text-gray-300">
                      In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity, subject to the same privacy protections.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.4 With Your Consent</h3>
                    <p className="text-gray-300">
                      We may share information for purposes not listed here with your explicit consent.
                    </p>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  6. Your Rights
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">6.1 Rights Under GDPR (for EU/EEA Users)</h3>
                    <p className="text-gray-300 mb-2">You have the right to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Access:</span> Request a copy of your personal data</li>
                      <li><span className="font-semibold">Rectification:</span> Correct inaccurate or incomplete data</li>
                      <li><span className="font-semibold">Erasure:</span> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
                      <li><span className="font-semibold">Restriction:</span> Limit how we process your data</li>
                      <li><span className="font-semibold">Portability:</span> Receive your data in a structured, machine-readable format</li>
                      <li><span className="font-semibold">Object:</span> Object to processing based on legitimate interests</li>
                      <li><span className="font-semibold">Withdraw Consent:</span> Withdraw consent for marketing or cookies at any time</li>
                      <li><span className="font-semibold">Lodge a Complaint:</span> File a complaint with your local data protection authority</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">6.2 Rights Under UAE Law</h3>
                    <p className="text-gray-300 mb-2">Under UAE data protection regulations, you have the right to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Access your personal information</li>
                      <li>Request correction of inaccurate data</li>
                      <li>Request deletion of data when legally permissible</li>
                      <li>Object to processing for marketing purposes</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">6.3 Exercising Your Rights</h3>
                    <p className="text-gray-300 mb-2">To exercise any of these rights, please contact us at:</p>
                    <div className="bg-[#7042f810] p-6 rounded-lg border border-purple-500/20">
                      <p className="text-gray-300 mb-1"><span className="font-semibold text-white">Email:</span> contact@mdntech.org</p>
                      <p className="text-gray-300"><span className="font-semibold text-white">Attention:</span> Martin Jerabek, Data Protection Contact</p>
                    </div>
                    <p className="text-gray-300 mt-3">
                      We will respond to your request within 30 days (or as required by applicable law).
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies and Tracking */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  7. Cookies and Tracking Technologies
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">7.1 What Are Cookies?</h3>
                    <p className="text-gray-300">
                      Cookies are small text files stored on your device that help us provide and improve our services.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">7.2 Types of Cookies We Use</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-cyan-400 mb-2">Essential Cookies (Always Active):</p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                          <li>Session management for client accounts</li>
                          <li>Security and authentication</li>
                          <li>Load balancing and performance</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-cyan-400 mb-2">Analytics Cookies (When Implemented):</p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                          <li>Google Analytics for website usage statistics</li>
                          <li>These cookies help us understand how visitors interact with our site</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-cyan-400 mb-2">Future Cookies:</p>
                        <p className="text-gray-300 mb-2">As we implement additional features, we may use:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                          <li>Marketing cookies (with your consent)</li>
                          <li>Preference cookies for user settings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">7.3 Managing Cookies</h3>
                    <p className="text-gray-300 mb-2">
                      You can control cookies through your browser settings. Note that disabling essential cookies may affect website functionality.
                    </p>
                    <p className="text-gray-300">
                      For Google Analytics opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">https://tools.google.com/dlpage/gaoptout</a>
                    </p>
                  </div>
                </div>
              </section>

              {/* International Data Transfers */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  8. International Data Transfers
                </h2>
                <p className="text-gray-300 mb-4">
                  As we serve clients internationally, including in the European Union, your data may be transferred across borders. We ensure such transfers comply with:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                  <li><span className="font-semibold">GDPR Standard Contractual Clauses:</span> For EU data transfers</li>
                  <li><span className="font-semibold">Adequacy Decisions:</span> Transferring to countries with adequate protection</li>
                  <li><span className="font-semibold">Your Consent:</span> Where required by law</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  All international transfers maintain the same level of protection as guaranteed in the UAE and EU.
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  9. Children&apos;s Privacy
                </h2>
                <p className="text-gray-300">
                  Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a minor, please contact us immediately.
                </p>
              </section>

              {/* Third-Party Links */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  10. Third-Party Links
                </h2>
                <p className="text-gray-300">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                </p>
              </section>

              {/* Data Breach Notification */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  11. Data Breach Notification
                </h2>
                <p className="text-gray-300 mb-4">
                  In the unlikely event of a data breach that poses a risk to your rights and freedoms, we will:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                  <li>Notify affected individuals within 72 hours (as required by GDPR)</li>
                  <li>Inform relevant supervisory authorities</li>
                  <li>Provide information about the breach and remedial actions</li>
                  <li>Take immediate steps to mitigate risks</li>
                </ul>
              </section>

              {/* Changes to Privacy Policy */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  12. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-300 mb-4">
                  We may update this Privacy Policy periodically to reflect changes in our practices, new legal requirements, service improvements or new features.
                </p>
                <div className="bg-[#7042f810] p-6 rounded-lg border border-purple-500/20">
                  <p className="font-semibold text-white mb-3">Notice of Changes:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                    <li>Updated policy will be posted on www.mdntech.org with a new &quot;Last Updated&quot; date</li>
                    <li>For material changes, we will notify you via email or prominent website notice</li>
                    <li>Continued use of our services after changes constitutes acceptance</li>
                  </ul>
                </div>
              </section>

              {/* Contact Us */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  13. Contact Us
                </h2>
                <p className="text-gray-300 mb-6">
                  For questions, concerns, or requests regarding this Privacy Policy or your personal data:
                </p>
                <div className="bg-[#7042f810] p-6 rounded-lg border border-purple-500/20">
                  <p className="font-semibold text-white mb-3">M.D.N Tech FZE</p>
                  <p className="text-gray-300 mb-1">Al Shmookh Business Center M 1003</p>
                  <p className="text-gray-300 mb-1">One UAQ, UAQ Free Trade Zone</p>
                  <p className="text-gray-300 mb-1">Umm Al Quwain, United Arab Emirates</p>
                  <p className="text-gray-300 mb-1">Email: contact@mdntech.org</p>
                  <p className="text-gray-300 mb-1">Data Protection Contact: Martin Jerabek</p>
                  <p className="text-gray-300">Website: www.mdntech.org</p>
                </div>
              </section>

              {/* Supervisory Authority */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  14. Supervisory Authority
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-cyan-400 mb-2">For EU/EEA Users:</p>
                    <p className="text-gray-300">
                      If you believe your data protection rights have been violated, you have the right to lodge a complaint with your local supervisory authority.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-cyan-400 mb-2">For UAE Users:</p>
                    <p className="text-gray-300">
                      You may contact the UAE Telecommunications and Digital Government Regulatory Authority (TDRA) or relevant UAQ Free Trade Zone authorities regarding data protection concerns.
                    </p>
                  </div>
                </div>
              </section>

              {/* Footer Note */}
              <div className="mt-12 pt-8 border-t border-purple-500/30">
                <p className="text-gray-400 text-sm mb-2">
                  <span className="font-semibold text-white">Governing Law:</span> This Privacy Policy is governed by the laws of the United Arab Emirates and the regulations of UAQ Free Trade Zone.
                </p>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-white">Language:</span> In case of any discrepancy between language versions of this policy, the English version shall prevail.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
