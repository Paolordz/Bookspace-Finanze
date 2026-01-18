import React from 'react';

/**
 * Logo de Bookspace
 * @param {number} size - Tamaño del logo
 */
const BookspaceLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="20" width="84" height="72" rx="8" stroke="#4f67eb" strokeWidth="6" fill="white"/>
    <rect x="20" y="8" width="12" height="20" rx="3" fill="#4f67eb"/>
    <rect x="44" y="8" width="12" height="20" rx="3" fill="#4f67eb"/>
    <rect x="68" y="8" width="12" height="20" rx="3" fill="#4f67eb"/>
    <rect x="20" y="40" width="28" height="28" rx="4" fill="#2a1d89"/>
    <path d="M28 48h12M28 54h8M28 60h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="56" y="40" width="24" height="12" rx="3" fill="#b7bac3"/>
    <rect x="56" y="56" width="24" height="12" rx="3" fill="#b7bac3"/>
  </svg>
);

export default BookspaceLogo;
