import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ConversationProvider, useConversation } from '@elevenlabs/react';
import { useAppContext } from './AppContext';
import confetti from 'canvas-confetti';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

interface VoiceContextProps {
  voiceState: VoiceState;
  waveformLevels: number[];
  startListening: () => void;
  stopListening: () => void;
  triggerSimulatedIntent: (text: string) => void;
  transcription: string;
}

const VoiceContext = createContext<VoiceContextProps | undefined>(undefined);

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID || '';
  return (
    <ConversationProvider agentId={agentId}>
      <VoiceContextInner>{children}</VoiceContextInner>
    </ConversationProvider>
  );
};

const VoiceContextInner = ({ children }: { children: React.ReactNode }) => {
  const { setActiveBrand, setActiveView } = useAppContext();
  const [waveformLevels, setWaveformLevels] = useState<number[]>(Array(24).fill(0.1));
  const [transcription, setTranscription] = useState<string>('');

  const conversation = useConversation({
    onMessage: (message: any) => {
      // The transcript object might contain user or agent text.
      if (message.source === 'user' && message.text) {
        setTranscription(message.text);
        triggerSimulatedIntent(message.text);
      } else if (message.source === 'agent' && message.text) {
        setTranscription(message.text);
        triggerSimulatedIntent(message.text);
      }
    },
    onError: (err: any) => {
      console.error('ElevenLabs Error:', err);
    }
  });

  const { status, startSession, endSession, getInputVolume, getOutputVolume, isSpeaking } = conversation;

  // Map ElevenLabs status to our VoiceState
  const voiceState: VoiceState = 
    status === 'connecting' ? 'processing' :
    status === 'connected' ? 'listening' :
    'idle';

  useEffect(() => {
    // Waveform simulation / live volume polling
    let animationFrameId: number;

    const updateWaveform = () => {
      if (status === 'connected') {
        const inputVol = getInputVolume();
        const outputVol = getOutputVolume();
        const activeVol = isSpeaking ? outputVol : inputVol;
        
        // Generate a smooth responsive waveform based on the active volume
        const newLevels = Array(24).fill(0).map(() => {
          const base = 0.1;
          const randomFactor = Math.random() * 0.3;
          // Scale active volume (0-1) nicely
          return Math.min(1, Math.max(base, activeVol * 2 + randomFactor));
        });
        
        // Smooth transition
        setWaveformLevels(prev => prev.map((p, i) => p * 0.6 + newLevels[i] * 0.4));
      } else {
        // Idle heartbeat
        const time = Date.now() / 1000;
        const newLevels = Array(24).fill(0).map((_, i) => {
          return 0.2 + Math.sin(time * 2 + i * 0.5) * 0.05;
        });
        setWaveformLevels(newLevels);
      }

      animationFrameId = requestAnimationFrame(updateWaveform);
    };

    updateWaveform();
    return () => cancelAnimationFrame(animationFrameId);
  }, [status, isSpeaking, getInputVolume, getOutputVolume]);

  const triggerSimulatedIntent = useCallback((text: string) => {
    const lowerText = text.toLowerCase();

    // Fire confetti for ticket bookings
    if (/(book|buy|reserve|ticket|redeem)/i.test(lowerText)) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0055', '#00ffaa', '#00f0ff']
      });
    }

    if (/(lovable|credit)/i.test(lowerText)) {
      setActiveBrand('Lovable');
    } else if (/(stitch|drop|catalog)/i.test(lowerText)) {
      setActiveBrand('Stitch');
    } else if (/(anti|gravity|home|main)/i.test(lowerText) && !lowerText.includes('ticket')) {
      setActiveBrand('AntiGravity');
    }
    
    // View changes
    if (/(event|arena|happening|show)/i.test(lowerText)) {
      setActiveView('Events');
    } else if (/(admin|insight|telemetry)/i.test(lowerText)) {
      setActiveView('Admin');
    } else if (/(ticket|pass)/i.test(lowerText)) {
      setActiveView('Tickets');
    }
  }, [setActiveBrand, setActiveView]);

  const handleStartListening = async () => {
    try {
      await startSession();
    } catch (e) {
      console.error('Failed to start session', e);
    }
  };

  return (
    <VoiceContext.Provider value={{
      voiceState,
      waveformLevels,
      startListening: handleStartListening,
      stopListening: endSession,
      triggerSimulatedIntent,
      transcription
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoiceContext = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoiceContext must be used within a VoiceProvider');
  }
  return context;
};
