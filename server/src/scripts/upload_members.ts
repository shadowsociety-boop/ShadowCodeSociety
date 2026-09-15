import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const dbUrl = (process.env.DATABASE_URL || '')
  .replace('aws-0-ap-south-1.pooler.supabase.com:5432', '65.0.195.55:6543') + '?pgbouncer=true&sslmode=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

interface CSVMember {
  name: string;
  contact: string;
  batch: string;
  yearNum: string;
  yearText: string;
  sec: string;
  roleType: string;
  finalRole: string;
  branch: string;
  department: string;
  bio: string;
  skills: string[];
  github?: string;
  order: number;
}

const csvDataList: CSVMember[] = [
  {
    name: 'Aditya Kumawat',
    contact: '7976161805',
    batch: 'H',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'C',
    roleType: '',
    finalRole: 'Club Captain',
    branch: 'CYS',
    department: 'Cybersecurity',
    bio: 'Club Captain leading Shadow Code Society operations, student council coordination, and cybersecurity initiatives.',
    skills: ['Leadership', 'Cybersecurity', 'Web Security', 'Offensive Security', 'Python'],
    order: 1,
  },
  {
    name: 'Nakshtra Pal Parihar',
    contact: '9251134847',
    batch: 'F',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'VC',
    roleType: '',
    finalRole: 'Vice-Captain',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Vice-Captain coordinating society operations, AI security research, and inter-domain technical collaborations.',
    skills: ['AI/ML', 'Adversarial Machine Learning', 'Python', 'Security Analytics', 'System Defense'],
    order: 2,
  },
  {
    name: 'Pramod Patel',
    contact: '9561866118',
    batch: 'H',
    yearNum: '2',
    yearText: '2nd Year',
    sec: 'TECH',
    roleType: 'LEAD',
    finalRole: 'Technical Lead',
    branch: 'CYS',
    department: 'Cybersecurity',
    bio: 'Core technical member specializing in vulnerability assessment, web application penetration testing, and security tooling.',
    skills: ['Web Security', 'Penetration Testing', 'Linux', 'OWASP Top 10', 'Bash'],
    order: 3,
  },
  {
    name: 'Nishant Rankawat',
    contact: '9257131501',
    batch: 'H',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'TECH',
    roleType: 'LEAD',
    finalRole: 'Technical Lead',
    branch: 'CYS',
    department: 'Cybersecurity',
    bio: 'Core technical member and full-stack security researcher building resilient platforms and developing CTF challenges.',
    skills: ['Full-Stack Development', 'Cloud Security', 'CTF', 'DevSecOps', 'Application Security'],
    github: 'https://github.com/nishant4086',
    order: 4,
  },
  {
    name: 'Nikhil Adwani',
    contact: '9784573466',
    batch: 'F',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'TECH',
    roleType: 'Member',
    finalRole: 'Technical Member',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Technical team member exploring intelligent security automation, model vulnerabilities, and algorithmic defense.',
    skills: ['Python', 'Data Analytics', 'Machine Learning', 'Network Security', 'Linux'],
    order: 5,
  },
  {
    name: 'Kushagraa',
    contact: '',
    batch: 'TECH',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'TECH',
    roleType: 'LEAD',
    finalRole: 'Technical Lead',
    branch: 'CYS',
    department: 'Cybersecurity & Systems',
    bio: 'Technical Lead driving infrastructure hardening, network protocol analysis, and offensive security research.',
    skills: ['Network Security', 'Systems Architecture', 'Cyber Defense', 'Python', 'Linux'],
    order: 6,
  },
  {
    name: 'Lakshay Jain',
    contact: '9166052155',
    batch: 'H',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'MAN',
    roleType: 'LEAD',
    finalRole: 'Management Lead',
    branch: 'CYS',
    department: 'Cybersecurity',
    bio: 'Leading society logistics, event execution, and participant operations for workshops and hackathons.',
    skills: ['Event Management', 'Operations', 'Resource Planning', 'Cybersecurity Awareness'],
    order: 7,
  },
  {
    name: 'Vaibhav Panwar',
    contact: '9257825252',
    batch: 'G',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'MAN',
    roleType: 'LEAD',
    finalRole: 'Management Lead',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Management Lead coordinating member operations, workshop logistics, and institutional security drills.',
    skills: ['Operations Management', 'Coordination', 'Public Relations', 'Team Logistics'],
    order: 8,
  },
  {
    name: 'Komal Sayal',
    contact: '7340080072',
    batch: 'F',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'MAN',
    roleType: 'Member',
    finalRole: 'Management Member',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Management core member driving community engagement, attendee operations, and student council communications.',
    skills: ['Community Engagement', 'Event Operations', 'Communication', 'Team Building'],
    order: 9,
  },
  {
    name: 'Rajshree Solanki',
    contact: '7877980235',
    batch: 'G',
    yearNum: '2',
    yearText: '2nd Year',
    sec: 'MAN',
    roleType: 'Member',
    finalRole: 'Management Member',
    branch: 'CYS',
    department: 'Cybersecurity',
    bio: 'Supporting event coordination, attendee management, and cybersecurity awareness sessions.',
    skills: ['Event Logistics', 'Documentation', 'Cyber Awareness', 'Coordination'],
    order: 10,
  },
  {
    name: 'Lakshay Vyas',
    contact: '9145918787',
    batch: 'H',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'PR/MAN',
    roleType: 'Member',
    finalRole: 'PR & Management Member',
    branch: 'CYS',
    department: 'Cybersecurity',
    bio: 'Supporting public relations, institutional outreach, and event operations for society initiatives.',
    skills: ['Public Relations', 'Media Relations', 'Management', 'Outreach'],
    order: 11,
  },
  {
    name: 'Daarein Khan',
    contact: '',
    batch: 'PR',
    yearNum: '3',
    yearText: '3rd Year',
    sec: 'PR',
    roleType: 'LEAD',
    finalRole: 'Public Relations Lead',
    branch: 'AI/ML',
    department: 'Public Relations & Outreach',
    bio: 'Directing society media campaigns, student outreach initiatives, and strategic institutional partnerships.',
    skills: ['Public Relations', 'Brand Strategy', 'Community Outreach', 'Communications'],
    order: 12,
  },
  {
    name: 'Fardeen Khan',
    contact: '6377071724',
    batch: 'E',
    yearNum: '2',
    yearText: '2nd Year',
    sec: 'PR/INSTA',
    roleType: 'LEAD',
    finalRole: 'PR & Social Media Lead',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Managing digital branding, Instagram campaigns, and creative outreach for Shadow Code Society.',
    skills: ['Social Media Strategy', 'Digital Marketing', 'Content Creation', 'Brand Design'],
    order: 13,
  },
  {
    name: 'Akhilesh Sharma',
    contact: '6377126787',
    batch: 'E',
    yearNum: '2',
    yearText: '2nd Year',
    sec: 'DES/DOC',
    roleType: 'LEAD',
    finalRole: 'Design & Documentation Lead',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Overseeing visual design, documentation archives, event posters, and UI assets.',
    skills: ['Graphic Design', 'Technical Documentation', 'UI/UX Design', 'Figma'],
    order: 14,
  },
  {
    name: 'Jaideep Vaishnav',
    contact: '8003548875',
    batch: 'E',
    yearNum: '2',
    yearText: '2nd Year',
    sec: 'DOC',
    roleType: 'LEAD',
    finalRole: 'Documentation Lead',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Leading official technical writeups, knowledge base documentation, meeting proceedings, and research records.',
    skills: ['Technical Writing', 'Documentation', 'Research', 'Information Architecture'],
    order: 15,
  },
  {
    name: 'Kratika Singh',
    contact: '7737429556',
    batch: 'F',
    yearNum: '2',
    yearText: '2nd Year',
    sec: 'PR',
    roleType: 'Member',
    finalRole: 'Public Relations Member',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Driving community relations, inter-college club outreach, and media communications.',
    skills: ['Public Relations', 'Communications', 'Networking', 'Event Promotion'],
    order: 16,
  },
  {
    name: 'Azeem',
    contact: '7412936356',
    batch: 'G',
    yearNum: '2',
    yearText: '2nd Year',
    sec: 'MAN/TECH',
    roleType: '',
    finalRole: 'Management & Technical Member',
    branch: 'AI/ML',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'Management and technical contributor supporting workshops, society operations, and algorithmic security research.',
    skills: ['Management', 'Technical Operations', 'Python', 'Machine Learning'],
    order: 17,
  },
];

