import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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

  const mentor = await prisma.admin.create({
    data: {
      email: 'mentor@shadowcode.dev',
      passwordHash: mentorPassword,
      name: 'Dr. Cipher',
      role: 'MENTOR',
    },
  });

  const president = await prisma.admin.create({
    data: {
      email: 'president@shadowcode.dev',
      passwordHash: presidentPassword,
      name: 'Nishant Rankawat',
      role: 'PRESIDENT',
    },
  });

  console.log('✓ Admin accounts created');
  console.log('  → Mentor: mentor@shadowcode.dev / mentor123');
  console.log('  → President: president@shadowcode.dev / president123\n');

  // ── Members ───────────────────────────────
  const members = [
    { name: 'Dr. Cipher', role: 'Club Mentor', bio: 'Cybersecurity researcher and educator with 15 years of experience in penetration testing and secure architecture.', skills: JSON.stringify(['Penetration Testing', 'Security Architecture', 'Cryptography', 'Threat Modeling']), github: 'https://github.com/drcipher', linkedin: 'https://linkedin.com/in/drcipher', status: 'CURRENT', order: 0, joinYear: 2022 },
    { name: 'Nishant Rankawat', role: 'President', bio: 'Passionate about web security and ethical hacking. Leading the society towards new frontiers in cybersecurity education.', skills: JSON.stringify(['Web Security', 'Ethical Hacking', 'CTF', 'Python', 'JavaScript']), github: 'https://github.com/nishant', linkedin: 'https://linkedin.com/in/nishant', status: 'CURRENT', order: 1, joinYear: 2023 },
    { name: 'Aria Vortex', role: 'Vice President', bio: 'Network security enthusiast and CTF champion. Specializes in infrastructure security and red teaming.', skills: JSON.stringify(['Network Security', 'Red Teaming', 'Linux', 'Wireshark']), github: 'https://github.com/ariavortex', status: 'CURRENT', order: 2, joinYear: 2023 },
    { name: 'Kael Phantom', role: 'Technical Lead', bio: 'Full-stack developer turned security researcher. Building secure applications and breaking insecure ones.', skills: JSON.stringify(['Application Security', 'Secure Coding', 'OWASP', 'Bug Bounty']), github: 'https://github.com/kaelphantom', status: 'CURRENT', order: 3, joinYear: 2023 },
    { name: 'Luna Hex', role: 'CTF Lead', bio: 'CTF addict and puzzle solver. Leads the society in national and international CTF competitions.', skills: JSON.stringify(['CTF', 'Reverse Engineering', 'Binary Exploitation', 'Forensics']), github: 'https://github.com/lunahex', status: 'CURRENT', order: 4, joinYear: 2024 },
    { name: 'Zephyr Root', role: 'Cloud Security Lead', bio: 'Cloud infrastructure specialist focused on securing AWS, GCP, and Azure environments.', skills: JSON.stringify(['Cloud Security', 'AWS', 'DevSecOps', 'Container Security']), status: 'CURRENT', order: 5, joinYear: 2024 },
    { name: 'Nova Shield', role: 'Event Coordinator', bio: 'Organizing impactful cybersecurity events and workshops that bring the community together.', skills: JSON.stringify(['Event Management', 'Community Building', 'OSINT', 'Social Engineering']), status: 'CURRENT', order: 6, joinYear: 2024 },
    { name: 'Raven Proxy', role: 'Member', bio: 'Aspiring pentester diving deep into web application security and vulnerability research.', skills: JSON.stringify(['Web Security', 'Burp Suite', 'SQL Injection', 'XSS']), status: 'CURRENT', order: 7, joinYear: 2025 },
    // Alumni
    { name: 'Ghost Protocol', role: 'Former President', bio: 'Founded the society and established its core mission and values.', skills: JSON.stringify(['Malware Analysis', 'Incident Response', 'Security Operations']), status: 'ALUMNI', order: 0, joinYear: 2022, leaveYear: 2024 },
    { name: 'Cipher Storm', role: 'Former Technical Lead', bio: 'Built the first generation of tools and resources for the society.', skills: JSON.stringify(['Exploit Development', 'Assembly', 'C/C++', 'Kernel Security']), status: 'ALUMNI', order: 1, joinYear: 2022, leaveYear: 2024 },
    { name: 'Echo Null', role: 'Former CTF Lead', bio: 'Led the team to multiple national CTF victories.', skills: JSON.stringify(['Cryptography', 'Steganography', 'Web Exploitation']), status: 'ALUMNI', order: 2, joinYear: 2023, leaveYear: 2025 },
  ];

  for (const m of members) {
    await prisma.member.create({ data: m });
  }
  console.log(`✓ ${members.length} members created (${members.filter(m => m.status === 'CURRENT').length} current, ${members.filter(m => m.status === 'ALUMNI').length} alumni)\n`);

  // ── Events ────────────────────────────────
  const now = new Date();
  const futureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const events = [
    {
      title: 'Shadow CTF 2026',
      slug: 'shadow-ctf-2026',
      description: 'The flagship Capture The Flag competition of Shadow Code Society. Test your offensive security skills across web exploitation, cryptography, reverse engineering, forensics, and more. Solo and team participation welcome. Prizes for top 3 teams.',
      shortDescription: 'Our flagship CTF competition — hack, solve, and dominate.',
      eventType: 'CTF',
      date: futureDate(30),
      startTime: '10:00',
      endTime: '22:00',
      location: 'Computer Science Lab - Block A',
      mode: 'OFFLINE',
      maxParticipants: 100,
      status: 'UPCOMING',
      featured: true,
      published: true,
    },
    {
      title: 'Web Security Masterclass',
      slug: 'web-security-masterclass',
      description: 'Deep dive into OWASP Top 10 vulnerabilities. Hands-on lab sessions covering SQL injection, XSS, CSRF, authentication bypass, and more. Bring your laptop with Burp Suite installed.',
      shortDescription: 'Master the OWASP Top 10 with hands-on exploitation labs.',
      eventType: 'Workshop',
      date: futureDate(14),
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
      date: futureDate(45),
      startTime: '11:00',
      endTime: '13:00',
      location: 'Online',
      mode: 'ONLINE',
      meetingLink: 'https://meet.google.com/shadow-cloud',
      maxParticipants: 200,
      status: 'UPCOMING',
      published: true,
    },
    {
      title: 'Introduction to Ethical Hacking',
      slug: 'intro-ethical-hacking',
      description: 'A beginner-friendly workshop covering the fundamentals of ethical hacking. Learn about reconnaissance, scanning, enumeration, and basic exploitation techniques.',
      shortDescription: 'Start your journey into ethical hacking.',
      eventType: 'Workshop',
      date: pastDate(30),
      startTime: '10:00',
      endTime: '16:00',
      location: 'Auditorium',
      mode: 'OFFLINE',
      maxParticipants: 80,
      status: 'COMPLETED',
      published: true,
    },
  ];

  for (const e of events) {
    const event = await prisma.event.create({ data: e });

    // Add registration form for upcoming events
    if (e.status === 'UPCOMING') {
      const fields = [
        { id: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name', order: 0 },
        { id: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'your@email.com', order: 1 },
        { id: 'phone', label: 'Phone Number', type: 'phone', required: false, placeholder: '+91 XXXXX XXXXX', order: 2 },
        { id: 'college', label: 'College/University', type: 'text', required: true, placeholder: 'Your college name', order: 3 },
        { id: 'year', label: 'Year of Study', type: 'dropdown', required: true, options: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'], order: 4 },
        { id: 'experience', label: 'Cybersecurity Experience Level', type: 'radio', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], order: 5 },
        { id: 'interests', label: 'Areas of Interest', type: 'multiselect', required: false, options: ['Web Security', 'Network Security', 'Cloud Security', 'Forensics', 'Cryptography', 'Malware Analysis', 'OSINT', 'Reverse Engineering'], order: 6 },
        { id: 'github', label: 'GitHub Profile', type: 'url', required: false, placeholder: 'https://github.com/username', order: 7 },
      ];

      await prisma.eventForm.create({
        data: { eventId: event.id, fields: JSON.stringify(fields) },
      });

      // Add sample registrations
      if (e.slug === 'web-security-masterclass') {
        const sampleRegs = [
          { name: 'Alice Walker', email: 'alice@test.com' },
          { name: 'Bob Chen', email: 'bob@test.com' },
          { name: 'Charlie Dev', email: 'charlie@test.com' },
        ];
        for (let i = 0; i < sampleRegs.length; i++) {
          await prisma.registration.create({
            data: {
              eventId: event.id,
              registrationNumber: i + 1,
              name: sampleRegs[i].name,
              email: sampleRegs[i].email,
              responses: JSON.stringify({
                fullName: sampleRegs[i].name,
                email: sampleRegs[i].email,
                college: 'Tech University',
                year: '3rd Year',
                experience: 'Intermediate',
                interests: ['Web Security', 'OSINT'],
              }),
              status: 'REGISTERED',
            },
          });
        }
      }
    }
  }
  console.log(`✓ ${events.length} events created with forms and sample registrations\n`);

  // ── Resources ─────────────────────────────
  const resources = [
    { title: 'OWASP Top 10 - 2025 Edition', slug: 'owasp-top-10-2025', description: 'Comprehensive guide to the OWASP Top 10 web application security risks with practical examples and remediation strategies.', author: 'Dr. Cipher', category: 'Web Security', tags: JSON.stringify(['OWASP', 'Web Security', 'Vulnerabilities']) },
    { title: 'CTF Writeup: Binary Exploitation 101', slug: 'ctf-binary-exploitation-101', description: 'Walkthrough of common binary exploitation challenges including buffer overflows, format string vulnerabilities, and ROP chains.', author: 'Luna Hex', category: 'CTF Writeups', tags: JSON.stringify(['CTF', 'Binary', 'Exploitation', 'PWN']) },
    { title: 'Linux Privilege Escalation Cheatsheet', slug: 'linux-privesc-cheatsheet', description: 'Essential commands and techniques for Linux privilege escalation during penetration testing engagements.', author: 'Kael Phantom', category: 'Ethical Hacking', tags: JSON.stringify(['Linux', 'Privilege Escalation', 'Pentest']) },
    { title: 'Introduction to Cryptography', slug: 'intro-cryptography', description: 'Foundations of modern cryptography covering symmetric/asymmetric encryption, hashing, digital signatures, and PKI.', author: 'Dr. Cipher', category: 'Cryptography', tags: JSON.stringify(['Cryptography', 'Encryption', 'PKI']) },
    { title: 'AWS Security Best Practices', slug: 'aws-security-best-practices', description: 'Guide to securing AWS infrastructure including IAM policies, VPC configurations, S3 bucket policies, and CloudTrail monitoring.', author: 'Zephyr Root', category: 'Cloud Security', tags: JSON.stringify(['AWS', 'Cloud', 'IAM', 'DevSecOps']) },
    { title: 'Network Scanning with Nmap', slug: 'nmap-scanning-guide', description: 'Complete guide to network reconnaissance using Nmap. Covers scan types, scripts, OS detection, and service enumeration.', author: 'Aria Vortex', category: 'Network Security', tags: JSON.stringify(['Nmap', 'Network', 'Scanning', 'Reconnaissance']) },
    { title: 'SQL Injection Deep Dive', slug: 'sql-injection-deep-dive', description: 'Advanced SQL injection techniques including blind SQLi, time-based SQLi, second-order injection, and WAF bypass methods.', author: 'Kael Phantom', category: 'Web Security', tags: JSON.stringify(['SQL Injection', 'Database', 'Web Security']) },
    { title: 'Digital Forensics Toolkit', slug: 'digital-forensics-toolkit', description: 'Essential tools and methodologies for digital forensics investigations including disk imaging, memory analysis, and timeline creation.', author: 'Ghost Protocol', category: 'Digital Forensics', tags: JSON.stringify(['Forensics', 'Investigation', 'Tools']) },
    { title: 'OSINT Resources Collection', slug: 'osint-resources-collection', description: 'Curated list of open-source intelligence tools and techniques for information gathering and reconnaissance.', author: 'Nova Shield', category: 'OSINT', tags: JSON.stringify(['OSINT', 'Intelligence', 'Reconnaissance']) },
    { title: 'Python for Hackers', slug: 'python-for-hackers', description: 'Learn to write security tools in Python. Covers socket programming, web scraping, exploit development, and automation scripts.', author: 'Nishant Rankawat', category: 'Programming', tags: JSON.stringify(['Python', 'Scripting', 'Tools', 'Automation']) },
  ];

  for (const r of resources) {
    await prisma.resource.create({ data: { ...r, description: r.description } });
  }
  console.log(`✓ ${resources.length} resources created\n`);

  // ── Highlights ────────────────────────────
  const highlights = [
    { title: 'Shadow CTF 2025 Winners', description: 'Team Phantom Bytes won the inaugural Shadow CTF with a perfect score in web exploitation.', image: '/uploads/placeholder.jpg', category: 'CTF', featured: true },
    { title: 'Cybersecurity Workshop Series', description: 'Over 200 students attended our 5-part workshop series on ethical hacking fundamentals.', image: '/uploads/placeholder.jpg', category: 'Workshop', featured: true },
    { title: 'National Cyber Defense Competition', description: 'Shadow Code Society placed 3rd in the National Cyber Defense Competition 2025.', image: '/uploads/placeholder.jpg', category: 'Achievement', featured: true },
  ];

  for (const h of highlights) {
    await prisma.highlight.create({ data: h });
  }
  console.log(`✓ ${highlights.length} highlights created\n`);

  // ── Sample Join Applications ──────────────
  const apps = [
    { name: 'Alex Crypt', email: 'alex@test.com', college: 'Tech University', course: 'B.Tech CSE', year: '2nd Year', motivation: 'I am deeply passionate about cybersecurity and want to learn ethical hacking techniques. I have completed several TryHackMe rooms and want to take my skills to the next level.', skills: JSON.stringify(['Python', 'Linux', 'Networking']), status: 'PENDING' },
    { name: 'Maya Shield', email: 'maya@test.com', college: 'Engineering College', course: 'B.Tech IT', year: '3rd Year', branch: 'Information Technology', motivation: 'I want to specialize in cloud security and DevSecOps. Being part of Shadow Code Society will give me the community and resources I need to grow.', skills: JSON.stringify(['AWS', 'Docker', 'Linux', 'Python']), status: 'UNDER_REVIEW' },
  ];

  for (const a of apps) {
    await prisma.joinApplication.create({ data: a });
  }
  console.log(`✓ ${apps.length} join applications created\n`);

  console.log('✅ Seed complete!\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
