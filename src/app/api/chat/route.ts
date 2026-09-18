import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { SYSTEM_PROMPT } from "@/lib/chatbot/knowledge";
import type { ChatMessage, ChatApiResponse } from "@/lib/chatbot/types";
import { clientIpFrom } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Parses <ACTION> JSON tags emitted by the agent
 */
type AgentAction = { type?: string; data?: Record<string, unknown> };

function extractAgentAction(text: string): { cleanText: string; actionData: AgentAction | null } {
  const actionRegex = /<ACTION>([\s\S]*?)<\/ACTION>/i;
  const match = text.match(actionRegex);

  if (!match || !match[1]) {
    return { cleanText: text, actionData: null };
  }

  try {
    const actionData = JSON.parse(match[1].trim());
    const cleanText = text.replace(actionRegex, "").trim();
    return { cleanText, actionData };
  } catch {
    return { cleanText: text, actionData: null };
  }
}

/**
 * Intelligent studio fallback generator when no API key is configured yet
 */
function generateFallbackResponse(userPrompt: string): { response: string; actionData: AgentAction | null } {
  const lower = userPrompt.toLowerCase();

  // Check for lead information (name & email)
  const emailMatch = userPrompt.match(/[\w.-]+@[\w.-]+\.\w+/);
  const nameMatch = userPrompt.match(/(?:my name is|i am|this is|name:?)\s+([A-Za-z\s]{2,30})/i);

  if (emailMatch) {
    const email = emailMatch[0];
    const name = nameMatch ? nameMatch[1].trim() : "Prospective Partner";
    
    return {
      response: `Thank you, **${name}**! I have registered your project inquiry directly into our engineering pipeline. Our technical leads review all submissions within 24 hours.\n\nYou can also reach our team directly anytime at **support@thedigitalalchemy.co.in**.`,
      actionData: {
        type: "submit_lead",
        data: {
          name,
          email,
          message: userPrompt,
          services: ["AI Automation", "Software Engineering"],
        },
      },
    };
  }

  if (lower.includes("service") || lower.includes("offer") || lower.includes("what do you do")) {
    return {
      response: `At **The Digital Alchemy**, we specialize in high-impact digital engineering across 4 core capabilities:\n\n1. **AI Automation & Agents**: Autonomous operational pipelines, custom LLM agents, and automated workflows.\n2. **AI-Ready SaaS & Web Platforms**: Scalable SaaS platforms and full-stack software built on Next.js, Node.js, and PostgreSQL.\n3. **Custom Software & Cloud**: High-throughput APIs, distributed backends, and cloud infrastructure.\n4. **UI/UX Design Systems**: World-class, Apple-grade interface design with micro-animations.\n\nWould you like to scope a project or discuss an MVP? Share your idea and email, and I can submit a brief directly to our team!`,
      actionData: null,
    };
  }

  if (lower.includes("mvp") || lower.includes("how fast") || lower.includes("timeline") || lower.includes("velocity")) {
    return {
      response: `Our average velocity to a live, production-ready MVP is **28 days**.\n\nWe work in tight, high-intensity sprints with daily builds you can test on your phone. We eliminate agency discovery bloat and pair you directly with senior engineers from day one. Would you like us to scope your timeline?`,
      actionData: null,
    };
  }

  if (lower.includes("pricing") || lower.includes("cost") || lower.includes("budget") || lower.includes("rate")) {
    return {
      response: `We scope every project transparently based on depth and requirements:\n\n- **Targeted Sprints / Small Scopes**: Under ₹1,00,000 / $1,500\n- **Core Production MVP (28-day sprint)**: ₹1,00,000 – ₹3,00,000 / $1,500 – $4,000\n- **Custom Enterprise AI Systems**: ₹3,00,000 – ₹8,00,000 / $4,00,000 – $10,000\n- **Full-Scale SaaS Ecosystems**: ₹8,00,000+ / $10,000 – $25,000+\n\nEvery project includes 100% full IP ownership transferred to you on day one.`,
      actionData: null,
    };
  }

  if (lower.includes("stack") || lower.includes("tech") || lower.includes("technologies") || lower.includes("language")) {
    return {
      response: `Our battle-tested production technology stack includes:\n\n- **Frontend**: TypeScript, React, Next.js (App Router), Tailwind CSS, Motion.\n- **Backend & DB**: Node.js, Python, PostgreSQL, Prisma ORM, Redis, Docker.\n- **AI & Agents**: OpenAI, Claude, Gemini, LangChain, vector databases (Pinecone, pgvector).\n- **Cloud**: AWS, Vercel, Supabase, Cloudflare.`,
      actionData: null,
    };
  }

  if (lower.includes("client") || lower.includes("case study") || lower.includes("proof") || lower.includes("work")) {
    return {
      // No client names, no outcome figures. The rest of the site publishes
      // case studies only where a client has approved them, and there are none
      // yet — so a chatbot inventing four of them would undo the one thing the
      // site is careful about. Offering a real call is the honest alternative.
      response: `We are only publishing work that clients have given us permission to show, with results we can stand behind — and those write-ups are still being prepared, so there is nothing on the site yet.

That is deliberate rather than an oversight. What we can do is walk you through relevant work directly on a call, including projects still under NDA that we cannot publish.

If you tell me what you are planning, along with your name and email, I will pass it to the team and they will show you the closest thing we have built.`,
      actionData: null,
    };
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("location") || lower.includes("office")) {
    return {
      response: `We are based in **New Delhi, India**, and collaborate with clients worldwide across the US, UK, India, and UAE.\n\n- **Direct Email**: support@thedigitalalchemy.co.in\n- **Start a Project**: You can also share your name, email, and idea right here, and I'll route it straight to our engineering team!`,
      actionData: null,
    };
  }

  return {
    response: `Hello! I am **Bhadawar AI**, the digital representative for **The Digital Alchemy**.\n\nI can help you explore our AI automation services, review our technical stack, look through client case studies, or submit a project brief directly to our senior engineering team.\n\nWhat kind of digital system or software are you looking to build?`,
    actionData: null,
  };
}

