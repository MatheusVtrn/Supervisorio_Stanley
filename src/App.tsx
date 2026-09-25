/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, ShiftInfo, PlcTelemetry } from './types/scada';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OeeDashboard } from './components/OeeDashboard';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { UsersScreen } from './components/UsersScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { PlcConfigScreen } from './components/PlcConfigScreen';
import { ImageLinksModal } from './components/ImageLinksModal';

export default function App() {
  // Current active screen - starts on 'oee' (Screen 4B from Image 1) so user immediately sees the rich dashboard
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('oee');
  const [isImageLinksModalOpen, setIsImageLinksModalOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Active operator / shift state
  const [currentShift, setCurrentShift] = useState<ShiftInfo>({
    id: 'shift-1',
    name: 'TURNO',
    code: 'TURNO A - MANHÃ',
    timeRange: '06:00 - 14:00',
    operator: 'Matheus Vitorino',
    operatorBadge: '84920',
    operatorRole: 'Admin',
    operatorLevel: 4,
  });

  // Industrial telemetry state
  const [telemetry, setTelemetry] = useState<PlcTelemetry>({
    sampleRate: '100ms (10Hz)',
    commBus: 'MODBUS/TCP 502',
    opcUa: 'opc.tcp://192.168.1.100:4840',
    packetsTx: 1284992,
    packetsRx: 1284992,
    errors: 0,
    version: 'v4.18.2-PROD',
    industrialNode: 'BR-SP-04',
    lastReading: '13:59:59.892',
    interlockSecure: true,
  });

  // Simulated live telemetry tick for packets & last CLP reading
  useEffect(() => {
    if (!isLive || !isOnline) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');

      setTelemetry((prev) => ({
        ...prev,
        packetsTx: prev.packetsTx + Math.floor(Math.random() * 8) + 4,
        packetsRx: prev.packetsRx + Math.floor(Math.random() * 8) + 4,
        lastReading: `${hours}:${mins}:${secs}.${ms}`,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive, isOnline]);

  const handleLoginSuccess = (user: ShiftInfo) => {
    setCurrentShift(user);
    setCurrentScreen('oee');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  // If on login screen, render Login view directly
  if (currentScreen === 'login') {
    return (
      <div className="relative min-h-screen bg-[#f1f5f9]">
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onOpenImageLinks={() => setIsImageLinksModalOpen(true)}
        />
        <ImageLinksModal
          isOpen={isImageLinksModalOpen}
          onClose={() => setIsImageLinksModalOpen(false)}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0f172a] font-sans antialiased">
      {/* Top SCADA Status & Navigation Header */}
      <Header
        currentShift={currentShift}
        onOpenImageLinks={() => setIsImageLinksModalOpen(true)}
        onToggleLogin={() => setCurrentScreen('login')}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

      {/* Main Workspace Layout (Sidebar + Content Viewport) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onSelectScreen={(screen) => setCurrentScreen(screen)}
          onLogout={handleLogout}
          isInterlockSecure={telemetry.interlockSecure}
        />

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f8f9ff]">
          {currentScreen === 'oee' && (
            <OeeDashboard
              isLive={isLive}
              onToggleLive={() => setIsLive(!isLive)}
              telemetry={telemetry}
              onOpenImageLinks={() => setIsImageLinksModalOpen(true)}
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />
          )}

          {currentScreen === 'users' && <UsersScreen />}

          {currentScreen === 'history' && <HistoryScreen />}

          {currentScreen === 'reports' && (
            <ReportsScreen currentShift={currentShift} />
          )}

          {currentScreen === 'plc_config' && (
            <PlcConfigScreen
              telemetry={telemetry}
              onUpdateTelemetry={(newTelem) =>
                setTelemetry((prev) => ({ ...prev, ...newTelem }))
              }
            />
          )}
        </main>
      </div>

      {/* Image Links & HTML Code Modal */}
      <ImageLinksModal
        isOpen={isImageLinksModalOpen}
        onClose={() => setIsImageLinksModalOpen(false)}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />
    </div>
  );
}
