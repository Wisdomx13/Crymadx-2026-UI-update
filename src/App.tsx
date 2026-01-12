import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './theme/GlobalStyles';
import { ThemeModeProvider } from './theme/ThemeContext';
import { PresentationMode } from './components/PresentationMode';
import { AuthProvider } from './context/AuthContext';
import { UnderwaterBackground } from './components/UnderwaterBackground';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  DashboardScreen,
  TradingScreen,
  WalletScreen,
  MarketsScreen,
  ProfileScreen,
  P2PScreen,
  RewardsScreen,
  ReferralScreen,
  TicketsScreen,
  DepositScreen,
  WithdrawScreen,
  ConvertScreen,
  HistoryScreen,
  SavingsVaultScreen,
  VaultScreen,
  NFTScreen,
  FiatScreen,
} from './screens';

// Wrapper component to conditionally render background based on route
const ConditionalBackground: React.FC = () => {
  const location = useLocation();
  // Hide underwater background on trading pages
  if (location.pathname.startsWith('/trade')) {
    return null;
  }
  return <UnderwaterBackground />;
};

const App: React.FC = () => {
  return (
    <ThemeModeProvider defaultTheme="dark">
      <ThemeProvider>
        <Router>
          <ConditionalBackground />
          <AuthProvider>
            <PresentationMode>
              <Routes>
            {/* Landing Page */}
            <Route path="/" element={<HomeScreen />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

            {/* Main App Routes */}
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/trade" element={<TradingScreen />} />
            <Route path="/trade/:pair" element={<TradingScreen />} />
            <Route path="/wallet" element={<WalletScreen />} />
            <Route path="/wallet/deposit" element={<DepositScreen />} />
            <Route path="/wallet/withdraw" element={<WithdrawScreen />} />
            <Route path="/wallet/convert" element={<ConvertScreen />} />
            <Route path="/wallet/history" element={<HistoryScreen />} />
            <Route path="/markets" element={<MarketsScreen />} />

            {/* CrymadX Dashboard Routes */}
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/p2p" element={<P2PScreen />} />
            <Route path="/p2p-trading" element={<P2PScreen />} />
            <Route path="/rewards" element={<RewardsScreen />} />
            <Route path="/referral" element={<ReferralScreen />} />
            <Route path="/settings" element={<ProfileScreen />} />
            <Route path="/tickets" element={<TicketsScreen />} />

            {/* Earn & Vault Routes */}
            <Route path="/earn" element={<SavingsVaultScreen />} />
            <Route path="/savings" element={<SavingsVaultScreen />} />
            <Route path="/vault" element={<VaultScreen />} />

            {/* NFT & Fiat Routes */}
            <Route path="/nft" element={<NFTScreen />} />
            <Route path="/fiat" element={<FiatScreen />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PresentationMode>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ThemeModeProvider>
  );
};

export default App;
