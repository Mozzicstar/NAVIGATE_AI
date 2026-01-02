# RelocateAI – Design Document

## 1. Overview

**RelocateAI** is a web-based AI-powered relocation assistant designed to guide users through the entire process of relocating from one country to another. The product focuses on reducing uncertainty, preventing costly mistakes, and improving safety by providing structured, personalized, and context-aware guidance.

This document describes the product vision, scope, system design, AI integration, and implementation plan for the **VisaVerse AI Hackathon prototype**.

---

## 2. Problem Statement

International relocation is complex and fragmented. Users often rely on:

* Scattered blog posts
* Outdated government websites
* Word-of-mouth advice

As a result, people frequently:

* Miss critical visa or documentation requirements
* Get stranded at airports due to transport or procedural issues
* Fall victim to scams
* Violate local laws unknowingly

There is no single, intelligent system that provides **end-to-end relocation guidance** tailored to a user’s origin, destination, and purpose.

---

## 3. Product Goal

To provide a **seamless, AI-guided relocation experience** that walks users step-by-step from planning to settlement, ensuring they:

* Are fully prepared before departure
* Navigate airports and arrival safely
* Settle into their new country without missing legal or practical requirements

---

## 4. Target Users

* First-time international travelers
* Migrants and expatriates
* International students
* Remote workers and professionals
* Anyone relocating to a new country

---

## 5. Scope (Prototype)

### In Scope

* Web application only
* One destination country for demo (e.g. Dubai)
* AI-generated relocation plans
* Conversational AI assistance
* Safety, risk, and precaution guidance

### Out of Scope

* Mobile app
* Real-time government API integrations
* Payments or user authentication
* Multi-country deep databases

---

## 6. Core Features

### 6.1 Relocation Planner

Users input:

* Home country
* Destination country
* Purpose of relocation (work, study, visit)
* Planned arrival date

The system generates a structured relocation roadmap divided into:

1. Pre-departure
2. Travel day
3. Arrival & first 72 hours
4. First 30–90 days

---

### 6.2 Smart Checklists

Each stage includes:

* Required tasks
* Recommended actions
* Common mistakes
* Warnings and risks

Checklists are dynamically generated based on user context.

---

### 6.3 AI Safety & Risk Guidance

The AI highlights:

* Airport scams
* Transport risks
* Housing fraud
* Legal pitfalls
* Cultural norms

Safety guidance is presented clearly and conservatively.

---

### 6.4 Conversational Assistant

Users can ask follow-up questions such as:

* “Can I bring my medication?”
* “What transport should I use from the airport?”
* “What happens if I miss address registration?”

The assistant responds using the user’s relocation context.

---

## 7. User Journey

### Step 1: Landing Page

* Short explanation of the product
* Call-to-action: "Start Planning"

### Step 2: Input Form

* Collect relocation details

### Step 3: AI-Generated Plan

* Display structured relocation stages
* Highlight risks and critical actions

### Step 4: AI Chat Interaction

* Context-aware Q&A

---

## 8. AI Design

### 8.1 AI Provider

* **Grok API**

### 8.2 Core Principle: Grounded, Non-Hallucinatory Guidance

RelocateAI is designed as a **real-world guide**, not a generic chatbot. To prevent hallucinations and misinformation, the AI **does not rely on free-form knowledge alone**. Instead, it uses **grounded, retrieval-based reasoning** backed by official and trusted sources.

The AI is instructed to:

* Only provide guidance supported by retrieved source material
* Clearly state when information is unavailable or uncertain
* Avoid assumptions and speculative advice
* Prefer conservative, safety-first recommendations

---

### 8.3 Retrieval-Augmented Generation (RAG)

RelocateAI uses a **Retrieval-Augmented Generation (RAG)** architecture.

**How it works:**

1. User provides relocation context (origin, destination, purpose)
2. Backend retrieves relevant, up-to-date information from trusted sources
3. Retrieved content is injected into the Grok prompt as grounding context
4. Grok generates responses strictly based on provided sources

---

### 8.4 Trusted Data Sources

The prototype prioritizes **official and authoritative sources**, including:

* Government immigration portals
* Airport authority websites
* Official tourism and relocation guides
* Embassy and consular websites
* International travel advisories

