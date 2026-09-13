import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, ArrowRight } from 'lucide-react';
import { TextReveal, FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

export const About: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'OFFENSIVE SECURITY RESEARCH',
      desc: 'Understanding how attackers exploit memory, bypass authentication, and discover zero-days is mandatory for building resilient digital environments.',
    },
    {
      num: '02',
      title: 'DEFENSIVE RESILIENCE & DFIR',
      desc: 'Hardening multi-cloud infrastructure, implementing cryptographic assurances, analyzing volatile RAM dumps, and automating detection pipelines.',
    },
    {
      num: '03',
      title: 'OPEN SECURITY ARCHIVES',
      desc: 'No knowledge hoarding. We maintain open exploit writeups, cheat sheets, and tool repositories accessible to every student researcher.',
    },
    {
      num: '04',
      title: 'COLLEGIATE CTF SYNDICATE',
      desc: 'A dedicated competitive team training weekly for national and international Jeopardy and Attack-Defense CTF tournaments.',
    },
  ];

  const ethicsRules = [
    { num: '01', rule: 'WRITTEN AUTHORIZATION REQUIRED', desc: 'We strictly never test or probe systems without explicit, documented legal authorization.' },
    { num: '02', rule: 'RESPONSIBLE DISCLOSURE', desc: 'When vulnerabilities are identified during authorized testing, vendors are notified in private prior to any publication.' },
    { num: '03', rule: 'CONFIDENTIALITY & PRIVACY', desc: 'User privacy and system data integrity are paramount. Zero retention of discovered sensitive artifacts.' },
    { num: '04', rule: 'COMMUNITY PROTECTION', desc: 'Offensive capabilities are harnessed strictly for defensive advancement and educational empowerment.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-20">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <FadeIn>
          <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
            // SOCIETY MISSION
          </span>
        </FadeIn>
        <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          <TextReveal as="span">
            <span className="block">ABOUT</span>
          </TextReveal>
          <TextReveal as="span" delay={0.15}>
            <span className="block">SHADOW CODE SOCIETY.</span>
          </TextReveal>
        </h1>
        <FadeIn delay={0.3}>
          <p className="text-sm sm:text-base text-[#A1A1A1] max-w-2xl font-sans">
            The premier collegiate cybersecurity and ethical hacking society. We train defenders through practical offensive research and deep systems understanding.
          </p>
        </FadeIn>
      </div>

      {/* Manifesto Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
        <div className="lg:col-span-6 space-y-4">
          <FadeIn>
            <span className="text-xs font-mono tracking-widest text-[#666666] uppercase">OUR PHILOSOPHY</span>
          </FadeIn>
          <TextReveal as="h2">
            <span className="font-['Syne'] font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight block">
              OFFENSE INFORMS<br />
              DEFENSE.
            </span>
          </TextReveal>
        </div>
        <FadeIn delay={0.2} className="lg:col-span-6 space-y-4 font-sans text-sm sm:text-base text-[#A1A1A1] leading-relaxed">
          <p>
            Shadow Code Society was founded on a simple truth: you cannot defend what you do not understand how to break.
          </p>
          <p>
            By studying real vulnerabilities, analyzing malware payloads in secure sandboxes, and reverse engineering network protocols, our members gain deep engineering skills that prepare them for leading cybersecurity roles worldwide.
          </p>
        </FadeIn>
      </div>

      {/* 4 Pillars Editorial Grid */}
      <div className="space-y-6 pt-10 border-t border-white/[0.08]">
        <FadeIn>
          <h3 className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
            // OPERATIONAL PILLARS
          </h3>
        </FadeIn>

        <StaggerContainer stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.num}>
              <div className="bg-[#0B0B0B] border border-white/[0.08] rounded-lg p-8 space-y-3 h-full">
                <span className="text-xs font-mono text-[#FF4D1C] font-semibold">{pillar.num}</span>
                <h4 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#A1A1A1] font-sans leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Code of Ethics */}
      <div className="space-y-6 pt-10 border-t border-white/[0.08]">
        <div className="space-y-2">
          <FadeIn>
            <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
              // CODE OF ETHICS & LEGAL CONDUCT
            </span>
          </FadeIn>
          <TextReveal as="h3">
            <span className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white block">
              MANDATORY ETHICAL CODES
            </span>
          </TextReveal>
          <FadeIn delay={0.15}>
            <p className="text-xs text-[#A1A1A1] font-sans max-w-xl">
              Every member of Shadow Code Society is bound by our strict ethical charter. Non-compliance results in immediate revocation of privileges and expulsion.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ethicsRules.map((rule) => (
            <StaggerItem key={rule.num}>
              <div className="bg-[#080808] border border-white/[0.07] rounded-lg p-6 space-y-2 h-full">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#FF4D1C] font-bold">{rule.num}</span>
                  <span className="text-white font-bold">{rule.rule}</span>
                </div>
                <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Join Society CTA */}
      <FadeIn y={30}>
        <div className="p-8 sm:p-12 bg-[#0B0B0B] border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#FF4D1C] uppercase font-semibold">GET INVOLVED</span>
            <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
              Ready to train with the society?
            </h3>
            <p className="text-xs text-[#A1A1A1] font-sans">Applications open for student researchers across all departments.</p>
          </div>

          <Link to="/join">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              APPLY FOR MEMBERSHIP
            </Button>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
};
