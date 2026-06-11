# Episode 0 — What even is an agent?

*A letter to my children, who will live with these things their whole lives.*

---

## Before I tell you what it is, let me tell you why it matters

I'm writing this for the two of you, but I want anyone reading over your shoulder
to be welcome too. There's a thing in the world right now called an "AI agent."
People use the word a lot. They use it to sell things, to scare people, to
sound clever at dinner. By the time you're old enough to build one yourself,
the word might mean something else entirely. So I want to start in a place
that won't move: not with the technology, but with how you choose to meet it.

There are, broadly, two ways a person can teach another person something.
You can teach from **love**, or you can teach from **fear**. I want you to
recognize both, because you'll feel them done to you all your life, and
you'll do them to others, and the difference matters more than almost
anything else I could tell you.

When you teach from fear, you **narrate** and you **impose**. You tell the
child what is and what must be. You give the answer. You don't ask what they
see, because what they see is not relevant — only what you see is relevant.
The lesson moves in one direction. If the child resists, you raise your
voice or your hand or your eyebrow, and the resistance stops, but the
learning stops with it. What you get at the end is obedience. What you
don't get is a person who can think.

When you teach from love, you **converse**, and you **respect**. You sit
beside the child, not above them. You ask what they see. You let them be
wrong out loud, because being wrong out loud is how a mind finds its own
edges. You give the answer last, or sometimes not at all. The lesson moves
in both directions: you learn things about the child, and sometimes about
the world, that you would never have learned if you had only narrated.
What you get at the end is a person who can think. Which means, sometimes,
a person who disagrees with you. That's the cost. It's the price of the
thing being real.

I am telling you this in an essay about computers because **the same fork
shows up when you build software that thinks**. You can build from fear or
you can build from love, and the system that comes out the other side
will be a different kind of thing depending on which posture you chose.

That's what an agent really is, in the end. It's a choice about posture,
dressed up in code.

---

## The two ways to build a thinking machine

Imagine you want to write a program that helps someone plan a trip.

The **fear** version is what most software has always been. You sit down and
you imagine every thing the user might do, and you write a screen for each
one. *Click here for flights. Click here for hotels. Click here for car
rental. Fill in this form. Read this confirmation.* The program narrates.
The user does what the program tells them, in the order the program tells
them, or the program breaks. If the user wants to do something the
programmer didn't imagine, the user is wrong. The system has imposed.

The **love** version is what we're now learning to build. You sit down and
you write something that can **talk with** the user. The user says, *I want
to take the kids somewhere warm in February for under three thousand
dollars and my youngest gets motion sick.* The program doesn't have a
screen for that. It has a conversation. It asks questions back. It thinks
about what it knows, and what it doesn't know, and when it doesn't know
something it goes and looks. It tries things. It tells the user what it's
doing. If it gets something wrong, the user can say so, and it adjusts.

That second thing is what people are pointing at when they say "agent."

It is, at its heart, **a program that can have a conversation with the
world** — with you, with other programs, with a database, with a website —
and adjust what it does based on what it hears back. That's it.
Everything else is detail.

---

## The smallest honest definition

If you stripped away every buzzword, every framework, every venture-capital
deck, an agent is this:

> A program that runs in a loop. On each turn, it looks at where things
> are, it decides what to do next, it does the thing, and it observes what
> happened. Then it loops again, until it decides it's done.

That's it. Four verbs. **Look. Decide. Do. Observe.**

I want you to hold that picture in your head for a moment, because the
rest of this series is just going to fill it in with detail. Every episode
adds one capability to one of those four verbs. By the end you'll have
built a real one. But the shape doesn't change.

If a person tells you something is an agent and you can't see the loop in
it — if you can't point to where it looks, decides, acts, and observes —
they're either using the word wrong or selling you something. That's a
useful test. Children should have useful tests for grown-ups' words.

---

## Four things people call agents (and which one we'll build)

The word gets used for very different things. Before we build one, let's
sort them by which posture they came from, because the posture shows.

**1. A chat wrapper.** Someone took a chatbot, wrapped it in a nice
interface, gave it a personality, and called it an agent. It cannot
really *do* anything outside the conversation. It can suggest, it can
explain, it can write you a poem, but if you ask it to actually book the
flight, it can't. It just talks. This is built from love in the sense
that it converses — but it has no hands. Most "AI assistants" you'll
meet in 2026 are this. They're useful. They're not really agents in the
strong sense.

**2. A function-caller.** This one can actually do things, but only the
things the programmer permitted, one at a time. You ask it for the
weather, it calls a weather function. You ask it to send an email, it
calls a send-email function. Between the asking and the doing, the
programmer wrote a list of permitted actions, and the agent picks from
the list. This is the honest middle. It's where most real products live.
It's where we will spend most of this series.

**3. The autonomous worker.** This is the one the magazines write about.
You give it a goal — *grow my business, write my novel, find me a job* —
and you walk away, and it goes off and works for hours or days, making
its own decisions about what to do next. This one exists in demos. It
mostly doesn't exist in real life yet, and when it does it tends to fail
in interesting and expensive ways. We will build *toward* this in this
series, but I want to be honest with you that we will not arrive.
Anyone who tells you they have arrived is selling something.

