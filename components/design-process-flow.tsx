"use client"

import { useState, useRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
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

interface ProcessItem {
  id: string
  title: string
  description?: string
  details?: string[]
  weeks: (number | "2days")[] // e.g., [8, 4, 2, 1, "2days"]
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
        weeks: [8, 4, 2, 1, "2days"], // Added "2days" to critical items
        details: [
          "Identify lead PM, designer, researcher, engineer.",
          "Assign facilitator to set up process and rituals.",
          "Consult Goals, Growth, People chapter in AI UX Playbook.",
        ],
      },
      {
        id: "action-0-2",
        title: "Defining the project",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Check for findings from existing AI UX Research studies. That could also help with inform other stakeholders and SMEs to reach out to.",
          "Consult Should your design use AI? chapter in AI UX Playbook.",
          "Consult AI UX Research Library chapter in AI UX Playbook to find what's known and focus on what's unknown",
        ],
      },
      {
        id: "action-0-3",
        title: "Invite sponsors and SMEs",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Confirm sponsors and key stakeholders.",
          "Send invitations with expectations for involvement.",
          "Consult Goals, Growth, People chapter in AI UX Playbook.",
        ],
      },
      {
        id: "action-0-4",
        title: "Set up infrastructure",
        weeks: [8, 4],
        details: [
          "Create Sharepoint folders, Miro hubs, and/or Webex spaces",
          "Document team norms, roles, and responsibilities.",
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-0-1",
        title: "Team roster",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Core team, working group, sponsors, and SMEs listed.",
          "Clarify roles and responsibilities with RACI model.",
        ],
      },
      {
        id: "deliv-0-2",
        title: "Approved Project Brief",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["Scope, objectives, and deliverables documented.", "Sponsor approval recorded and shared."],
      },
      {
        id: "deliv-0-3",
        title: "Comms strategy and cadence",
        weeks: [8, 4],
        details: ["Define who gets updates, when, and how.", "Establish Webex channels and recurring sessions."],
      },
    ],
    aiBoosts: [
      {
        id: "ai-0-1",
        title: "AI assisted OKR definition",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Use AI to draft initial OKRs and pressure-test the scope of what's been defined, providing a starting point for alignment discussions.",
        ],
      },
      {
        id: "ai-0-2",
        title: "Draft Project Brief from past inputs",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Feed recordings (e.g., Webex) and existing research into AI to generate a first-draft Project Brief for sponsors to react to.",
        ],
      },
    ],
  },
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
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Preparation: once approved by sponsors, share the Project Brief with the working group ahead of the meeting.",
          "Team members review the Project Brief and document initial thoughts in the project Miro",
        ],
      },
      {
        id: "action-1-2",
        title: "Host first working session",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Use the Project Miro board to introduce the team hub, logistics, and initial tasks.",
          "Discuss and reflect on the project scope and objectives. Ensure the team has clarity. Assign initial tasks and responsibilities.",
        ],
      },
      {
        id: "action-1-3",
        title: "Run questionstorming exercise",
        weeks: [8, 4],
        details: ["Capture what the team knows and doesn't know.", "Use outputs to inform interview guide."],
      },
    ],
    deliverables: [
      {
        id: "deliv-1-1",
        title: "Drafted interview guide",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["Seeded from questionstorming results, ready for sponsor review."],
      },
      {
        id: "deliv-1-2",
        title: "Kickoff agenda",
        weeks: [8, 4],
        details: ["Project Brief, goals, deliverables, sponsor intros, team Q&A."],
      },
      {
        id: "deliv-1-3",
        title: "Rituals and cadence calendar",
        weeks: [8, 4],
        details: ["Documented sessions and practices for team collaboration."],
      },
    ],
    aiBoosts: [
      {
        id: "ai-1-1",
        title: "Auto generate kickoff content",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["Seed Q&A from the Project Brief"],
      },
      {
        id: "ai-1-2",
        title: "Transcribe and summarize sessions",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Capture discussions from kickoff/working sessions, output decisions, risks, and next steps into Miro.",
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
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Prepare a diverse list of interviewees across roles and products, using questionstorming to shape the guide.",
          "Consult Empathize phase of AI UX framework chapter in AI UX Playbook ",
          "Consult AI UX Research Library chapter in AI UX Playbook to find what's known and focus on what's unknown",
        ],
      },
      {
        id: "action-2-2",
        title: "Document assumptions",
        weeks: [8, 4],
        details: [
          "Capture existing assumptions about users, workflows, and problem space.",
          "Note gaps in knowledge to guide interviews and research.",
        ],
      },
      {
        id: "action-2-3",
        title: "Host product demos",
        weeks: [8, 4],
        details: [
          "Review existing product features and pain points relevant to the project scope.",
          "Capture insights to inform ideation later.",
        ],
      },
      {
        id: "action-2-4",
        title: "Start additional research if planned",
        weeks: [8],
        details: [
          "Confirm research goals, timelines, and resources with project leaders.",
          "Ensure additional work supports progress but does not block the main sprint.",
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-2-1",
        title: "Interviewee list and guide",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["List of interviewees across functions and an approved discussion guide."],
      },
      {
        id: "deliv-2-2",
        title: "Discovery activity outputs",
        weeks: [8, 4],
        details: ["Employ journey mapping, empathy mapping, and Jobs To Be Done analysis to"],
      },
    ],
    aiBoosts: [
      {
        id: "ai-2-1",
        title: "Seed the question bank",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Feed the Project Brief, existing research, tickets, and product docs into AI to generate critical questions for interviews.",
        ],
      },
      {
        id: "ai-2-2",
        title: "Draft discussion guide",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Use AI to convert the seeded question bank into a polished discussion guide tailored for different interviewees.",
        ],
      },
      {
        id: "ai-2-3",
        title: "Auto summarize interviews",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Transcribe recordings, highlight key quotes, and cluster insights into themes with confidence scores.",
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
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Review interview notes, research insights, and discovery artifacts.",
          "Cluster related findings into themes to highlight patterns and opportunities.",
          "Facilitate group discussion to align on key insights.",
        ],
      },
      {
        id: "action-3-2",
        title: "Generate need statements",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Create statements focused on specific user pain points and value.",
          "Explore multiple variations before narrowing down to the most critical.",
          "Consult Define phase of AI UX framework chapter in AI UX Playbook ",
        ],
      },
      {
        id: "action-3-3",
        title: "Articulate user outcomes",
        weeks: [8, 4],
        details: [
          "Reframe need statements into user-centered outcomes tied to business goals.",
          "Capture the shift from current pain points to future benefits.",
          "Ensure outcomes are measurable, specific, and sponsor-ready.",
        ],
      },
      {
        id: "action-3-4",
        title: "Develop real life scenarios",
        weeks: [8, 4],
        details: [
          "Draft short stories or vignettes that illustrate prioritized outcomes.",
          "Use scenarios to highlight user struggles and the value of proposed solutions.",
          "Keep scenarios high-level but actionable enough to inspire ideation.",
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-3-1",
        title: "Affinity map or cluster board",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Organized view of themes, pain points, and opportunity areas.",
          "Consult AI Tools and Methods chapter in AI UX Playbook",
        ],
      },
      {
        id: "deliv-3-2",
        title: "Draft need statements",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["Clear user needs to… so that… statements grounded in evidence."],
      },
      {
        id: "deliv-3-3",
        title: "Real life scenario",
        weeks: [8, 4],
        details: ["Narratives that visualize current challenges and future outcomes."],
      },
      {
        id: "deliv-3-4",
        title: "User outcomes",
        weeks: [8, 4],
        details: ["Approved outcome statements reframing needs into value delivered."],
      },
    ],
    aiBoosts: [
      {
        id: "ai-3-1",
        title: "Convert insights into need statements",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Automatically draft need statements from clustered insights and highlight vague or redundant phrasing for the team to refine.",
        ],
      },
      {
        id: "ai-3-2",
        title: "Use AI to draft real life scenario",
        weeks: [8, 4],
        details: [
          "Generate story outlines or scripts that illustrate user struggles and future benefits, using inputs from need statements and outcomes.",
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
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Encourage lateral inspiration from adjacent domains, nature, or unrelated industries.",
          "Generate a large pool of divergent solutions.",
          "Consult Ideate phase of AI UX framework chapter in AI UX Playbook ",
        ],
      },
      {
        id: "action-4-2",
        title: "Narrow down ideas",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Facilitate voting or scoring exercises to identify the strongest solutions.",
          "Create simple walkthroughs illustrating challenge, solution, and value.",
          "Consult Principles and Patterns chapter in AI UX Playbook",
        ],
      },
      {
        id: "action-4-3",
        title: "Storyboarding",
        weeks: [8, 4],
        details: [
          "Translate top ideas into quick sketches or visual storyboards.",
          "Ground storyboards in real-life scenarios developed during Define.",
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-4-1",
        title: "Shortlist of ideas per outcome",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "A curated set of two or three solution directions per outcome.",
          "Document rationale for selection tied to user outcomes.",
        ],
      },
      {
        id: "deliv-4-2",
        title: "Initial prototype files",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Exploratory screens or flows created in Figma Make or other tools.",
          "Documentation of assumptions and open questions to test later.",
          "Consult AI Tools and Methods chapter in AI UX Playbook",
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-4-1",
        title: "AI Idea Catalyst",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Seed AI with need statements, research insights, and outcome goals.",
          "Leverage AI to spark a wide range of initial ideas, and use diverse prompts to fuel ideation.",
        ],
      },
      {
        id: "ai-4-2",
        title: "Storyboarding support",
        weeks: [8, 4],
        details: [
          "Generate draft images or sketches from text-based scenarios.",
          "Propose visual metaphors or layouts to accelerate storyboard creation.",
          "Iterate quickly on variations to explore multiple story directions.",
        ],
      },
      {
        id: "ai-4-3",
        title: "Early prototyping with AI",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Create rough, low-fidelity mockups with Figma Make or other vibe-coding tools.",
          "Suggest component patterns aligned with the Momentum / Magnetic system.",
          "Consult Principles and Patterns chapter in AI UX Playbook",
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
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Translate storyboards into clickable flows.",
          "Consult Prototype phase of AI UX framework chapter in AI UX Playbook ",
        ],
      },
      {
        id: "action-5-2",
        title: "Build initial prototypes",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Use vibe coding tools to accelerate early builds.",
          "Translate storyboards into clickable low- to mid-fidelity prototypes.",
        ],
      },
      {
        id: "action-5-3",
        title: "Run review rounds",
        weeks: [8, 4],
        details: [
          "Peer reviews often with PM and Eng.",
          "Hold sponsor/SME reviews to validate direction and secure feedback.",
        ],
      },
      {
        id: "action-5-4",
        title: "Craft the narrative",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Collaborate across design, PM, and research to draft a cohesive story.",
          "Keep focus on user value and business impact.",
          "Connect prototypes directly to outcomes, metrics, and strategic goals.",
          "Consult Best Practices chapter in AI UX Playbook.",
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-5-1",
        title: "Initial prototype file",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["Low to mid fidelity clickable prototype.", "Variant branches for key choices."],
      },
      {
        id: "deliv-5-2",
        title: "Narrative and script doc",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Written story aligned with personas, needs, and outcomes.",
          "Includes challenges, solutions, and impact on metrics.",
          "Serves as the backbone for later presentations.",
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-5-1",
        title: "Vibe coding accelerators",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["Consult AI Tools chapter in AI UX Playbook.", "Auto generate placeholder copy and data."],
      },
      {
        id: "ai-5-2",
        title: "Narrative drafting",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Expand rough bullet points into polished draft scripts.",
          "Propose alternative framings to emphasize user or business value.",
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
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Translate shortlisted ideas into high fidelity, testable prototypes.",
          "Consult Principles and Patterns, Responsible AI & Ethics, and the Test phase of AI UX Framework in AI UX Playbook.",
          "Tools can vary (Figma, PowerPoint, custom demo), what matters is clarity, interactivity, and adaptability.",
        ],
      },
      {
        id: "action-6-2",
        title: "Refine the narrative",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Ensure the storyline flows from pain points → solutions → business outcomes.",
          "Align language with Cisco's Responsible AI guidelines.",
        ],
      },
      {
        id: "action-6-3",
        title: "Deliver the final readout",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Present to sponsors, SMEs, and stakeholders.",
          "Record and publish the final vidcast for broader visibility.",
        ],
      },
    ],
    deliverables: [
      {
        id: "deliv-6-1",
        title: "Final prototypes",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "High-fidelity, clickable, and ready for stakeholder demonstration.",
          "Clear links to user outcomes, success measures, and ethical design practices.",
        ],
      },
      {
        id: "deliv-6-2",
        title: "Presentation deck",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Visual storytelling supported with evidence, outcomes, and design rationale.",
          "Clear sections for problem framing, solution walkthroughs, and business impact.",
        ],
      },
      {
        id: "deliv-6-3",
        title: "Narrative and script doc",
        weeks: [8, 4],
        details: [
          "Polished storyline aligned with outcomes.",
          "Finalized version published in SharePoint / Confluence alongside the prototypes.",
        ],
      },
      {
        id: "deliv-6-4",
        title: "Vidcast recording",
        weeks: [8, 4],
        details: [
          "Captures the presentation and demo for async audiences.",
          "Packaged with the final deck as the reference bundle.",
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-6-1",
        title: "Generate presentation spine",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Use Circuit to generate a draft PowerPoint deck as a structural backbone.",
          "Designers should refine visuals and polish narrative flow.",
        ],
      },
      {
        id: "ai-6-2",
        title: "Practice stakeholder questions",
        weeks: [8, 4],
        details: [
          "Query AI against project content to surface the most relevant insights and materials for the specific stakeholders being presented to.",
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
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Convert Figma to PPT and PDF with notes.",
          "Publish vidcast and organize files in SharePoint.",
          "Set up a central doc linking to all materials for leaders.",
        ],
      },
      {
        id: "action-7-2",
        title: "Conduct reflection session",
        weeks: [8, 4],
        details: ["Discuss what worked and what to improve.", "Capture ideas to improve Rapid AI UX process."],
      },
      {
        id: "action-7-3",
        title: "Socialize final artifacts",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["Share across design, PM, and engineering channels.", "Create central doc linking all materials."],
      },
    ],
    deliverables: [
      {
        id: "deliv-7-1",
        title: "Project artifact bundle",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: [
          "Final clickable prototype (Figma).",
          "Project deck (PPT + PDF).",
          "Script document (Word).",
          "Final vidcast recording and narration podcast.",
          "Final research artifacts.",
        ],
      },
    ],
    aiBoosts: [
      {
        id: "ai-7-2",
        title: "Summarize reflections",
        weeks: [8, 4],
        details: [
          "Summarize reflection session transcripts into clear insights.",
          'Cluster feedback into "what worked / what to improve."',
        ],
      },
      {
        id: "ai-7-3",
        title: "Share new AI UX patterns",
        weeks: [8, 4, 2, 1, "2days"], // Added "2days"
        details: ["Upload new design patterns / components to the AI UX Patterns section on the AI UX Playbook."],
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const phaseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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
      </div>

      <div className="relative mb-12">
        {/* Week labels row */}
        <div className="grid grid-cols-8 gap-3 mb-4 px-8">
          {weekGroups.map((week, index) => (
            <div
              key={index}
              className="text-center text-sm font-semibold text-zinc-400 border-b-2 border-zinc-700 pb-2"
              style={{ gridColumn: `span ${week.span}` }}
            >
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
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-visible pb-8"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex gap-6 min-w-max">
          {phases.map((phase) => {
            const filteredActions = filterItemsByDuration(phase.actions)
            const filteredDeliverables = filterItemsByDuration(phase.deliverables)
            const filteredAiBoosts = filterItemsByDuration(phase.aiBoosts)

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
                  <div className="space-y-3">
                    <div className="border-2 border-teal-500/50 rounded-lg p-4 bg-zinc-900/50 flex items-center">
                      <h3 className="font-semibold">Actions: What to do</h3>
                    </div>
                    {filteredActions.map((action) => (
                      <div key={action.id} className="border border-zinc-800 rounded-lg bg-zinc-900/80 overflow-hidden">
                        <button
                          onClick={() => toggleItem(action.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-teal-500" />
                            <span className="font-medium text-left">{action.title}</span>
                          </div>
                          {expandedItems.has(action.id) ? (
                            <ChevronUp className="w-5 h-5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                          )}
                        </button>
                        {expandedItems.has(action.id) && action.details && (
                          <div className="px-4 pb-4 pt-3 space-y-2">
                            {action.details.map((detail, idx) => (
                              <div key={idx} className="bg-zinc-800/50 rounded p-3 text-sm text-zinc-300">
                                {detail}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="border-2 border-blue-500/50 rounded-lg p-4 bg-zinc-900/50 flex items-center">
                      <h3 className="font-semibold">Deliverables: Artifacts to produce</h3>
                    </div>
                    {filteredDeliverables.map((deliverable) => (
                      <div
                        key={deliverable.id}
                        className="border border-zinc-800 rounded-lg bg-zinc-900/80 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(deliverable.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="font-medium text-left">{deliverable.title}</span>
                          </div>
                          {expandedItems.has(deliverable.id) ? (
                            <ChevronUp className="w-5 h-5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                          )}
                        </button>
                        {expandedItems.has(deliverable.id) && (deliverable.description || deliverable.details) && (
                          <div className="px-4 pb-4 pt-3 space-y-2">
                            {deliverable.description && (
                              <div className="bg-zinc-800/50 rounded p-3 text-sm text-zinc-300">
                                {deliverable.description}
                              </div>
                            )}
                            {deliverable.details?.map((detail, idx) => (
                              <div key={idx} className="bg-zinc-800/50 rounded p-3 text-sm text-zinc-300">
                                {detail}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="border-2 rounded-lg p-4 bg-zinc-900/50 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-transparent relative overflow-hidden flex items-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-50 blur-sm" />
                      <div className="absolute inset-[2px] bg-zinc-900/90 rounded-lg" />
                      <h3 className="font-semibold relative z-10 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        AI boosts: How AI accelerates this phase
                      </h3>
                    </div>
                    {filteredAiBoosts.map((boost) => (
                      <div key={boost.id} className="border border-zinc-800 rounded-lg bg-zinc-900/80 overflow-hidden">
                        <button
                          onClick={() => toggleItem(boost.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-lg shadow-cyan-500/50" />
                            <span className="font-medium text-left">{boost.title}</span>
                          </div>
                          {expandedItems.has(boost.id) ? (
                            <ChevronUp className="w-5 h-5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                          )}
                        </button>
                        {expandedItems.has(boost.id) && boost.details && (
                          <div className="px-4 pb-4 pt-3 space-y-2">
                            {boost.details.map((detail, idx) => (
                              <div key={idx} className="bg-zinc-800/50 rounded p-3 text-sm text-zinc-300">
                                {detail}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
