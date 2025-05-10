
import { useEffect, useRef, useState } from 'react';

type QrScannerProps = {
  onScan: (result: string) => void;
};

export const QrScannerComponent = ({ onScan }: QrScannerProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerAnimationRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  
  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;
    
    const startScan = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setScanning(true);
          scanFrame();
        }
      } catch (err) {
        setErrorMessage("Unable to access camera. Please ensure you have granted camera permissions.");
        console.error("Error accessing camera:", err);
      }
    };
    
    const scanFrame = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // In a real app, we'd process this with a QR code library like jsQR
        // For this demo, we'll simulate detecting a QR code after a few seconds
        setTimeout(() => {
          if (scanning) {
            // Simulate finding a QR code
            onScan("cert-abc-123-xyz-789");
            setScanning(false);
          }
        }, 3000);
      }
      
      // Continue scanning
      if (scanning) {
        animationFrameId = requestAnimationFrame(scanFrame);
      }
    };
    
    startScan();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setScanning(false);
    };
  }, [onScan]);
  
  return (
    <div className="relative rounded-lg overflow-hidden">
      <video 
        ref={videoRef}
        className="w-full h-96 object-cover bg-black"
        playsInline
        muted
      />
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full hidden"
      />
      
      {/* Scanning animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64 border-2 border-primary rounded-lg">
          {/* Animated scan line */}
          <div 
            ref={scannerAnimationRef}
            className="absolute left-0 right-0 h-0.5 bg-primary top-0 animate-[scanLine_2s_linear_infinite]"
            style={{
              animation: "scanLine 2s ease-in-out infinite",
              boxShadow: "0 0 8px 2px rgba(37, 99, 235, 0.5)"
            }}
          />
          
          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary" />
        </div>
      </div>
      
      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-white p-4 rounded-lg max-w-xs text-center">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes scanLine {
            0% {
              top: 0%;
            }
            50% {
              top: calc(100% - 2px);
            }
            100% {
              top: 0%;
            }
          }
        `}
      </style>
    </div>
  );
};
