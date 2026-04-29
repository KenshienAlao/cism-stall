"use client"
import { Dashboard } from "@/components/dashboard";
import { ManageItem } from "@/components/manageitem";
import Mobilesidebar from "@/components/mobilesidebar";
import { MonitorItem } from "@/components/monitoritem";
import { Sidebar } from "@/components/sidebar";
import Loading from "@/components/ui/loading";
import { VALUE } from "@/config/app.config";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function Home() {
  const { profile, isLoading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<(typeof VALUE)[keyof typeof VALUE]>(VALUE.HOME);

  console.log(profile)

  if (authLoading) return <Loading />

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header
          title={getPageTitle()}
          onLogout={() => setIsAuthenticated(false)}
        /> */}
        <div className="flex-1 overflow-y-auto bg-white pb-16 md:pb-0">
          {currentView === VALUE.HOME && <Dashboard profile={profile || undefined} />}
          {currentView === VALUE.MANAGE && <ManageItem profile={profile || undefined} />}
          {currentView === VALUE.MONITOR && <MonitorItem profile={profile || undefined} />}
          {/* {currentView === VALUE.ORDER && <Order />} */}
        </div>
      </div>
      <Mobilesidebar
        currentView={currentView}
        onNavigate={setCurrentView}
      />
    </div>
  );
}
