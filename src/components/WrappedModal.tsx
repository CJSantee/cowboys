import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import useWrapped from '../hooks/queries/useWrapped';
import States from '../pages/wrapped/components/States';
import headsCarolina from '../assets/music/Heads Carolina.m4a';
import saveAHorse from '../assets/music/Save a horse ride a cowboy.m4a';
import drinkInMyHand from '../assets/music/Drink in my hand.m4a';
import liveLikeYouWereDying from '../assets/music/Live Like You Were Dying.m4a';
import huntinFishinAndLovinEveryDay from "../assets/music/Huntin', Fishin' And Lovin' Every Day.m4a";
import Horses from '../pages/wrapped/components/Horses';
import Drinks from '../pages/wrapped/components/Drinks';
import LLYWD from '../pages/wrapped/components/LLYWD';
import Days from '../pages/wrapped/components/Days';
import Icon from './Icon';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

interface WrappedModalProps {
  open: boolean;
  onClose: () => void;
}

interface StepData {
  song_title?: string;
  audioSrc?: string;
}

const steps: Record<string, StepData> = {
  days: {
    song_title: "Huntin', Fishin' And Lovin' Every Day - Luke Bryan",
    audioSrc: huntinFishinAndLovinEveryDay,
  },
  horses: {
    song_title: "Save a Horse (Ride a Cowboy) - Big & Rich",
    audioSrc: saveAHorse,
  },
  states: {
    song_title: "Heads Carolina - Jo Dee Messina",
    audioSrc: headsCarolina,
  },
  drinks: {
    song_title: "Drink In My Hand - Eric Church",
    audioSrc: drinkInMyHand,
  },
  llywd: {
    song_title: "Live Like You Were Dying - Tim McGraw",
    audioSrc: liveLikeYouWereDying,
  },
} as const;

export default function WrappedModal({ open, onClose }: WrappedModalProps) {
  const [activeStep, setActiveStep] = useState<'welcome' | keyof typeof steps>('welcome');
  const { data: wrapped, isLoading } = useWrapped();

  const stepKeys = Object.keys(steps) as Array<keyof typeof steps>;

  const goNext = () => {
    if (activeStep === 'welcome') {
      setActiveStep(stepKeys[0]);
    } else {
      const currentIndex = stepKeys.indexOf(activeStep);
      if (currentIndex === stepKeys.length - 1) {
        onClose();
      } else {
        setActiveStep(stepKeys[currentIndex + 1]);
      }
    }
  };

  const goBack = () => {
    if (activeStep === 'welcome') return;
    const currentIndex = stepKeys.indexOf(activeStep);
    if (currentIndex === 0) {
      setActiveStep('welcome');
    } else {
      setActiveStep(stepKeys[currentIndex - 1]);
    }
  };

  const activeStepData = activeStep !== 'welcome' ? steps[activeStep as keyof typeof steps] : undefined;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (activeStepData?.audioSrc) {
      if (!audioRef.current) {
        audioRef.current = new Audio(activeStepData.audioSrc);
        audioRef.current.loop = true;
      } else if (audioRef.current.src !== activeStepData.audioSrc) {
        audioRef.current.pause();
        audioRef.current = new Audio(activeStepData.audioSrc);
        audioRef.current.loop = true;
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      // Cleanup on unmount or if logic requires
    };
  }, [activeStep, activeStepData]);

  // Stop audio when modal closes
  useEffect(() => {
    if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveStep('welcome');
    }
  }, [open]);

  if (!wrapped || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className={clsx("fixed inset-0 transition-opacity duration-300 ease-out data-[closed]:opacity-0", activeStep === 'welcome' ? 'bg-black' : 'bg-[var(--background)]')}
      />

      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center text-center">
          <DialogPanel
            transition
            className={clsx("w-full h-screen transform overflow-hidden text-left align-middle shadow-xl transition-all duration-300 ease-out data-[closed]:opacity-0 data-[closed]:scale-95", activeStep === 'welcome' ? 'bg-black' : 'bg-background')}
          >
            <button
              onClick={onClose}
              className={clsx("absolute top-4 right-4 z-10 hover:text-gray-300 focus:outline-none", activeStep === 'welcome' ? 'text-white' : 'text-black')}
              aria-label="Close"
            >
              <Icon name='close' size={6} />
            </button>
            <div className={clsx("flex flex-col items-center justify-center h-full w-full", activeStep === 'welcome' ? 'text-white' : 'text-black')}>
              {activeStep !== 'welcome' && (
                <div className="w-full flex justify-center py-4 shrink-0 items-center gap-2">
                  {Object.keys(steps).map((step) => (
                    <div
                      key={step}
                      className={clsx(
                        "h-1.5 w-8 rounded-full transition-colors duration-300",
                        activeStep === step ? "bg-amber-700" : "bg-gray-600/50"
                      )}
                    />
                  ))}
                </div>
              )}

              <div className="flex-1 w-full flex flex-col items-center justify-center overflow-y-auto relative">
                {activeStep === 'welcome' && (
                  <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold mb-4">Cowboy Counter Wrapped</h1>
                    <p className="text-xl mb-8">1/12/2025 - 1/12/2026</p>
                    <button
                      onClick={() => setActiveStep('days')}
                      className="px-8 py-3 bg-white text-black font-bold rounded-full text-lg hover:scale-105 transition-transform"
                    >
                      Enter
                    </button>
                  </div>
                )}
                {activeStep === 'days' && (
                  <Days days={wrapped?.score_days} />
                )}
                {activeStep === 'horses' && (
                  <Horses horses={wrapped.horses} />
                )}
                {activeStep === 'states' && (
                  <States states={wrapped.states} />
                )}
                {activeStep === 'drinks' && (
                  <Drinks drinks={wrapped.drinks} />
                )}
                {activeStep === 'llywd' && (
                  <LLYWD llywd={wrapped.llywd} />
                )}
              </div>

              {activeStep !== 'welcome' && (
                <div className="w-full p-4 shrink-0 flex justify-between items-center">
                  <button
                    onClick={goBack}
                    className="p-2 rounded-full hover:bg-black/5 text-black transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeftIcon />
                  </button>

                  <div className="flex flex-col items-center justify-center gap-1 w-48">
                    {activeStepData?.audioSrc && (
                      <div className="flex items-end justify-center gap-1 h-8 mb-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-amber-700 rounded-t"
                            style={{
                              animation: 'equalize 1s infinite ease-in-out',
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {activeStepData?.song_title && (
                      <div className="overflow-hidden w-full relative h-6 bg-transparent">
                        <p
                          className="whitespace-nowrap text-sm font-semibold text-amber-900 absolute"
                          style={{
                            animation: 'scroll-text 8s linear infinite',
                          }}
                        >
                          {activeStepData.song_title}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={goNext}
                    className="p-2 rounded-full hover:bg-black/5 text-black transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
