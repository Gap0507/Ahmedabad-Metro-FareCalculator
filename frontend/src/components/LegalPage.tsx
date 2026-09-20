"use client";
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import type { ReactNode } from 'react';

type LegalPageKind = 'privacy' | 'terms';

const supportEmail = 'shahgarv0507@gmail.com';

function BackToPlannerLink() {
    return (
        <a
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
        >
            <ArrowLeftIcon />
            Back to planner
        </a>
    );
}

function LegalSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="grid gap-3">
            <h2 className="text-xl font-semibold text-neutral-950 dark:text-zinc-50">{title}</h2>
            <div className="grid gap-3 text-sm leading-6 text-neutral-700 dark:text-zinc-300">
                {children}
            </div>
        </section>
    );
}

function PrivacyPolicy() {
    return (
        <>
            <header className="grid gap-3">
                <p className="text-xs font-semibold uppercase text-[#009b50] dark:text-emerald-400">ahmedabad Metro Route Planner</p>
                <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Privacy Policy</h1>
                <p className="text-sm font-medium text-neutral-500 dark:text-zinc-400">Last updated: June 02, 2026</p>
            </header>

            <LegalSection title="Overview">
                <p>This Privacy Policy describes our policies and procedures on the collection, use, and disclosure of your information when you use ahmedabad Metro Route Planner.</p>
                <p>By using the service, you agree to the collection and use of information in accordance with this Privacy Policy.</p>
            </LegalSection>

            <LegalSection title="Information We Collect">
                <p>Usage Data may be collected automatically when using the service. This may include your device internet protocol address, browser type, browser version, pages visited, the time and date of your visit, time spent on pages, unique device identifiers, and diagnostic data.</p>
                <p>When you access the service through a mobile device, we may collect information such as mobile device type, operating system, mobile browser type, unique device identifiers, and diagnostic data.</p>
            </LegalSection>

            <LegalSection title="How We Use Information">
                <ul className="list-disc space-y-2 pl-5">
                    <li>To provide and maintain the service, including monitoring usage.</li>
                    <li>To improve the route planner, map experience, performance, and reliability.</li>
                    <li>To manage requests sent to us.</li>
                    <li>To detect, prevent, and address technical issues or misuse.</li>
                    <li>To comply with legal obligations where required.</li>
                </ul>
            </LegalSection>

            <LegalSection title="Sharing Information">
                <p>We may share information with service providers who help operate, monitor, or improve the service. We may also disclose information where required by law, to protect rights and safety, or in connection with a business transfer.</p>
            </LegalSection>

            <LegalSection title="Retention">
                <p>We retain personal data only as long as necessary for the purposes described in this policy. Usage statistics and server logs may be retained for up to 24 months for security, troubleshooting, and service improvement, unless a longer period is required for legal compliance, security, fraud prevention, or legal claims.</p>
                <p>When data is no longer needed, it may be deleted, aggregated, or anonymized.</p>
            </LegalSection>

            <LegalSection title="Data Transfers">
                <p>Your information may be processed where the company, infrastructure providers, or service providers operate. We take reasonable steps to ensure information is handled securely and in accordance with this Privacy Policy.</p>
            </LegalSection>

            <LegalSection title="Your Choices">
                <p>You may contact us to request access, correction, or deletion of personal data that you have provided to us. We may need to retain certain information where we have a legal obligation or lawful basis to do so.</p>
            </LegalSection>

            <LegalSection title="Children's Privacy">
                <p>The service is not directed to anyone under the age of 16. We do not knowingly collect personally identifiable information from anyone under 16. If we become aware that such information has been collected without appropriate consent, we take steps to remove it.</p>
            </LegalSection>

            <LegalSection title="Links to Other Websites">
                <p>The service may contain links to websites that are not operated by us. We are not responsible for the content, privacy policies, or practices of third-party sites or services.</p>
            </LegalSection>

            <LegalSection title="Changes">
                <p>We may update this Privacy Policy from time to time. Changes are effective when posted on this page, and the last updated date will be revised accordingly.</p>
            </LegalSection>

            <LegalSection title="Contact Us">
                <p>
                    For questions about this Privacy Policy, contact us at{' '}
                    <a className="font-semibold text-[#007a3d] underline-offset-4 hover:underline dark:text-emerald-400" href={`mailto:${supportEmail}`}>{supportEmail}</a>{' '}
                    or visit{' '}
                    <a className="font-semibold text-[#007a3d] underline-offset-4 hover:underline dark:text-emerald-400" href="https://coolhead.in" target="_blank" rel="noreferrer">coolhead.in</a>.
                </p>
            </LegalSection>
        </>
    );
}

