import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Shadow Code Society database...\n');

  // ── Clear existing data ───────────────────
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.eventForm.deleteMany();
  await prisma.event.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.resourceSubmission.deleteMany();
  await prisma.highlight.deleteMany();
  await prisma.joinApplication.deleteMany();
  await prisma.member.deleteMany();
  await prisma.admin.deleteMany();

  // ── Admins ────────────────────────────────
  const mentorPassword = await bcrypt.hash('mentor123', 12);
  const presidentPassword = await bcrypt.hash('president123', 12);

  await prisma.admin.create({
    data: {
      email: 'mentor@shadowcode.dev',
      passwordHash: mentorPassword,
      name: 'Sohaib Khan',
      role: 'MENTOR',
    },
  });

  await prisma.admin.create({
    data: {
      email: 'president@shadowcode.dev',
      passwordHash: presidentPassword,
      name: 'Aditya Kumawat',
      role: 'PRESIDENT',
    },
  });

  console.log('✓ Admin accounts created');

  // ── Members ───────────────────────────────
  const members = [
    // Faculty Mentor
    {
      name: 'Sohaib Khan',
      role: 'Faculty Mentor',
      department: 'Cybersecurity & Computing',
      year: 'Faculty',
      branch: 'FACULTY',
      bio: 'Faculty Mentor guiding Shadow Code Society in cybersecurity research, student development, competitive CTF strategy, and security architecture.',
      skills: JSON.stringify(['Cybersecurity', 'Mentorship', 'Security Architecture', 'Network Defense']),
      status: 'CURRENT',
      order: 0,
      joinYear: 2024,
    },
    // Core Leadership
    {
      name: 'Aditya Kumawat',
      role: 'Club Captain',
      department: 'Cybersecurity',
      branch: 'CYS',
      year: '3rd Year',
      bio: 'Club Captain leading Shadow Code Society operations, student council coordination, and cybersecurity initiatives.',
      skills: JSON.stringify(['Leadership', 'Cybersecurity', 'Web Security', 'Offensive Security', 'Python']),
      status: 'CURRENT',
      order: 1,
      joinYear: 2024,
    },
    {
      name: 'Nakshtra Pal Parihar',
      role: 'Vice-Captain',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '3rd Year',
      bio: 'Vice-Captain coordinating society operations, AI security research, and inter-domain technical collaborations.',
      skills: JSON.stringify(['AI/ML', 'Adversarial Machine Learning', 'Python', 'Security Analytics', 'System Defense']),
      status: 'CURRENT',
      order: 2,
      joinYear: 2024,
    },
    // Technical Domain
    {
      name: 'Pramod Patel',
      role: 'Technical Lead',
      department: 'Cybersecurity',
      branch: 'CYS',
      year: '3rd Year',
      bio: 'Core technical member specializing in vulnerability assessment, web application penetration testing, and security tooling.',
      skills: JSON.stringify(['Web Security', 'Penetration Testing', 'Linux', 'OWASP Top 10', 'Bash']),
      status: 'CURRENT',
      order: 3,
      joinYear: 2024,
    },
    {
      name: 'Nishant Rankawat',
      role: 'Technical Lead',
      department: 'Cybersecurity',
      branch: 'CYS',
      year: '3rd Year',
      bio: 'Core technical member and full-stack security researcher building resilient platforms and developing CTF challenges.',
      skills: JSON.stringify(['Full-Stack Development', 'Cloud Security', 'CTF', 'DevSecOps', 'Application Security']),
      github: 'https://github.com/nishant4086',
      status: 'CURRENT',
      order: 4,
      joinYear: 2024,
    },
    {
      name: 'Lakshya Siyota',
      role: 'Technical & Management Member',
      department: 'Computer Science & Engineering',
      branch: 'CSE',
      year: '3rd Year',
      bio: 'Technical and management specialist driving inter-domain security infrastructure, system operations, and society coordination.',
      skills: JSON.stringify(['Tech & Management', 'CSE', 'System Operations', 'Cybersecurity']),
      status: 'CURRENT',
      order: 5,
      joinYear: 2024,
    },
    {
      name: 'Nikhil Adwani',
      role: 'Technical Member',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '3rd Year',
      bio: 'Technical team member exploring intelligent security automation, model vulnerabilities, and algorithmic defense.',
      skills: JSON.stringify(['Python', 'Data Analytics', 'Machine Learning', 'Network Security', 'Linux']),
      status: 'CURRENT',
      order: 6,
      joinYear: 2024,
    },
    // Management & Leadership
    {
      name: 'Vaibhav Panwar',
      role: 'Management Lead',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '3rd Year',
      bio: 'Management Lead coordinating member operations, workshop logistics, and institutional security drills.',
      skills: JSON.stringify(['Operations Management', 'Coordination', 'Public Relations', 'Team Logistics']),
      status: 'CURRENT',
      order: 7,
      joinYear: 2024,
    },
    {
      name: 'Komal Sayal',
      role: 'Management Lead',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '3rd Year',
      bio: 'Management Lead driving community engagement, attendee operations, and student council communications.',
      skills: JSON.stringify(['Community Engagement', 'Event Operations', 'Communication', 'Team Building']),
      status: 'CURRENT',
      order: 8,
      joinYear: 2024,
    },
    {
      name: 'Lakshay Jain',
      role: 'Management Lead',
      department: 'Cybersecurity',
      branch: 'CYS',
      year: '3rd Year',
      bio: 'Leading society logistics, event execution, and participant operations for workshops and hackathons.',
      skills: JSON.stringify(['Event Management', 'Operations', 'Resource Planning', 'Cybersecurity Awareness']),
      status: 'CURRENT',
      order: 9,
      joinYear: 2024,
    },
    {
      name: 'Azeem',
      role: 'Management & Technical Member',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '2nd Year',
      bio: 'Management and technical contributor supporting workshops, society operations, and algorithmic security research.',
      skills: JSON.stringify(['Management', 'Technical Operations', 'Python', 'Machine Learning']),
      status: 'CURRENT',
      order: 10,
      joinYear: 2025,
    },
    {
      name: 'Riddhi Gandhi',
      role: 'Social Media & PR Lead',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '3rd Year',
      bio: 'Leading society public relations, social media outreach, creative digital campaigns, and community engagement.',
      skills: JSON.stringify(['Social Media', 'Public Relations', 'Digital Marketing', 'Content Strategy']),
      status: 'CURRENT',
      order: 11,
      joinYear: 2024,
    },
    {
      name: 'Lakshay Vyas',
      role: 'PR & Management Lead',
      department: 'Cybersecurity',
      branch: 'CYS',
      year: '3rd Year',
      bio: 'Directing public relations, institutional outreach, and event management for society initiatives.',
      skills: JSON.stringify(['Public Relations', 'Media Relations', 'Management', 'Outreach']),
      status: 'CURRENT',
      order: 12,
      joinYear: 2024,
    },
    {
      name: 'Fardeen Khan',
      role: 'PR & Social Media Lead',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '2nd Year',
      bio: 'Managing digital branding, Instagram campaigns, and creative outreach for Shadow Code Society.',
      skills: JSON.stringify(['Social Media Strategy', 'Digital Marketing', 'Content Creation', 'Brand Design']),
      status: 'CURRENT',
      order: 13,
      joinYear: 2025,
    },
    {
      name: 'Akhilesh Sharma',
      role: 'Design & Documentation Lead',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '2nd Year',
      bio: 'Overseeing visual design, documentation archives, event posters, and UI assets.',
      skills: JSON.stringify(['Graphic Design', 'Technical Documentation', 'UI/UX Design', 'Figma']),
      status: 'CURRENT',
      order: 14,
      joinYear: 2025,
    },
    {
      name: 'Yash Kumar',
      role: 'Technical Member',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '2nd Year',
      bio: 'Active member working on machine learning security challenges, automation, and Python scripts.',
      skills: JSON.stringify(['Python', 'Machine Learning', 'Data Analysis', 'Problem Solving']),
      status: 'CURRENT',
      order: 15,
      joinYear: 2025,
    },
    {
      name: 'Jaideep Vaishnav',
      role: 'Documentation Member',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '2nd Year',
      bio: 'Maintaining official records, meeting minutes, technical writeups, and society proceedings.',
      skills: JSON.stringify(['Technical Writing', 'Documentation', 'Research', 'Information Architecture']),
      status: 'CURRENT',
      order: 16,
      joinYear: 2025,
    },
    {
      name: 'Kratika Singh',
      role: 'Public Relations Member',
      department: 'Artificial Intelligence & Machine Learning',
      branch: 'AI/ML',
      year: '2nd Year',
      bio: 'Driving community relations, inter-college club outreach, and media communications.',
      skills: JSON.stringify(['Public Relations', 'Communications', 'Networking', 'Event Promotion']),
      status: 'CURRENT',
      order: 17,
      joinYear: 2025,
    },
    {
      name: 'Rajshree Solanki',
      role: 'Management Member',
      department: 'Cybersecurity',
      branch: 'CYS',
      year: '2nd Year',
      bio: 'Supporting event coordination, attendee management, and cybersecurity awareness sessions.',
      skills: JSON.stringify(['Event Logistics', 'Documentation', 'Cyber Awareness', 'Coordination']),
      status: 'CURRENT',
      order: 18,
      joinYear: 2025,
    },

    // ── Alumni Hall of Fame ───────────────────
    {
      name: 'Rudra',
      role: 'Founding President',
      department: 'Cybersecurity',
      bio: 'Founding President who established the vision, core values, and foundational research framework of Shadow Code Society.',
      skills: JSON.stringify(['Security Architecture', 'Offensive Security', 'Club Leadership', 'CTF Strategy']),
      status: 'ALUMNI',
      order: 19,
      joinYear: 2023,
      leaveYear: 2024,
    },
    {
      name: 'Sameer Ali',
      role: 'Senior Backend Engineer @ SaveIt',
      department: 'Computer Science & Engineering',
      bio: 'JIET Alumni & Senior Backend Engineer specializing in high-performance distributed systems, NestJS, PostgreSQL, Redis, and NextJS architectures.',
      skills: JSON.stringify(['NestJS', 'PostgreSQL', 'Redis', 'NextJS', 'Backend Architecture']),
      linkedin: 'https://www.linkedin.com/in/sameer-ali',
      status: 'ALUMNI',
      order: 20,
      joinYear: 2021,
      leaveYear: 2024,
    },
    {
      name: 'Raj Patel',
      role: 'AI Engineer @ Teqotic',
      department: 'Artificial Intelligence & Machine Learning',
      bio: 'JIET Alumni & AI Engineer. 3x Hackathon Winner, Runner-up at Ethos IIT Guwahati 2024, Runner-up at Tequity Hackathon 2025, and NASA Space Apps Challenge 2025 Global Nominee.',
      skills: JSON.stringify(['AI & ML', 'Python', 'n8n', 'Agentic Workflows', 'Hackathons']),
      linkedin: 'https://www.linkedin.com/in/raj-patel',
      status: 'ALUMNI',
      order: 21,
      joinYear: 2021,
      leaveYear: 2024,
    },
    {
      name: 'Nishant Rankawat',
      role: 'Technical Lead & Full-Stack Security Researcher',
      department: 'Cybersecurity',
      bio: 'Core technical member and full-stack security researcher building resilient platforms, web security tooling, and developing CTF challenges.',
      skills: JSON.stringify(['Full-Stack Development', 'Cloud Security', 'CTF', 'DevSecOps']),
      github: 'https://github.com/nishant4086',
      status: 'ALUMNI',
      order: 22,
      joinYear: 2024,
      leaveYear: 2026,
    },
  ];

  for (const m of members) {
    await prisma.member.create({ data: m });
  }
  console.log(`✓ ${members.length} members created (${members.filter(m => m.status === 'CURRENT').length} current, ${members.filter(m => m.status === 'ALUMNI').length} alumni)\n`);

  // ── Events ────────────────────────────────
  const events = [
    {
      title: 'Cyber Hunt II',
      slug: 'cyber-hunt-ii',
      description: 'Get ready for Cyber Hunt II, an entry-level technical scavenger hunt designed to test your observational skills, basic tech knowledge, and teamwork!\n\nSpread across the college campus, teams will decode beginner-friendly riddles, solve simple logic puzzles, and scan hidden QR codes to uncover clues that lead to the next destination. Perfect for first-time participants, this level requires zero advanced coding skills just quick thinking, sharp eyes, and a good strategy.\n\n• Level: Basic (Beginner-Friendly)\n• Venue: Campus-wide\n• Team Size: 3–6 members\n• Goal: Decode all campus clues and reach the final terminal first to claim victory!',
      shortDescription: 'Campus-wide technical scavenger hunt — decode clues, scan QR codes, and reach the final terminal first!',
      eventType: 'Competition',
      date: new Date('2026-09-18T10:00:00'),
      startTime: '10:00',
      endTime: '17:00',
      location: 'Campus-wide (Start: Central Amphitheatre)',
      mode: 'OFFLINE',
      maxParticipants: 150,
      status: 'UPCOMING',
      featured: true,
      published: true,
    },
    {
      title: 'Shadow CTF 2026',
      slug: 'shadow-ctf-2026',
      description: 'The flagship Capture The Flag competition of Shadow Code Society. Test your offensive security skills across web exploitation, cryptography, reverse engineering, forensics, and more. Solo and team participation welcome. Prizes for top 3 teams.',
      shortDescription: 'Our flagship CTF competition — hack, solve, and dominate.',
      eventType: 'CTF',
      date: new Date('2026-10-24T10:00:00'),
      startTime: '10:00',
      endTime: '22:00',
      location: 'Computer Science Lab - Block A',
      mode: 'OFFLINE',
      maxParticipants: 100,
      status: 'UPCOMING',
      featured: false,
      published: true,
    },
    {
      title: 'Web Security Masterclass',
      slug: 'web-security-masterclass',
      description: 'Deep dive into OWASP Top 10 vulnerabilities. Hands-on lab sessions covering SQL injection, XSS, CSRF, authentication bypass, and more. Bring your laptop with Burp Suite installed.',
      shortDescription: 'Master the OWASP Top 10 with hands-on exploitation labs.',
      eventType: 'Workshop',
      date: new Date('2026-10-10T14:00:00'),
      startTime: '14:00',
      endTime: '18:00',
      location: 'Seminar Hall 2',
      mode: 'OFFLINE',
      maxParticipants: 50,
      status: 'UPCOMING',
      featured: false,
      published: true,
    },
    {
      title: 'Cloud Security & DevSecOps',
      slug: 'cloud-security-devsecops',
      description: 'Learn how to secure cloud infrastructure. Topics include IAM misconfiguration, S3 bucket security, container escapes, CI/CD pipeline security, and infrastructure as code scanning.',
      shortDescription: 'Securing cloud infrastructure from misconfigurations and attacks.',
      eventType: 'Seminar',
      date: new Date('2027-04-18T11:00:00'), // Put to next year as requested!
      startTime: '11:00',
      endTime: '13:00',
      location: 'Online / Google Meet',
      mode: 'ONLINE',
      meetingLink: 'https://meet.google.com/shadow-cloud',
      maxParticipants: 200,
      status: 'UPCOMING',
      featured: false,
      published: true,
    },
  ];

  for (const e of events) {
    const event = await prisma.event.create({ data: e });

    const fields = [
      { id: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name', order: 0 },
      { id: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'your@email.com', order: 1 },
      { id: 'phone', label: 'Phone Number', type: 'phone', required: false, placeholder: '+91 XXXXX XXXXX', order: 2 },
      { id: 'college', label: 'College/University', type: 'text', required: true, placeholder: 'Your college name', order: 3 },
      { id: 'year', label: 'Year of Study', type: 'dropdown', required: true, options: ['1st Year', '2nd Year', '3rd Year', '4th Year'], order: 4 },
      { id: 'teamName', label: 'Team Name (if applicable)', type: 'text', required: false, placeholder: 'Team Name', order: 5 },
    ];

    await prisma.eventForm.create({
      data: { eventId: event.id, fields: JSON.stringify(fields) },
    });
  }
  console.log(`✓ ${events.length} events created\n`);

  // ── Resources (Official Course Links) ─────
  const resources = [
    {
      title: 'Ethical Hacking Basics — Kali Linux',
      slug: 'ethical-hacking-basics-kali-linux',
      description: 'Foundational Kali Linux tools, network reconnaissance, and practical ethical hacking walkthroughs.',
      author: 'Shadow Code Society',
      category: 'Ethical Hacking',
      externalUrl: 'https://www.udemy.com/course/ethical-hacking-basics-kali-20211/',
      tags: JSON.stringify(['Kali Linux', 'Ethical Hacking', 'Basics', 'Reconnaissance']),
    },
    {
      title: 'OWASP ZAP From Scratch',
      slug: 'owasp-zap-from-scratch',
      description: 'Master automated and manual vulnerability scanning, proxying, and web application security auditing using OWASP ZAP.',
      author: 'Shadow Code Society',
      category: 'Web Security',
      externalUrl: 'https://www.udemy.com/course/owasp-zap-from-scratch/',
      tags: JSON.stringify(['OWASP ZAP', 'Web Security', 'DAST', 'Scanning']),
    },
    {
      title: 'Cybersecurity Kali Linux Course — Part 1',
      slug: 'cybersecurity-kali-linux-course-part-1',
      description: 'Hands-on training in Kali Linux security commands, penetration testing methodology, and vulnerability discovery.',
      author: 'Techlatest',
      category: 'Ethical Hacking',
      externalUrl: 'https://www.udemy.com/course/cybersecurity-kali-linux-course-by-techlatest-part-1/',
      tags: JSON.stringify(['Kali Linux', 'Pentest', 'Security Tools']),
    },
    {
      title: 'Cybersecurity Kali Linux Course — Part 3',
      slug: 'cybersecurity-kali-linux-course-part-3',
      description: 'Advanced Kali Linux offensive tradecraft, exploit payloads, and defensive countermeasure evaluation.',
      author: 'Techlatest',
      category: 'Ethical Hacking',
      externalUrl: 'https://www.udemy.com/course/cybersecurity-kali-linux-course-by-techlatest-part-3/',
      tags: JSON.stringify(['Advanced Exploitation', 'Kali Linux', 'Payloads']),
    },
    {
      title: 'Practical AWS Cloud Security',
      slug: 'practical-aws-cloud-security',
      description: 'In-depth security architecture for Amazon Web Services: IAM policies, VPC boundaries, S3 hardening, and KMS encryption.',
      author: 'CloudSec Lab',
      category: 'Cloud Security',
      externalUrl: 'https://www.udemy.com/course/practical-aws-cloud-security/',
      tags: JSON.stringify(['AWS', 'Cloud Security', 'IAM', 'DevSecOps']),
    },
    {
      title: 'Networking for Ethical Hacker and Penetration Tester',
      slug: 'networking-for-ethical-hacker-and-penetration-tester',
      description: 'Comprehensive network protocol analysis: TCP/IP stack, Wireshark packet dissection, subnetting, routing, and firewall evasion.',
      author: 'NetSec Institute',
      category: 'Network Security',
      externalUrl: 'https://www.udemy.com/course/networking-for-ethical-hacker-and-penetration-tester/',
      tags: JSON.stringify(['Networking', 'TCP/IP', 'Wireshark', 'Packet Analysis']),
    },
    {
      title: 'Ethical Hacking Primer',
      slug: 'ethical-hacking-primer',
      description: 'Essential fundamentals of penetration testing, legal frameworks, reconnaissance workflows, and attack vectors.',
      author: 'Security Academy',
      category: 'Ethical Hacking',
      externalUrl: 'https://www.udemy.com/course/ethical-hacking-primer/',
      tags: JSON.stringify(['Primer', 'Ethical Hacking', 'Recon']),
    },
    {
      title: 'Manage Network Security with pfSense Firewall',
      slug: 'manage-network-security-with-pfsense-firewall',
      description: 'Deployment, rule configuration, VPN tunneling, and perimeter intrusion prevention using open-source pfSense firewalls.',
      author: 'Firewall Ops',
      category: 'Network Security',
      externalUrl: 'https://www.udemy.com/course/crash-course-manage-network-security-with-pfsense-firewall/',
      tags: JSON.stringify(['pfSense', 'Firewall', 'Network Defense', 'IDS']),
    },
    {
      title: 'Ethical Hacker',
      slug: 'ethical-hacker-mastery',
      description: 'Complete ethical hacking program covering system hacking, malware threats, sniffing, social engineering, and DoS defense.',
      author: 'Cyber Research',
      category: 'Ethical Hacking',
      externalUrl: 'https://www.udemy.com/course/ethical-hacker/',
      tags: JSON.stringify(['Ethical Hacker', 'Exploit Defense', 'System Security']),
    },
    {
      title: 'Web Hacking — Cross-Site Scripting & SQL Injection',
      slug: 'web-hacking-cross-site-scripting-sql-injection',
      description: 'Master manual discovery and exploitation of XSS (DOM, Reflected, Stored) and SQL Injection (Union, Blind, Time-based) vulnerabilities.',
      author: 'Lee Cybersec',
      category: 'Web Security',
      externalUrl: 'https://www.udemy.com/course/lees-web-hacking-cross-site-scripting-sql-injection/',
      tags: JSON.stringify(['XSS', 'SQL Injection', 'Web Hacking', 'AppSec']),
    },
  ];

  for (const r of resources) {
    await prisma.resource.create({ data: r });
  }
  console.log(`✓ ${resources.length} resources created\n`);

  // ── Highlights ────────────────────────────
  const highlights = [
    { title: 'Cyber Hunt II Announced', description: 'Campus-wide technical scavenger hunt on 18.09 — test your observational skills and decode clues!', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80', category: 'Event', featured: true },
    { title: 'Shadow CTF 2025 Winners', description: 'Team Phantom Bytes won the inaugural Shadow CTF with a perfect score in web exploitation.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80', category: 'CTF', featured: true },
    { title: 'National Cyber Defense Competition', description: 'Shadow Code Society placed 3rd in the National Cyber Defense Competition 2025.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', category: 'Achievement', featured: true },
  ];

  for (const h of highlights) {
    await prisma.highlight.create({ data: h });
  }
  console.log(`✓ ${highlights.length} highlights created\n`);

  console.log('✅ Seed complete!\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
