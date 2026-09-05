'use client';

/**
 * Source: Watermelon UI `view-on-map`
 * https://ui.watermelon.sh/animated-components/view-on-map
 * Brand-adapted for Ghoroa — forest/terracotta map reveal.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Map, X } from 'lucide-react';

export function ViewOnMap({
  address,
  mapImageUrl = '/images/dining.jpg',
  label = 'View on Map',
  className = '',
}: {
  address: string;
  mapImageUrl?: string;
  label?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const toggleOpen = () => {
    setIsOpen((v) => !v);
    if (isOpen) setIsMapLoaded(false);
  };

  const springConfig = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  };

  const publicMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`relative flex w-full items-center justify-center ${className}`}>
      <AnimatePresence mode="popLayout">
        {!isOpen ? (
          <motion.button
            type="button"
            key="button"
            layoutId="map-container"
            onClick={toggleOpen}
            className="group relative flex cursor-pointer items-center justify-center overflow-hidden border border-gold-deep/40 bg-forest shadow-sm"
            style={{ width: 200, height: 52, borderRadius: 0 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springConfig}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              layoutId="map-bg"
              className="absolute inset-0 opacity-25 grayscale"
              style={{
                backgroundImage: `url(${mapImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <span className="relative z-10 flex items-center gap-3 px-4">
              <Map className="h-5 w-5 text-gold" strokeWidth={1.5} aria-hidden />
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-cream">
                {label}
              </span>
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="map"
            layoutId="map-container"
            className="relative aspect-square w-[min(100%,380px)] overflow-hidden border border-gold-deep/40 bg-forest"
            style={{ borderRadius: 0 }}
            transition={springConfig}
          >
            <iframe
              title="Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={publicMapUrl}
              allowFullScreen
              onLoad={() => setIsMapLoaded(true)}
              className={`h-full w-full transition-opacity duration-700 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {!isMapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-forest">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : null}
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={toggleOpen}
              className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center border border-gold-deep/50 bg-dark text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ViewOnMap;
