import { motion } from 'framer-motion';

export function TerminalPreview() {
  return (
    <div className="relative w-full max-w-5xl mx-auto pt-10 px-4">
      {/* Main Terminal Window */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-lg shadow-2xl overflow-hidden bg-transparent"
      >
        <img 
          src="/terminal-preview.png" 
          alt="EnsoAI Terminal Interface" 
          className="w-full h-auto rounded-lg shadow-2xl border border-ayu-line/50"
        />
      </motion.div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] border border-ayu-line/30 -z-10 rounded-xl bg-gradient-to-b from-ayu-line/5 to-transparent"></div>
    </div>
  );
}
