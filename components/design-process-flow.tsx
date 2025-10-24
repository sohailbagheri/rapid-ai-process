"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, Plus, Heart, Check } from "lucide-react"
import {
  FlagBannerFold,
  UsersThree,
  MagnifyingGlass,
  ListChecks,
  LightbulbFilament,
  Cube,
  MonitorPlay,
  CheckCircle,
} from "@phosphor-icons/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

async function fetchCounts(duration: string, ids?: string[]): Promise<Record<string, number>> {
  try {
    const url = new URL(`/api/likes`, window.location.origin)
    url.searchParams.set("duration", duration)
    if (ids && ids.length > 0) url.searchParams.set("ids", ids.join(","))
    const res = await fetch(url.toString(), { cache: "no-store" })
    if (!res.ok) return {}
    const data = (await res.json()) as { duration: string; counts: Record<string, number> }
    return data.counts || {}
  } catch {
    return {}
  }
}

async function postLike(detailId: string, duration: string, action: "inc" | "dec") {
  try {
    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ detailId, duration, action }),
    })
  } catch {
    // ignore
  }
}

interface DetailItem {
  id: string
  text: string
}

interface ProcessItem {
  id: string
  title: string
  description?: string
  details?: DetailItem[]
  weeks: (number | "2days")[]
}

interface Phase {
  id: string
  title: string
  description: string
  color: string
  weekRange: string
  borderColor: string
  glowColor: string
  actions: ProcessItem[]
  deliverables: ProcessItem[]
  aiBoosts: ProcessItem[]
}