export async function POST(request: Request) {
  const headerList = await headers();
  const ip = clientIpFrom(headerList) ?? "unknown";

  // Rate limiting to prevent bot abuse
  const limit = await rateLimit("chat:rate", ip, 20, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please pause a moment before asking again." },
      { status: 429 },
    );
  }

  let body: { messages: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ ok: false, error: "Messages array is required" }, { status: 400 });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const userPrompt = lastUserMessage?.content ?? "";

  const apiKey =
    process.env.BHADAWAR_AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY;

  let assistantText = "";
  let actionData: AgentAction | null = null;

  // 1. If an LLM API key is present, invoke the LLM
  if (apiKey) {
    try {
      let provider = (process.env.BHADAWAR_AI_PROVIDER || "openai").toLowerCase();
      if (apiKey.startsWith("gsk_")) provider = "groq";
      if (apiKey.startsWith("AIza")) provider = "gemini";

      let defaultBaseUrl = "https://api.openai.com/v1";
      let defaultModel = "gpt-4o-mini";

      if (provider === "groq") {
        defaultBaseUrl = "https://api.groq.com/openai/v1";
        defaultModel = "openai/gpt-oss-120b";
      } else if (provider === "openrouter") {
        defaultBaseUrl = "https://openrouter.ai/api/v1";
        defaultModel = "meta-llama/llama-3.3-70b-instruct";
      }

      const model = process.env.BHADAWAR_AI_MODEL || defaultModel;
      const baseUrl = process.env.BHADAWAR_AI_BASE_URL || defaultBaseUrl;

      if (provider === "gemini" || apiKey.startsWith("AIza")) {
        // Google Gemini API call
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const contents = [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          ...messages.slice(-8).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        ];

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          const parsed = extractAgentAction(rawText);
          assistantText = parsed.cleanText;
          actionData = parsed.actionData;
        } else {
          // Fallback if provider responds with non-200
          const fb = generateFallbackResponse(userPrompt);
          assistantText = fb.response;
          actionData = fb.actionData;
        }
      } else {
        // OpenAI / Groq / OpenRouter Compatible chat completion
        const formattedMessages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ];

        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.5,
            max_tokens: 600,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.choices?.[0]?.message?.content ?? "";
          const parsed = extractAgentAction(rawText);
          assistantText = parsed.cleanText;
          actionData = parsed.actionData;
        } else {
          // Fallback if API returned error
          const fb = generateFallbackResponse(userPrompt);
          assistantText = fb.response;
          actionData = fb.actionData;
        }
      }
    } catch {
      // Fallback on network or runtime error
      const fb = generateFallbackResponse(userPrompt);
      assistantText = fb.response;
      actionData = fb.actionData;
    }
  } else {
    // 2. Intelligent offline fallback when waiting for user to add API key
    const fb = generateFallbackResponse(userPrompt);
    assistantText = fb.response;
    actionData = fb.actionData;
  }

  // 3. Agentic Action Execution: Submit Lead to Database
  let confirmedAction = null;
  if (actionData && actionData.type === "submit_lead" && actionData.data) {
    const { name, email, company, services, message } = actionData.data as {
      name?: string;
      email?: string;
      company?: string;
      services?: unknown;
      message?: string;
    };
    if (email && email.includes("@")) {
      try {
        const lead = await db.lead.create({
          data: {
            name: name || "Website Visitor",
            email: email.trim().toLowerCase(),
            company: company || null,
            services: Array.isArray(services) ? JSON.stringify(services) : JSON.stringify(["Bhadawar AI Inquiry"]),
            message: message || "Submitted via Bhadawar AI Chatbot conversation",
            sourcePage: "BHADAWAR_AI",
          },
        });

        confirmedAction = {
          type: "lead_submitted" as const,
          data: {
            leadId: lead.id,
            name: lead.name,
            email: lead.email,
            services: Array.isArray(services) ? services : ["AI Automation"],
          },
        };
      } catch (err) {
        console.error("[Bhadawar AI] Error saving lead:", err);
      }
    }
  }

  const responsePayload: ChatApiResponse = {
    ok: true,
    message: assistantText,
    action: confirmedAction ?? undefined,
  };

  return NextResponse.json(responsePayload);
}
