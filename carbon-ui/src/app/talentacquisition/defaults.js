export const DEFAULTS = {
  free_form_text: `HIRING REQUEST
Role title: Senior IBM i Systems Developer
Department: Technology and Platform Engineering
Hiring manager: James Thornton
Location: Leeds with hybrid working
Employment type: Full-time

Role purpose:
We need an experienced IBM i developer to maintain, enhance, and modernise our core order management platform (Orbit). The role sits within the Platform Engineering team and works closely with the development lead and infrastructure teams to evolve our IBM i estate as part of a broader platform modernisation strategy.

Core responsibilities:
- Develop, maintain, and enhance RPG and CL applications within the Orbit order management system
- Support the integration of IBM i workloads with modern APIs and web services
- Work with the Head of Development on the platform modernisation roadmap
- Participate in code reviews, testing, and deployment activities
- Provide third-line support for production incidents affecting core order processing

Must-have skills:
- IBM i / AS400 development experience (RPG, RPGLE, CL)
- SQL and DB2 for i database skills
- Understanding of order management or ERP systems
- Experience integrating IBM i with REST APIs or web services
- Strong analytical and problem-solving skills

Preferred skills:
- Experience with Orbit or similar IBM i order management platforms
- Knowledge of OpenShift or hybrid cloud integration patterns
- Awareness of AI tooling for IBM i modernisation
- Experience working in a distribution, e-commerce, or supply chain environment

Tone and writing guidance:
- Use inclusive, professional hiring language
- Expand the diversity and inclusion statement
- Expand compensation and benefits in a realistic but non-specific way
- Make the role sound senior, credible, and attractive — emphasise the modernisation opportunity, not a maintenance-only role

TASK
Generate a polished job description from this requisition.`,
  entities: [
    { label: 'Job Title', definition: 'Final title to use in the job description' },
    { label: 'Role Summary', definition: 'A polished overview paragraph for the role' },
    { label: 'Key Responsibilities', definition: 'Structured bullet-style description of the main responsibilities' },
    { label: 'Required Qualifications', definition: 'Essential skills and experience for the role' },
    { label: 'Preferred Qualifications', definition: 'Nice-to-have skills and experience' },
    { label: 'Diversity and Inclusion Statement', definition: 'Expanded inclusive hiring statement' },
    { label: 'Compensation and Benefits', definition: 'Expanded but non-specific compensation and benefits paragraph' },
    { label: 'Call to Action', definition: 'Closing application encouragement text' },
    { label: '', definition: '' },
  ],
};

export const RESUME_SEARCH = {
  free_form_text: `CANDIDATE REPOSITORY SNAPSHOT

Candidate 1:
Name: Sarah Whitfield
Current role: Senior IBM i Developer
Location: Leeds
Experience: 11 years
Profile summary:
Specialist in RPGLE and CL development across order management and logistics platforms. Has delivered integration work connecting IBM i to REST APIs and web-based front ends. Strong DB2 for i skills, production support experience, and familiarity with IBM i modernisation tooling including ARCAD and Rational Developer for i.

Candidate 2:
Name: Rajesh Patel
Current role: Systems Analyst — ERP Platforms
Location: Manchester
Experience: 8 years
Profile summary:
Works across IBM i and SAP environments in distribution and manufacturing. Experience with order processing workflows, inventory management systems, and cross-platform data integration. Growing interest in AI-assisted operational intelligence and OpenShift integration patterns.

Candidate 3:
Name: Claire Donnelly
Current role: Platform Engineer
Location: Birmingham
Experience: 9 years
Profile summary:
Leads IBM Power and IBM i platform operations for a mid-sized distributor. Strong infrastructure and operational background. Experience with high-availability configuration, disaster recovery, and IBM i security hardening. Less development focus, stronger platform and operations orientation.

Candidate 4:
Name: Tom Ashworth
Current role: Application Developer
Location: Sheffield
Experience: 5 years
Profile summary:
RPG developer working on commercial distribution software. Familiar with order management workflows and e-commerce integrations. Developing skills in modernisation approaches and API connectivity. Strong communication skills and eager to grow into a senior role.

SEARCH REQUEST
Hiring team wants candidates relevant to:
- IBM i / RPG development for order management and distribution
- API and integration experience connecting IBM i to modern systems
- Ability to support modernisation alongside day-to-day development
- Strong communication and cross-team working

TASK
Create a concise search-and-summary output that makes the candidates easy to browse in a single canonical format.`,
  entities: [
    { label: 'Search Summary', definition: 'A short summary of the candidate pool against the search request' },
    { label: 'Candidate 1 Summary', definition: 'Concise summary for Sarah Whitfield including fit and strengths' },
    { label: 'Candidate 2 Summary', definition: 'Concise summary for Rajesh Patel including fit and strengths' },
    { label: 'Candidate 3 Summary', definition: 'Concise summary for Claire Donnelly including fit and strengths' },
    { label: 'Candidate 4 Summary', definition: 'Concise summary for Tom Ashworth including fit and strengths' },
    { label: 'Best Match Candidates', definition: 'Which candidates appear strongest and why' },
    { label: 'Suggested Search Tags', definition: 'Useful canonical tags or keywords for indexing and future search' },
    { label: '', definition: '' },
  ],
};

export const SHORTLIST_INTERVIEW = {
  free_form_text: `HIRING CONTEXT
Role title: Senior IBM i Systems Developer
Priority criteria:
- Strong RPGLE and CL development skills
- Integration experience connecting IBM i to modern systems
- Understanding of order management or distribution platforms
- Ability to contribute to a modernisation programme without disrupting live operations
- Good communication and cross-functional working skills

SHORTLIST CANDIDATES

Candidate A: Sarah Whitfield
Highlights:
- Strongest pure IBM i development background
- Direct experience with order management and logistics platforms
- Modernisation tooling experience is a strong differentiator
- May need development in hybrid cloud and AI integration areas

Candidate B: Rajesh Patel
Highlights:
- Good cross-platform background combining IBM i and ERP
- Useful distribution and supply chain domain knowledge
- Growing interest in AI and OpenShift integration — strong future potential
- Less deep in IBM i development than Sarah

Candidate C: Claire Donnelly
Highlights:
- Strong platform and infrastructure background on IBM Power and IBM i
- Excellent security and DR credentials — very relevant to Avnet's resilience agenda
- Less development depth than others — better fit for a Platform Engineer role than a Developer role

TASK
Generate a structured shortlist and interview pack that helps the hiring team move to the next stage quickly.`,
  entities: [
    { label: 'Shortlist Recommendation', definition: 'A concise recommendation on who should move forward' },
    { label: 'Candidate A Assessment', definition: 'Structured assessment of Sarah Whitfield against the role' },
    { label: 'Candidate B Assessment', definition: 'Structured assessment of Rajesh Patel against the role' },
    { label: 'Candidate C Assessment', definition: 'Structured assessment of Claire Donnelly against the role' },
    { label: 'Recommended Interview Focus', definition: 'What themes the interview panel should test across shortlisted candidates' },
    { label: 'Suggested Interview Questions', definition: 'A concise set of strong interview questions' },
    { label: 'Hiring Risks / Watchouts', definition: 'Potential concerns or gaps to validate in interviews' },
    { label: 'Next-Step Recommendation', definition: 'Suggested next hiring action for the panel' },
    { label: '', definition: '' },
  ],
};

// Made with Bob
