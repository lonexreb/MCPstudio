import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboardingStore } from '../stores/onboarding-store';
import { tourSteps } from '../lib/tour-steps';
import confetti from 'canvas-confetti';

const TourOverlay = () => {
  const { isTourActive, currentStep, nextStep, prevStep, setOnboardingDone, skipTour } = useOnboardingStore();
  const navigate = useNavigate();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = tourSteps[currentStep];
  const isLast = currentStep === tourSteps.length - 1;

  const updateTargetRect = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.target);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!isTourActive || !step) return;

    if (step.route) {
      navigate(step.route);
    }

    // Small delay for route transition then find element
    const timer = setTimeout(updateTargetRect, 150);
    window.addEventListener('resize', updateTargetRect);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetRect);
    };
  }, [isTourActive, step, navigate, updateTargetRect]);

  const handleNext = () => {
    if (isLast) {
      setOnboardingDone();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#2563eb', '#0d9488', '#ec4899', '#f97316'],
      });
    } else {
      nextStep();
    }
  };

  if (!isTourActive || !step) return null;

  const padding = 8;
  const spotlightStyle = targetRect
    ? {
        boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 0 ${padding}px rgba(124, 58, 237, 0.3)`,
        position: 'fixed' as const,
        top: targetRect.top - padding,
        left: targetRect.left - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
        borderRadius: '12px',
        zIndex: 101,
        pointerEvents: 'none' as const,
        transition: 'all 0.3s ease',
      }
    : undefined;

  // Position the tooltip card
  const getTooltipStyle = () => {
    if (!targetRect) return { position: 'fixed' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 102 };

    const gap = 16;
    const base: React.CSSProperties = { position: 'fixed', zIndex: 102, maxWidth: '320px' };

    switch (step.placement) {
      case 'right':
        return { ...base, top: targetRect.top, left: targetRect.right + gap + padding };
      case 'left':
        return { ...base, top: targetRect.top, right: window.innerWidth - targetRect.left + gap + padding };
      case 'bottom':
        return { ...base, top: targetRect.bottom + gap + padding, left: targetRect.left };
      case 'top':
        return { ...base, bottom: window.innerHeight - targetRect.top + gap + padding, left: targetRect.left };
      default:
        return { ...base, top: targetRect.bottom + gap, left: targetRect.left };
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100]" onClick={skipTour} />

      {/* Spotlight */}
      {spotlightStyle && <div style={spotlightStyle} />}

      {/* Tooltip */}
      <Card style={getTooltipStyle()} className="shadow-2xl border-mcp-purple-500/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{step.content}</p>
            </div>
            <button onClick={skipTour} className="text-muted-foreground hover:text-foreground shrink-0 ml-2">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {currentStep + 1} of {tourSteps.length}
            </span>
            <div className="flex gap-1.5">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" onClick={prevStep} className="h-7 px-2">
                  <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                  Back
                </Button>
              )}
              <Button size="sm" onClick={handleNext} className="h-7 px-3 gradient-brand">
                {isLast ? 'Finish' : 'Next'}
                {!isLast && <ChevronRight className="h-3.5 w-3.5 ml-0.5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TourOverlay;
