---
title: Ramya Ravi
name: Ramya Ravi
pronouns: she/her
slug: ramya-ravi
tagline: Developer Advocate - AI and Open Source
description: Ramya Ravi speaks about AI and open source technologies, with a focus on AI search, RAG, and AI agents.
featured_image: '/images/speakers/ramya-ravi.jpg'
location: United States
employer: NetApp Instaclustr
languages:
  - English
  - Hindi
  - Telugu
  - Tamil
expertise:
  - AI
  - OpenSearch
  - RAG
  - AI Agents
  - Open Source
profiles:
  sessionize: https://sessionize.com/ramya-ravi19/
  linkedin: https://www.linkedin.com/in/ramya-ravi19/
  x: https://x.com/Ramya_ravi19
  github: https://github.com/ramyaravi1
  website: https://medium.com/@ramyaravi19
talks:
  - title: "Fix Your Retrieval, Fix Your RAG"
    abstract: |
      Most RAG systems have a retrieval problem. The language model gets the blame, but the real culprit is upstream in the search layer deciding what context the model ever sees in the first place. Fix the retrieval, and the answers fix themselves.

      This talk is for developers and ML engineers who have shipped a RAG system with OpenSearch and are wondering why the answers aren't as good as the demos suggested. No retrieval evaluation experience needed.

      Through live demos on a real OpenSearch index, the session will show you how to see exactly what your retrieval layer is returning, identify the failure modes that silently kill answer quality, and apply targeted fixes without rearchitecting your stack. You'll leave knowing where to look, what to measure, and what to do about it.
    delivered_at:
      - OpenSearch Con, 2026
  - title: "Solving Context Shuffle with OpenSearch: Mitigating Permutation-Induced Hallucinations in Production"
    abstract: |
      Modern AI systems can appear confident while being surprisingly fragile. Change the order of the same evidence, rearrange the prompt, or present supporting facts in a slightly different sequence, and the model may produce a different answer. That is not always a retrieval problem. It is often a context presentation problem. This session explores why the layout of information matters, why repeated exposure to the same input can improve results, and what that tells us about how models process evidence before generating a response.

      Using OpenSearch as the foundation, this session examines how RAG agent responses change when the same knowledge is retrieved, ranked, and presented in different ways. We will explore practical patterns for structuring search results, document chunks, tool outputs, and evidence chains to make models less sensitive to arbitrary ordering. Attendees will see how changes in context presentation can alter an agent's answer, then learn techniques for testing input-order sensitivity, reducing permutation-induced hallucinations, and building production AI systems that reason from stable evidence instead of whatever sequence the pipeline happened to produce.
    delivered_at:
      - OpenSearch Con, 2026
  - title: "Ask the Experts: Maintainer Panel"
    abstract: |
      Join us for an interactive "Ask the Experts" Maintainer Panel and take advantage of a unique opportunity to gain insights from core maintainers from OpenSearch and across the open source ecosystem.

      Moderated by Senior Community Manager Kris Freedain, this session brings maintainers together to explore the work of building an enterprise-grade platform in the open. From navigating complex roadmap trade-offs and scaling search performance to managing contributor dynamics and AI-fuelled contributions, panelists will share their firsthand perspectives on the triumphs and realities of open source software maintenance.
    delivered_at:
      - OpenSearch Con, 2026
  - title: "Your Agent is Only as Good as What It Retrieves"
    abstract: |
      Most agentic RAG systems have a retrieval problem, not a model problem. When an agent's tool-use loop hands the model the wrong context, the agent doesn't fail loudly - it reasons confidently over the wrong documents and returns a wrong answer with nothing broken in the logs.

      This talk is for developers and ML engineers building agents who've shipped something that passed every test and then quietly gave someone a wrong answer in production. No retrieval evaluation experience needed.

      Through demos on a real OpenSearch index, we'll trace exactly what an agent's retrieval step actually returns, identify the failure modes that silently degrade what the model sees, and apply targeted fixes without rearchitecting the agent itself. You'll leave knowing where to look when your agent is wrong, what to measure, and what to fix first.
    delivered_at:
      - Agentic 101 Boston, 2026

# hero_image: '/images/speakers/ramya-ravi.jpg' # optional banner; falls back to a default photo
---

Ramya Ravi is a Developer Advocate for AI and Open Source at NetApp Instaclustr, a passionate content creator and AI enthusiast who thrives on exploring emerging trends, building communities, and attending tech conferences. With expertise in Python, TypeScript, C/C++, and AI/ML libraries like scikit-learn, XGBoost, PyTorch, TensorFlow, and Hugging Face, Ramya brings a wealth of technical knowledge to her role.

Previously, as a Developer Relations Engineer at Intel, she focused on AI/ML solutions, creating impactful technical content including blogs, demos, and videos. Ramya also spearheaded the growth of Intel's developer community on Reddit and Discord, building it from the ground up.
