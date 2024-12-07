import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UserList from './components/list/UserList';
import RoleList from './components/list/RoleList';
import { 
  Shield, 
  Moon, 
  Sun, 
  Users, 
  Key, 
  LogOut, 
  Clock, 
  Calendar 
} from 'lucide-react';

// Tabs data
const tabs = [
  { id: 'users', label: 'Manage Users', icon: <Users className="h-5 w-5" /> },
  { id: 'roles', label: 'Manage Roles', icon: <Key className="h-5 w-5" /> },
];

// App component
function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');

    // Update date and time every minute
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [darkMode]);

  // Sign out function
  const handleSignOut = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    navigate('/sign-in');
  };

  const buttonVariants = {
    initial: { rotate: 0, opacity: 0 },
    animate: { rotate: darkMode ? 180 : 0, opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, rotate: 90, transition: { duration: 0.3 } },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
  };

  // Format date and time
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    // Main container
    <motion.div
      className="min-h-screen"
      style={{
        backgroundImage: darkMode 
          ? 'linear-gradient(135deg, #2d3748, #1a202c, #4a5568)' 
          : 'linear-gradient(135deg, #e2e8f0, #edf2f7, #f7fafc)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 6s ease infinite',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                RBAC Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Date and Time Display */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 space-x-2">
                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formattedDate}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {formattedTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md transform hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {darkMode ? (
                  <Sun className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-900" />
                )}
              </motion.button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all transform hover:-translate-y-1"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */} 
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6 mb-6">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md transition-all transform ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md scale-105'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon}
              <span className="ml-2 font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
          {/* UserList and RoleList components */}
        <div className="mt-6">
          <motion.div
            className="flex flex-col"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {activeTab === 'users' ? <UserList /> : <RoleList />}
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}

export default App;