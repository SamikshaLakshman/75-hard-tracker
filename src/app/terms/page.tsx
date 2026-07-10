import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — Forge75",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-5 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link href="/login" className="text-accent hover:underline text-stat-label inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back
          </Link>
          <h1 className="text-headline-lg text-accent mt-4">Terms & Conditions</h1>
          <p className="text-stat-label text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="glass-card rounded-xl p-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="text-foreground font-bold text-base mb-2">1. Acceptance of Terms</h2>
            <p>By creating an account on Forge75, you agree to these Terms & Conditions. If you do not agree, please do not use the app.</p>
          </div>

          <div>
            <h2 className="text-foreground font-bold text-base mb-2">2. Your Account</h2>
            <p>You are responsible for keeping your password secure and for all activity under your account. You must provide accurate information when signing up. One account per person.</p>
          </div>

          <div>
            <h2 className="text-foreground font-bold text-base mb-2">3. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Harass, abuse, or threaten other users, including through the Friends feature</li>
              <li>Impersonate another person or create fake/duplicate accounts</li>
              <li>Submit false or fraudulent daily log data to manipulate leaderboards, streaks, or XP</li>
              <li>Attempt to access another user&apos;s account or data without permission</li>
              <li>Use the app for any unlawful purpose or in a way that disrupts the service for others</li>
              <li>Attempt to exploit bugs, reverse-engineer the app, or interfere with its normal operation</li>
            </ul>
          </div>

          <div>
            <h2 className="text-foreground font-bold text-base mb-2">4. Enforcement</h2>
            <p>
              If you engage in any of the behavior described in Section 3, we reserve the right to warn, suspend,
              or permanently delete your account and all associated data — including your challenge history, XP,
              achievements, and friend connections — without prior notice.
            </p>
          </div>

          <div>
            <h2 className="text-foreground font-bold text-base mb-2">5. Your Data</h2>
            <p>
              We store the information you provide (email, username, daily logs, progress data) to operate the app.
              We do not sell your personal data to third parties. If your account is deleted — by you or by an
              administrator for a Terms violation — your data is permanently removed from our database.
            </p>
          </div>

          <div>
            <h2 className="text-foreground font-bold text-base mb-2">6. Friends & Social Features</h2>
            <p>
              Adding a friend requires mutual acceptance. Your XP, level, title, streak, and daily task completion
              may be visible to accepted friends. You can remove a friend connection at any time from the Friends tab.
            </p>
          </div>

          <div>
            <h2 className="text-foreground font-bold text-base mb-2">7. No Medical Advice</h2>
            <p>
              Forge75 is a habit-tracking tool for the 75 Hard Challenge. It does not provide medical, nutritional,
              or fitness advice. Consult a qualified professional before starting any new diet or exercise program.
            </p>
          </div>

          <div>
            <h2 className="text-foreground font-bold text-base mb-2">8. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the app after changes means you accept the updated Terms.</p>
          </div>

          <div>
            <h2 className="text-foreground font-bold text-base mb-2">9. Contact</h2>
            <p>Questions about these Terms can be directed to the app administrator.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
