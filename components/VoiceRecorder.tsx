import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from "react-icons/io";

export default function VoiceRecorder() {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [recipe, setRecipe] = useState('');
  const [showTranscription, setShowTranscription] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [activeWindow, setActiveWindow] = useState<'transcription' | 'recipe' | null>(null);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const startRecording = async () => {
    try {
      console.log('Iniciando grabación...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          channelCount: 1,
          sampleRate: 48000,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.start(500);
      setIsRecording(true);
      console.log('Grabación iniciada');
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        setIsRecording(false);
        
        const audioBlob = await new Promise<Blob>((resolve, reject) => {
          if (!mediaRecorderRef.current) return reject('No hay grabadora');
          
          mediaRecorderRef.current.onstop = () => {
            try {
              const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
              resolve(blob);
            } catch (error) {
              reject(error);
            }
          };
          
          mediaRecorderRef.current.stop();
        });

        const base64Audio = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        });

        const response = await fetch('/api/speech-to-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            audioData: base64Audio.split(',')[1],
            userName: JSON.parse(localStorage.getItem('user') || '{}').name 
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `Error en la respuesta: ${response.status}`);
        }
        
        if (data.text) {
          setTranscription(data.text);
          setShowTranscription(true);
          if (data.recipe) {
            setRecipe(data.recipe);
            setShowRecipe(true);
          }
        } else {
          throw new Error('No se recibió texto en la respuesta');
        }

      } catch (error) {
        console.error('Error al procesar el audio:', error);
        setTranscription('Error al procesar el audio. Por favor, intente nuevamente.');
      } finally {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          mediaRecorderRef.current = null;
        }
        chunksRef.current = [];
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <AnimatePresence>
        {isBrowser && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: isRecording ? [1, 1.2, 1] : 1,
                boxShadow: isRecording 
                  ? ['0 0 0 0 rgba(255,255,255,0.4)', '0 0 0 20px rgba(255,255,255,0)'] 
                  : '0 0 0 0 rgba(255,255,255,0)'
              }}
              transition={{
                duration: 2,
                repeat: isRecording ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full"
            />
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`
                relative w-12 h-12 rounded-full 
                flex items-center justify-center 
                text-white transition-all duration-300 
                shadow-lg transform hover:scale-105
                ${isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }
              `}
            >
              {isRecording ? (
                <FaStop className="text-xl" />
              ) : (
                <FaMicrophone className="text-xl" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor de ventanas flotantes con slider */}
      <AnimatePresence>
        {(showTranscription || showRecipe) && (
          <motion.div 
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0.2 }}
          >
            <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-2xl">
              {/* Barra superior con pestañas */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div className="flex gap-4">
                  {showTranscription && (
                    <button
                      onClick={() => setActiveWindow('transcription')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeWindow === 'transcription' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Transcripción
                    </button>
                  )}
                  {showRecipe && (
                    <button
                      onClick={() => setActiveWindow('recipe')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeWindow === 'recipe' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Receta
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setShowTranscription(false);
                    setShowRecipe(false);
                    setActiveWindow(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoMdClose size={24} />
                </button>
              </div>

              {/* Contenido con scroll */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {activeWindow === 'transcription' && (
                  <div className="text-gray-600 text-lg leading-relaxed">
                    {transcription}
                  </div>
                )}
                {activeWindow === 'recipe' && (
                  <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                    {recipe}
                  </div>
                )}
              </div>

              {/* Indicador de arrastre */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay oscuro */}
      <AnimatePresence>
        {(showTranscription || showRecipe) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => {
              setShowTranscription(false);
              setShowRecipe(false);
              setActiveWindow(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}