async function main() {
  console.log('🚀 Starting Member Data Upload from CSV to Database...\n');

  // 1. Fetch existing members in DB
  const existingMembers = await prisma.member.findMany();
  console.log(`Found ${existingMembers.length} existing members in database.`);

  // 2. Ensure Faculty Mentor (Sohaib Khan) is order 0
  const mentor = existingMembers.find(m => m.name.toLowerCase().includes('sohaib'));
  if (mentor) {
    await prisma.member.update({
      where: { id: mentor.id },
      data: { order: 0, status: 'CURRENT' },
    });
    console.log('✓ Faculty Mentor (Sohaib Khan) verified at order 0.');
  }

  // 3. Process each CSV member (Upsert)
  for (const item of csvDataList) {
    // Find matching existing member by name (case-insensitive fuzzy/exact)
    const match = existingMembers.find(m => 
      m.name.trim().toLowerCase() === item.name.trim().toLowerCase() ||
      (item.name.toLowerCase().includes('akhilesh') && m.name.toLowerCase().includes('akhilesh')) ||
      (item.name.toLowerCase().includes('jaideep') && m.name.toLowerCase().includes('jaideep'))
    );

    if (match) {
      // Update existing record
      await prisma.member.update({
        where: { id: match.id },
        data: {
          name: item.name,
          role: item.finalRole,
          department: item.department,
          branch: item.branch,
          year: item.yearText,
          order: item.order,
          status: 'CURRENT',
          bio: item.bio || match.bio,
          skills: JSON.stringify(item.skills.length > 0 ? item.skills : JSON.parse(match.skills || '[]')),
          github: item.github || match.github,
        },
      });
      console.log(`✓ Updated member [${item.order}]: ${item.name} (${item.finalRole}, ${item.yearText}, ${item.branch})`);
    } else {
      // Create new record
      await prisma.member.create({
        data: {
          name: item.name,
          role: item.finalRole,
          department: item.department,
          branch: item.branch,
          year: item.yearText,
          order: item.order,
          status: 'CURRENT',
          bio: item.bio,
          skills: JSON.stringify(item.skills),
          github: item.github || null,
          joinYear: item.yearNum === '2' ? 2025 : 2024,
        },
      });
      console.log(`+ Created new member [${item.order}]: ${item.name} (${item.finalRole}, ${item.yearText}, ${item.branch})`);
    }
  }

  // 4. Any member in DB not in CSV or Mentor, move to ALUMNI (so their history is retained)
  const csvNames = csvDataList.map(c => c.name.toLowerCase());
  for (const em of existingMembers) {
    const isMentor = em.name.toLowerCase().includes('sohaib');
    const inCsv = csvNames.some(cn => cn === em.name.toLowerCase() || (cn.includes('akhilesh') && em.name.toLowerCase().includes('akhilesh')));
    const isAlumniAlready = em.status === 'ALUMNI';

    if (!isMentor && !inCsv && !isAlumniAlready) {
      await prisma.member.update({
        where: { id: em.id },
        data: {
          status: 'ALUMNI',
          leaveYear: 2025,
        },
      });
      console.log(`⇄ Moved inactive member to ALUMNI: ${em.name}`);
    }
  }

  // 5. Verification listing
  const updatedMembers = await prisma.member.findMany({
    where: { status: 'CURRENT' },
    orderBy: { order: 'asc' },
  });

  console.log('\n================ CURRENT ACTIVE ROSTER IN DATABASE ================');
  updatedMembers.forEach(m => {
    console.log(`[#${m.order}] ${m.name.padEnd(24)} | ${m.role.padEnd(28)} | ${m.branch?.padEnd(6)} | ${m.year}`);
  });
  console.log(`================ Total Current Members: ${updatedMembers.length} ================\n`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Migration error:', err);
  prisma.$disconnect();
  process.exit(1);
});