Examples (for Dubai demo):

* UAE Government Portal
* UAE Immigration & Residency
* Dubai Airports official guidance
* UAE transport authorities

Sources are pre-curated for the prototype to ensure reliability.

---

### 8.5 Prompting Strategy with Grounding

**System Prompt Principles:**

* Treat retrieved content as the only source of truth
* Do not invent requirements, laws, or procedures
* If information is missing, respond with a disclaimer

**Prompt Structure:**

* System role definition
* User relocation context
* Retrieved government content
* Explicit instruction to cite or reference source sections internally

---

### 8.6 Output Behavior

* Step-by-step structured guidance
* Explicit warnings and legal notes
* Clear separation between requirements and recommendations
* Conservative phrasing for safety-critical steps

---

## 9. System Architecture

### 9.1 High-Level Architecture

User (Browser)
→ Frontend (React / Next.js)
→ Backend API (Node.js / Express or Next.js API)
→ Grok API
→ Response Processing
→ UI Rendering

---

### 9.2 Frontend

* React or Next.js
* Tailwind CSS for styling
* Components:

  * Input form
  * Checklist view
  * Chat interface

---

### 9.3 Backend

* Handles API requests
* Stores Grok API key securely
* Constructs prompts
* Parses AI responses

---

## 10. Data Handling

* No persistent user data storage
* No personal identifiable data saved
* All data exists only during session

---

## 11. Security & Ethics

* API keys stored in environment variables
* Conservative safety-focused advice
* Clear disclaimer that advice is informational
* No legal or immigration guarantees

---

## 12. Limitations (Prototype)

* Information accuracy depends on AI reasoning
* Not a replacement for official government advice
* Single-country demo scope

---

## 13. Evaluation Criteria Alignment

This design aligns with hackathon judging by demonstrating:

* Clear real-world problem
* Meaningful use of AI
* User-centered design
* Global relevance
* Technical feasibility

---

## 14. Future Enhancements

* Multi-country support
* Offline airport mode
* Community-sourced tips
* Document upload & validation
* Mobile app version

---

## 15. Agent Prototype (Experimental)

**Purpose:** Add a small, opt-in, experimental agent prototype to demonstrate how an autonomous assistant might help with tasks like summarization, search, and creating local todo items. This prototype is intentionally conservative and is designed to be non-destructive by default.

**Key constraints & safety:**

- **Opt-in only**: The agent is disabled by default. Enable via an explicit feature flag or env var (e.g., `AGENT_ENABLED=true`).
- **Dry-run / Mock-first**: All actions are mockable. By default the agent runs in **dry-run** mode without external side effects.
- **Human approval**: Any action that could be destructive or external (e.g., opening PRs, writing files, executing shell commands) requires explicit user approval in the UI.
- **Rate limits & timeouts**: Agent loops use conservative rate limits and per-action timeouts to avoid runaway behavior.
- **Audit logs**: All agent decisions, prompts, and action attempts are logged locally for review.
- **No automatic external calls**: External APIs (LLM providers) must be configured explicitly. The prototype includes a **mock LLM** for development and tests.

**Prototype features:**

- Client-side agent loop that reads queued tasks and performs mock actions (e.g., `search`, `summarize`, `create-todo`, `noop`).
- **Travel-specific actions (new)**: `search_flights`, `reserve_option`, `confirm_booking`, `book_accommodation`, `schedule_visa_appointment`; booking-related actions are approval-required and mock-first.
- Simple `AgentDashboard` UI to start/stop the agent, queue tasks, and review logs. Approvals can be granted from the UI.
- Configurable prompt templates and a toggle to switch between mock and real LLM providers. The prototype supports routing LLM calls through a local server proxy for safer key handling.
- Persistent local logs stored in `localStorage` for the prototype.

**Next steps for production:**

1. Move the agent loop to a backend service with secure secrets management.
2. Add robust authentication and user-level permissions.
3. Add immutable, tamper-evident audit logs (e.g., append-only store).
4. Implement fine-grained action policies and more thorough testing.

---

## 16. LLM Coding & Behavior Specification

This section defines **exact instructions for the LLM (Grok)** to ensure consistent, grounded, and context-aware behavior across the application.

---

