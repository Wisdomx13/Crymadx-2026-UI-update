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
  VerifyEmailScreen,
  DashboardScreen,
  TradingScreen,
  WalletScreen,
  MarketsScreen,
  ProfileScreen,
  P2PScreen,
  PaymentMethodsScreen,
  RewardsScreen,
  ReferralScreen,
  TicketsScreen,
  DepositScreen,
  WithdrawScreen,
  ConvertScreen,
  HistoryScreen,
  SavingsVaultScreen,
  VaultScreen,
  AutoInvestScreen,
  StakingScreen,
  NFTScreen,
  NFTMarketplaceScreen,
  FiatScreen,
  KYCScreen,
  TwoFactorScreen,
  AntiPhishingScreen,
  PortfolioScreen,
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
                <Route path="/verify-email" element={<VerifyEmailScreen />} />

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
                <Route path="/portfolio" element={<PortfolioScreen />} />

                {/* Profile & Settings */}
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/settings" element={<ProfileScreen />} />

                {/* P2P Trading */}
                <Route path="/p2p" element={<P2PScreen />} />
                <Route path="/p2p-trading" element={<P2PScreen />} />
                <Route path="/p2p/payment-methods" element={<PaymentMethodsScreen />} />

                {/* Rewards & Referral */}
                <Route path="/rewards" element={<RewardsScreen />} />
                <Route path="/referral" element={<ReferralScreen />} />

                {/* Support */}
                <Route path="/tickets" element={<TicketsScreen />} />
                <Route path="/support" element={<TicketsScreen />} />

                {/* Earn & Vault Routes */}
                <Route path="/earn" element={<SavingsVaultScreen />} />
                <Route path="/savings" element={<SavingsVaultScreen />} />
                <Route path="/vault" element={<VaultScreen />} />
                <Route path="/auto-invest" element={<AutoInvestScreen />} />
                <Route path="/staking" element={<StakingScreen />} />

                {/* NFT Routes */}
                <Route path="/nft" element={<NFTScreen />} />
                <Route path="/nft/marketplace" element={<NFTMarketplaceScreen />} />

                {/* Fiat */}
                <Route path="/fiat" element={<FiatScreen />} />

                {/* Security Routes */}
                <Route path="/security/kyc" element={<KYCScreen />} />
                <Route path="/security/2fa" element={<TwoFactorScreen />} />
                <Route path="/security/anti-phishing" element={<AntiPhishingScreen />} />
                <Route path="/kyc" element={<KYCScreen />} />
                <Route path="/2fa" element={<TwoFactorScreen />} />

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
