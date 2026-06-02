import { useAppContext } from '../context/AppContext';
import { useVoiceContext } from '../context/VoiceContext';
import { mockGmailExtractionPipeline, mockZoomExtractionPipeline, mockGmailPayload, mockZoomTranscriptPayload } from '../utils/workspaceMock';

export const useDataPipeline = () => {
  const { setActiveOrder } = useAppContext();
  const { setAuditLogs } = useVoiceContext() as any; // Cast to any because setAuditLogs wasn't exported in the interface, we'll fix VoiceContext or use a workaround

  const runDataSync = async (type: 'gmail' | 'zoom') => {
    const pipeline = type === 'gmail' ? mockGmailExtractionPipeline : mockZoomExtractionPipeline;
    const rawPayload = type === 'gmail' ? mockGmailPayload : mockZoomTranscriptPayload;

    // Log the raw incoming text block first
    setAuditLogs((prev: any) => [...prev, {
        step: "RAW_INGESTION",
        message: `Incoming ${type.toUpperCase()} Payload Stream`,
        data: rawPayload
    }]);

    // Stream the processing pipeline steps with realistic delays
    for (let i = 0; i < pipeline.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150)); // 150ms gap
        setAuditLogs((prev: any) => [...prev, pipeline[i]]);
    }

    // Final UI Mutation
    if (type === 'gmail') {
        setActiveOrder((prev: any) => {
            const current = prev || {
                id: "CUST-90210",
                customerName: "Guest",
                joinDate: "2023-11-15",
                email: "guest@example.com",
                phone: "+1 (555) 019-8372",
                ltv: "$4,250",
            };
            return {
                ...current,
                status: "Active - VIP Confirmed",
                loyaltyTier: "Platinum",
                loyaltyPoints: 15000,
                lastEvent: "Global Tech Summit",
                supportTier: "Platinum",
                recentQuery: "Tier upgrade & Order verification (via Gmail)"
            };
        });
    } else {
        setActiveOrder((prev: any) => {
            const current = prev || {
                id: "CUST-90210",
                customerName: "Guest",
                joinDate: "2023-11-15",
                email: "guest@example.com",
                phone: "+1 (555) 019-8372",
                ltv: "$4,250",
                loyaltyTier: "VIP",
                loyaltyPoints: 12500,
                lastEvent: "Global Tech Summit",
                supportTier: "VIP",
            };
            return {
                ...current,
                status: "Refund Processed",
                recentQuery: "Subscription refund request (via Zoom Transcript)"
            };
        });
    }
  };

  return { runDataSync };
};