**4. The swarm.** Many agents talking to each other, dividing up the work,
arguing, voting. This is the frontier. It's beautiful when it works.
It works less often than the demos suggest. We'll touch it at the very
end, and only carefully.

The series is about category two — the function-caller — built with
enough care that you understand how to push it toward category three when
the work calls for it. We will not pretend to know more than we know.
That's the love posture again: you can't have a real conversation with
someone if you're pretending to be smarter than you are.

---

## What the loop actually looks like

Let me draw it for you the way I'd draw it on a napkin.

```
   ┌──────────────┐
   │   you ask    │   "plan a warm february trip for under $3k"
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  it LOOKS    │   reads your message, reads its memory,
   │              │   reads the conversation so far
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  it DECIDES  │   "I should search for flights first"
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  it ACTS     │   calls the flights API
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  it OBSERVES │   gets back a list, notices nothing under $3k
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  loop again  │   "I should try shifting dates"
   └──────────────┘
```

That's the whole picture. Everything in the rest of this series is one of
these boxes getting more interesting.

- **Look** is where *memory* and *context* live (Episodes 3 and 4).
- **Decide** is where *planning* lives ([Episode 5](/episodes/05-the-planning-loop)). It's also where the
  language model itself lives ([Episode 1](/episodes/01-just-a-prompt)).
- **Act** is where *tools* live ([Episode 2](/episodes/02-give-it-hands)). Tools are the agent's hands.
- **Observe** is where *evaluation* and *feedback* live (Episodes 6 and
  10). Without honest observation, the loop is blind, and a blind loop is
  what people mean when they say "the agent went crazy."

Every famous agent failure you've heard about — the lawyer who submitted
hallucinated case law, the customer-service bot that promised refunds it
couldn't authorize, the autonomous trader that lost a fortune in an hour —
was a failure in one of these four boxes. Usually in *observe*. Almost
always in *observe*. The agent didn't notice it was wrong, so it kept
going.

A father's lesson sneaks in here: **the most important capability is the
one that lets you notice you were wrong.** That's true of agents. It was
true of me when I was learning to be your father. It will be true of you.
Build the noticing first, before you build anything fancy.

---

## Why I'm starting from love and not from the framework

There are at least a hundred frameworks for building agents. LangChain.
LlamaIndex. AutoGen. CrewAI. Three more were invented while you were
reading this paragraph. If you start with the framework, you will learn
the framework, and when the framework changes — and it will, every six
months — you will have to learn it again, and you will still not know
what an agent is.

If you start with the loop and the posture, you can pick up any framework
in an afternoon, because they all wrap the same four verbs. You will
build better things, because you'll know what the framework is hiding
from you. And you'll know when the framework is wrong, which it sometimes
is.

This is the same lesson I would give you about any tool. The blender is
not cooking. The calculator is not arithmetic. The framework is not the
agent. Learn the thing, then learn the tool.

---

## What we will build together

By the end of this series, we will have built a small, real agent. It
will not be impressive in the way the demos are impressive. It will not
write your novel or grow your business. But it will:

- Take a request in plain language.
- Decide what tools to use to fulfill it.
- Use those tools, including reading from a database and searching the
  web.
- Notice when it's about to do something wrong.
- Cost you a few cents to run, not a few dollars.
- Get measurably better over time as you use it.

It will be written in Python because Python is where this work lives in
2026. We'll use a real database (Postgres with vector search) because
toys don't teach you what production teaches you. We'll write our own
loop because writing your own loop, once, is the only way the rest of
the field stops being magic.

And we will go slowly. Each episode adds **one capability**. You can
follow along by building it, or by reading it like a story. Either is
fine. I am not in a hurry, and neither should you be. The people who are
in a hurry with this technology tend to build things they later regret.

---

## A promise, and a warning

The promise: I will not narrate at you. I will not pretend the open
problems are solved. I will tell you when I don't know, and I will tell
you when the field doesn't know. I will show you the failures alongside
the successes, because the failures are where the learning is. I will
respect your time and your intelligence the way I would want someone to
respect yours.

The warning: this stuff is genuinely powerful, and like everything
genuinely powerful, it can be used from love or from fear. Someone will
try to use these agents to surveil you, to manipulate you, to take your
job without asking, to flood the world with cheap text and cheap
images and cheaper decisions. You will need to be able to tell which is
which. The best defense is to understand the machine well enough that
nobody can lie to you about what it can and can't do. That's most of why
I'm writing this.

The other reason is that I'd rather you build them than be built by
them.

---

## Where we go next

In [Episode 1](/episodes/01-just-a-prompt), we'll build the smallest version of the **decide** box — a
single language-model call, with a prompt that's actually thought about.
No loop yet, no tools, no memory. Just the model and a good question.
You'll be surprised how far that gets you. Then in [Episode 2](/episodes/02-give-it-hands) we'll give
it hands.

I love you both. Let's go.

— Dad

---

*Series: Building an Agent from Scratch. Source material includes Chip
Huyen's* AI Engineering: Building Applications with Foundation Models
*(O'Reilly, 2024), chapters 1 and 6, among others.*
