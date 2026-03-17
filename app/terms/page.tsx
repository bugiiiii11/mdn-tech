"use client";

import { motion } from "framer-motion";
import { slideInFromTop } from "@/lib/motion";

export default function TermsPage() {
  return (
    <main className="min-h-screen w-full pt-20">
      <section className="relative flex flex-col items-center justify-center py-20 px-4 md:px-8 lg:px-20 overflow-hidden">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideInFromTop}
          className="relative z-10 text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-6">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-400">
            Last Updated: January 20, 2026
          </p>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="p-8 md:p-12 rounded-xl border border-[#7042f88b] bg-[#0c0424]/80 text-gray-300 leading-relaxed">
              
              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  1. Introduction and Agreement
                </h2>
                <p className="mb-4">
                  These Terms & Conditions (&quot;Terms&quot;) constitute a legally binding agreement between M.D.N Tech FZE (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) and you (&quot;Client,&quot; &quot;you,&quot; or &quot;your&quot;) governing your use of our website www.mdntech.org and our IT services.
                </p>
                <div className="bg-[#7042f810] p-6 rounded-lg border border-purple-500/20 my-6">
                  <p className="font-semibold text-white mb-3">Company Details:</p>
                  <ul className="list-none space-y-2 text-gray-300">
                    <li><span className="text-purple-400">Legal Name:</span> M.D.N Tech FZE</li>
                    <li><span className="text-purple-400">Registration:</span> UAQ Free Trade Zone, United Arab Emirates</li>
                    <li><span className="text-purple-400">Address:</span> Al Shmookh Business Center M 1003, One UAQ, UAQ Free Trade Zone, Umm Al Quwain, U.A.E</li>
                    <li><span className="text-purple-400">Contact:</span> contact@mdntech.org</li>
                    <li><span className="text-purple-400">Website:</span> www.mdntech.org</li>
                  </ul>
                </div>
                <p>
                  By accessing our website, requesting a consultation, or engaging our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                </p>
              </section>

              {/* Definitions */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  2. Definitions
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-cyan-400 mb-2">&quot;Services&quot; means all IT services provided by the Company, including but not limited to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-2 text-gray-300">
                      <li>AI & Machine Learning development (LLM integration, RAG systems, AI agents, intelligent automation)</li>
                      <li>Blockchain & Web3 solutions (smart contracts, DeFi systems, wallet integrations, blockchain analytics)</li>
                      <li>Full-Stack Development (backend systems, APIs, microservices, cloud-native architecture)</li>
                      <li>Mobile Development (iOS & Android apps with React Native, Flutter, Web3 integrations)</li>
                      <li>UI/UX & Product Design (UX research, design systems, product branding, conversion-focused design)</li>
                      <li>Game Development (Unity, Unreal Engine, Web3 games, multiplayer systems, AR/VR experiences)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-cyan-400 mb-2">&quot;Agreement&quot;</p>
                    <p className="text-gray-300">means the contract formed between the Company and Client, including these Terms, project proposals, statements of work, and any additional agreements.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-cyan-400 mb-2">&quot;Deliverables&quot;</p>
                    <p className="text-gray-300">means all work products, code, designs, documentation, and materials created by the Company for the Client.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-cyan-400 mb-2">&quot;Client Account&quot;</p>
                    <p className="text-gray-300">means the secure portal provided to clients for accessing development environments and project materials.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-cyan-400 mb-2">&quot;Confidential Information&quot;</p>
                    <p className="text-gray-300">means any proprietary or sensitive information disclosed by either party.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-cyan-400 mb-2">&quot;Intellectual Property&quot;</p>
                    <p className="text-gray-300">means all patents, copyrights, trademarks, trade secrets, and other proprietary rights.</p>
                  </div>
                </div>
              </section>

              {/* Scope of Services */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  3. Scope of Services
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.1 Service Description</h3>
                    <p className="text-gray-300">
                      The Company provides professional IT development and consulting services tailored to each Client&apos;s needs. Specific services, deliverables, timelines, and pricing are defined in individual project proposals or statements of work.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.2 Service Engagement Process</h3>
                    <ol className="list-decimal list-inside ml-4 space-y-2 text-gray-300">
                      <li><span className="font-semibold">Initial Consultation:</span> Client schedules a call to discuss project requirements</li>
                      <li><span className="font-semibold">Proposal:</span> Company provides detailed proposal including scope, timeline, and costs</li>
                      <li><span className="font-semibold">Agreement:</span> Client accepts proposal and signs agreement</li>
                      <li><span className="font-semibold">Development:</span> Company executes project according to agreed specifications</li>
                      <li><span className="font-semibold">Delivery:</span> Company delivers completed work to Client</li>
                      <li><span className="font-semibold">Support:</span> Optional ongoing maintenance and support as agreed</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.3 Client Account Access</h3>
                    <p className="text-gray-300 mb-2">Upon project commencement, eligible clients receive:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Access to secure client portal</li>
                      <li>Real-time visibility of development environment</li>
                      <li>Ability to review work-in-progress</li>
                      <li>Access to project documentation and deliverables</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">3.4 Development Environments</h3>
                    <p className="text-gray-300 mb-2">For active projects, the Company maintains:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>24/7 running development environments</li>
                      <li>Secure, isolated instances for each project</li>
                      <li>Regular backups and version control</li>
                      <li>Staging environments for testing and review</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Client Responsibilities */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  4. Client Responsibilities
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">4.1 Information and Cooperation</h3>
                    <p className="text-gray-300 mb-2">The Client agrees to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Provide accurate and complete information required for project execution</li>
                      <li>Respond to Company inquiries in a timely manner</li>
                      <li>Designate authorized representatives for project decisions</li>
                      <li>Provide necessary access to systems, data, or resources as required</li>
                      <li>Review and approve deliverables within agreed timeframes</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">4.2 Content and Materials</h3>
                    <p className="text-gray-300 mb-2">The Client is responsible for:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Accuracy and legality of all content and materials provided</li>
                      <li>Obtaining necessary rights and licenses for third-party materials</li>
                      <li>Ensuring compliance with applicable laws and regulations</li>
                      <li>Providing clear specifications and requirements</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">4.3 Feedback and Approvals</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Client must review deliverables within agreed review periods</li>
                      <li>Failure to provide feedback within specified timeframes constitutes acceptance</li>
                      <li>Changes requested after approval may incur additional fees</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Payment Terms */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  5. Payment Terms
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.1 Pricing and Invoicing</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Project costs are specified in individual proposals or statements of work</li>
                      <li>All prices are quoted in UAE Dirhams (AED) or as mutually agreed</li>
                      <li>The Company will issue invoices according to the agreed payment schedule</li>
                      <li>Invoices are typically issued upon project milestones or monthly for ongoing services</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.2 Payment Schedule</h3>
                    <p className="text-gray-300 mb-2">Unless otherwise agreed:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li><span className="font-semibold">Initial Payment:</span> 50% upon project commencement</li>
                      <li><span className="font-semibold">Milestone Payments:</span> As defined in project agreement</li>
                      <li><span className="font-semibold">Final Payment:</span> Balance due upon project completion</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.3 Payment Methods</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Bank transfer to Company&apos;s designated account</li>
                      <li>Payment details provided on invoices</li>
                      <li>Website payment processing may be implemented in the future</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.4 Late Payments</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Invoices are due within 14 days unless otherwise specified</li>
                      <li>Late payments may incur interest at 1.5% per month</li>
                      <li>Company may suspend services for overdue accounts</li>
                      <li>Client remains liable for all costs of collection</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">5.5 Taxes</h3>
                    <p className="text-gray-300">
                      All fees are exclusive of applicable taxes. Client is responsible for any Value Added Tax (VAT), withholding taxes, import duties or other governmental charges.
                    </p>
                  </div>
                </div>
              </section>

              {/* Intellectual Property Rights */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  6. Intellectual Property Rights
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">6.1 Client Ownership</h3>
                    <p className="text-gray-300 mb-2">Upon full payment, Client receives ownership of:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Custom code developed specifically for the Client&apos;s project</li>
                      <li>Final deliverables created exclusively for the Client</li>
                      <li>Client-provided materials and content</li>
                    </ul>
                    <p className="text-gray-300 mt-3 font-semibold">Excluded from Transfer:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Company&apos;s pre-existing intellectual property</li>
                      <li>Third-party libraries, frameworks, and tools</li>
                      <li>General methodologies and processes</li>
                      <li>Templates and reusable components</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">6.2 Company Ownership</h3>
                    <p className="text-gray-300 mb-2">The Company retains ownership of:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Pre-existing tools, frameworks, and code libraries</li>
                      <li>General development methodologies and processes</li>
                      <li>Knowledge and experience gained</li>
                      <li>Templates and reusable components</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">6.3 Third-Party Components</h3>
                    <p className="text-gray-300 mb-2">Deliverables may include:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Open-source software (subject to their respective licenses)</li>
                      <li>Third-party APIs and services</li>
                      <li>Licensed components and libraries</li>
                    </ul>
                    <p className="text-gray-300 mt-3">Client is responsible for complying with all third-party licenses.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">6.4 License to Company</h3>
                    <p className="text-gray-300 mb-2">Client grants the Company a non-exclusive license to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Use Client materials solely for providing Services</li>
                      <li>Display completed work in portfolio (with Client approval)</li>
                      <li>Reference Client as a customer (with approval)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">6.5 Portfolio and Marketing</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Company may showcase completed work with Client&apos;s written consent</li>
                      <li>Client may request anonymization or confidentiality</li>
                      <li>Confidential projects will not be disclosed without permission</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Confidentiality */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  7. Confidentiality
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">7.1 Confidential Information</h3>
                    <p className="text-gray-300 mb-2">Both parties agree to protect:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Business strategies and plans</li>
                      <li>Technical specifications and source code</li>
                      <li>Financial information</li>
                      <li>Client data and user information</li>
                      <li>Trade secrets and proprietary information</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">7.2 Obligations</h3>
                    <p className="text-gray-300 mb-2">Each party agrees to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Maintain strict confidentiality of the other party&apos;s information</li>
                      <li>Use Confidential Information only for authorized purposes</li>
                      <li>Implement reasonable security measures</li>
                      <li>Restrict access to authorized personnel only</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">7.3 Exclusions</h3>
                    <p className="text-gray-300 mb-2">Confidentiality obligations do not apply to information that:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Is publicly available through no breach of this agreement</li>
                      <li>Was rightfully known prior to disclosure</li>
                      <li>Is independently developed</li>
                      <li>Must be disclosed by law or court order</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">7.4 Duration</h3>
                    <p className="text-gray-300">
                      Confidentiality obligations continue for 3 years after project completion or termination of services.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Protection */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  8. Data Protection and Privacy
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">8.1 Data Processing</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Company processes Client data in accordance with our Privacy Policy</li>
                      <li>Company implements appropriate technical and organizational security measures</li>
                      <li>Client data is stored securely on Vercel and Railway infrastructure</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">8.2 Client Data Security</h3>
                    <p className="text-gray-300 mb-2">The Company commits to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Encrypting data in transit and at rest</li>
                      <li>Implementing access controls and authentication</li>
                      <li>Regular security monitoring and updates</li>
                      <li>Backup and disaster recovery procedures</li>
                      <li>Compliance with GDPR for European clients</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">8.3 Data Breach Notification</h3>
                    <p className="text-gray-300 mb-2">In the event of a data breach:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Company will notify Client within 72 hours</li>
                      <li>Company will take immediate remedial action</li>
                      <li>Company will cooperate with regulatory notifications as required</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">8.4 Client Obligations</h3>
                    <p className="text-gray-300 mb-2">Client warrants that:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>They have legal authority to provide data to Company</li>
                      <li>They comply with applicable data protection laws</li>
                      <li>They have obtained necessary consents for data processing</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Warranties */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  9. Warranties and Representations
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">9.1 Company Warranties</h3>
                    <p className="text-gray-300 mb-2">The Company warrants that:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Services will be performed with professional skill and care</li>
                      <li>Work will substantially conform to agreed specifications</li>
                      <li>Company has the right to provide the Services</li>
                      <li>Deliverables will not knowingly infringe third-party rights</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">9.2 Client Warranties</h3>
                    <p className="text-gray-300 mb-2">The Client warrants that:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>They have authority to enter into this Agreement</li>
                      <li>All information provided is accurate and complete</li>
                      <li>Client-provided materials do not infringe third-party rights</li>
                      <li>They will comply with all applicable laws</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">9.3 Warranty Period</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Standard warranty: 90 days from delivery for defects in workmanship</li>
                      <li>Warranty covers fixes for bugs or errors in delivered code</li>
                      <li>Warranty does not cover changes to requirements or new features</li>
                      <li>Extended warranty may be available under separate support agreements</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">9.4 Disclaimer</h3>
                    <p className="text-gray-300 italic">
                      EXCEPT AS EXPRESSLY STATED, SERVICES ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                    </p>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  10. Limitation of Liability
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">10.1 Maximum Liability</h3>
                    <p className="text-gray-300 mb-2 italic">TO THE MAXIMUM EXTENT PERMITTED BY UAE LAW:</p>
                    <p className="text-gray-300">
                      The Company&apos;s total liability for any claims arising from or related to Services shall not exceed the total fees paid by Client in the 12 months preceding the claim, or AED 50,000, whichever is less.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">10.2 Excluded Damages</h3>
                    <p className="text-gray-300 mb-2 italic">COMPANY SHALL NOT BE LIABLE FOR:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Indirect, incidental, or consequential damages</li>
                      <li>Loss of profits, revenue, or business opportunities</li>
                      <li>Loss of data (except where due to Company&apos;s gross negligence)</li>
                      <li>Costs of substitute services</li>
                      <li>Business interruption</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">10.3 Exceptions</h3>
                    <p className="text-gray-300 mb-2">Limitations do not apply to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Gross negligence or willful misconduct</li>
                      <li>Breaches of confidentiality</li>
                      <li>Indemnification obligations</li>
                      <li>Matters that cannot be limited under UAE law</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">10.4 Third-Party Services</h3>
                    <p className="text-gray-300 mb-2">Company is not liable for:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Performance or availability of third-party services</li>
                      <li>Actions of hosting providers (Vercel, Railway)</li>
                      <li>Third-party API or service failures</li>
                      <li>Issues with Client&apos;s infrastructure or systems</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Indemnification */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  11. Indemnification
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">11.1 Client Indemnification</h3>
                    <p className="text-gray-300 mb-2">Client agrees to indemnify and hold harmless the Company from claims arising from:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Client-provided content, materials, or data</li>
                      <li>Client&apos;s breach of these Terms</li>
                      <li>Client&apos;s violation of applicable laws</li>
                      <li>Infringement of third-party rights by Client materials</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">11.2 Company Indemnification</h3>
                    <p className="text-gray-300 mb-2">Company agrees to indemnify Client from claims that Deliverables created solely by Company infringe third-party intellectual property rights, provided:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Client promptly notifies Company of the claim</li>
                      <li>Company has sole control of defense and settlement</li>
                      <li>Client provides reasonable cooperation</li>
                      <li>Claim does not result from Client modifications or misuse</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">11.3 Remedies</h3>
                    <p className="text-gray-300 mb-2">If Deliverables are found to infringe, Company may:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Obtain rights for Client to continue use</li>
                      <li>Modify Deliverables to be non-infringing</li>
                      <li>Replace with non-infringing alternatives</li>
                      <li>Refund fees paid for infringing components</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Term and Termination */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  12. Term and Termination
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">12.1 Term</h3>
                    <p className="text-gray-300 mb-2">This Agreement begins when Client accepts our Services and continues until:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Project completion and final payment</li>
                      <li>Termination by either party as provided herein</li>
                      <li>Mutual agreement to terminate</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">12.2 Termination for Convenience</h3>
                    <p className="text-gray-300 mb-2">Either party may terminate with 30 days&apos; written notice, subject to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Payment for work completed through termination date</li>
                      <li>Return of all materials and Confidential Information</li>
                      <li>Completion of transition activities as reasonably requested</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">12.3 Termination for Cause</h3>
                    <p className="text-gray-300 mb-2">Either party may terminate immediately if the other party:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Materially breaches these Terms and fails to cure within 14 days</li>
                      <li>Becomes insolvent or subject to bankruptcy proceedings</li>
                      <li>Ceases business operations</li>
                      <li>Engages in illegal activities related to the Services</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">12.4 Effect of Termination</h3>
                    <p className="text-gray-300 mb-2">Upon termination:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Client pays for all work completed</li>
                      <li>Company delivers work-in-progress in current state</li>
                      <li>Both parties return Confidential Information</li>
                      <li>Client account access is revoked</li>
                      <li>Development environments are shut down</li>
                      <li>Licenses granted under these Terms terminate (except for paid deliverables)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">12.5 Survival</h3>
                    <p className="text-gray-300 mb-2">The following sections survive termination:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Payment obligations</li>
                      <li>Intellectual Property rights</li>
                      <li>Confidentiality obligations</li>
                      <li>Indemnification</li>
                      <li>Limitation of Liability</li>
                      <li>Dispute Resolution</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Force Majeure */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  13. Force Majeure
                </h2>
                <p className="text-gray-300 mb-4">
                  Neither party shall be liable for delays or failures due to circumstances beyond reasonable control, including natural disasters, pandemics, or acts of God; war, terrorism, or civil unrest; government actions or regulations; internet or telecommunications failures; third-party service provider outages.
                </p>
                <p className="text-gray-300 mb-2">Affected party must:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                  <li>Notify the other party promptly</li>
                  <li>Use reasonable efforts to mitigate impact</li>
                  <li>Resume performance as soon as practicable</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  If force majeure continues for more than 60 days, either party may terminate the Agreement.
                </p>
              </section>

              {/* Dispute Resolution */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  14. Dispute Resolution
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">14.1 Governing Law</h3>
                    <p className="text-gray-300">
                      These Terms are governed by the laws of the United Arab Emirates and the regulations of UAQ Free Trade Zone.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">14.2 Jurisdiction</h3>
                    <p className="text-gray-300">
                      The courts of Umm Al Quwain, United Arab Emirates, shall have exclusive jurisdiction over any disputes, unless otherwise agreed.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">14.3 Negotiation</h3>
                    <p className="text-gray-300 mb-2">Before initiating formal proceedings, parties agree to:</p>
                    <ol className="list-decimal list-inside ml-4 space-y-1 text-gray-300">
                      <li>Attempt good faith negotiation for 30 days</li>
                      <li>Escalate to senior management if necessary</li>
                      <li>Consider mediation if negotiation fails</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">14.4 Arbitration (Optional)</h3>
                    <p className="text-gray-300 mb-2">By mutual agreement, disputes may be resolved through:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Arbitration under UNCITRAL rules</li>
                      <li>Seat of arbitration: Umm Al Quwain, UAE</li>
                      <li>Language: English</li>
                      <li>Single arbitrator (or three for claims exceeding AED 500,000)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">14.5 Equitable Relief</h3>
                    <p className="text-gray-300 mb-2">Nothing prevents either party from seeking injunctive relief for:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Breach of confidentiality</li>
                      <li>Intellectual property infringement</li>
                      <li>Urgent matters requiring immediate action</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* General Provisions */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  15. General Provisions
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.1 Entire Agreement</h3>
                    <p className="text-gray-300">
                      These Terms, together with any signed proposals or statements of work, constitute the entire agreement and supersede all prior agreements and understandings.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.2 Amendments</h3>
                    <p className="text-gray-300 mb-2">These Terms may only be modified:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>By written agreement signed by authorized representatives</li>
                      <li>By updated Terms posted on our website (for general updates)</li>
                      <li>With 30 days&apos; notice for material changes affecting existing projects</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.3 Assignment</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Client may not assign this Agreement without Company&apos;s written consent</li>
                      <li>Company may assign to affiliates or in connection with a merger or acquisition</li>
                      <li>Any attempted unauthorized assignment is void</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.4 Independent Contractors</h3>
                    <p className="text-gray-300 mb-2">The parties are independent contractors. Nothing creates:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Employment relationship</li>
                      <li>Partnership or joint venture</li>
                      <li>Agency or franchise</li>
                      <li>Fiduciary duty beyond what is stated herein</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.5 Severability</h3>
                    <p className="text-gray-300 mb-2">If any provision is found invalid or unenforceable:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>The provision will be modified to the minimum extent necessary</li>
                      <li>Remaining provisions continue in full effect</li>
                      <li>Parties will negotiate a replacement provision if necessary</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.6 Waiver</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Failure to enforce any right does not constitute a waiver</li>
                      <li>Waivers must be in writing to be effective</li>
                      <li>Waiver of one breach does not waive subsequent breaches</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.7 Notices</h3>
                    <p className="text-gray-300 mb-2">All notices must be in writing and sent to:</p>
                    <div className="bg-[#7042f810] p-6 rounded-lg border border-purple-500/20 my-4">
                      <p className="font-semibold text-white mb-3">For Company:</p>
                      <p className="text-gray-300 mb-1">M.D.N Tech FZE</p>
                      <p className="text-gray-300 mb-1">Al Shmookh Business Center M 1003</p>
                      <p className="text-gray-300 mb-1">One UAQ, UAQ Free Trade Zone</p>
                      <p className="text-gray-300 mb-1">Umm Al Quwain, United Arab Emirates</p>
                      <p className="text-gray-300 mb-1">Email: contact@mdntech.org</p>
                      <p className="text-gray-300">Attention: Martin Jerabek</p>
                    </div>
                    <p className="text-gray-300 mb-2">For Client:</p>
                    <p className="text-gray-300 mb-4">To the address provided in the project agreement or client account</p>
                    <p className="text-gray-300 mb-2">Notices are effective:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Upon delivery by hand</li>
                      <li>3 business days after mailing</li>
                      <li>Upon confirmed receipt of email</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.8 Language</h3>
                    <p className="text-gray-300">
                      In case of any discrepancy between language versions of these Terms, the English version shall prevail.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.9 Headings</h3>
                    <p className="text-gray-300">
                      Section headings are for convenience only and do not affect interpretation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">15.10 Counterparts</h3>
                    <p className="text-gray-300">
                      This Agreement may be executed in counterparts, each considered an original.
                    </p>
                  </div>
                </div>
              </section>

              {/* Acceptable Use Policy */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  16. Acceptable Use Policy
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">16.1 Prohibited Uses</h3>
                    <p className="text-gray-300 mb-2">Client agrees not to use our Services for:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Illegal activities or violation of laws</li>
                      <li>Infringement of intellectual property rights</li>
                      <li>Transmission of malware, viruses, or harmful code</li>
                      <li>Harassment, abuse, or harm to others</li>
                      <li>Spam, phishing, or fraudulent activities</li>
                      <li>Unauthorized access to systems or data</li>
                      <li>Impersonation or misrepresentation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">16.2 Client Account Conduct</h3>
                    <p className="text-gray-300 mb-2">When using the Client Account, you agree to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Maintain confidentiality of login credentials</li>
                      <li>Not share account access with unauthorized persons</li>
                      <li>Notify Company immediately of any security breach</li>
                      <li>Use the account only for authorized project purposes</li>
                      <li>Not attempt to circumvent security measures</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">16.3 Consequences of Violation</h3>
                    <p className="text-gray-300 mb-2">Violation of acceptable use may result in:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Immediate suspension or termination of Services</li>
                      <li>Deletion of content or account</li>
                      <li>Legal action and reporting to authorities</li>
                      <li>Liability for damages</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Support and Maintenance */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  17. Support and Maintenance
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">17.1 Warranty Support</h3>
                    <p className="text-gray-300 mb-2">During the warranty period, Company provides:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Bug fixes for defects in delivered code</li>
                      <li>Clarification and documentation support</li>
                      <li>Resolution of issues related to agreed specifications</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">17.2 Post-Warranty Support</h3>
                    <p className="text-gray-300 mb-2">After warranty expiration, support is available:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Under separate maintenance agreements</li>
                      <li>On a time-and-materials basis</li>
                      <li>Through dedicated support packages</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">17.3 Response Times</h3>
                    <p className="text-gray-300 mb-2">Support response times are defined in:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Individual support agreements</li>
                      <li>Service Level Agreements (SLAs) when applicable</li>
                      <li>Project-specific terms</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Updates and Changes */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  18. Updates and Changes
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">18.1 Service Updates</h3>
                    <p className="text-gray-300 mb-2">The Company reserves the right to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Update or modify Services to improve functionality</li>
                      <li>Implement security patches and updates</li>
                      <li>Upgrade infrastructure and technologies</li>
                      <li>Discontinue outdated or unsupported features</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">18.2 Client Notification</h3>
                    <p className="text-gray-300 mb-2">Company will provide reasonable notice of:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                      <li>Material changes to Services</li>
                      <li>Scheduled maintenance windows</li>
                      <li>Updates affecting Client systems</li>
                      <li>Changes to hosting infrastructure</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Export Control */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  19. Export Control and Compliance
                </h2>
                <p className="text-gray-300 mb-4">
                  Client acknowledges that deliverables may be subject to UAE export control regulations, international export restrictions, sanctions and embargoes.
                </p>
                <p className="text-gray-300 mb-2">Client agrees to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-300">
                  <li>Comply with all applicable export laws</li>
                  <li>Not export to prohibited countries or entities</li>
                  <li>Obtain necessary export licenses</li>
                  <li>Indemnify Company for violations</li>
                </ul>
              </section>

              {/* Contact Information */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3">
                  20. Contact Information
                </h2>
                <p className="text-gray-300 mb-6">
                  For questions regarding these Terms & Conditions:
                </p>
                <div className="bg-[#7042f810] p-6 rounded-lg border border-purple-500/20">
                  <p className="font-semibold text-white mb-3">M.D.N Tech FZE</p>
                  <p className="text-gray-300 mb-1">Al Shmookh Business Center M 1003</p>
                  <p className="text-gray-300 mb-1">One UAQ, UAQ Free Trade Zone</p>
                  <p className="text-gray-300 mb-1">Umm Al Quwain, United Arab Emirates</p>
                  <p className="text-gray-300 mb-1">Email: contact@mdntech.org</p>
                  <p className="text-gray-300 mb-1">Website: www.mdntech.org</p>
                  <p className="text-gray-300">Contact Person: Martin Jerabek</p>
                </div>
              </section>

              {/* Footer Note */}
              <div className="mt-12 pt-8 border-t border-purple-500/30">
                <p className="text-gray-400 text-sm mb-2">
                  <span className="font-semibold text-white">Acknowledgment:</span> By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                </p>
                <p className="text-gray-400 text-sm mb-2">
                  <span className="font-semibold text-white">Effective Date:</span> These Terms are effective as of the date you first access our website or engage our Services.
                </p>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-white">Review Date:</span> We recommend reviewing these Terms periodically. Continued use after updates constitutes acceptance of modified Terms.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
