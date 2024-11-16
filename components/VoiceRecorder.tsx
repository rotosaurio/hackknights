import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceRecorder() {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [recipe, setRecipe] = useState('');

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
          if (data.recipe) {
            setRecipe(data.recipe);
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
                relative w-48 h-48 rounded-full 
                flex items-center justify-center 
                text-white transition-all duration-300 
                shadow-lg transform hover:scale-105
                ${isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                }
              `}
            >
              <div className="flex flex-col items-center">
                {isRecording ? (
                  <>
                    <FaStop className="text-4xl mb-3" />
                    <div className="font-bold text-xl">Detener</div>
                    <div className="text-sm mt-2 opacity-90">
                      Presiona para finalizar
                    </div>
                  </>
                ) : (
                  <>
                    <FaMicrophone className="text-4xl mb-3" />
                    <div className="font-bold text-xl">Iniciar</div>
                    <div className="text-sm mt-2 opacity-90">
                      Presiona para comenzar
                    </div>
                  </>
                )}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Área de transcripción */}
      <AnimatePresence>
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full mt-8"
          >
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Transcripción
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {transcription}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {recipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full mt-8"
        >
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Receta Sugerida
            </h3>
            <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
              {recipe}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}