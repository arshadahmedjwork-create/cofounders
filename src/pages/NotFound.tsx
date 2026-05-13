import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0B0F2F] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">System Error: 404</span>
          </div>
          
          <h1 className="text-8xl md:text-9xl font-display font-black text-white mb-6 tracking-tighter">
            Lost in <span className="text-primary italic">Space</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
            Even our AI couldn't find a co-founder at this coordinate. You've drifted beyond the known network.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20"
              >
                <ArrowLeft size={18} />
                Back to Earth
              </motion.button>
            </Link>
            
            <Link to="/browse">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <Rocket size={18} />
                Find Co-founders
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative floating icon */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none"
      >
        <Rocket size={400} className="text-white" />
      </motion.div>
    </div>
  );
};

export default NotFound;
