import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface DetectionState {
  imageSrc: string | null;
  preprocessedImage: string | null;
  results: any | null;
  treatmentInfo: any | null;
  url: string;
  loading: boolean;
  error: string | null;
  loadingTreatment: boolean;
  treatmentError: string | null;
  isReading: boolean;
  scanInProgress: boolean;
  copied: boolean;
  shareDialogOpen: boolean;
}

interface DetectionContextType {
  state: DetectionState;
  setImageSrc: (src: string | null) => void;
  setPreprocessedImage: (img: string | null) => void;
  setResults: (results: any | null) => void;
  setTreatmentInfo: (info: any | null) => void;
  setUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLoadingTreatment: (loading: boolean) => void;
  setTreatmentError: (error: string | null) => void;
  setIsReading: (reading: boolean) => void;
  setScanInProgress: (inProgress: boolean) => void;
  setCopied: (copied: boolean) => void;
  setShareDialogOpen: (open: boolean) => void;
  resetState: () => void;
}

const STORAGE_KEY = 'leafcare_detection_state';

const DetectionContext = createContext<DetectionContextType | undefined>(undefined);

export const DetectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [state, setState] = useState<DetectionState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Error parsing saved detection state:', e);
      }
    }
    return {
      imageSrc: null,
      preprocessedImage: null,
      results: null,
      treatmentInfo: null,
      url: "",
      loading: false,
      error: null,
      loadingTreatment: false,
      treatmentError: null,
      isReading: false,
      scanInProgress: false,
      copied: false,
      shareDialogOpen: false,
    };
  });

  const { isAuthenticated } = useAuth();

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving detection state:', e);
    }
  }, [state]);

  const setImageSrc = (src: string | null) => setState(prev => ({ ...prev, imageSrc: src }));
  const setPreprocessedImage = (img: string | null) => setState(prev => ({ ...prev, preprocessedImage: img }));
  const setResults = (results: any | null) => setState(prev => ({ ...prev, results }));
  const setTreatmentInfo = (info: any | null) => setState(prev => ({ ...prev, treatmentInfo: info }));
  const setUrl = (url: string) => setState(prev => ({ ...prev, url }));
  const setLoading = (loading: boolean) => setState(prev => ({ ...prev, loading }));
  const setError = (error: string | null) => setState(prev => ({ ...prev, error }));
  const setLoadingTreatment = (loading: boolean) => setState(prev => ({ ...prev, loadingTreatment: loading }));
  const setTreatmentError = (error: string | null) => setState(prev => ({ ...prev, treatmentError: error }));
  const setIsReading = (reading: boolean) => setState(prev => ({ ...prev, isReading: reading }));
  const setScanInProgress = (inProgress: boolean) => setState(prev => ({ ...prev, scanInProgress: inProgress }));
  const setCopied = (copied: boolean) => setState(prev => ({ ...prev, copied }));
  const setShareDialogOpen = (open: boolean) => setState(prev => ({ ...prev, shareDialogOpen: open }));

  const resetState = () => {
    const initialState = {
      imageSrc: null,
      preprocessedImage: null,
      results: null,
      treatmentInfo: null,
      url: "",
      loading: false,
      error: null,
      loadingTreatment: false,
      treatmentError: null,
      isReading: false,
      scanInProgress: false,
      copied: false,
      shareDialogOpen: false,
    };
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY); // Also clear localStorage when resetting
  };

  // Clean up reading state when navigating away
  useEffect(() => {
    return () => {
      if (state.isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      }
    };
  }, [state.isReading]);

  useEffect(() => {
    // Reset state when logged out
    if (!isAuthenticated) {
      resetState();
    }
  }, [isAuthenticated]);

  return (
    <DetectionContext.Provider value={{
      state,
      setImageSrc,
      setPreprocessedImage,
      setResults,
      setTreatmentInfo,
      setUrl,
      setLoading,
      setError,
      setLoadingTreatment,
      setTreatmentError,
      setIsReading,
      setScanInProgress,
      setCopied,
      setShareDialogOpen,
      resetState,
    }}>
      {children}
    </DetectionContext.Provider>
  );
};

export const useDetection = () => {
  const context = useContext(DetectionContext);
  if (context === undefined) {
    throw new Error('useDetection must be used within a DetectionProvider');
  }
  return context;
};