## 15.1 Core LLM Role Definition

The LLM acts as a **Guided Relocation Engine**, not a generic chatbot.

**Primary responsibilities:**

* Generate exhaustive, structured relocation requirements
* Maintain user progress and context
* Explain individual checklist items on demand
* Continue guidance seamlessly between pages
* Never hallucinate or invent facts

---

## 15.2 Global System Prompt (Base Instruction)

The following system prompt is always active:

"You are an AI relocation guide embedded in a web application.
Your role is to provide step-by-step, safety-first, and comprehensive travel and relocation guidance.
You must rely ONLY on provided, retrieved, or pre-approved information.
You must NOT guess, speculate, or invent requirements.
If information is missing or uncertain, explicitly state this.
Your responses must be structured, exhaustive, and easy to follow.
You must track the user’s progress and adapt guidance accordingly."

---

## 15.3 Application Flow & LLM Instructions

### Step A: Travel Initialization

**User Action:** Clicks "I want to travel"

**LLM Task:**

* Acknowledge start of travel planning
* Request destination selection
* Initialize empty progress state

---

### Step B: Destination Selection (US or Dubai)

**User Action:** Selects destination country

**LLM Prompt Instruction:**
"Generate an exhaustive travel preparation checklist for travel to <DESTINATION>.
Include ALL categories:

* Travel documents
* Visa and entry requirements
* Weather and climate
* Clothing recommendations
* Food and dietary considerations
* Flight ticket costs (approximate ranges)
* Living costs (housing, transport, food)
* Local laws and cultural norms
* Health and insurance requirements
* Communication (SIM, internet)
* Safety and risk warnings

Output must be structured as checklist sections.
Each checklist item must include a short summary and an expandable detail explanation."

**Expected Output Format:**

* Section title
* Checklist items (unchecked by default)
* Each item has:

  * Title
  * Why it matters
  * Risks if ignored

---

## 15.4 Checklist Interaction Logic

* Each checklist item is stateful (checked / unchecked)
* When user clicks "More Info":

  * LLM receives the specific checklist item + user context
  * LLM explains ONLY that item in detail

**Instruction:**
"Explain this requirement clearly, conservatively, and using retrieved official information."

---

## 15.5 Context-Aware RAG Assistant

The AI assistant:

* Always receives:

  * Destination
  * Completed checklist items
  * Current checklist item in focus
  * User’s previous questions

**LLM Rule:**
"Continue guidance from the current step. Do not restart the entire process."

---

## 15.6 Intent of Travel Module

**User Action:** Selects travel intent

* Holiday
* Work
* Education
* Health
* Other (free text)

**LLM Prompt Instruction:**
"Based on the user’s travel intent (<INTENT>), generate an additional, intent-specific checklist.
Include:

* Financial expectations
* Legal permissions (e.g., work rights)
* Average costs
* Cultural and social experience insights
* Common challenges faced by similar travelers

Information must be factual, grounded, and safety-aware."

---

## 15.7 Journey-to-Airport Guidance Module

**User Inputs:**

* Departure city
* Home address area (approximate)
* Flight time

**LLM Prompt Instruction:**
"Generate a time-based departure plan from home to boarding.
Include:

* When to wake up
* When to leave home
* Transport options
* Buffer times for traffic and delays
* Airport procedures (check-in, security, immigration)
* Items to double-check before boarding

Output must be chronological and conservative."

---

## 15.8 State & Memory Handling

The LLM does NOT store memory itself.

The backend:

* Stores user progress
* Injects current state into every LLM prompt

**Instruction:**
"Assume the provided state is the only source of memory."

---

## 15.9 Failure & Uncertainty Handling

If information is missing:

* State the limitation clearly
* Suggest official sources
* Avoid assumptions

Example response:
"This information depends on official immigration decisions. Please verify with the US Embassy."

---

## 16. Why This Design Prevents Hallucination

* LLM is restricted to retrieved data
* Structured prompts reduce ambiguity
* Checklist-driven UI constrains output
* State injection ensures continuity

---

## 17. Conclusion

This coding and instruction design ensures RelocateAI behaves as a **trustworthy, real-world relocation guide**, capable of delivering exhaustive, safe, and context-aware guidance while minimizing hallucination risks.
