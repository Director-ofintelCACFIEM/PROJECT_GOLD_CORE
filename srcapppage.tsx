import React from 'react';
import { ShieldCheck, Radar, FileText, ArrowRight, Activity } from 'lucide-react';

export default function CACFIEMLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Radar className="h-7 w-7 text-emerald-400" />
            <span className="font-bold text-lg tracking-wider text-white">CACFIEM</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-emerald-400 transition">Capabilities</a>
            <a href="#audit" className="hover:text-emerald-400 transition">Forensic Audits</a>
            <a href="#portal" className="hover:text-emerald-400 transition">Client Portal</a>
          </nav>
          <a
            href="#contact"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-md text-sm transition"
          >
            Initiate Engagement
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono mb-6">
            <Activity className="h-3.5 w-3.5" />
            <span>Forensic Intelligence & Entropy Mapping</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Precision Site Audits & Spatial Analytics
          </h1>
          <p className="mt-6 text-slate-400 text-lg leading-relaxed">
            Coast Aerial Check provides high-granularity forensic documentation, environmental compliance auditing, and UAS spatial intelligence for civil and geotechnical engineering projects.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex justify-center items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-base transition"
            >
              Request Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#portal"
              className="inline-flex justify-center items-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-lg text-base border border-slate-700 transition"
            >
              Access Portal
            </a>
          </div>
        </div>
        
        {/* Terminal / Live Pipeline Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-sm text-slate-300 shadow-2xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-xs text-slate-500 ml-2">cacfiem-ingress-stream</span>
          </div>
          <div className="space-y-2 text-xs">
            <p className="text-emerald-400">[SYSTEM] Pipeline active. Ingress router online.</p>
            <p className="text-slate-400">[INSPECT] Site Boundary Polygon: OK</p>
            <p className="text-slate-400">[TELEMETRY] Ground Sample Distance (GSD): Validated</p>
            <p className="text-amber-400">[AUDIT] Statutory Compliance Check (POEO / AS 2870): In Progress</p>
            <p className="text-slate-500">// Clean Room evidence log output standard</p>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="services" className="bg-slate-900/50 py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Core Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl">
              <Radar className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aerial Spatial Mapping</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                High-precision UAS photogrammetry and grid execution delivering verifiable sub-centimeter spatial data.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl">
              <ShieldCheck className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Statutory Compliance</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Comprehensive environmental and structural audit documentation aligned with Australian Standards and state legislation.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl">
              <FileText className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Forensic Intelligence</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Clean Room evidence structuring for site breach identification, defect mapping, and risk mitigation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}