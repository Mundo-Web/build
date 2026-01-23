import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

/**
 * ScrollAnimation - Wrapper para animaciones de scroll al estilo gcigc.com
 * 
 * Tipos de animación disponibles:
 * - fade-up: Aparece de abajo hacia arriba con fade
 * - fade-down: Aparece de arriba hacia abajo con fade
 * - fade-left: Aparece desde la izquierda con fade
 * - fade-right: Aparece desde la derecha con fade
 * - fade: Solo fade in
 * - zoom-in: Zoom desde pequeño a normal
 * - zoom-out: Zoom desde grande a normal
 * - flip-up: Rotación 3D desde abajo
 * - flip-down: Rotación 3D desde arriba
 * - slide-up: Slide desde abajo sin fade
 * - slide-down: Slide desde arriba sin fade
 * - slide-left: Slide desde la izquierda sin fade
 * - slide-right: Slide desde la derecha sin fade
 * - blur-in: Aparece desde desenfocado
 * - scale-up: Escala desde 0.8 a 1
 * - rotate-in: Rotación sutil al aparecer
 * - stagger: Para listas, anima cada hijo con delay
 * - parallax: Efecto parallax al hacer scroll
 * - reveal: Máscara que revela el contenido
 * - none: Sin animación
 */

// Variantes de animación predefinidas
const animationVariants = {
  'fade-up': {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  'fade-down': {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 }
  },
  'fade-left': {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 }
  },
  'fade-right': {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
  },
  'fade': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  'zoom-in': {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  'zoom-out': {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1 }
  },
  'flip-up': {
    hidden: { opacity: 0, rotateX: 30, y: 30 },
    visible: { opacity: 1, rotateX: 0, y: 0 }
  },
  'flip-down': {
    hidden: { opacity: 0, rotateX: -30, y: -30 },
    visible: { opacity: 1, rotateX: 0, y: 0 }
  },
  'slide-up': {
    hidden: { y: 100, opacity: 0.5 },
    visible: { y: 0, opacity: 1 }
  },
  'slide-down': {
    hidden: { y: -100, opacity: 0.5 },
    visible: { y: 0, opacity: 1 }
  },
  'slide-left': {
    hidden: { x: -100, opacity: 0.5 },
    visible: { x: 0, opacity: 1 }
  },
  'slide-right': {
    hidden: { x: 100, opacity: 0.5 },
    visible: { x: 0, opacity: 1 }
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' }
  },
  'scale-up': {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  },
  'rotate-in': {
    hidden: { opacity: 0, rotate: -5, y: 20 },
    visible: { opacity: 1, rotate: 0, y: 0 }
  },
  'reveal': {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
    visible: { clipPath: 'inset(0% 0% 0% 0%)' }
  },
  'none': {
    hidden: {},
    visible: {}
  }
};

// Presets de easing
const easingPresets = {
  'ease': [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  'spring': { type: 'spring', stiffness: 100, damping: 15 },
  'bounce': { type: 'spring', stiffness: 300, damping: 10 },
  'smooth': [0.4, 0, 0.2, 1],
  'sharp': [0.4, 0, 0.6, 1],
  'gcigc': [0.25, 0.46, 0.45, 0.94] // Easing similar a gcigc.com
};

const ScrollAnimation = ({ 
  children, 
  animation = 'fade-up',
  duration = 0.8,
  delay = 0,
  easing = 'gcigc',
  threshold = 0.1,
  triggerOnce = true,
  disabled = false,
  className = '',
  style = {},
  staggerChildren = 0.1,
  staggerDirection = 1, // 1 = normal, -1 = reverse
  customVariants = null,
  onAnimationComplete = null,
  // Props de configuración dinámica desde System
  animationConfig = null
}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { 
    once: triggerOnce, 
    amount: threshold 
  });

  // Usar configuración dinámica si está disponible
  const config = animationConfig || {};
  const finalAnimation = config.animation || animation;
  const finalDuration = config.duration || duration;
  const finalDelay = config.delay || delay;
  const finalEasing = config.easing || easing;
  const finalDisabled = config.disabled !== undefined ? config.disabled : disabled;

  useEffect(() => {
    if (isInView && !finalDisabled) {
      controls.start('visible');
    }
  }, [isInView, controls, finalDisabled]);

  // Si está deshabilitado, solo renderiza los children
  if (finalDisabled || finalAnimation === 'none') {
    return <div className={className} style={style}>{children}</div>;
  }

  // Obtener variantes
  const variants = customVariants || animationVariants[finalAnimation] || animationVariants['fade-up'];
  
  // Obtener easing
  const transitionEasing = easingPresets[finalEasing] || easingPresets['gcigc'];
  
  // Construir transición
  const transition = typeof transitionEasing === 'object' && transitionEasing.type
    ? { ...transitionEasing, duration: finalDuration, delay: finalDelay }
    : { duration: finalDuration, delay: finalDelay, ease: transitionEasing };

  // Para stagger children
  if (finalAnimation === 'stagger') {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={style}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerChildren,
              staggerDirection: staggerDirection,
              delayChildren: finalDelay
            }
          }
        }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={animationVariants['fade-up']}
            transition={transition}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={transition}
      onAnimationComplete={() => {
        if (onAnimationComplete) onAnimationComplete();
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Hook personalizado para animaciones de scroll
 * Uso: const { ref, isInView, controls } = useScrollAnimation('fade-up');
 */
export const useScrollAnimation = (animation = 'fade-up', options = {}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { 
    once: options.triggerOnce !== false, 
    amount: options.threshold || 0.1 
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const variants = animationVariants[animation] || animationVariants['fade-up'];
  const transition = {
    duration: options.duration || 0.8,
    delay: options.delay || 0,
    ease: easingPresets[options.easing] || easingPresets['gcigc']
  };

  return { ref, isInView, controls, variants, transition };
};

/**
 * Componente para animar elementos hijos con stagger
 */
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  containerDelay = 0,
  animation = 'fade-up',
  className = '',
  style = {}
}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: containerDelay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={animationVariants[animation]}
          transition={{
            duration: 0.6,
            ease: easingPresets['gcigc']
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * Componente de texto animado caracter por caracter
 */
export const AnimatedText = ({ 
  text, 
  animation = 'fade-up',
  staggerDelay = 0.03,
  className = '',
  as: Component = 'span'
}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const words = text.split(' ');

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              variants={animationVariants[animation]}
              transition={{
                duration: 0.4,
                ease: easingPresets['gcigc']
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};

// Exportar las variantes y easings para uso externo
export { animationVariants, easingPresets };

export default ScrollAnimation;
