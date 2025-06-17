import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Waveform } from 'lucide-react';

interface VoiceInputProps {
  isRecording: boolean;
  onTranscript: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ isRecording, onTranscript }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate voice recognition (in a real app, you'd use Web Speech API or similar)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      setIsListening(true);
      
      // Simulate audio level fluctuations
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);

      // Simulate transcript updates
      const phrases = [
        "I think artificial intelligence has tremendous potential in healthcare...",
        "However, we need to consider the ethical implications...",
        "Data privacy is a major concern that needs to be addressed...",
        "The accuracy of AI diagnosis is impressive, but human oversight is crucial...",
        "Cost-effectiveness should also be a key consideration..."
      ];

      const simulateTranscript = () => {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setTranscript(randomPhrase);
        onTranscript(randomPhrase);
      };

      // Simulate speaking after 2-5 seconds of recording
      const transcriptTimeout = setTimeout(simulateTranscript, 2000 + Math.random() * 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(transcriptTimeout);
      };
    } else {
      setIsListening(false);
      setAudioLevel(0);
      if (transcript) {
        setTranscript('');
      }
    }
  }, [isRecording, onTranscript, transcript]);

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Voice Input</h3>
        <div className="flex items-center space-x-2">
          {isListening ? (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="text-sm font-medium">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-1 h-20 bg-gray-50 rounded-xl">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={index}
              className="w-2 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full"
              animate={{
                height: isRecording 
                  ? `${Math.random() * audioLevel/2 + 10}px`
                  : '4px'
              }}
              transition={{
                duration: 0.1,
                repeat: isRecording ? Infinity : 0,
                repeatType: 'mirror'
              }}
            />
          ))}
        </div>
      </div>

      {/* Microphone Button */}
      <div className="text-center mb-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 ${
            isRecording 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {isRecording ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </motion.div>
      </div>

      {/* Live Transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500"
        >
          <div className="flex items-start space-x-2">
            <Volume2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">You said:</p>
              <p className="text-gray-800">{transcript}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {isRecording 
            ? 'Speak clearly into your microphone. Your voice is being processed...'
            : 'Click the record button in the control panel to start speaking'
          }
        </p>
      </div>

      {/* Voice Quality Indicators */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-green-50 rounded-lg">
          <p className="text-lg font-bold text-green-600">Good</p>
          <p className="text-xs text-gray-600">Volume</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-600">Clear</p>
          <p className="text-xs text-gray-600">Clarity</p>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg">
          <p className="text-lg font-bold text-purple-600">Steady</p>
          <p className="text-xs text-gray-600">Pace</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;