const phases: Phase[] = [
  {
    id: "phase-0",
    title: "Set the stage",
    description: "Build clarity, prepare foundations, and align sponsors early.",
    color: "from-zinc-600 to-zinc-500",
    weekRange: "Week 0",
    borderColor: "border-zinc-500",
    glowColor: "shadow-zinc-500/50",
    actions: [
      {
        id: "action-0-1",
        title: "Form the core team",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-0-1-detail-1", text: "Identify lead PM, designer, researcher, engineer." },
          { id: "action-0-1-detail-2", text: "Assign facilitator to set up process and rituals." },
          { id: "action-0-1-detail-3", text: "Consult Goals, Growth, People chapter in AI UX Playbook." },
        ],
      },
      {
        id: "action-0-2",
        title: "Defining the project",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "action-0-2-detail-1",
            text: "Check for findings from existing AI UX Research studies. That could also help with inform other stakeholders and SMEs to reach out to.",
          },
          { id: "action-0-2-detail-2", text: "Consult Should your design use AI? chapter in AI UX Playbook." },
          {
            id: "action-0-2-detail-3",
            text: "Consult AI UX Research Library chapter in AI UX Playbook to find what's known and focus on what's unknown",
          },
        ],
      },
      {
        id: "action-0-3",
        title: "Invite sponsors and SMEs",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-0-3-detail-1", text: "Confirm sponsors and key stakeholders." },
          { id: "action-0-3-detail-2", text: "Send invitations with expectations for involvement." },
          { id: "action-0-3-detail-3", text: "Consult Goals, Growth, People chapter in AI UX Playbook." },
        ],
      },
      {
        id: "action-0-4",
        title: "Set up infrastructure",
        weeks: [8, 4],
        details: [
          { id: "action-0-4-detail-1", text: "Create Sharepoint folders, Miro hubs, and/or Webex spaces" },
          { id: "action-0-4-detail-2", text: "Document team norms, roles, and responsibilities." },
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-0-1",
        title: "Team roster",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-0-1-detail-1", text: "Core team, working group, sponsors, and SMEs listed." },
          { id: "deliv-0-1-detail-2", text: "Clarify roles and responsibilities with RACI model." },
        ],
      },
      {
        id: "deliv-0-2",
        title: "Approved Project Brief",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-0-2-detail-1", text: "Scope, objectives, and deliverables documented." },
          { id: "deliv-0-2-detail-2", text: "Sponsor approval recorded and shared." },
        ],
      },
      {
        id: "deliv-0-3",
        title: "Comms strategy and cadence",
        weeks: [8, 4],
        details: [
          { id: "deliv-0-3-detail-1", text: "Define who gets updates, when, and how." },
          { id: "deliv-0-3-detail-2", text: "Establish Webex channels and recurring sessions." },
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-0-1",
        title: "AI assisted OKR definition",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-0-1-detail-1",
            text: "Use AI to draft initial OKRs and pressure-test the scope of what's been defined, providing a starting point for alignment discussions.",
          },
        ],
      },
      {
        id: "ai-0-2",
        title: "Draft Project Brief from past inputs",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-0-2-detail-1",
            text: "Feed recordings (e.g., Webex) and existing research into AI to generate a first-draft Project Brief for sponsors to react to.",
          },
        ],
      },
    ],
  },
  // Due to length, showing pattern for remaining phases
  {
    id: "phase-1",
    title: "Align group",
    description: "Kick off collaboration, align team, and set project momentum.",
    color: "from-blue-600 to-blue-500",
    weekRange: "Week 1",
    borderColor: "border-blue-500",
    glowColor: "shadow-blue-500/50",
    actions: [
      {
        id: "action-1-1",
        title: "Host kickoff",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "action-1-1-detail-1",
            text: "Preparation: once approved by sponsors, share the Project Brief with the working group ahead of the meeting.",
          },
          {
            id: "action-1-1-detail-2",
            text: "Team members review the Project Brief and document initial thoughts in the project Miro",
          },
        ],
      },
      {
        id: "action-1-2",
        title: "Host first working session",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "action-1-2-detail-1",
            text: "Use the Project Miro board to introduce the team hub, logistics, and initial tasks.",
          },
          {
            id: "action-1-2-detail-2",
            text: "Discuss and reflect on the project scope and objectives. Ensure the team has clarity. Assign initial tasks and responsibilities.",
          },
        ],
      },
      {
        id: "action-1-3",
        title: "Run questionstorming exercise",
        weeks: [8, 4],
        details: [
          { id: "action-1-3-detail-1", text: "Capture what the team knows and doesn't know." },
          { id: "action-1-3-detail-2", text: "Use outputs to inform interview guide." },
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-1-1",
        title: "Drafted interview guide",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-1-1-detail-1", text: "Seeded from questionstorming results, ready for sponsor review." },
        ],
      },
      {
        id: "deliv-1-2",
        title: "Kickoff agenda",
        weeks: [8, 4],
        details: [{ id: "deliv-1-2-detail-1", text: "Project Brief, goals, deliverables, sponsor intros, team Q&A." }],
      },
      {
        id: "deliv-1-3",
        title: "Rituals and cadence calendar",
        weeks: [8, 4],
        details: [{ id: "deliv-1-3-detail-1", text: "Documented sessions and practices for team collaboration." }],
      },
    ],
    aiBoosts: [
      {
        id: "ai-1-1",
        title: "Auto generate kickoff content",
        weeks: [8, 4, 2, 1, "2days"],
        details: [{ id: "ai-1-1-detail-1", text: "Seed Q&A from the Project Brief" }],
      },
      {
        id: "ai-1-2",
        title: "Transcribe and summarize sessions",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-1-2-detail-1",
            text: "Capture discussions from kickoff/working sessions, output decisions, risks, and next steps into Miro.",
          },
        ],
      },
    ],
  },
  {
    id: "phase-2",
    title: "Discovery",
    description: "Uncover user needs, challenges, and insights through deep exploration.",
    color: "from-fuchsia-600 to-fuchsia-500",
    weekRange: "Week 1–2",
    borderColor: "border-fuchsia-500",
    glowColor: "shadow-fuchsia-500/50",
    actions: [
      {
        id: "action-2-1",
        title: "Conduct internal stakeholder interviews",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "action-2-1-detail-1",
            text: "Prepare a diverse list of interviewees across roles and products, using questionstorming to shape the guide.",
          },
          { id: "action-2-1-detail-2", text: "Consult Empathize phase of AI UX framework chapter in AI UX Playbook " },
          {
            id: "action-2-1-detail-3",
            text: "Consult AI UX Research Library chapter in AI UX Playbook to find what's known and focus on what's unknown",
          },
        ],
      },
      {
        id: "action-2-2",
        title: "Document assumptions",
        weeks: [8, 4],
        details: [
          {
            id: "action-2-2-detail-1",
            text: "Capture existing assumptions about users, workflows, and problem space.",
          },
          { id: "action-2-2-detail-2", text: "Note gaps in knowledge to guide interviews and research." },
        ],
      },
      {
        id: "action-2-3",
        title: "Host product demos",
        weeks: [8, 4],
        details: [
          {
            id: "action-2-3-detail-1",
            text: "Review existing product features and pain points relevant to the project scope.",
          },
          { id: "action-2-3-detail-2", text: "Capture insights to inform ideation later." },
        ],
      },
      {
        id: "action-2-4",
        title: "Start additional research if planned",
        weeks: [8],
        details: [
          { id: "action-2-4-detail-1", text: "Confirm research goals, timelines, and resources with project leaders." },
          {
            id: "action-2-4-detail-2",
            text: "Ensure additional work supports progress but does not block the main sprint.",
          },
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-2-1",
        title: "Interviewee list and guide",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-2-1-detail-1", text: "List of interviewees across functions and an approved discussion guide." },
        ],
      },
      {
        id: "deliv-2-2",
        title: "Discovery activity outputs",
        weeks: [8, 4],
        details: [
          {
            id: "deliv-2-2-detail-1",
            text: "Employ journey mapping, empathy mapping, and Jobs To Be Done analysis to",
          },
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-2-1",
        title: "Seed the question bank",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-2-1-detail-1",
            text: "Feed the Project Brief, existing research, tickets, and product docs into AI to generate critical questions for interviews.",
          },
        ],
      },
      {
        id: "ai-2-2",
        title: "Draft discussion guide",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-2-2-detail-1",
            text: "Use AI to convert the seeded question bank into a polished discussion guide tailored for different interviewees.",
          },
        ],
      },
      {
        id: "ai-2-3",
        title: "Auto summarize interviews",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-2-3-detail-1",
            text: "Transcribe recordings, highlight key quotes, and cluster insights into themes with confidence scores.",
          },
        ],
      },
    ],
  },
  {
    id: "phase-3",
    title: "Define",
    description: "Translate research into clear priorities and actionable user needs.",
    color: "from-amber-600 to-amber-500",
    weekRange: "Week 2–3",
    borderColor: "border-amber-500",
    glowColor: "shadow-amber-500/50",
    actions: [
      {
        id: "action-3-1",
        title: "Synthesize gathered knowledge",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-3-1-detail-1", text: "Review interview notes, research insights, and discovery artifacts." },
          {
            id: "action-3-1-detail-2",
            text: "Cluster related findings into themes to highlight patterns and opportunities.",
          },
          { id: "action-3-1-detail-3", text: "Facilitate group discussion to align on key insights." },
        ],
      },
      {
        id: "action-3-2",
        title: "Generate need statements",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-3-2-detail-1", text: "Create statements focused on specific user pain points and value." },
          {
            id: "action-3-2-detail-2",
            text: "Explore multiple variations before narrowing down to the most critical.",
          },
          { id: "action-3-2-detail-3", text: "Consult Define phase of AI UX framework chapter in AI UX Playbook " },
        ],
      },
      {
        id: "action-3-3",
        title: "Articulate user outcomes",
        weeks: [8, 4],
        details: [
          {
            id: "action-3-3-detail-1",
            text: "Reframe need statements into user-centered outcomes tied to business goals.",
          },
          { id: "action-3-3-detail-2", text: "Capture the shift from current pain points to future benefits." },
          { id: "action-3-3-detail-3", text: "Ensure outcomes are measurable, specific, and sponsor-ready." },
        ],
      },
      {
        id: "action-3-4",
        title: "Develop real life scenarios",
        weeks: [8, 4],
        details: [
          { id: "action-3-4-detail-1", text: "Draft short stories or vignettes that illustrate prioritized outcomes." },
          {
            id: "action-3-4-detail-2",
            text: "Use scenarios to highlight user struggles and the value of proposed solutions.",
          },
          { id: "action-3-4-detail-3", text: "Keep scenarios high-level but actionable enough to inspire ideation." },
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-3-1",
        title: "Affinity map or cluster board",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-3-1-detail-1", text: "Organized view of themes, pain points, and opportunity areas." },
          { id: "deliv-3-1-detail-2", text: "Consult AI Tools and Methods chapter in AI UX Playbook" },
        ],
      },
      {
        id: "deliv-3-2",
        title: "Draft need statements",
        weeks: [8, 4, 2, 1, "2days"],
        details: [{ id: "deliv-3-2-detail-1", text: "Clear user needs to… so that… statements grounded in evidence." }],
      },
      {
        id: "deliv-3-3",
        title: "Real life scenario",
        weeks: [8, 4],
        details: [
          { id: "deliv-3-3-detail-1", text: "Narratives that visualize current challenges and future outcomes." },
        ],
      },
      {
        id: "deliv-3-4",
        title: "User outcomes",
        weeks: [8, 4],
        details: [
          { id: "deliv-3-4-detail-1", text: "Approved outcome statements reframing needs into value delivered." },
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-3-1",
        title: "Convert insights into need statements",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-3-1-detail-1",
            text: "Automatically draft need statements from clustered insights and highlight vague or redundant phrasing for the team to refine.",
          },
        ],
      },
      {
        id: "ai-3-2",
        title: "Use AI to draft real life scenario",
        weeks: [8, 4],
        details: [
          {
            id: "ai-3-2-detail-1",
            text: "Generate story outlines or scripts that illustrate user struggles and future benefits, using inputs from need statements and outcomes.",
          },
        ],
      },
    ],
  },
  {
    id: "phase-4",
    title: "Ideate",
    description: "Spark creativity, explore possibilities, and refine top solution ideas.",
    color: "from-red-600 to-red-500",
    weekRange: "Week 2–3",
    borderColor: "border-red-500",
    glowColor: "shadow-red-500/50",
    actions: [
      {
        id: "action-4-1",
        title: "What If ideation",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "action-4-1-detail-1",
            text: "Encourage lateral inspiration from adjacent domains, nature, or unrelated industries.",
          },
          { id: "action-4-1-detail-2", text: "Generate a large pool of divergent solutions." },
          { id: "action-4-1-detail-3", text: "Consult Ideate phase of AI UX framework chapter in AI UX Playbook " },
        ],
      },
      {
        id: "action-4-2",
        title: "Narrow down ideas",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "action-4-2-detail-1",
            text: "Facilitate voting or scoring exercises to identify the strongest solutions.",
          },
          {
            id: "action-4-2-detail-2",
            text: "Create simple walkthroughs illustrating challenge, solution, and value.",
          },
          { id: "action-4-2-detail-3", text: "Consult Principles and Patterns chapter in AI UX Playbook" },
        ],
      },
      {
        id: "action-4-3",
        title: "Storyboarding",
        weeks: [8, 4],
        details: [
          { id: "action-4-3-detail-1", text: "Translate top ideas into quick sketches or visual storyboards." },
          { id: "action-4-3-detail-2", text: "Ground storyboards in real-life scenarios developed during Define." },
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-4-1",
        title: "Shortlist of ideas per outcome",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-4-1-detail-1", text: "A curated set of two or three solution directions per outcome." },
          { id: "deliv-4-1-detail-2", text: "Document rationale for selection tied to user outcomes." },
        ],
      },
      {
        id: "deliv-4-2",
        title: "Initial prototype files",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-4-2-detail-1", text: "Exploratory screens or flows created in Figma Make or other tools." },
          { id: "deliv-4-2-detail-2", text: "Documentation of assumptions and open questions to test later." },
          { id: "deliv-4-2-detail-3", text: "Consult AI Tools and Methods chapter in AI UX Playbook" },
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-4-1",
        title: "AI Idea Catalyst",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-4-1-detail-1",
            text: "Seed AI with need statements, research insights, and outcome goals.",
          },
          {
            id: "ai-4-1-detail-2",
            text: "Leverage AI to spark a wide range of initial ideas, and use diverse prompts to fuel ideation.",
          },
        ],
      },
      {
        id: "ai-4-2",
        title: "Storyboarding support",
        weeks: [8, 4],
        details: [
          { id: "ai-4-2-detail-1", text: "Generate draft images or sketches from text-based scenarios." },
          { id: "ai-4-2-detail-2", text: "Propose visual metaphors or layouts to accelerate storyboard creation." },
          { id: "ai-4-2-detail-3", text: "Iterate quickly on variations to explore multiple story directions." },
        ],
      },
      {
        id: "ai-4-3",
        title: "Early prototyping with AI",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-4-3-detail-1",
            text: "Create rough, low-fidelity mockups with Figma Make or other vibe-coding tools.",
          },
          { id: "ai-4-3-detail-2", text: "Suggest component patterns aligned with the Momentum / Magnetic system." },
          { id: "ai-4-3-detail-3", text: "Consult Principles and Patterns chapter in AI UX Playbook" },
        ],
      },
    ],
  },
  {
    id: "phase-5",
    title: "Prototype",
    description: "Transform concepts into prototypes.",
    color: "from-rose-600 to-rose-500",
    weekRange: "Week 5",
    borderColor: "border-rose-500",
    glowColor: "shadow-rose-500/50",
    actions: [
      {
        id: "action-5-1",
        title: "Figma designs",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-5-1-detail-1", text: "Translate storyboards into clickable flows." },
          { id: "action-5-1-detail-2", text: "Consult Prototype phase of AI UX framework chapter in AI UX Playbook " },
        ],
      },
      {
        id: "action-5-2",
        title: "Build initial prototypes",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-5-2-detail-1", text: "Use vibe coding tools to accelerate early builds." },
          { id: "action-5-2-detail-2", text: "Translate storyboards into clickable low- to mid-fidelity prototypes." },
        ],
      },
      {
        id: "action-5-3",
        title: "Run review rounds",
        weeks: [8, 4],
        details: [
          { id: "action-5-3-detail-1", text: "Peer reviews often with PM and Eng." },
          { id: "action-5-3-detail-2", text: "Hold sponsor/SME reviews to validate direction and secure feedback." },
        ],
      },
      {
        id: "action-5-4",
        title: "Craft the narrative",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-5-4-detail-1", text: "Collaborate across design, PM, and research to draft a cohesive story." },
          { id: "action-5-4-detail-2", text: "Keep focus on user value and business impact." },
          { id: "action-5-4-detail-3", text: "Connect prototypes directly to outcomes, metrics, and strategic goals." },
          { id: "action-5-4-detail-4", text: "Consult Best Practices chapter in AI UX Playbook." },
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-5-1",
        title: "Initial prototype file",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-5-1-detail-1", text: "Low to mid fidelity clickable prototype." },
          { id: "deliv-5-1-detail-2", text: "Variant branches for key choices." },
        ],
      },
      {
        id: "deliv-5-2",
        title: "Narrative and script doc",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-5-2-detail-1", text: "Written story aligned with personas, needs, and outcomes." },
          { id: "deliv-5-2-detail-2", text: "Includes challenges, solutions, and impact on metrics." },
          { id: "deliv-5-2-detail-3", text: "Serves as the backbone for later presentations." },
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-5-1",
        title: "Vibe coding accelerators",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "ai-5-1-detail-1", text: "Consult AI Tools chapter in AI UX Playbook." },
          { id: "ai-5-1-detail-2", text: "Auto generate placeholder copy and data." },
        ],
      },
      {
        id: "ai-5-2",
        title: "Narrative drafting",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "ai-5-2-detail-1", text: "Expand rough bullet points into polished draft scripts." },
          { id: "ai-5-2-detail-2", text: "Propose alternative framings to emphasize user or business value." },
        ],
      },
    ],
  },
  {
    id: "phase-6",
    title: "Present",
    description: "Showcase outcomes with a polished prototype and engaging presentation and vidcast.",
    color: "from-orange-600 to-orange-500",
    weekRange: "Week 5",
    borderColor: "border-orange-500",
    glowColor: "shadow-orange-500/50",
    actions: [
      {
        id: "action-6-1",
        title: "Develop final prototypes",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "action-6-1-detail-1",
            text: "Translate shortlisted ideas into high fidelity, testable prototypes.",
          },
          {
            id: "action-6-1-detail-2",
            text: "Consult Principles and Patterns, Responsible AI & Ethics, and the Test phase of AI UX Framework in AI UX Playbook.",
          },
          {
            id: "action-6-1-detail-3",
            text: "Tools can vary (Figma, PowerPoint, custom demo), what matters is clarity, interactivity, and adaptability.",
          },
        ],
      },
      {
        id: "action-6-2",
        title: "Refine the narrative",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "action-6-2-detail-1",
            text: "Ensure the storyline flows from pain points → solutions → business outcomes.",
          },
          { id: "action-6-2-detail-2", text: "Align language with Cisco's Responsible AI guidelines." },
        ],
      },
      {
        id: "action-6-3",
        title: "Deliver the final readout",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-6-3-detail-1", text: "Present to sponsors, SMEs, and stakeholders." },
          { id: "action-6-3-detail-2", text: "Record and publish the final vidcast for broader visibility." },
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-6-1",
        title: "Final prototypes",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-6-1-detail-1", text: "High-fidelity, clickable, and ready for stakeholder demonstration." },
          {
            id: "deliv-6-1-detail-2",
            text: "Clear links to user outcomes, success measures, and ethical design practices.",
          },
        ],
      },
      {
        id: "deliv-6-2",
        title: "Presentation deck",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "deliv-6-2-detail-1",
            text: "Visual storytelling supported with evidence, outcomes, and design rationale.",
          },
          {
            id: "deliv-6-2-detail-2",
            text: "Clear sections for problem framing, solution walkthroughs, and business impact.",
          },
        ],
      },
      {
        id: "deliv-6-3",
        title: "Narrative and script doc",
        weeks: [8, 4],
        details: [
          { id: "deliv-6-3-detail-1", text: "Polished storyline aligned with outcomes." },
          {
            id: "deliv-6-3-detail-2",
            text: "Finalized version published in SharePoint / Confluence alongside the prototypes.",
          },
        ],
      },
      {
        id: "deliv-6-4",
        title: "Vidcast recording",
        weeks: [8, 4],
        details: [
          { id: "deliv-6-4-detail-1", text: "Captures the presentation and demo for async audiences." },
          { id: "deliv-6-4-detail-2", text: "Packaged with the final deck as the reference bundle." },
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-6-1",
        title: "Generate presentation spine",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "ai-6-1-detail-1", text: "Use Circuit to generate a draft PowerPoint deck as a structural backbone." },
          { id: "ai-6-1-detail-2", text: "Designers should refine visuals and polish narrative flow." },
        ],
      },
      {
        id: "ai-6-2",
        title: "Practice stakeholder questions",
        weeks: [8, 4],
        details: [
          {
            id: "ai-6-2-detail-1",
            text: "Query AI against project content to surface the most relevant insights and materials for the specific stakeholders being presented to.",
          },
        ],
      },
    ],
  },
  {
    id: "phase-7",
    title: "Close project",
    description: "Celebrate milestones, finalize artifacts, and prepare for future learnings.",
    color: "from-green-600 to-green-500",
    weekRange: "Week 6",
    borderColor: "border-green-500",
    glowColor: "shadow-green-500/50",
    actions: [
      {
        id: "action-7-1",
        title: "Finalize and archive artifacts",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-7-1-detail-1", text: "Convert Figma to PPT and PDF with notes." },
          { id: "action-7-1-detail-2", text: "Publish vidcast and organize files in SharePoint." },
          { id: "action-7-1-detail-3", text: "Set up a central doc linking to all materials for leaders." },
        ],
      },
      {
        id: "action-7-2",
        title: "Conduct reflection session",
        weeks: [8, 4],
        details: [
          { id: "action-7-2-detail-1", text: "Discuss what worked and what to improve." },
          { id: "action-7-2-detail-2", text: "Capture ideas to improve Rapid AI UX process." },
        ],
      },
      {
        id: "action-7-3",
        title: "Socialize final artifacts",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "action-7-3-detail-1", text: "Share across design, PM, and engineering channels." },
          { id: "action-7-3-detail-2", text: "Create central doc linking all materials." },
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-7-1",
        title: "Project artifact bundle",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          { id: "deliv-7-1-detail-1", text: "Final clickable prototype (Figma)." },
          { id: "deliv-7-1-detail-2", text: "Project deck (PPT + PDF)." },
          { id: "deliv-7-1-detail-3", text: "Script document (Word)." },
          { id: "deliv-7-1-detail-4", text: "Final vidcast recording and narration podcast." },
          { id: "deliv-7-1-detail-5", text: "Final research artifacts." },
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-7-2",
        title: "Summarize reflections",
        weeks: [8, 4],
        details: [
          { id: "ai-7-2-detail-1", text: "Summarize reflection session transcripts into clear insights." },
          { id: "ai-7-2-detail-2", text: 'Cluster feedback into "what worked / what to improve."' },
        ],
      },
      {
        id: "ai-7-3",
        title: "Share new AI UX patterns",
        weeks: [8, 4, 2, 1, "2days"],
        details: [
          {
            id: "ai-7-3-detail-1",
            text: "Upload new design patterns / components to the AI UX Patterns section on the AI UX Playbook.",
          },
        ],
      },
    ],
  },
]

