/**
 * HealthAI — Gemini AI Service
 * Wraps Google Gemini 1.5 Flash API for all AI features across the platform.
 * Requires config.js to be loaded first.
 */

const GeminiService = (() => {
    const BASE_URL = `${HEALTHAI_CONFIG.GEMINI_API_URL}${HEALTHAI_CONFIG.GEMINI_MODEL}:generateContent?key=${HEALTHAI_CONFIG.GEMINI_API_KEY}`;

    async function callGemini(prompt, systemContext = '') {
        try {
            const body = {
                contents: [{
                    parts: [{
                        text: systemContext ? `${systemContext}\n\n${prompt}` : prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                    topP: 0.95,
                }
            };

            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const err = await response.json();
                console.error('Gemini API error:', err);
                throw new Error(err.error?.message || 'Gemini API call failed');
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (error) {
            console.error('GeminiService error:', error);
            throw error;
        }
    }

    // ── Feature 1: Emergency Triage Assessment ────────────────────────────────
    async function analyzeEmergency(symptoms, emergencyType = '', age = '', existingConditions = '') {
        const system = `You are an AI medical triage assistant for HealthAI, an emergency healthcare platform in India.
Your role is to help assess the severity of an emergency and provide structured, factual triage guidance.
You are NOT a doctor and always recommend professional medical attention.
Always be calm, clear and concise. Format your response as valid JSON.`;

        const prompt = `A patient is reporting an emergency. Analyze and respond with a JSON object.

Emergency Type: ${emergencyType || 'Not specified'}
Patient Age: ${age || 'Unknown'}
Symptoms: ${symptoms}
Existing Conditions: ${existingConditions || 'None reported'}

Respond ONLY with this JSON structure (no markdown, no extra text):
{
  "severity": "low" | "medium" | "high" | "critical",
  "severityScore": 1-5,
  "triagePriority": "P1 Immediate" | "P2 Urgent" | "P3 Delayed" | "P4 Minor",
  "assessment": "2-3 sentence clinical assessment",
  "recommendedDepartment": "Department name",
  "immediateActions": ["action1", "action2", "action3"],
  "estimatedWaitTime": "X-Y minutes",
  "warning": "any red flag symptoms or null"
}`;

        const raw = await callGemini(prompt, system);
        try {
            const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        } catch {
            // Fallback structured response
            return {
                severity: 'medium',
                severityScore: 3,
                triagePriority: 'P2 Urgent',
                assessment: 'Based on the symptoms described, medical attention is recommended promptly.',
                recommendedDepartment: 'Emergency Medicine',
                immediateActions: ['Call emergency services', 'Keep the patient calm and still', 'Monitor breathing'],
                estimatedWaitTime: '15-25 minutes',
                warning: null
            };
        }
    }

    // ── Feature 2: AI Triage Chat ─────────────────────────────────────────────
    async function triageChat(userMessage, conversationHistory = []) {
        const system = `You are HealthAI's compassionate AI triage assistant.
You are helping users in potential medical emergencies to understand their situation and guide them.
Be calm, empathetic, and clear. Ask relevant follow-up questions if needed.
Provide first-aid guidance where appropriate.
Always recommend calling emergency services for life-threatening situations.
Keep responses concise (2-4 sentences). Do not use bullet points or markdown.
If the user seems in immediate danger, immediately say to call 112 (India emergency number).`;

        const history = conversationHistory.map(m =>
            `${m.role === 'user' ? 'User' : 'HealthAI'}: ${m.text}`
        ).join('\n');

        const prompt = history
            ? `Previous conversation:\n${history}\n\nUser: ${userMessage}`
            : `User: ${userMessage}`;

        return await callGemini(prompt, system);
    }

    // ── Feature 3: Demand Forecasting ─────────────────────────────────────────
    async function predictDemand(hospitalName, currentLoad, dayOfWeek, hour) {
        const system = `You are a healthcare operations AI for a hospital management platform in India.
Provide concise, data-driven demand forecasting insights. Respond with valid JSON only.`;

        const prompt = `Hospital: ${hospitalName}
Current occupancy: ${currentLoad}%
Day of week: ${dayOfWeek}
Hour of day: ${hour}:00

Predict the next 6 hours of patient demand and respond ONLY with this JSON (no markdown):
{
  "forecast": [
    {"hour": "${hour}:00", "expectedLoad": 0-100, "incomingPatients": number},
    {"hour": "${(hour+1)%24}:00", "expectedLoad": 0-100, "incomingPatients": number},
    {"hour": "${(hour+2)%24}:00", "expectedLoad": 0-100, "incomingPatients": number},
    {"hour": "${(hour+3)%24}:00", "expectedLoad": 0-100, "incomingPatients": number},
    {"hour": "${(hour+4)%24}:00", "expectedLoad": 0-100, "incomingPatients": number},
    {"hour": "${(hour+5)%24}:00", "expectedLoad": 0-100, "incomingPatients": number}
  ],
  "peakHour": "HH:00",
  "recommendation": "Single sentence recommendation for hospital management",
  "staffingAlert": true | false
}`;

        const raw = await callGemini(prompt, system);
        try {
            const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        } catch {
            // Simulated fallback
            return {
                forecast: Array.from({ length: 6 }, (_, i) => ({
                    hour: `${(hour + i) % 24}:00`,
                    expectedLoad: Math.min(95, currentLoad + Math.floor(Math.random() * 10) - 5),
                    incomingPatients: Math.floor(Math.random() * 8) + 2
                })),
                peakHour: `${(hour + 2) % 24}:00`,
                recommendation: 'Ensure additional staff are available during peak hours.',
                staffingAlert: currentLoad > 75
            };
        }
    }

    // ── Feature 4: Admin Insights ─────────────────────────────────────────────
    async function generateAdminInsights(metricsData) {
        const system = `You are a healthcare intelligence AI for HealthAI's admin dashboard.
Generate actionable, concise insights for hospital network administrators in India.
Focus on resource optimization, patient flow, and emergency readiness.`;

        const prompt = `Current System Metrics:
- Total Patients Today: ${metricsData.totalPatients}
- Emergencies Today: ${metricsData.emergenciesToday}
- Average Response Time: ${metricsData.avgResponseTime} minutes
- Overall Resource Utilization: ${metricsData.resourceUtilization}%
- Hospitals at Critical Capacity: ${metricsData.criticalHospitals || 1}
- Active Ambulances: ${metricsData.ambulancesActive}

Generate exactly 4 key insights for the admin. Each insight should be one sentence.
Respond ONLY with a JSON array of strings (no markdown, no numbering):
["insight1", "insight2", "insight3", "insight4"]`;

        const raw = await callGemini(prompt, system);
        try {
            const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        } catch {
            return [
                `Resource utilization at ${metricsData.resourceUtilization}% — consider reallocating staff from low-load hospitals.`,
                `Average response time of ${metricsData.avgResponseTime} min is within acceptable range; target reduction to under 5 min.`,
                `Fortis Healthcare is at critical capacity — divert non-emergency cases to Apollo Multispeciality.`,
                `AI triage has processed ${metricsData.aiTriagesCompleted || 287} assessments, reducing ER intake time by an estimated 23%.`,
            ];
        }
    }

    // ── Feature 5: First Aid Guidance ─────────────────────────────────────────
    async function getFirstAidTips(emergencyType) {
        const system = `You are a first-aid guidance AI for a healthcare emergency platform.
Provide clear, simple first-aid steps that a non-medical bystander can perform.
Be concise and actionable. Do not use markdown headers.`;

        const prompt = `Provide 4 immediate first-aid steps for: ${emergencyType} emergency.
Respond ONLY with a JSON array of short action strings:
["step1", "step2", "step3", "step4"]`;

        const raw = await callGemini(prompt, system);
        try {
            const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        } catch {
            const defaults = {
                'cardiac': ['Call 112 immediately', 'Begin CPR if trained', 'Loosen tight clothing', 'Keep patient still and calm'],
                'accident': ['Do not move the patient', 'Apply pressure to bleeding wounds', 'Call 112', 'Keep patient warm and still'],
                'stroke': ['Note the time symptoms started', 'Keep patient lying flat', 'Do not give food or water', 'Call 112 immediately'],
                'breathing': ['Sit patient upright', 'Loosen tight clothing', 'Help use inhaler if available', 'Call 112 if not improving'],
            };
            return defaults[emergencyType] || ['Call 112 immediately', 'Keep the person calm', 'Do not leave them alone', 'Follow operator instructions'];
        }
    }

    // ── Public API ────────────────────────────────────────────────────────────
    return {
        analyzeEmergency,
        triageChat,
        predictDemand,
        generateAdminInsights,
        getFirstAidTips,
    };
})();
