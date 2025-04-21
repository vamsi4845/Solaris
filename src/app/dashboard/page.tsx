import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solaris",
};

import Chat from "@/components/chatbox/chat";
import {
  SettingsPanel,
  SettingsPanelProvider,
} from "@/components/settings-panel";
import { SidebarInset, SidebarProvider } from "@/components/sidebar";
import UserDropdown from "@/components/user-dropdown";

export default function Page() {
  return (
    <SidebarProvider>
    <SidebarInset className="bg-sidebar group/sidebar-inset">
      <header className="dark flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-[#18181b] text-background relative before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 before:z-50">
        <p className="text-2xl font-bold text-primary">Solaris</p>
        <div className="flex items-center gap-8 ml-auto">
          <UserDropdown />
        </div>
      </header>
      <SettingsPanelProvider>
        <div className="flex h-[calc(100svh-4rem)] bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
          <Chat />
          <SettingsPanel />
        </div>
      </SettingsPanelProvider>
    </SidebarInset>
  </SidebarProvider>
  );
}
