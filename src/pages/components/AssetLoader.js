// components/AssetPreloader.js
import { useEffect } from 'react';

const ASSETS = [
  '/frame.svg', '/floor.svg', '/table.svg',
  '/clock.svg', '/grain.gif',
];

export default function AssetPreloader() {
  useEffect(() => {
    ASSETS.forEach((path) => {
      const img = new Image();
      img.src = process.env.PUBLIC_URL + path;
    });
  }, []);

  return null;
}