function TermsAndConditions() {
    return (
        <>
            <header className="grid gap-3">
                <p className="text-xs font-semibold uppercase text-[#009b50] dark:text-emerald-400">ahmedabad Metro Route Planner</p>
                <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Terms and Conditions</h1>
                <p className="text-sm font-medium text-neutral-500 dark:text-zinc-400">Last updated: June 02, 2026</p>
            </header>

            <LegalSection title="Acceptance">
                <p>By accessing or using ahmedabad Metro Route Planner, you agree to these Terms and Conditions. If you do not agree, please do not use the service.</p>
            </LegalSection>

            <LegalSection title="Service">
                <p>ahmedabad Metro Route Planner is an independent route planning tool for ahmedabad Metro journeys. It provides map, route, fare, travel time, stop, and interchange information for general guidance.</p>
                <p>This service is not affiliated with, endorsed by, or operated by ahmedabad Metro Rail Corporation or any government transport authority.</p>
            </LegalSection>

            <LegalSection title="Accuracy">
                <p>We aim to keep information useful and current, but metro routes, fares, timings, service conditions, station access, and interchange details may change. You should verify critical travel information with official sources before relying on it.</p>
            </LegalSection>

            <LegalSection title="Permitted Use">
                <ul className="list-disc space-y-2 pl-5">
                    <li>Use the service for personal, informational, and lawful purposes.</li>
                    <li>Do not misuse, disrupt, scrape excessively, reverse engineer, or interfere with the service.</li>
                    <li>Do not use the service in a way that violates applicable law or harms other users.</li>
                </ul>
            </LegalSection>

            <LegalSection title="Third-Party Links">
                <p>The service may include links to third-party websites or services. We are not responsible for their content, availability, policies, or practices.</p>
            </LegalSection>

            <LegalSection title="No Warranty">
                <p>The service is provided on an as-is and as-available basis. We do not guarantee uninterrupted availability, error-free operation, or complete accuracy of travel information.</p>
            </LegalSection>

            <LegalSection title="Limitation of Liability">
                <p>To the maximum extent permitted by law, we are not liable for losses, delays, missed journeys, service disruptions, damages, or expenses arising from your use of, or reliance on, the service.</p>
            </LegalSection>

            <LegalSection title="Changes to Terms">
                <p>We may update these Terms and Conditions from time to time. Changes are effective when posted on this page, and the last updated date will be revised accordingly.</p>
            </LegalSection>

            <LegalSection title="Contact Us">
                <p>
                    For questions about these Terms and Conditions, contact us at{' '}
                    <a className="font-semibold text-[#007a3d] underline-offset-4 hover:underline dark:text-emerald-400" href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                </p>
            </LegalSection>
        </>
    );
}

function LegalPage({ kind }: { kind: LegalPageKind }) {
    return (
        <main className="min-h-svh bg-[#f4f0e8] p-3 text-neutral-950 dark:bg-zinc-950 dark:text-zinc-50 sm:p-6">
            <div className="mx-auto grid max-w-4xl gap-4">
                <nav className="flex flex-wrap items-center justify-between gap-3">
                    <BackToPlannerLink />
                    <div className="flex flex-wrap gap-2">
                        <a className="inline-flex h-10 items-center rounded-lg bg-neutral-900 px-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200" href="/privacy-policy">Privacy Policy</a>
                        <a className="inline-flex h-10 items-center rounded-lg bg-neutral-900 px-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200" href="/terms-and-conditions">Terms</a>
                    </div>
                </nav>
                <article className="grid gap-8 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                    {kind === 'privacy' ? <PrivacyPolicy /> : <TermsAndConditions />}
                </article>
            </div>
        </main>
    );
}

export default LegalPage;