const getPhaseIcon = (phaseId: string) => {
  const iconProps = { size: 24, weight: "duotone" as const }
  switch (phaseId) {
    case "phase-0":
      return <FlagBannerFold {...iconProps} />
    case "phase-1":
      return <UsersThree {...iconProps} />
    case "phase-2":
      return <MagnifyingGlass {...iconProps} />
    case "phase-3":
      return <ListChecks {...iconProps} />
    case "phase-4":
      return <LightbulbFilament {...iconProps} />
    case "phase-5":
      return <Cube {...iconProps} />
    case "phase-6":
      return <MonitorPlay {...iconProps} />
    case "phase-7":
      return <CheckCircle {...iconProps} />
    default:
      return null
  }
}

export function DesignProcessFlow() {
  const [duration, setDuration] = useState("8")
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [usedDetails, setUsedDetails] = useState<Set<string>>(new Set())
  const [customItems, setCustomItems] = useState<{
    [phaseId: string]: {
      actions: ProcessItem[]
      deliverables: ProcessItem[]
      aiBoosts: ProcessItem[]
    }
  }>({})
  const [customDetails, setCustomDetails] = useState<{
    [itemId: string]: DetailItem[]
  }>({})
  const [newItemInputs, setNewItemInputs] = useState<{
    [key: string]: string
  }>({})
  const baseUsageCounts: { [detailId: string]: number } = {
    // Phase 0 details
    "action-0-1-detail-1": 42,
    "action-0-1-detail-2": 38,
    "action-0-1-detail-3": 35,
    "action-0-2-detail-1": 45,
    "action-0-2-detail-2": 40,
    "action-0-2-detail-3": 37,
    "deliv-0-1-detail-1": 41,
    "deliv-0-1-detail-2": 39,
    "ai-0-1-detail-1": 36,
    "ai-0-2-detail-1": 34,
    // Phase 1 details
    "action-1-1-detail-1": 39,
    "action-1-1-detail-2": 37,
    "action-1-2-detail-1": 41,
    "action-1-2-detail-2": 40,
    "action-1-3-detail-1": 33,
    "action-1-3-detail-2": 30,
    "deliv-1-1-detail-1": 37,
    "deliv-1-2-detail-1": 30,
    "deliv-1-3-detail-1": 25,
    "ai-1-1-detail-1": 34,
    "ai-1-2-detail-1": 36,
    // Phase 2 details
    "action-2-1-detail-1": 44,
    "action-2-1-detail-2": 40,
    "action-2-1-detail-3": 38,
    "action-2-2-detail-1": 32,
    "action-2-2-detail-2": 29,
    "action-2-3-detail-1": 28,
    "action-2-3-detail-2": 25,
    "action-2-4-detail-1": 19,
    "action-2-4-detail-2": 16,
    "deliv-2-1-detail-1": 41,
    "deliv-2-2-detail-1": 31,
    "ai-2-1-detail-1": 38,
    "ai-2-2-detail-1": 40,
    "ai-2-3-detail-1": 43,
    // Phase 3 details
    "action-3-1-detail-1": 46,
    "action-3-1-detail-2": 43,
    "action-3-1-detail-3": 40,
    "action-3-2-detail-1": 44,
    "action-3-2-detail-2": 41,
    "action-3-2-detail-3": 38,
    "action-3-3-detail-1": 35,
    "action-3-3-detail-2": 32,
    "action-3-3-detail-3": 30,
    "action-3-4-detail-1": 30,
    "action-3-4-detail-2": 28,
    "action-3-4-detail-3": 26,
    "deliv-3-1-detail-1": 42,
    "deliv-3-1-detail-2": 40,
    "deliv-3-2-detail-1": 45,
    "deliv-3-3-detail-1": 33,
    "deliv-3-4-detail-1": 31,
    "ai-3-1-detail-1": 41,
    "ai-3-2-detail-1": 29,
    // Phase 4 details
    "action-4-1-detail-1": 47,
    "action-4-1-detail-2": 45,
    "action-4-1-detail-3": 42,
    "action-4-2-detail-1": 48,
    "action-4-2-detail-2": 46,
    "action-4-2-detail-3": 43,
    "action-4-3-detail-1": 36,
    "action-4-3-detail-2": 33,
    "deliv-4-1-detail-1": 43,
    "deliv-4-1-detail-2": 41,
    "deliv-4-2-detail-1": 44,
    "deliv-4-2-detail-2": 42,
    "deliv-4-2-detail-3": 40,
    "ai-4-1-detail-1": 49,
    "ai-4-1-detail-2": 47,
    "ai-4-2-detail-1": 32,
    "ai-4-2-detail-2": 30,
    "ai-4-2-detail-3": 28,
    "ai-4-3-detail-1": 45,
    "ai-4-3-detail-2": 43,
    "ai-4-3-detail-3": 40,
    // Phase 5 details
    "action-5-1-detail-1": 50,
    "action-5-1-detail-2": 48,
    "action-5-2-detail-1": 48,
    "action-5-2-detail-2": 46,
    "action-5-3-detail-1": 37,
    "action-5-3-detail-2": 35,
    "action-5-4-detail-1": 46,
    "action-5-4-detail-2": 44,
    "action-5-4-detail-3": 42,
    "action-5-4-detail-4": 40,
    "deliv-5-1-detail-1": 49,
    "deliv-5-1-detail-2": 47,
    "deliv-5-2-detail-1": 47,
    "deliv-5-2-detail-2": 45,
    "deliv-5-2-detail-3": 43,
    "ai-5-1-detail-1": 51,
    "ai-5-1-detail-2": 49,
    "ai-5-2-detail-1": 44,
    "ai-5-2-detail-2": 42,
    // Phase 6 details
    "action-6-1-detail-1": 52,
    "action-6-1-detail-2": 50,
    "action-6-1-detail-3": 48,
    "action-6-2-detail-1": 50,
    "action-6-2-detail-2": 48,
    "action-6-3-detail-1": 53,
    "action-6-3-detail-2": 51,
    "deliv-6-1-detail-1": 51,
    "deliv-6-1-detail-2": 49,
    "deliv-6-2-detail-1": 52,
    "deliv-6-2-detail-2": 50,
    "deliv-6-3-detail-1": 38,
    "deliv-6-3-detail-2": 36,
    "deliv-6-4-detail-1": 35,
    "deliv-6-4-detail-2": 33,
    "ai-6-1-detail-1": 48,
    "ai-6-1-detail-2": 46,
    "ai-6-2-detail-1": 34,
    // Phase 7 details
    "action-7-1-detail-1": 45,
    "action-7-1-detail-2": 43,
    "action-7-1-detail-3": 40,
    "action-7-2-detail-1": 33,
    "action-7-2-detail-2": 30,
    "action-7-3-detail-1": 42,
    "action-7-3-detail-2": 40,
    "deliv-7-1-detail-1": 46,
    "deliv-7-1-detail-2": 44,
    "deliv-7-1-detail-3": 42,
    "deliv-7-1-detail-4": 40,
    "deliv-7-1-detail-5": 38,
    "ai-7-2-detail-1": 31,
    "ai-7-2-detail-2": 29,
    "ai-7-3-detail-1": 39,
  }

  const DURATION_KEYS = ["8", "4", "2", "1", "2days"] as const
  const makeDetailKey = (detailId: string, durationKey: string) => `${durationKey}::${detailId}`

  const [usageCounts, setUsageCounts] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {}
    for (const d of DURATION_KEYS) {
      for (const [id, count] of Object.entries(baseUsageCounts)) {
        initial[makeDetailKey(id, d)] = count
      }
    }
    return initial
  })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const phaseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Rehydrate likes and counts from localStorage
  useEffect(() => {
    try {
      const savedUsed = typeof window !== "undefined" ? localStorage.getItem("usedDetails") : null
      const savedCounts = typeof window !== "undefined" ? localStorage.getItem("usageCounts") : null
      const savedCustomItems = typeof window !== "undefined" ? localStorage.getItem("customItems") : null
      const savedCustomDetails = typeof window !== "undefined" ? localStorage.getItem("customDetails") : null
      if (savedUsed) {
        const parsed: string[] = JSON.parse(savedUsed)
        const migrated = parsed.map((id) => (id.includes("::") ? id : makeDetailKey(id, duration)))
        setUsedDetails(new Set(migrated))
      }
      if (savedCounts) {
        const parsedCounts = JSON.parse(savedCounts) as { [key: string]: number }
        const migrated: { [key: string]: number } = {}
        for (const [k, v] of Object.entries(parsedCounts)) {
          if (k.includes("::")) migrated[k] = v
          else migrated[makeDetailKey(k, duration)] = v
        }
        setUsageCounts((prev) => ({ ...prev, ...migrated }))
      }
      if (savedCustomItems) {
        const parsedCustomItems = JSON.parse(savedCustomItems) as typeof customItems
        setCustomItems(parsedCustomItems)
      }
      if (savedCustomDetails) {
        const parsedCustomDetails = JSON.parse(savedCustomDetails) as typeof customDetails
        setCustomDetails(parsedCustomDetails)
      }
    } catch {
      // ignore
    }
  }, [])

  // Sync any existing locally stored custom details to server with proper metadata
  useEffect(() => {
    const sync = async () => {
      const payloads: Array<{
        detail_id: string
        item_id: string
        section: string
        parent_title: string
        phase_title: string
        allowed_durations: string[]
        text: string
        author?: string
      }> = []
      for (const [itemId, details] of Object.entries(customDetails)) {
        const section = itemId.includes("-actions-")
          ? "actions"
          : itemId.includes("-deliverables-")
            ? "deliverables"
            : itemId.includes("-aiBoosts-")
              ? "aiBoosts"
              : "unknown"
        let metaTitle = ""
        let metaPhase = ""
        let metaAllowed: string[] = ["8", "4", "2", "1", "2days"]
        for (const p of phases) {
          const it = [...p.actions, ...p.deliverables, ...p.aiBoosts].find((x) => x.id === itemId)
          if (it) {
            metaTitle = it.title
            metaPhase = p.title
            metaAllowed = it.weeks.map((w) => String(w))
            break
          }
        }
        if (!metaTitle) {
          for (const pId of Object.keys(customItems)) {
            const m = customItems[pId]
            const it = [...(m?.actions || []), ...(m?.deliverables || []), ...(m?.aiBoosts || [])].find(
              (x) => x.id === itemId,
            )
            if (it) {
              metaTitle = it.title
              metaPhase = pId
              break
            }
          }
        }
        for (const d of details) {
          payloads.push({
            detail_id: d.id,
            item_id: itemId,
            section,
            parent_title: metaTitle,
            phase_title: metaPhase,
            allowed_durations: metaAllowed,
            text: d.text,
            author: (typeof window !== "undefined" && localStorage.getItem("userEmail")) || undefined,
          })
        }
      }
      for (const body of payloads) {
        try {
          await fetch("/api/custom-details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        } catch {
          // ignore
        }
      }
    }
    if (Object.keys(customDetails).length > 0) {
      sync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customDetails])
  // Refetch counts when duration changes
  useEffect(() => {
    // Gather visible detail ids to ensure seeded per-duration values exist
    const visibleIds = new Set<string>()
    phases.forEach((p) => {
      const add = (arr?: { id: string }[]) => arr?.forEach((d) => visibleIds.add(d.id))
      filterItemsByDuration(p.actions).forEach((it) => add(it.details))
      filterItemsByDuration(p.deliverables).forEach((it) => add(it.details))
      filterItemsByDuration(p.aiBoosts).forEach((it) => add(it.details))
    })

    const idsParam = Array.from(visibleIds)
    fetchCounts(duration, idsParam).then((serverCounts) => {
      setUsageCounts((prev) => {
        // merge only current duration keys
        const next = { ...prev }
        for (const [detailId, count] of Object.entries(serverCounts)) {
          next[makeDetailKey(detailId, duration)] = count
        }
        return next
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  // Persist item metadata (title, phase, allowed durations) for summary page fallbacks
  useEffect(() => {
    try {
      const meta: {
        [itemId: string]: { title: string; phaseTitle: string; allowedDurations: string[]; section: string }
      } = {}
      phases.forEach((p) => {
        ;(
          [
            ["actions" as const, p.actions],
            ["deliverables" as const, p.deliverables],
            ["aiBoosts" as const, p.aiBoosts],
          ] as const
        ).forEach(([section, arr]) => {
          arr.forEach((it) => {
            meta[it.id] = {
              title: it.title,
              phaseTitle: p.title,
              allowedDurations: it.weeks.map((w) => String(w)),
              section,
            }
          })
        })
      })
      for (const [phaseId, groups] of Object.entries(customItems)) {
        const phaseTitle = phases.find((pp) => pp.id === phaseId)?.title || phaseId
        const add = (section: "actions" | "deliverables" | "aiBoosts", items?: ProcessItem[]) => {
          items?.forEach((it) => {
            meta[it.id] = {
              title: it.title,
              phaseTitle,
              allowedDurations: (it.weeks || [8, 4, 2, 1, "2days"]).map((w) => String(w)),
              section,
            }
          })
        }
        add("actions", groups?.actions)
        add("deliverables", groups?.deliverables)
        add("aiBoosts", groups?.aiBoosts)
      }
      localStorage.setItem("itemsMeta", JSON.stringify(meta))
    } catch {
      // ignore
    }
  }, [customItems])

  // Persist likes and counts to localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("usedDetails", JSON.stringify(Array.from(usedDetails)))
        localStorage.setItem("usageCounts", JSON.stringify(usageCounts))
        localStorage.setItem("customItems", JSON.stringify(customItems))
        localStorage.setItem("customDetails", JSON.stringify(customDetails))
      }
    } catch {
      // ignore
    }
  }, [usedDetails, usageCounts, customItems, customDetails])

  const getWeekGroups = () => {
    switch (duration) {
      case "8":
        return [
          { label: "Week 0", span: 1 },
          { label: "Week 1–2", span: 2 },
          { label: "Week 3–4", span: 2 },
          { label: "Week 5–6", span: 1 },
          { label: "Week 7", span: 1 },
          { label: "Week 8", span: 1 },
        ]
      case "4":
        return [
          { label: "Week 0", span: 1 },
          { label: "Week 1", span: 2 },
          { label: "Week 2", span: 2 },
          { label: "Week 3", span: 2 },
          { label: "Week 4", span: 1 },
        ]
      case "2":
        return [
          { label: "Week 0", span: 1 },
          { label: "Week 1", span: 3 },
          { label: "Week 2", span: 4 },
        ]
      case "1":
        return [
          { label: "Day 1", span: 2 },
          { label: "Day 2", span: 2 },
          { label: "Day 3", span: 2 },
          { label: "Day 4", span: 1 },
          { label: "Day 5", span: 1 },
        ]
      case "2days":
        return [
          { label: "Day 0", span: 2 },
          { label: "Day 1", span: 3 },
          { label: "Day 2", span: 3 },
        ]
      default:
        return [
          { label: "Week 0", span: 1 },
          { label: "Week 1–2", span: 2 },
          { label: "Week 3–4", span: 2 },
          { label: "Week 5–6", span: 1 },
          { label: "Week 7", span: 1 },
          { label: "Week 8", span: 1 },
        ]
    }
  }

  const weekGroups = getWeekGroups()

  const filterItemsByDuration = (items: ProcessItem[]) => {
    return items.filter((item) => item.weeks.includes(duration === "2days" ? "2days" : Number.parseInt(duration)))
  }

  // 2-day planner state (Option A + F)
  type PlannedItem = {
    plannedId: string
    sourceItemId: string
    title: string
    track: "Define" | "Ideate" | "Prototype" | "Present" | "Other"
    minutes: number
  }

  const [dayConfig, setDayConfig] = useState<{ day1Start: string; day1End: string; day2Start: string; day2End: string }>(
    () => {
      const saved = typeof window !== "undefined" ? localStorage.getItem("twoDayPlannerConfig") : null
      return saved
        ? (JSON.parse(saved) as { day1Start: string; day1End: string; day2Start: string; day2End: string })
        : { day1Start: "09:00", day1End: "17:00", day2Start: "09:00", day2End: "17:00" }
    },
  )

  const [planned, setPlanned] = useState<{ day1: PlannedItem[]; day2: PlannedItem[] }>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("twoDayPlannerPlanned") : null
      return saved ? (JSON.parse(saved) as { day1: PlannedItem[]; day2: PlannedItem[] }) : { day1: [], day2: [] }
    } catch {
      return { day1: [], day2: [] }
    }
  })

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("twoDayPlannerConfig", JSON.stringify(dayConfig))
        localStorage.setItem("twoDayPlannerPlanned", JSON.stringify(planned))
      }
    } catch {
      // ignore
    }
  }, [dayConfig, planned])

  const parseHm = (s: string) => {
    const [h, m] = s.split(":").map((x) => Number.parseInt(x))
    return h * 60 + m
  }
  const minutesBetween = (start: string, end: string) => Math.max(0, parseHm(end) - parseHm(start))

  const getBacklog = (): Array<{ sourceItemId: string; title: string; track: PlannedItem["track"]; suggested: number }> => {
    // Flatten all items valid for 2days
    const out: Array<{ sourceItemId: string; title: string; track: PlannedItem["track"]; suggested: number }> = []
    const allowedPhases = new Set(["phase-3", "phase-4", "phase-5", "phase-6"]) // Define, Ideate, Prototype, Present
    phases.forEach((p) => {
      if (!allowedPhases.has(p.id)) return
      filterItemsByDuration(p.actions).forEach((it) => {
        const track: PlannedItem["track"] = p.id === "phase-5" || p.id === "phase-6" ? (p.id === "phase-5" ? "Prototype" : "Present") : (p.id === "phase-3" ? "Define" : "Ideate")
        out.push({ sourceItemId: it.id, title: it.title, track, suggested: 60 })
      })
      filterItemsByDuration(p.deliverables).forEach((it) => {
        const track: PlannedItem["track"] = p.id === "phase-5" || p.id === "phase-6" ? (p.id === "phase-5" ? "Prototype" : "Present") : (p.id === "phase-3" ? "Define" : "Ideate")
        out.push({ sourceItemId: it.id, title: it.title, track, suggested: 60 })
      })
      filterItemsByDuration(p.aiBoosts).forEach((it) => {
        const track: PlannedItem["track"] = p.id === "phase-5" || p.id === "phase-6" ? (p.id === "phase-5" ? "Prototype" : "Present") : (p.id === "phase-3" ? "Define" : "Ideate")
        out.push({ sourceItemId: it.id, title: it.title, track, suggested: 30 })
      })
    })
    // De‑duplicate by id (custom items included via customItems map)
    const seen = new Set<string>()
    const unique: typeof out = []
    out.forEach((x) => {
      if (!seen.has(x.sourceItemId)) {
        seen.add(x.sourceItemId)
        unique.push(x)
      }
    })
    return unique
  }

  // Visual helpers
  const getTrackClasses = (track: PlannedItem["track"]) => {
    switch (track) {
      case "Define":
        return {
          chip: "border-amber-500/50 bg-amber-500/10",
          zone: "hover:border-amber-400/70",
          badge: "text-amber-300",
        }
      case "Ideate":
        return {
          chip: "border-cyan-500/50 bg-cyan-500/10",
          zone: "hover:border-cyan-400/70",
          badge: "text-cyan-300",
        }
      case "Prototype":
        return {
          chip: "border-violet-500/50 bg-violet-500/10",
          zone: "hover:border-violet-400/70",
          badge: "text-violet-300",
        }
      case "Present":
        return {
          chip: "border-orange-500/50 bg-orange-500/10",
          zone: "hover:border-orange-400/70",
          badge: "text-orange-300",
        }
      default:
        return { chip: "border-zinc-700", zone: "", badge: "text-zinc-400" }
    }
  }

  const pxPerMinute = 2.8 // visual height scale for planned items (30m ~= previous 1h)
  // Layout overhead tuning so pixel height maps 1:1 to available minutes
  const DAY_ZONE_VERTICAL_PADDING_PX = 16 // p-2 top+bottom
  const DAY_ZONE_BORDER_PX = 4 // border-2 top+bottom
  const DAY_ZONES_GAP_PX = 12 // gap-3 between zones
  const DAY_ZONE_HEADER_PX = 22 // track label + margin
  const DAY_INNER_OVERHEAD_PX = 3 * (DAY_ZONE_VERTICAL_PADDING_PX + DAY_ZONE_BORDER_PX + DAY_ZONE_HEADER_PX) + 2 * DAY_ZONES_GAP_PX
  const ITEM_VERTICAL_OVERHEAD_PX = 18 // item padding + borders
  const ITEM_INTER_GAP_PX = 8 // space-y-2 between items
  const ITEM_CONTROLS_ROW_PX = 34 // -30m/+1h/Remove row
  const ITEM_FIXED_OVERHEAD_PX = 52 // consolidated real-world overhead per card

  const formatHours = (minutes: number) => {
    const hours = minutes / 60
    const rounded = Math.round(hours * 2) / 2 // snap to 0.5h display
    const unit = Math.abs(rounded - 1) < 1e-9 ? "hr" : "hrs"
    return `${rounded} ${unit}`
  }

  const addPlanned = (day: "day1" | "day2", item: { sourceItemId: string; title: string; track: PlannedItem["track"]; minutes: number }) => {
    setPlanned((prev) => ({
      ...prev,
      [day]: [
        ...prev[day],
        { plannedId: `${day}-${item.sourceItemId}-${Date.now()}`, sourceItemId: item.sourceItemId, title: item.title, track: item.track, minutes: item.minutes },
      ],
    }))
  }

  const removePlanned = (day: "day1" | "day2", plannedId: string) => {
    setPlanned((prev) => ({ ...prev, [day]: prev[day].filter((p) => p.plannedId !== plannedId) }))
  }

  // Expanded state for planner/backlog items
  const [expandedPlannerItems, setExpandedPlannerItems] = useState<Set<string>>(new Set())
  const [expandedBacklog, setExpandedBacklog] = useState<Set<string>>(new Set())

  const togglePlannerExpanded = (plannedId: string) => {
    setExpandedPlannerItems((prev) => {
      const s = new Set(prev)
      if (s.has(plannedId)) s.delete(plannedId)
      else s.add(plannedId)
      return s
    })
  }
  const toggleBacklogExpanded = (sourceItemId: string) => {
    setExpandedBacklog((prev) => {
      const s = new Set(prev)
      if (s.has(sourceItemId)) s.delete(sourceItemId)
      else s.add(sourceItemId)
      return s
    })
  }

  // Fetch base+custom details for an item id
  const getItemDetails = (itemId: string): DetailItem[] => {
    let base: DetailItem[] = []
    for (const p of phases) {
      const it = [...p.actions, ...p.deliverables, ...p.aiBoosts].find((x) => x.id === itemId)
      if (it) {
        base = it.details || []
        break
      }
    }
    const custom = customDetails[itemId] || []
    return [...base, ...custom]
  }

  // Drag & drop helpers (HTML5 DnD)
  type DragPayload =
    | { kind: "backlog"; sourceItemId: string; title: string; track: PlannedItem["track"]; minutes: number }
    | { kind: "planned"; plannedId: string; fromDay: "day1" | "day2"; sourceItemId: string; title: string; track: PlannedItem["track"]; minutes: number }

  const onBacklogDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: { sourceItemId: string; title: string; track: PlannedItem["track"]; minutes: number },
  ) => {
    const payload: DragPayload = { kind: "backlog", sourceItemId: item.sourceItemId, title: item.title, track: item.track, minutes: item.minutes }
    e.dataTransfer.setData("application/json", JSON.stringify(payload))
    e.dataTransfer.effectAllowed = "copyMove"
  }

  const onPlannedDragStart = (e: React.DragEvent<HTMLDivElement>, day: "day1" | "day2", p: PlannedItem) => {
    const payload: DragPayload = {
      kind: "planned",
      plannedId: p.plannedId,
      fromDay: day,
      sourceItemId: p.sourceItemId,
      title: p.title,
      track: p.track,
      minutes: p.minutes,
    }
    e.dataTransfer.setData("application/json", JSON.stringify(payload))
    e.dataTransfer.effectAllowed = "move"
  }

  const movePlanned = (
    fromDay: "day1" | "day2",
    plannedId: string,
    toDay: "day1" | "day2",
    toTrack: PlannedItem["track"],
  ) => {
    setPlanned((prev) => {
      const fromList = prev[fromDay]
      const item = fromList.find((x) => x.plannedId === plannedId)
      if (!item) return prev
      const newFrom = fromList.filter((x) => x.plannedId !== plannedId)
      const toList = prev[toDay]
      const moved: PlannedItem = { ...item, track: toTrack, plannedId: `${toDay}-${item.sourceItemId}-${Date.now()}` }
      return {
        ...prev,
        [fromDay]: newFrom,
        [toDay]: [...toList, moved],
      }
    })
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: "day1" | "day2", track: PlannedItem["track"]) => {
    e.preventDefault()
    let payload: DragPayload | null = null
    try {
      payload = JSON.parse(e.dataTransfer.getData("application/json")) as DragPayload
    } catch {
      payload = null
    }
    if (!payload) return
    if (payload.kind === "backlog") {
      addPlanned(day, { sourceItemId: payload.sourceItemId, title: payload.title, track, minutes: payload.minutes })
    } else if (payload.kind === "planned") {
      movePlanned(payload.fromDay, payload.plannedId, day, track)
    }
  }

  // Drop zone hover state
  const [dropHover, setDropHover] = useState<{ day: "day1" | "day2"; track: PlannedItem["track"] } | null>(null)

  const capacity = {
    day1: minutesBetween(dayConfig.day1Start, dayConfig.day1End),
    day2: minutesBetween(dayConfig.day2Start, dayConfig.day2End),
  }
  const used = {
    day1: planned.day1.filter((x) => x.track === "Define" || x.track === "Ideate").reduce((a, b) => a + b.minutes, 0),
    day2: planned.day2.filter((x) => x.track === "Prototype" || x.track === "Present").reduce((a, b) => a + b.minutes, 0),
  }

  const autoFill = (mode: "goat" | "balanced") => {
    const backlog = getBacklog()
    // Score by total likes for the item within current duration
    const score = (sourceItemId: string) => {
      const baseDetails = (phases.flatMap((p) => [...p.actions, ...p.deliverables, ...p.aiBoosts]).find((it) => it.id === sourceItemId)?.details || [])
      const customItemDetails = customDetails[sourceItemId] || []
      const all = [...baseDetails, ...customItemDetails]
      return all.reduce((t, d) => t + (usageCounts[makeDetailKey(d.id, duration)] || 0), 0)
    }
    const sorted = backlog
      .map((b) => ({ ...b, s: score(b.sourceItemId) }))
      .sort((a, b) => b.s - a.s)

    const plan: { day1: PlannedItem[]; day2: PlannedItem[] } = { day1: [], day2: [] }
    let rem1 = capacity.day1
    let rem2 = capacity.day2
    const pushIfFits = (day: "day1" | "day2", title: string, track: PlannedItem["track"], minutes: number, id: string) => {
      if ((day === "day1" ? rem1 : rem2) >= minutes) {
        const pi: PlannedItem = { plannedId: `${day}-${id}-${Date.now()}-${Math.random()}`, sourceItemId: id, title, track, minutes }
        plan[day].push(pi)
        if (day === "day1") rem1 -= minutes
        else rem2 -= minutes
        return true
      }
      return false
    }
    // Ensure at least one Prototype deliverable by end of Day 2 in goat mode
    if (mode === "goat") {
      for (const b of sorted.filter((x) => x.track === "Prototype")) {
        if (pushIfFits("day2", b.title, b.track, b.suggested, b.sourceItemId)) break
      }
    }
    // Fill remaining with highest score, alternating days
    for (const b of sorted) {
      if (rem1 >= b.suggested) {
        pushIfFits("day1", b.title, b.track, b.suggested, b.sourceItemId)
      } else if (rem2 >= b.suggested) {
        pushIfFits("day2", b.title, b.track, b.suggested, b.sourceItemId)
      }
      if (rem1 <= 0 && rem2 <= 0) break
    }
    setPlanned(plan)
  }

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const toggleUsedDetail = (detailId: string) => {
    const key = makeDetailKey(detailId, duration)
    const wasLiked = usedDetails.has(key)
    // Toggle local like state
    setUsedDetails((prev) => {
      const newSet = new Set(prev)
      if (wasLiked) newSet.delete(key)
      else newSet.add(key)
      return newSet
    })
    // Increment/decrement the visible like count
    setUsageCounts((prev) => {
      const current = prev[key] || 0
      const next = wasLiked ? Math.max(0, current - 1) : current + 1
      return { ...prev, [key]: next }
    })
    // Persist to server (fire-and-forget)
    postLike(detailId, duration, wasLiked ? "dec" : "inc")
  }

  // Toggle a detail and sync parent item aggregate state
  const toggleDetailWithParent = (detailId: string, parentItemId: string) => {
    const key = makeDetailKey(detailId, duration)
    const wasLiked = usedDetails.has(key)
    const parentKey = makeDetailKey(parentItemId, duration)

    setUsedDetails((prev) => {
      const next = new Set(prev)
      if (wasLiked) next.delete(key)
      else next.add(key)

      // After toggling this detail, recompute whether all details are used
      const allUsed = getItemDetails(parentItemId).every((d) => next.has(makeDetailKey(d.id, duration)))
      if (allUsed) next.add(parentKey)
      else next.delete(parentKey)
      return next
    })

    // Increment/decrement the visible like count for the detail
    setUsageCounts((prev) => {
      const current = prev[key] || 0
      const next = wasLiked ? Math.max(0, current - 1) : current + 1
      return { ...prev, [key]: next }
    })
    postLike(detailId, duration, wasLiked ? "dec" : "inc")
  }

  // Toggle an item and cascade to all of its details
  const toggleItemWithChildren = (itemId: string) => {
    const parentKey = makeDetailKey(itemId, duration)
    const wasUsed = usedDetails.has(parentKey)
    const shouldUse = !wasUsed

    // Update big toggle state
    setUsedDetails((prev) => {
      const next = new Set(prev)
      if (shouldUse) next.add(parentKey)
      else next.delete(parentKey)
      return next
    })

    const details = getItemDetails(itemId)
    for (const d of details) {
      const dKey = makeDetailKey(d.id, duration)
      const isUsed = usedDetails.has(dKey)
      if (shouldUse && !isUsed) toggleUsedDetail(d.id)
      if (!shouldUse && isUsed) toggleUsedDetail(d.id)
    }
  }

  const addCustomItem = (phaseId: string, section: "actions" | "deliverables" | "aiBoosts") => {
    const inputKey = `${phaseId}-${section}`
    const inputValue = newItemInputs[inputKey]?.trim()

    if (!inputValue) return

    const newItem: ProcessItem = {
      id: `custom-${phaseId}-${section}-${Date.now()}`,
      title: inputValue,
      weeks: [8, 4, 2, 1, "2days"], // Custom items appear in all durations
      details: [],
    }

    setCustomItems((prev) => ({
      ...prev,
      [phaseId]: {
        ...prev[phaseId],
        [section]: [...(prev[phaseId]?.[section] || []), newItem],
      },
    }))

    setNewItemInputs((prev) => ({
      ...prev,
      [inputKey]: "",
    }))
  }

  const handleInputChange = (key: string, value: string) => {
    setNewItemInputs((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Function to calculate total usage count for an item
  const getItemUsageCount = (item: ProcessItem): number => {
    const baseDetails = item.details || []
    const customItemDetails = customDetails[item.id] || []
    const allDetails = [...baseDetails, ...customItemDetails]

    return allDetails.reduce((total, detail) => {
      return total + (usageCounts[makeDetailKey(detail.id, duration)] || 0)
    }, 0)
  }

  const addCustomDetail = (itemId: string) => {
    const inputKey = `${itemId}-detail`
    const inputValue = newItemInputs[inputKey]?.trim()

    if (!inputValue) return

    const newDetail: DetailItem = {
      id: `${itemId}-detail-${Date.now()}`,
      text: inputValue,
    }

    setCustomDetails((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), newDetail],
    }))

    setNewItemInputs((prev) => ({
      ...prev,
      [inputKey]: "",
    }))

    // Fire-and-forget persist to server for global listing
    const section = itemId.includes("-actions-")
      ? "actions"
      : itemId.includes("-deliverables-")
        ? "deliverables"
        : itemId.includes("-aiBoosts-")
          ? "aiBoosts"
          : "unknown"
    const { parentTitle, phaseTitle, allowedDurations } = (() => {
      // Try to look up from base data first
      for (const p of phases) {
        const it = [...p.actions, ...p.deliverables, ...p.aiBoosts].find((x) => x.id === itemId)
        if (it) return { parentTitle: it.title, phaseTitle: p.title, allowedDurations: it.weeks.map((w) => String(w)) }
      }
      // Try custom items map
      for (const pId of Object.keys(customItems)) {
        const m = customItems[pId]
        const it = [...(m?.actions || []), ...(m?.deliverables || []), ...(m?.aiBoosts || [])].find((x) => x.id === itemId)
        if (it) return { parentTitle: it.title, phaseTitle: pId, allowedDurations: it.weeks?.map((w) => String(w)) || ["8","4","2","1","2days"] }
      }
      return { parentTitle: "", phaseTitle: "", allowedDurations: ["8","4","2","1","2days"] }
    })()
    try {
      fetch("/api/custom-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detail_id: newDetail.id,
          item_id: itemId,
          section,
          parent_title: parentTitle,
          phase_title: phaseTitle,
          allowed_durations: allowedDurations,
          text: newDetail.text,
          author: (typeof window !== "undefined" && localStorage.getItem("userEmail")) || undefined,
        }),
      })
    } catch {
      // ignore
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    phaseId: string,
    section: "actions" | "deliverables" | "aiBoosts",
  ) => {
    if (e.key === "Enter") {
      addCustomItem(phaseId, section)
    }
  }

  const scrollToPhase = (phaseId: string) => {
    setSelectedPhase(phaseId)
    const phaseElement = phaseRefs.current[phaseId]
    if (phaseElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const phaseLeft = phaseElement.offsetLeft
      container.scrollTo({
        left: phaseLeft - 24,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Rapid AI Design Process</h1>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="w-32 bg-zinc-900 border-zinc-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2days">2 days</SelectItem>
            <SelectItem value="1">1 week</SelectItem>
            <SelectItem value="2">2 weeks</SelectItem>
            <SelectItem value="4">4 weeks</SelectItem>
            <SelectItem value="8">8 weeks</SelectItem>
          </SelectContent>
        </Select>
        {duration === "2days" && (
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Day 1</span>
              <input
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-32"
                type="time"
                value={dayConfig.day1Start}
                onChange={(e) => setDayConfig((c) => ({ ...c, day1Start: e.target.value }))}
              />
              <span>–</span>
              <input
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-32"
                type="time"
                value={dayConfig.day1End}
                onChange={(e) => setDayConfig((c) => ({ ...c, day1End: e.target.value }))}
              />
              <span className="ml-1 text-zinc-500">{formatHours(used.day1)}/{formatHours(capacity.day1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Day 2</span>
              <input
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-32"
                type="time"
                value={dayConfig.day2Start}
                onChange={(e) => setDayConfig((c) => ({ ...c, day2Start: e.target.value }))}
              />
              <span>–</span>
              <input
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-32"
                type="time"
                value={dayConfig.day2End}
                onChange={(e) => setDayConfig((c) => ({ ...c, day2End: e.target.value }))}
              />
              <span className="ml-1 text-zinc-500">{formatHours(used.day2)}/{formatHours(capacity.day2)}</span>
            </div>
            <button
              onClick={() => autoFill("balanced")}
              className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white"
              title="Auto-fill agenda with top-liked items that fit your hours"
            >
              Auto-fill
            </button>
          </div>
        )}
      </div>

      <div className="relative mb-12">
        {duration === "2days" && (
          <div className="px-8 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 border border-zinc-800 rounded-lg p-3 bg-zinc-900/60">
                <div className="text-sm font-semibold mb-2">Backlog</div>
                <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
                    {getBacklog().map((b) => (
                    <div
                      key={b.sourceItemId}
                      className={`border rounded p-2 bg-zinc-900 ${getTrackClasses(b.track).chip.replace("border-", "border-")}`}
                      draggable
                      onDragStart={(e) => onBacklogDragStart(e, { sourceItemId: b.sourceItemId, title: b.title, track: b.track, minutes: b.suggested })}
                    >
                      <div className="text-sm font-medium">{b.title}</div>
                      <div className={`text-xs mb-2 ${getTrackClasses(b.track).badge}`}>{b.track} • {formatHours(b.suggested)}</div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
                          onClick={() => addPlanned((b.track === "Define" || b.track === "Ideate") ? "day1" : "day2", { sourceItemId: b.sourceItemId, title: b.title, track: b.track, minutes: b.suggested })}
                        >
                          Add to schedule
                        </button>
                        <button
                          className="ml-auto px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
                          onClick={() => toggleBacklogExpanded(b.sourceItemId)}
                        >
                          {expandedBacklog.has(b.sourceItemId) ? "Hide" : "Details"}
                        </button>
                      </div>
                      {expandedBacklog.has(b.sourceItemId) && (
                        <div className="mt-2 space-y-1">
                          {getItemDetails(b.sourceItemId).map((d) => (
                            <div key={d.id} className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1">
                              <span className="pr-2">{d.text}</span>
                              <button
                                className={`p-1 rounded ${usedDetails.has(makeDetailKey(d.id, duration)) ? "bg-rose-500 text-white" : "bg-zinc-700 text-zinc-300"}`}
                                onClick={() => toggleDetailWithParent(d.id, b.sourceItemId)}
                                title="Mark this detail used"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          {getItemDetails(b.sourceItemId).length === 0 && (
                            <div className="text-xs text-zinc-500">No details yet.</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {(["day1", "day2"] as const).map((day, idx) => (
                <div key={day} className="col-span-1 border border-zinc-800 rounded-lg p-3 bg-zinc-900/60 overflow-hidden">
                  <div className="text-sm font-semibold mb-2">{idx === 0 ? "Day 1" : "Day 2"} • {formatHours(used[day])}/{formatHours(capacity[day])}</div>
                  <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: Math.max(0, capacity[day] * pxPerMinute - DAY_INNER_OVERHEAD_PX) }}>
                    {(idx === 0 ? (["Define", "Ideate"] as const) : (["Prototype", "Present"] as const)).map((track) => (
                      <div
                        key={track}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDropHover({ day, track })
                        }}
                        onDragLeave={() => setDropHover((h) => (h && h.day === day && h.track === track ? null : h))}
                        onDrop={(e) => {
                          handleDrop(e, day, track)
                          setDropHover((h) => (h && h.day === day && h.track === track ? null : h))
                        }}
                        className={`min-h-24 border-2 border-dashed rounded p-2 ${getTrackClasses(track).zone} ${
                          dropHover && dropHover.day === day && dropHover.track === track ? "border-white/60" : "border-zinc-700/70"
                        }`}
                      >
                        <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">{track}</div>
                        <div className="space-y-2">
                          {planned[day]
                            .filter((p) => p.track === track)
                            .map((p) => (
                              <div
                                key={p.plannedId}
                                draggable
                                onDragStart={(e) => onPlannedDragStart(e, day, p)}
                                className={`border border-dashed rounded p-2 bg-zinc-900 ${getTrackClasses(p.track).chip}`}
                                style={{ minHeight: Math.max(60, p.minutes * pxPerMinute - ITEM_FIXED_OVERHEAD_PX) }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium">{p.title}</div>
                                  <button
                                    className={`ml-2 p-1 rounded ${usedDetails.has(makeDetailKey(p.sourceItemId, duration)) ? "bg-rose-500 text-white" : "bg-zinc-700 text-zinc-300"}`}
                                    onClick={() => toggleItemWithChildren(p.sourceItemId)}
                                    title="Mark this item used"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className={`text-xs mb-2 ${getTrackClasses(p.track).badge}`}>{p.track} • {formatHours(p.minutes)}</div>
                                <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
                            onClick={() => setPlanned((prev) => ({
                              ...prev,
                              [day]: prev[day].map((x) => x.plannedId === p.plannedId ? { ...x, minutes: Math.max(30, x.minutes - 30) } : x),
                            }))}
                          >
                            −30m
                          </button>
                                  <button
                                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
                                    onClick={() => setPlanned((prev) => ({
                                      ...prev,
                              [day]: prev[day].map((x) => x.plannedId === p.plannedId ? { ...x, minutes: x.minutes + 60 } : x),
                                    }))}
                                  >
                            +1h
                                  </button>
                                  <button
                                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-xs text-white"
                                    onClick={() => removePlanned(day, p.plannedId)}
                                  >
                                    Remove
                                  </button>
                                  <button
                                    className="ml-auto px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
                                    onClick={() => togglePlannerExpanded(p.plannedId)}
                                  >
                                    {expandedPlannerItems.has(p.plannedId) ? "Hide" : "Details"}
                                  </button>
                                </div>
                                {expandedPlannerItems.has(p.plannedId) && (
                                  <div className="mt-2 space-y-1">
                                    {getItemDetails(p.sourceItemId).map((d) => (
                                      <div key={d.id} className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1">
                                        <span className="pr-2">{d.text}</span>
                                        <button
                                          className={`p-1 rounded ${usedDetails.has(makeDetailKey(d.id, duration)) ? "bg-rose-500 text-white" : "bg-zinc-700 text-zinc-300"}`}
                                          onClick={() => toggleDetailWithParent(d.id, p.sourceItemId)}
                                          title="Mark this detail used"
                                        >
                                          <Check className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                    {getItemDetails(p.sourceItemId).length === 0 && (
                                      <div className="text-xs text-zinc-500">No details yet.</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {duration !== "2days" && (
        <>
        <div className="grid grid-cols-8 gap-3 mb-4 px-8">
          {weekGroups.map((week, index) => (
            <div key={index} className="text-center text-sm font-semibold text-zinc-400 border-b-2 border-zinc-700 pb-2" style={{ gridColumn: `span ${week.span}` }}>
              {week.label}
            </div>
          ))}
        </div>

        {/* Phase buttons row */}
        <div className="grid grid-cols-8 gap-3 px-8">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => scrollToPhase(phase.id)}
              className={`
                relative px-6 py-4 rounded-xl border-2
                bg-zinc-900/40 backdrop-blur-sm
                transition-all duration-300
                hover:bg-zinc-800/60 hover:scale-105
                ${phase.borderColor} ${phase.glowColor}
                ${selectedPhase === phase.id ? "ring-2 ring-white/30 scale-105" : ""}
                shadow-lg hover:shadow-xl
              `}
            >
              <div className="flex items-center justify-center gap-2">
                {getPhaseIcon(phase.id)}
                <div className="text-sm font-semibold text-center whitespace-nowrap">{phase.title}</div>
              </div>
            </button>
          ))}
        </div>
        </>
        )}
      </div>

      {duration !== "2days" && (
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-visible pb-8"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex gap-6 min-w-max">
          {phases.map((phase) => {
            const filteredActions = [
              ...filterItemsByDuration(phase.actions),
              ...(customItems[phase.id]?.actions || []),
            ].sort((a, b) => getItemUsageCount(b) - getItemUsageCount(a))

            const filteredDeliverables = [
              ...filterItemsByDuration(phase.deliverables),
              ...(customItems[phase.id]?.deliverables || []),
            ].sort((a, b) => getItemUsageCount(b) - getItemUsageCount(a))

            const filteredAiBoosts = [
              ...filterItemsByDuration(phase.aiBoosts),
              ...(customItems[phase.id]?.aiBoosts || []),
            ].sort((a, b) => getItemUsageCount(b) - getItemUsageCount(a))

            return (
              <div
                key={phase.id}
                ref={(el) => {
                  phaseRefs.current[phase.id] = el
                }}
                className="w-[1200px] flex-shrink-0"
              >
                <div className={`bg-gradient-to-r ${phase.color} rounded-lg p-4 mb-4`}>
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-3">
                    {getPhaseIcon(phase.id)}
                    {phase.title}
                  </h2>
                  <p className="text-white/90">{phase.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Actions Column */}
                  <div className="space-y-3">
                    <div className="border-2 border-teal-500/50 rounded-lg p-4 bg-zinc-900/50 flex items-center">
                      <h3 className="font-semibold">Actions: What to do</h3>
                    </div>
                    {filteredActions.map((action) => {
                      const allDetails = [...(action.details || []), ...(customDetails[action.id] || [])].sort(
                        (a, b) => (usageCounts[makeDetailKey(b.id, duration)] || 0) - (usageCounts[makeDetailKey(a.id, duration)] || 0),
                      )
                      const totalUsage = getItemUsageCount(action)

                      return (
                        <div
                          key={action.id}
                          className="border border-zinc-800 rounded-lg bg-zinc-900/80 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(action.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-3 h-3 rounded-full bg-teal-500" />
                              <span className="font-medium text-left">{action.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {totalUsage > 0 && (
                                <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded whitespace-nowrap">
                                  {totalUsage} {totalUsage === 1 ? "like" : "likes"}
                                </span>
                              )}
                              {expandedItems.has(action.id) ? (
                                <ChevronUp className="w-5 h-5 text-zinc-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-zinc-400" />
                              )}
                            </div>
                          </button>
                          {expandedItems.has(action.id) && (
                            <div className="px-4 pb-4 pt-3 space-y-2">
                              {allDetails.length > 0 ? allDetails.map((detail) => (
                                <div
                                  key={detail.id}
                                  className="bg-zinc-800/50 rounded p-3 text-sm text-zinc-300 flex items-start justify-between gap-3"
                                >
                                  <span className="flex-1">{detail.text}</span>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {(usageCounts[makeDetailKey(detail.id, duration)] ?? 0) > 0 && (
                                      <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded whitespace-nowrap">
                                        {usageCounts[makeDetailKey(detail.id, duration)]} {usageCounts[makeDetailKey(detail.id, duration)] === 1 ? "like" : "likes"}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => toggleUsedDetail(detail.id)}
                                      className={`p-1 rounded transition-colors ${
                                        usedDetails.has(makeDetailKey(detail.id, duration))
                                          ? "bg-rose-500 text-white"
                                          : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                                      }`}
                                    >
                                      <Heart className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )) : (
                                <div className="text-sm text-zinc-400">No items yet.</div>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Plus className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                <input
                                  type="text"
                                  placeholder="Add item..."
                                  value={newItemInputs[`${action.id}-detail`] || ""}
                                  onChange={(e) => handleInputChange(`${action.id}-detail`, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      addCustomDetail(action.id)
                                    }
                                  }}
                                  className="flex-1 bg-zinc-700/50 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-500 outline-none focus:border-teal-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    <div className="border border-zinc-800 border-dashed rounded-lg bg-zinc-900/40 overflow-hidden">
                      <div className="p-4 flex items-center gap-3">
                        <Plus className="w-5 h-5 text-teal-500" />
                        <input
                          type="text"
                          placeholder="Add custom action..."
                          value={newItemInputs[`${phase.id}-actions`] || ""}
                          onChange={(e) => handleInputChange(`${phase.id}-actions`, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, phase.id, "actions")}
                          className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-300 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deliverables Column */}
                  <div className="space-y-3">
                    <div className="border-2 border-blue-500/50 rounded-lg p-4 bg-zinc-900/50 flex items-center">
                      <h3 className="font-semibold">Deliverables: Artifacts to produce</h3>
                    </div>
                    {filteredDeliverables.map((deliverable) => {
                      const allDetails = [
                        ...(deliverable.details || []),
                        ...(customDetails[deliverable.id] || []),
                      ].sort((a, b) => (usageCounts[makeDetailKey(b.id, duration)] || 0) - (usageCounts[makeDetailKey(a.id, duration)] || 0))
                      const totalUsage = getItemUsageCount(deliverable)

                      return (
                        <div
                          key={deliverable.id}
                          className="border border-zinc-800 rounded-lg bg-zinc-900/80 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(deliverable.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                              <span className="font-medium text-left">{deliverable.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {totalUsage > 0 && (
                                <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded whitespace-nowrap">
                                  {totalUsage} {totalUsage === 1 ? "like" : "likes"}
                                </span>
                              )}
                              {expandedItems.has(deliverable.id) ? (
                                <ChevronUp className="w-5 h-5 text-zinc-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-zinc-400" />
                              )}
                            </div>
                          </button>
                          {expandedItems.has(deliverable.id) && (
                            <div className="px-4 pb-4 pt-3 space-y-2">
                              {allDetails.length > 0 ? allDetails.map((detail) => (
                                <div
                                  key={detail.id}
                                  className="bg-zinc-800/50 rounded p-3 text-sm text-zinc-300 flex items-start justify-between gap-3"
                                >
                                  <span className="flex-1">{detail.text}</span>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {(usageCounts[makeDetailKey(detail.id, duration)] ?? 0) > 0 && (
                                      <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded whitespace-nowrap">
                                        {usageCounts[makeDetailKey(detail.id, duration)]} {usageCounts[makeDetailKey(detail.id, duration)] === 1 ? "like" : "likes"}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => toggleUsedDetail(detail.id)}
                                      className={`p-1 rounded transition-colors ${
                                        usedDetails.has(makeDetailKey(detail.id, duration))
                                          ? "bg-rose-500 text-white"
                                          : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                                      }`}
                                    >
                                      <Heart className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )) : (
                                <div className="text-sm text-zinc-400">No items yet.</div>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Plus className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <input
                                  type="text"
                                  placeholder="Add item..."
                                  value={newItemInputs[`${deliverable.id}-detail`] || ""}
                                  onChange={(e) => handleInputChange(`${deliverable.id}-detail`, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      addCustomDetail(deliverable.id)
                                    }
                                  }}
                                  className="flex-1 bg-zinc-700/50 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-500 outline-none focus:border-blue-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    <div className="border border-zinc-800 border-dashed rounded-lg bg-zinc-900/40 overflow-hidden">
                      <div className="p-4 flex items-center gap-3">
                        <Plus className="w-5 h-5 text-blue-500" />
                        <input
                          type="text"
                          placeholder="Add custom deliverable..."
                          value={newItemInputs[`${phase.id}-deliverables`] || ""}
                          onChange={(e) => handleInputChange(`${phase.id}-deliverables`, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, phase.id, "deliverables")}
                          className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-300 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Boosts Column */}
                  <div className="space-y-3">
                    <div className="border-2 rounded-lg p-4 bg-zinc-900/50 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-transparent relative overflow-hidden flex items-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-50 blur-sm" />
                      <div className="absolute inset-[2px] bg-zinc-900/90 rounded-lg" />
                      <h3 className="font-semibold relative z-10 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        AI boosts: How AI accelerates this phase
                      </h3>
                    </div>
                    {filteredAiBoosts.map((boost) => {
                      const allDetails = [...(boost.details || []), ...(customDetails[boost.id] || [])].sort(
                        (a, b) => (usageCounts[makeDetailKey(b.id, duration)] || 0) - (usageCounts[makeDetailKey(a.id, duration)] || 0),
                      )
                      const totalUsage = getItemUsageCount(boost)

                      return (
                        <div
                          key={boost.id}
                          className="border border-zinc-800 rounded-lg bg-zinc-900/80 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(boost.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-lg shadow-cyan-500/50" />
                              <span className="font-medium text-left">{boost.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {totalUsage > 0 && (
                                <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded whitespace-nowrap">
                                  {totalUsage} {totalUsage === 1 ? "like" : "likes"}
                                </span>
                              )}
                              {expandedItems.has(boost.id) ? (
                                <ChevronUp className="w-5 h-5 text-zinc-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-zinc-400" />
                              )}
                            </div>
                          </button>
                          {expandedItems.has(boost.id) && (
                            <div className="px-4 pb-4 pt-3 space-y-2">
                              {allDetails.length > 0 ? allDetails.map((detail) => (
                                <div
                                  key={detail.id}
                                  className="bg-zinc-800/50 rounded p-3 text-sm text-zinc-300 flex items-start justify-between gap-3"
                                >
                                  <span className="flex-1">{detail.text}</span>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {(usageCounts[makeDetailKey(detail.id, duration)] ?? 0) > 0 && (
                                      <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded whitespace-nowrap">
                                        {usageCounts[makeDetailKey(detail.id, duration)]} {usageCounts[makeDetailKey(detail.id, duration)] === 1 ? "like" : "likes"}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => toggleUsedDetail(detail.id)}
                                      className={`p-1 rounded transition-colors ${
                                        usedDetails.has(makeDetailKey(detail.id, duration))
                                          ? "bg-rose-500 text-white"
                                          : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                                      }`}
                                    >
                                      <Heart className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )) : (
                                <div className="text-sm text-zinc-400">No items yet.</div>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Plus className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                <input
                                  type="text"
                                  placeholder="Add item..."
                                  value={newItemInputs[`${boost.id}-detail`] || ""}
                                  onChange={(e) => handleInputChange(`${boost.id}-detail`, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      addCustomDetail(boost.id)
                                    }
                                  }}
                                  className="flex-1 bg-zinc-700/50 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-500 outline-none focus:border-purple-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    <div className="border border-zinc-800 border-dashed rounded-lg bg-zinc-900/40 overflow-hidden">
                      <div className="p-4 flex items-center gap-3">
                        <Plus className="w-5 h-5 text-purple-500" />
                        <input
                          type="text"
                          placeholder="Add custom AI boost..."
                          value={newItemInputs[`${phase.id}-aiBoosts`] || ""}
                          onChange={(e) => handleInputChange(`${phase.id}-aiBoosts`, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, phase.id, "aiBoosts")}
                          className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-300 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      )}
    </div>
  )
}
