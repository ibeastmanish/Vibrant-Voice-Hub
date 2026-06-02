export const mockGmailPayload = `
From: Guest <guest@example.com>
Subject: Requesting tier upgrade and checking active order pass for the Global Tech Summit
Date: Today

Hello Vyntra Support,

I'm writing because I recently accumulated enough points for the Platinum tier, but my dashboard still shows VIP. 
Also, could you please confirm that my active order (CUST-90210) for the Global Tech Summit pass is fully processed and active? I want to make sure I don't run into issues at the door.

Thanks,
Guest
`;

export const mockZoomTranscriptPayload = `
[00:00:15] Guest: Hi, I'm calling about my recent subscription charge.
[00:00:22] Agent: Hello Guest! I can certainly help with that. What seems to be the issue?
[00:00:28] Guest: I was charged yesterday, but I meant to cancel before the billing cycle. I'd like a refund please.
[00:00:35] Agent: I completely understand. Let me check your account. Yes, I see the charge here. 
[00:00:45] Agent: Since you haven't used the service this cycle, I can process that refund for you right now.
[00:00:52] Guest: Thank you, I really appreciate it.
`;

export const mockGmailExtractionPipeline = [
    {
        step: "INGEST",
        message: "Payload received from Gmail Sync API",
        data: { source: "Gmail", timestamp: new Date().toISOString() }
    },
    {
        step: "ANALYSIS",
        message: "Routing through LLM for Intent Classification",
        data: { model: "gpt-4o-mini", latency: "105ms" }
    },
    {
        step: "EXTRACTION",
        message: "LLM Extracted Entities and Intents",
        data: { 
            extracted_intent: "TIER_UPGRADE_AND_ORDER_VERIFICATION",
            detected_entities: ["Platinum Tier", "Global Tech Summit", "CUST-90210"],
            sentiment: "Neutral/Inquiring"
        }
    },
    {
        step: "MUTATION",
        message: "Applying required UI mutations to Context",
        data: { 
            loyaltyTier: "Platinum", 
            loyaltyPoints: 15000, 
            status: "Active - VIP Confirmed"
        }
    }
];

export const mockZoomExtractionPipeline = [
    {
        step: "INGEST",
        message: "Payload received from Zoom Transcript Sync API",
        data: { source: "Zoom", timestamp: new Date().toISOString() }
    },
    {
        step: "ANALYSIS",
        message: "Routing through LLM for Intent Classification",
        data: { model: "gpt-4o-mini", latency: "112ms" }
    },
    {
        step: "EXTRACTION",
        message: "LLM Extracted Entities and Intents",
        data: { 
            extracted_intent: "SUBSCRIPTION_REFUND",
            detected_entities: ["Subscription Charge", "Refund Processed"],
            sentiment: "Resolved"
        }
    },
    {
        step: "MUTATION",
        message: "Applying required UI mutations to Context",
        data: { 
            status: "Refund Processed",
            recentQuery: "Subscription refund request handled via Zoom."
        }
    }
];
