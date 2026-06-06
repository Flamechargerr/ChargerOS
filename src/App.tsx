import { AuthProvider } from '@/contexts/AuthContext';
import { FileSystemProvider } from '@/contexts/FileSystemContext';
import { DesktopProvider } from '@/contexts/DesktopContext';
import { useAuth } from '@/contexts/AuthContext';
import { registerAllApps } from '@/apps';
import LoginScreen from '@/components/LoginScreen';
import Desktop from '@/components/Desktop';
import './App.css';

// Register all application components
registerAllApps();

function AppContent() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Desktop /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <FileSystemProvider>
        <DesktopProvider>
          <AppContent />
        </DesktopProvider>
      </FileSystemProvider>
    </AuthProvider>
  );
}
