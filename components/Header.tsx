import React from 'react';
import { User } from '../types';

interface HeaderProps {
    user: User | null;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onDashboardClick: () => void;
    onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, onDashboardClick, onLogoClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-4 sm:gap-6 cursor-pointer group" onClick={onLogoClick}>
            <img 
              src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png" 
              alt="Rommaana Insurance" 
              className="h-8 sm:h-10 w-auto transition-opacity hover:opacity-90"
            />
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider sm:hidden">Partner</span>
                <img 
                  src="https://giraffy.com/storage/images/brands/5U5vBaOI45eaHKA4XKfjTUzivD0F2psTYPtOqNIw.png" 
                  alt="Al Etihad Insurance" 
                  className="h-8 sm:h-12 w-auto object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {user ? (
                 <div className="flex items-center gap-4">
                     <button 
                        onClick={onDashboardClick}
                        className="text-gray-700 hover:text-pomegranate-700 font-medium text-sm flex items-center gap-2"
                     >
                         <div className="w-8 h-8 rounded-full bg-pomegranate-100 text-pomegranate-600 flex items-center justify-center font-bold">
                             {user.name.charAt(0)}
                         </div>
                         <span className="hidden sm:inline">My Account</span>
                     </button>
                     <button 
                        onClick={onLogoutClick}
                        className="text-gray-500 hover:text-red-600 text-sm font-medium"
                     >
                        Logout
                     </button>
                 </div>
             ) : (
                <button 
                    onClick={onLoginClick}
                    className="bg-pomegranate-600 hover:bg-pomegranate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                    Login / Register
                </button>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};