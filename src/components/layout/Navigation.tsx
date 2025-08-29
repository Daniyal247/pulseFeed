import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="flex justify-center py-4 bg-gray-100 dark:bg-gray-800 mb-6">
      <div className="flex space-x-4">
        <Link 
          to="/" 
          className={`px-4 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          General & Sports
        </Link>
        <Link 
          to="/health-tech" 
          className={`px-4 py-2 rounded-md transition-colors ${location.pathname === '/health-tech' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          Health & Technology
        </Link>
        <Link 
          to="/sports-finance" 
          className={`px-4 py-2 rounded-md transition-colors ${location.pathname === '/sports-finance' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          Sports & Finance
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;