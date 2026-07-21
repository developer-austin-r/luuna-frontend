import React from 'react';
import { Header } from './Header';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  return <Header onMenuToggle={onMenuToggle} />;
};
