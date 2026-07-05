import { Building2, ArrowRight } from 'lucide-react';

export function EnterpriseCTA() {
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-4xl">
        <div className="
          relative overflow-hidden rounded-3xl
          bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950
          p-10 text-white shadow-2xl
        ">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 translate-y-1/2 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
            {/* Grid pattern */}
            <svg className="absolute inset-0 h-full w-full opacity-5" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-indigo-300" />
            </div>

            <div className="flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                For Organizations
              </p>
              <h2 className="mb-2 text-2xl font-extrabold md:text-3xl">
                Need Enterprise-Scale Power?
              </h2>
              <p className="text-sm text-slate-300 md:text-base">
                Custom storage, unlimited API, on-premise deployment, SLA guarantees,
                dedicated account manager, and volume pricing — built for your team.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
              <a
                href="mailto:enterprise@aiofficeSuite.com"
                className="
                  inline-flex items-center gap-2 rounded-xl
                  bg-white px-6 py-3 text-sm font-bold text-slate-900
                  hover:bg-indigo-50 transition-colors shadow-lg
                "
              >
                Contact Sales
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="
                  inline-flex items-center justify-center gap-2 rounded-xl
                  border border-white/20 px-6 py-3 text-sm font-semibold text-white
                  hover:bg-white/10 transition-colors
                "
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
