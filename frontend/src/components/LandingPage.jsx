import PropTypes from "prop-types";
import ScoreGauge from "./ScoreGauge.jsx";

const STEPS = [
  { n: "01", title: "Select", body: "Pick a claim with a red or amber status dot from the review queue." },
  { n: "02", title: "Review Rules", body: "Run the claim through 7 pre-submission rules to check for errors." },
  { n: "03", title: "Correct Inline", body: "Fix flagged fields directly inside the claim using the AI-assisted guides." },
  { n: "04", title: "Submit Clean", body: "Once the claim is error-free, post the validated details directly to openIMIS." },
];

const FEATURES = [
  {
    title: "AI-Powered Explanations",
    body: "No more parsing cryptic insurance codes. The system translates policy rule failures into plain English instructions any billing clerk can resolve instantly.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    badge: "Interactive Assistant",
    bgColor: "bg-teal-50 text-teal-650"
  },
  {
    title: "7 Deterministic Rules",
    body: "Validate demographics, ICD-10 formats, visit date sanity, line items, coverage windows, and threshold amounts. Every check is traceable and auditable.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    badge: "100% Traceable",
    bgColor: "bg-emerald-50 text-emerald-600"
  },
  {
    title: "Instant openIMIS Sync",
    body: "Once errors are resolved and the claim is verified, standard FHIR R4 ClaimResponse payloads are posted directly to the openIMIS database with zero data duplication.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.21" />
      </svg>
    ),
    badge: "FHIR Integrated",
    bgColor: "bg-blue-50 text-blue-600"
  }
];

export default function LandingPage({ claims, loading, onEnter }) {
  const total = claims.length;
  const ready = claims.filter((c) => c._preview?.color === "green").length;
  const review = claims.filter((c) => c._preview?.color === "amber").length;
  const highRisk = claims.filter((c) => c._preview?.color === "red").length;
  const avgScore = total
    ? Math.round(
        claims.reduce((sum, c) => sum + (c._preview?.score ?? 0), 0) / total
      )
    : 0;

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col font-sans antialiased overflow-y-auto">
      
      {/* 1. Header (Standard Navbar) */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-teal-600 font-extrabold text-2xl tracking-tight">
              ClaimSense
            </span>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100 rounded-md px-2 py-0.5 shadow-sm uppercase tracking-wide">
              Pre-submission
            </span>
          </div>
          <button
            type="button"
            onClick={onEnter}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2 shadow-sm transition-all"
          >
            Enter Workspace
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Left: Title, Tagline, Body, CTA */}
          <div className="space-y-6 text-left">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Verify Claims in <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">Seconds</span>, Not Weeks.
              </h1>
              <p className="text-lg font-bold text-teal-600 italic tracking-wide">
                "Grammarly for hospital claims."
              </p>
            </div>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg">
              ClaimSense intercepts claim data at the draft stage—checking active eligibility, verifying ICD-10 formatting, scoring readiness, and translating failures into plain English instructions before they reach SHA.
            </p>
            <div className="pt-2 flex gap-4">
              <button
                type="button"
                onClick={onEnter}
                className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-extrabold px-8 py-4 rounded-xl text-sm shadow-md hover:shadow-teal-500/10 transition-all"
              >
                Open Review Workspace
              </button>
            </div>
          </div>

          {/* Hero Right: Live Queue Snapshot */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Queue Snapshot</span>
                <span className="text-[10px] font-bold text-slate-500 font-mono bg-slate-150 rounded-lg px-2 py-0.5 border border-slate-200">
                  {total} Active Drafts
                </span>
              </div>

              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-slate-400">Loading live claims...</span>
                </div>
              ) : total === 0 ? (
                <div className="py-8 text-center text-sm font-semibold text-slate-400">No active claims in pre-submission queue.</div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Readiness Score</span>
                    <ScoreGauge score={avgScore} />
                  </div>
                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex justify-between items-center text-xs p-2 bg-emerald-50/40 border border-emerald-100/60 rounded-xl">
                      <span className="text-emerald-700 font-bold">Ready for openIMIS</span>
                      <span className="font-extrabold text-emerald-800">{ready}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 bg-amber-50/40 border border-amber-100/60 rounded-xl">
                      <span className="text-amber-700 font-bold">Needs Review</span>
                      <span className="font-extrabold text-amber-800">{review}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 bg-red-50/40 border border-red-100/60 rounded-xl">
                      <span className="text-red-700 font-bold">High Risk Errors</span>
                      <span className="font-extrabold text-red-800">{highRisk}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-16 px-6 bg-slate-100/50 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">A seamless 4-step workflow built to optimize point-of-entry accuracy for billing officers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step) => (
              <div key={step.n} className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left hover:scale-[1.02] transition-transform duration-300">
                <span className="text-teal-650 text-xs font-mono font-extrabold block mb-1 text-teal-600">{step.n}</span>
                <h4 className="text-sm font-bold text-slate-800 mb-1.5">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="space-y-2 text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Engineered for Accuracy</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Modern claim verification designed to protect revenue and speed up reimbursements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feat.bgColor}`}>
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-855 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.body}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 block">{feat.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="w-full bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
          <span>© {new Date().getFullYear()} ClaimSense. All rights reserved.</span>
          <div className="flex gap-4">
            <span>openIMIS Hackathon • Track 3: Claims Management</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

LandingPage.propTypes = {
  claims: PropTypes.arrayOf(
    PropTypes.shape({
      _preview: PropTypes.shape({
        color: PropTypes.string,
        score: PropTypes.number,
      }),
    })
  ).isRequired,
  loading: PropTypes.bool,
  onEnter: PropTypes.func.isRequired,
};
