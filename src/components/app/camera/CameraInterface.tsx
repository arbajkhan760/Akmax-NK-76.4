
"use client";

import type { FC } from 'react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  Zap, ZapOff, RefreshCw, Timer, Grid, Camera as CameraIcon, Video, RadioTower, Layers,
  Sparkles, Wand2, Music2, Type, SmilePlus, Scissors, Link2, MoreVertical, Play, StopCircle,
  ZoomIn, ZoomOut, Sun, Moon, ChevronDown, X, Settings2, Users, MessageCircle as MessageCircleIcon, Heart, Gift,
  Film,
  Footprints,
  Mic,
  Info,
  Focus, // For Focus Lock / Sharpen
  Aperture, // For Cinematic/Depth
  Maximize, // For Ultra-Wide (can also use ZoomOut)
  Minimize, // For Telephoto (can also use ZoomIn)
  Droplet, // For Dolby Vision / HDR / Color
  AudioLines, // For Spatial Audio
  VideoIcon, // Generic video icon for ProRes/Quality
  CloudLightning, // For Smart HDR / Enhance
  Palette, // For Color Balance / Filters
  GalleryHorizontalEnd // Added Gallery icon
} from 'lucide-react';
import type { CameraMode } from '@/types/camera';
import Image from 'next/image';

// Mock data for effects and music
const mockFilters = ["None", "Vivid", "Dramatic", "Silvertone", "Noir", "Cinematic"];
const mockArLenses = ["Dog Ears", "Heart Crown", "Glasses", "Face Swap (Demo)", "Anime Style (Demo)"];
const mockBeautyTools = ["Smooth Skin", "Contour", "Whitening", "Face Reshape"];
const mockMusicTracks = ["Trending Sound 1", "Upbeat Pop", "Chill Lo-fi", "Funny Voiceover"];

// Define valid resolution types
type Resolution = '1080p' | '4K';
type Lens = 'wide' | 'ultrawide' | 'telephoto';


