import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div 
          className="max-w-5xl mx-auto rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden border border-white/5"
          style={{ background: "linear-gradient(145deg, hsl(232, 49%, 10%) 0%, hsl(252, 100%, 8%) 100%)" }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-7xl font-display font-bold mb-8 text-white leading-tight">
              Stop hiring. <br />
              <span className="text-primary italic">Start partnering.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Build with someone who believes in the vision as much as you do.
            </p>
            
            <Link to="/onboarding">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px hsl(252 100% 68% / 0.5)" }}
                whileTap={{ scale: 0.96 }}
                className="group h-18 px-12 rounded-full font-bold flex items-center gap-3 mx-auto text-lg transition-all bg-primary text-white"
              >
                Start Your Journey
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
