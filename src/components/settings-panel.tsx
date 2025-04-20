"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { RiSettingsLine } from "@remixicon/react";
import * as React from "react";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { WalletUi } from "./wallet/wallet-ui";
import { Wallet } from "./wallet/Wallet";

type Settings = {
  maxTokens: number | null;
  temperature: number | null;
};

type SettingsPanelContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  togglePanel: () => void;
};

const SettingsPanelContext = createContext<SettingsPanelContextType | undefined>(
  undefined,
);

export function SettingsPanelProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    maxTokens: null,
    temperature: null,
  });
  const isMobile = useIsMobile(1024);
  const [openMobile, setOpenMobile] = React.useState(false);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  const togglePanel = useCallback(() => {
    if (isMobile) {
        setOpenMobile((open) => !open);
    }
    // Add logic for desktop toggle if needed
  }, [isMobile, setOpenMobile]);

   const contextValue = useMemo<SettingsPanelContextType>(
     () => ({
       settings,
       updateSettings,
       isMobile,
       openMobile,
       setOpenMobile,
       togglePanel,
     }),
     [settings, isMobile, openMobile, setOpenMobile, togglePanel],
   );

  return (
    <SettingsPanelContext.Provider value={contextValue}>
      {children}
    </SettingsPanelContext.Provider>
  );
}

export function useSettingsPanel() {
  const context = useContext(SettingsPanelContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsPanel must be used within a SettingsPanelProvider",
    );
  }
  return context;
}

const SettingsPanelContent = () => {
  // const { settings, updateSettings } = useSettingsPanel(); // Access settings if needed
  return (
    <Wallet/>
  );
};
SettingsPanelContent.displayName = "SettingsPanelContent";

export function SettingsPanel() {
  const { isMobile, openMobile, setOpenMobile } = useSettingsPanel();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent className="w-72 px-4 md:px-6 py-0 dark bg-zinc-900/95 text-primary-foreground border-l-0 [&>button]:text-primary-foreground">
          <SheetTitle className="sr-only">Settings</SheetTitle>
          <div className="flex h-full w-full flex-col pt-6"> {/* Add padding top */} 
            <SettingsPanelContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view
  return (
      <div className="p-4">
         <SettingsPanelContent />
      </div>
  );
}
SettingsPanel.displayName = "SettingsPanel";

// Trigger remains the same - for mobile
export const SettingsPanelTrigger = ({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { isMobile, togglePanel } = useSettingsPanel();

  if (!isMobile) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      className="px-2 text-muted-foreground hover:text-primary-foreground" // Adjusted styling
      onClick={(event) => {
        onClick?.(event);
        togglePanel();
      }}
    >
      <RiSettingsLine
        className="size-5"
        aria-hidden="true"
      />
      <span className="sr-only">Settings</span>
    </Button>
  );
};
SettingsPanelTrigger.displayName = "SettingsPanelTrigger";