const CameraInterface: FC = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for canvas operations
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [currentMode, setCurrentMode] = useState<CameraMode>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [timerDuration, setTimerDuration] = useState(0);

  // States for new simulated features
  const [isHDRActive, setIsHDRActive] = useState(false);
  const [isNightModeActive, setIsNightModeActive] = useState(false);
  const [currentResolution, setCurrentResolution] = useState<Resolution>('1080p');
  const [isProResActive, setIsProResActive] = useState(false);
  const [currentLens, setCurrentLens] = useState<Lens>('wide');
  const [isSpatialAudioActive, setIsSpatialAudioActive] = useState(false);
  const [isCinematicModeActive, setIsCinematicModeActive] = useState(false);
  const [isActionModeActive, setIsActionModeActive] = useState(false);

  // States for simulated enhancement features
  const [isProModeActive, setIsProModeActive] = useState(false); // Rename Smart Enhance
  const [isSharpenActive, setIsSharpenActive] = useState(false);
  const [isNoiseReductionActive, setIsNoiseReductionActive] = useState(false); // Represented by low light/moon icon maybe


  const cleanupStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
          track.stop();
          console.log(`Track stopped: ${track.kind} (${track.label})`);
        });
      videoRef.current.srcObject = null;
      console.log("Previous stream cleaned up.");
    }
  }, []);

  // --- Request Camera Permission and Setup ---
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const setupCamera = async () => {
      console.log(`Attempting to set up camera with facingMode: ${facingMode}`);
      // 1. Cleanup any existing stream first - CRITICAL to prevent NotReadableError
      cleanupStream();
      // Give the browser a moment to release the hardware (might help in some cases)
      await new Promise(resolve => setTimeout(resolve, 50));

      if (!isMounted) return; // Check again after potential delay

      // 2. Define constraints based on current state
      let constraints: MediaStreamConstraints = {
          video: {
            facingMode: facingMode,
             // Use ideal constraints - browser will try its best
             width: { ideal: 1920 },
             height: { ideal: 1080 },
             frameRate: { ideal: 30 }
          },
          // Request audio only if necessary for the current mode
          audio: ['reel', 'story_video', 'live', 'vlog'].includes(currentMode)
        };
       console.log("Requesting getUserMedia with constraints:", JSON.stringify(constraints));


      // 3. Request Camera Access
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
         if (!isMounted) {
             stream.getTracks().forEach(track => track.stop()); // Cleanup if component unmounted during request
             return;
         }
        console.log(`Camera stream acquired successfully (facing: ${facingMode}).`);
        setHasCameraPermission(true);

        // 4. Attach Stream to Video Element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true; // Important for preventing feedback
          await videoRef.current.play(); // Attempt to play
          console.log("Video stream attached and playing.");
        } else {
             console.warn("Video ref not available after stream acquisition.");
             stream.getTracks().forEach(track => track.stop()); // Cleanup if ref is missing
             return;
        }

        // 5. Initialize MediaRecorder if required by mode
        if (['reel', 'story_video', 'live', 'vlog'].includes(currentMode)) {
           if (stream.getAudioTracks().length === 0) {
               console.warn("Audio track missing, recording might be video-only.");
           }
           try {
               // Check supported mime types
               let options = { mimeType: 'video/webm;codecs=vp9' };
               if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                   console.warn('video/webm;codecs=vp9 not supported, trying default.');
                   options = { mimeType: '' }; // Let browser choose default
               }
               const recorder = new MediaRecorder(stream, options);
               recorder.ondataavailable = (event) => {
                  if (event.data.size > 0 && isMounted) { // Check isMounted
                    setRecordedChunks((prev) => [...prev, event.data]);
                  }
               };
               setMediaRecorder(recorder);
               console.log(`MediaRecorder initialized. MimeType: ${recorder.mimeType || 'default'}`);
           } catch (recorderError: any) {
                console.error("Error initializing MediaRecorder:", recorderError);
                setMediaRecorder(null);
                if (isMounted) {
                    toast({ variant: "destructive", title: "Recording Unavailable", description: recorderError.message || "Video recording might not be fully supported." });
                }
           }
        } else {
            setMediaRecorder(null); // Ensure it's null for photo modes
        }

        // 6. Check capabilities (optional logging)
         const videoTrack = stream.getVideoTracks()[0];
           if (videoTrack && 'getCapabilities' in videoTrack) {
               const capabilities = videoTrack.getCapabilities();
               console.log("Camera Capabilities:", capabilities);
           }

      } catch (error: any) {
        console.error(`Error accessing camera (facing: ${facingMode}):`, error.name, error.message);
         if (!isMounted) return; // Don't update state if unmounted

        setHasCameraPermission(false);
        let description = 'Could not access the camera. Please ensure permissions are granted and refresh.';
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          description = 'Camera permission denied. Please enable it in browser settings and refresh.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
           description = `No camera found for mode '${facingMode}', or it's unavailable.`;
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            // More specific message for NotReadableError
            description = 'Camera is currently in use by another app or tab, or a hardware error occurred. Please close other apps/tabs using the camera and try again.';
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
            description = `Requested camera settings (e.g., resolution) are not supported by this '${facingMode}' camera.`;
        } else if (error.name === 'AbortError') {
            description = 'Camera request was aborted, possibly due to a conflict or quick user action.';
        } else if (error.name === 'TypeError') {
             description = 'Invalid camera constraints provided.';
        }
        toast({
          variant: 'destructive',
          title: 'Camera Access Failed',
          description: description,
          duration: 10000, // Show error longer
        });
      }
    };

    // Trigger camera setup only when necessary:
    // - Initial load (hasCameraPermission === null)
    // - facingMode changes
    // - currentMode changes (to potentially add/remove audio or recorder)
    setupCamera();

    // Cleanup function
    return () => {
      isMounted = false; // Set flag when component unmounts
      console.log("CameraInterface cleanup: stopping tracks and recorder.");
      cleanupStream();
       if (mediaRecorder && mediaRecorder.state !== 'inactive') {
           try {
               mediaRecorder.stop();
           } catch (e) {
              console.warn("Error stopping media recorder during cleanup:", e);
           }
       }
       setMediaRecorder(null);
       setRecordedChunks([]); // Clear chunks on cleanup
    };
  }, [facingMode, currentMode, cleanupStream, toast]); // Dependencies


  const handleFlipCamera = () => {
    if (isRecording) {
        toast({ title: "Cannot flip while recording", variant: "destructive" });
        return;
    }
    console.log("Flipping camera...");
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    // The useEffect hook will handle stream cleanup and requesting the new camera
  };

   const toggleFlash = async () => {
        const newState = !isFlashOn;
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const track = stream.getVideoTracks()[0];

            // Check if the track supports torch capability
            if (track && 'applyConstraints' in track && track.getCapabilities().torch) {
                try {
                     await track.applyConstraints({ advanced: [{ torch: newState }] });
                     setIsFlashOn(newState); // Update state only on success
                     console.log(`Flash ${newState ? 'ON' : 'OFF'}`);
                     toast({ title: `Flash ${newState ? 'On' : 'Off'}` });
                } catch(e) {
                    console.error("Failed to toggle flash:", e);
                    toast({ variant: 'destructive', title: "Flash Error", description: "Could not change flash setting." });
                }
            } else {
                console.warn("Flash control not supported by this device/browser or track doesn't have the capability.");
                toast({ variant: 'destructive', title: "Flash Not Supported", description: "This camera does not support flash control." });
                // Don't change the state if not supported
            }
        } else {
            console.warn("No active video stream to control flash.");
            // Optionally, update UI state to off if stream is lost?
            // setIsFlashOn(false);
        }
    };

  const handleCapture = async () => {
    // Photo Modes
    if (currentMode === 'photo' || currentMode === 'story_photo') {
      if (videoRef.current && videoRef.current.readyState >= videoRef.current.HAVE_CURRENT_DATA) { // Check if video has data
        const canvas = canvasRef.current || document.createElement('canvas');
        if (!canvasRef.current) canvasRef.current = canvas; // Assign to ref if created dynamically

        // Use native video dimensions for best quality capture
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');

        if (context) {
          try {
              // Clear previous drawings
              context.clearRect(0, 0, canvas.width, canvas.height);

              // Flip horizontally if using front camera for a natural selfie
              if (facingMode === 'user') {
                  context.save(); // Save current state
                  context.translate(canvas.width, 0);
                  context.scale(-1, 1);
              }

              // Draw the video frame to the canvas
              context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

              // Restore context if flipped
              if (facingMode === 'user') {
                   context.restore(); // Restore original state
              }


              // Apply simulated filters for visual effect only
              let filtersApplied = '';
              if (isHDRActive) filtersApplied += 'contrast(1.2) saturate(1.1) ';
              if (isSharpenActive) filtersApplied += 'contrast(1.05) brightness(1.02) ';
              if (isProModeActive) filtersApplied += 'sepia(0.05) '; // Example 'pro' effect
              if (isCinematicModeActive) filtersApplied += 'saturate(1.15) contrast(1.1) ';
              if (isNoiseReductionActive) filtersApplied += 'brightness(1.1) contrast(0.95) '; // Simulates noise reduction

              if (filtersApplied.trim()) {
                  console.log("Applying simulated filters:", filtersApplied.trim());
                   context.filter = filtersApplied.trim();
                   // Re-draw the *already captured frame* with filters - this might not work as intended without re-capturing
                   // A better approach might involve shaders or libraries like CamanJS/FabricJS for complex filters
                   context.drawImage(canvas, 0, 0); // Draw the canvas onto itself with filter
                   context.filter = 'none'; // Reset filter
              }

              // Get data URL (using PNG for potentially higher quality than JPEG)
              const dataUrl = canvas.toDataURL('image/png');
              console.log('Photo captured (simulated enhancements):', dataUrl.substring(0, 30) + "...");
              toast({ title: "Photo Captured!", description: "Simulated enhancements applied." });
              // TODO: Handle upload/display of dataUrl -> navigate to preview/edit screen

          } catch (e) {
              console.error("Error capturing photo:", e);
              toast({ variant: "destructive", title: "Capture Error", description: "Could not capture photo." });
          }
        } else {
           console.error("Could not get 2D context from canvas.");
           toast({ variant: "destructive", title: "Capture Error", description: "Canvas context unavailable." });
        }
      } else {
           console.warn("Video element not ready for capture.");
           toast({ variant: "destructive", title: "Capture Failed", description: "Camera not ready." });
      }
    }
    // Video Modes
    else if (currentMode === 'reel' || currentMode === 'story_video' || currentMode === 'vlog') {
      if (mediaRecorder) {
        if (!isRecording) {
          // Start recording
          setRecordedChunks([]); // Clear previous chunks
          try {
                mediaRecorder.start();
                setIsRecording(true);
                console.log("Recording started. Recorder state:", mediaRecorder.state);
                toast({ title: "Recording Started" });
          } catch(e) {
                console.error("Error starting media recorder:", e);
                toast({variant: "destructive", title: "Recording Error", description: "Could not start recording."});
          }
        } else {
          // Stop recording
          // Check if recorder is actually recording before stopping
          if (mediaRecorder.state === "recording") {
              try {
                  mediaRecorder.stop(); // This triggers the ondataavailable event
                  console.log("Recording stopped. Recorder state:", mediaRecorder.state);
                   // Processing chunks is moved to useEffect listening on recordedChunks
              } catch (e) {
                   console.error("Error stopping media recorder:", e);
                   toast({variant: "destructive", title: "Recording Error", description: "Could not stop recording properly."});
              }
          } else {
             console.warn("Stop recording called, but recorder state was:", mediaRecorder.state);
          }
          setIsRecording(false); // Update UI state regardless of potential errors
        }
      } else {
          console.error("MediaRecorder not initialized for video mode.");
          toast({variant: "destructive", title: "Error", description: "Recording is not available."});
      }
    }
    // Live Mode
    else if (currentMode === 'live') {
        setIsRecording(!isRecording); // Toggle state
        toast({ title: isRecording ? "Live Stream Ended" : "Live Stream Started (Simulated)" });
        // TODO: Implement actual live streaming logic (connect to streaming server)
        if (!isRecording) {
            console.log("Starting simulated live stream...");
        } else {
            console.log("Ending simulated live stream...");
        }
    }
  };

   // Effect to process recorded video chunks when recording stops
    useEffect(() => {
        if (!isRecording && recordedChunks.length > 0) {
            console.log(`Processing ${recordedChunks.length} recorded chunks.`);
            // Determine mimeType - ideally based on recorder's mimeType if available
            const mimeType = mediaRecorder?.mimeType || 'video/webm'; // Fallback to webm
            const blob = new Blob(recordedChunks, { type: mimeType });
            const url = URL.createObjectURL(blob);
            console.log('Video recorded:', url, 'Type:', mimeType, 'Size:', blob.size);
            toast({ title: "Recording Stopped", description: "Video ready (simulated)." });
            // TODO: Handle upload/display of video url -> navigate to preview/edit screen

            // Important: Clear chunks after processing
            setRecordedChunks([]);
        }
    }, [isRecording, recordedChunks, toast, mediaRecorder?.mimeType]);

   const renderModeSpecificControls = () => {
    if (currentMode === 'reel' || currentMode === 'vlog') {
      return (
        <div className="flex gap-2 absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-20">
          {[0.3, 0.5, 1, 2, 3].map(s => (
            <Button key={s} variant={speed === s ? "secondary" : "ghost"} size="sm" onClick={() => setSpeed(s)} className="text-xs text-white bg-black/30 hover:bg-white/20 rounded-full h-7 w-7 p-0 backdrop-blur-sm">
              {s}x
            </Button>
          ))}
        </div>
      );
    }
    return null;
  };

  // Trigger file input click
  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          console.log("File selected:", file.name, file.type);
          toast({ title: "File Selected", description: `${file.name}` });
          // TODO: Process the selected file (e.g., navigate to preview/edit screen)
          // Example: Generate preview URL
          const previewUrl = URL.createObjectURL(file);
          console.log("File Preview URL:", previewUrl);
          // In a real app: navigate to an edit screen with the file/URL
          // Example: router.push(`/edit?file=${encodeURIComponent(previewUrl)}&type=${file.type}`);

          // Reset file input value to allow selecting the same file again
          event.target.value = '';
      }
  };


  return (
    <>
      {/* Ensure this container takes full screen height and width */}
      <div className="relative h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
        {hasCameraPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
            <Alert variant="destructive" className="max-w-sm">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                AK Reels needs camera access. Please enable it in your browser settings and refresh the page. If the camera is already in use by another app, please close it.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Video element covers the entire container */}
        {/* Always show video tag irrespective of hasCameraPermission check to prevent race condition */}
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline />
        <canvas ref={canvasRef} className="hidden"></canvas> {/* Hidden canvas for capturing */}


        {/* Top Controls Overlay - Render only if permission granted */}
        {hasCameraPermission === true && (
         <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 p-1 bg-black/40 rounded-lg backdrop-blur-sm">
            <Button variant="ghost" size="icon" onClick={handleFlipCamera} className="text-white hover:bg-white/20 h-8 w-8"> <RefreshCw className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={toggleFlash} className="text-white hover:bg-white/20 h-8 w-8"> {isFlashOn ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4" />} </Button>
            {/* HDR Toggle */}
            <Button variant="ghost" size="icon" onClick={() => { setIsHDRActive(!isHDRActive); toast({title: `HDR ${!isHDRActive ? 'On' : 'Off'} (Simulated)`}) }} className={`text-white hover:bg-white/20 h-8 w-8 ${isHDRActive ? 'text-yellow-400' : ''}`}> <Droplet className="h-4 w-4" /><span className="sr-only">HDR</span></Button>
            {/* Night Mode Toggle */}
            <Button variant="ghost" size="icon" onClick={() => { setIsNoiseReductionActive(!isNoiseReductionActive); toast({title: `Low Light Boost ${!isNoiseReductionActive ? 'On' : 'Off'} (Simulated)`}) }} className={`text-white hover:bg-white/20 h-8 w-8 ${isNoiseReductionActive ? 'text-blue-400' : ''}`}> <Moon className="h-4 w-4" /><span className="sr-only">Night Mode</span></Button>
            {/* Video Quality Sheet */}
            <Sheet>
                <SheetTrigger asChild>
                     <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8"> <VideoIcon className="h-4 w-4" /><span className="sr-only">Quality</span></Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[260px] sm:w-[320px] bg-background/90 backdrop-blur-sm text-foreground p-4">
                    <SheetHeader><SheetTitle>Video Quality</SheetTitle></SheetHeader>
                    <div className="py-4 space-y-3">
                        <Button variant={currentResolution === '1080p' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setCurrentResolution('1080p')}>1080p HD</Button>
                        <Button variant={currentResolution === '4K' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => {setCurrentResolution('4K'); toast({title:"4K UHD Selected (Simulated)"})}}>4K UHD (Simulated)</Button>
                        <Button variant={isProResActive ? 'default' : 'outline'} className="w-full justify-start" onClick={() => {setIsProResActive(!isProResActive); toast({title:`ProRes ${!isProResActive ? 'On' : 'Off'} (Simulated)`})}}>ProRes (Simulated)</Button>
                    </div>
                </SheetContent>
            </Sheet>
             {/* Pro Mode/Enhancements Sheet */}
             <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className={`text-white hover:bg-white/20 h-8 w-8 ${isProModeActive ? 'text-purple-400' : ''}`}> <Wand2 className="h-4 w-4" /><span className="sr-only">Enhance</span></Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[260px] sm:w-[320px] bg-background/90 backdrop-blur-sm text-foreground p-4">
                    <SheetHeader><SheetTitle>Pro Enhancements (Simulated)</SheetTitle></SheetHeader>
                     <SheetDescription className="text-xs pt-1">These effects are visual simulations.</SheetDescription>
                    <div className="py-4 space-y-3">
                       <Button variant={isProModeActive ? 'secondary' : 'outline'} className="w-full justify-start gap-2" onClick={() => {setIsProModeActive(!isProModeActive); toast({title:`Smart Enhance ${!isProModeActive ? 'On' : 'Off'}`})}}> <CloudLightning className="h-4 w-4" /> Smart Enhance</Button>
                       <Button variant={isSharpenActive ? 'secondary' : 'outline'} className="w-full justify-start gap-2" onClick={() => {setIsSharpenActive(!isSharpenActive); toast({title:`Sharpen ${!isSharpenActive ? 'On' : 'Off'}`})}}> <Focus className="h-4 w-4" /> Sharpen Image</Button>
                       <Button variant={isCinematicModeActive ? 'secondary' : 'outline'} className="w-full justify-start gap-2" onClick={() => {setIsCinematicModeActive(!isCinematicModeActive); toast({title:`Cinematic Look ${!isCinematicModeActive ? 'On' : 'Off'}`})}}> <Palette className="h-4 w-4" /> Cinematic Color</Button>
                       {/* Add more controls here */}
                    </div>
                </SheetContent>
            </Sheet>
             {/* Info Sheet */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8"> <Info className="h-4 w-4" /><span className="sr-only">Info</span></Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/90 backdrop-blur-sm text-foreground">
                    <SheetHeader>
                        <SheetTitle>Advanced Vlogging Features</SheetTitle>
                        <SheetDescription>Capture professional-quality videos with these tools:</SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-3 text-sm overflow-y-auto max-h-[calc(100vh-10rem)] pr-2">
                        <p><strong><Aperture className="inline h-4 w-4 mr-1"/>Cinematic Mode:</strong> Achieve professional depth-of-field effects and automatic focus transitions for a movie-like look.</p>
                        <p><strong><Footprints className="inline h-4 w-4 mr-1"/>Action Mode:</strong> Get ultra-smooth, gimbal-like stabilization for dynamic handheld or fast-moving shots.</p>
                        <p><strong><VideoIcon className="inline h-4 w-4 mr-1"/>High-Quality Recording:</strong> Record in stunning 4K at up to 60 fps. Supports Dolby Vision HDR and ProRes formats (on compatible devices).</p>
                        <p><strong><CameraIcon className="inline h-4 w-4 mr-1"/>Pro Selfie Vlogging:</strong> Use the front camera for 4K vlogging with Cinematic and slow-mo options.</p>
                        <p><strong><Layers className="inline h-4 w-4 mr-1"/>Creative Lenses:</strong> Utilize ultra-wide and telephoto lenses for unique perspectives and framing.</p>
                        <p><strong><Moon className="inline h-4 w-4 mr-1"/>Low-Light Excellence:</strong> Capture clear videos even in dim conditions with Night Mode, Smart HDR, and Deep Fusion.</p>
                        <p><strong><AudioLines className="inline h-4 w-4 mr-1"/>Enhanced Audio:</strong> Record immersive spatial audio and connect external microphones for superior sound quality.</p>
                        <p><strong><Scissors className="inline h-4 w-4 mr-1"/>Built-in Tools:</strong> Edit, trim, add music, and share your vlogs directly within AK Reels for a seamless workflow.</p>
                    </div>
                </SheetContent>
            </Sheet>
         </div>
        )}


        {/* Bottom Controls Overlay - Render only if permission granted */}
        {hasCameraPermission === true && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/70 to-transparent">
          {renderModeSpecificControls()}
          <div className="flex items-center justify-center gap-8 w-full px-4">
            {/* Gallery Button */}
            <Button variant="ghost" size="icon" className="text-white" onClick={handleGalleryClick}>
              <GalleryHorizontalEnd className="h-6 w-6" />
              <span className="sr-only">Open Gallery</span>
            </Button>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*" // Accept images and videos
                className="hidden"
                multiple={false} // Allow only single file selection for now
            />

            {/* Capture Button */}
            <Button
              onClick={handleCapture}
              className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-colors duration-200 ease-in-out
                ${isRecording ? 'bg-red-600 shadow-lg shadow-red-500/50 animate-pulse' : 'bg-white/30 hover:bg-white/50'}`}
              aria-label={isRecording ? 'Stop Recording' : 'Capture Photo or Start Recording'}
              // Disable capture if permission not granted or recorder failed to init
              disabled={hasCameraPermission !== true || (['reel', 'story_video', 'vlog'].includes(currentMode) && !mediaRecorder)}
            >
              {isRecording ? (
                <StopCircle className="h-8 w-8 text-white" /> // Clear stop icon
              ) : (
                (currentMode === 'photo' || currentMode === 'story_photo') ?
                  <div className="w-12 h-12 rounded-full bg-white"></div> : // Inner white circle for photo
                  <div className="w-10 h-10 rounded-full bg-red-600"></div> // Inner red circle for video start
              )}
            </Button>

            {/* Timer Button */}
            <Sheet>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white"><Timer className="h-6 w-6" /></Button>
              </SheetTrigger>
               <SheetContent side="bottom" className="bg-background/80 backdrop-blur-sm text-foreground rounded-t-2xl h-[200px]">
                  <SheetHeader><SheetTitle>Timer</SheetTitle></SheetHeader>
                  <div className="flex justify-around items-center h-full">
                      {[0, 3, 10].map(d => <Button key={d} variant={timerDuration === d ? "default": "outline"} onClick={() => setTimerDuration(d)}>{d}s</Button>)}
                  </div>
               </SheetContent>
            </Sheet>
          </div>

           {/* Mode Selector */}
          <div className="flex justify-center gap-2 text-white text-xs font-medium overflow-x-auto pb-1 w-full px-2">
            {(['photo', 'story_photo', 'story_video', 'reel', 'vlog', 'live'] as CameraMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                    if (isRecording) {
                        toast({ title: "Stop recording before changing mode.", variant: "destructive"});
                        return;
                    }
                    if (hasCameraPermission) { // Only change mode if camera is accessible
                       setCurrentMode(mode);
                       // Reset states that might not apply to the new mode
                       setIsRecording(false);
                       setSpeed(1); // Reset speed
                    } else {
                        toast({ variant: "destructive", title: "Camera Access Needed", description: "Cannot change mode without camera permission."})
                    }
                }}
                className={`py-1 px-2.5 rounded whitespace-nowrap transition-colors ${currentMode === mode ? 'bg-white/40 font-semibold' : 'hover:bg-white/20 opacity-70'}`}
              >
                {mode.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Live Interaction Overlay (Shown only when live and recording) */}
        {currentMode === 'live' && isRecording && (
          <div className="absolute top-4 left-4 z-30 text-white p-2 bg-black/50 rounded-lg space-y-2 max-w-xs backdrop-blur-sm">
              <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-semibold">LIVE</span>
                  <Users className="h-4 w-4"/>
                  <span className="text-xs">1.2K</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1 text-xs scrollbar-hide">
                  {/* Mock comments/reactions */}
                  <p><span className="font-semibold">user123:</span> Awesome stream! 🔥</p>
                  <p><span className="font-semibold">viewer_007:</span> Hello from India!</p>
                   <p><span className="font-semibold">another_viewer:</span> What camera are you using?</p>
                   <p><span className="font-semibold">fan_account:</span> Amazing quality! <Heart className="h-3 w-3 inline text-red-500 fill-red-500"/></p>
                  <p><Gift className="h-3 w-3 inline text-yellow-400 fill-yellow-400"/> Gift from <span className="font-semibold">supporter01</span></p>
                   <p><span className="font-semibold">question_asker:</span> Can you show the setup?</p>
                   <p><span className="font-semibold">friend_1:</span> Looking good! </p>
                  {/* Add more simulated interactions */}
              </div>
               <Input placeholder="Add a comment..." className="bg-black/30 border-white/30 text-white placeholder:text-gray-400 h-8 text-xs"/>
          </div>
        )}
      </div>
    </>
  );
};

export default CameraInterface;
