"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#0a1c15] text-white overflow-hidden">
      
      {/* ━━━ LEFT SIDE (Image/Video Branding) ━━━ */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 lg:p-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1509391366360-1e97f52ce23b?q=80&w=2070&auto=format&fit=crop" 
            alt="Solar Panels" 
            className="w-full h-full object-cover"
          />
          {/* Green tint overlay */}
          <div className="absolute inset-0 bg-[#0a2e24] opacity-80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1c15] via-transparent to-[#0a1c15]/50" />
        </div>

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1 font-display font-bold text-[28px] tracking-tight cursor-pointer"
            >
              SRE<span className="text-[#e8ecc4] font-light -ml-1.5">.</span>
            </motion.div>
          </Link>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-[48px] xl:text-[64px] font-display font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Welcome <br />
                <span className="text-[#e8ecc4] font-serif italic font-normal text-[36px] xl:text-[48px] lowercase tracking-normal">to the</span> <br />
                Future
              </h2>
              <p className="text-white/70 max-w-sm text-[15px] leading-relaxed font-light">
                Sign in to manage projects, track microgrid operations, and access the Society of Renewable Energy portal.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ━━━ RIGHT SIDE (Login Form) ━━━ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20 relative z-10">
        
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/">
            <div className="inline-flex items-center gap-1 font-display font-bold text-[24px] tracking-tight cursor-pointer">
              SRE<span className="text-[#e8ecc4] font-light -ml-1">.</span>
            </div>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-12">
            <h1 className="text-[32px] md:text-[40px] font-display font-bold tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-white/50 text-[14px]">
              Enter your credentials to access your account.
            </p>
          </div>

          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email Input */}
            <div className="relative group">
              <input 
                type="email" 
                id="email"
                placeholder=" "
                className="block w-full px-0 py-3 text-white bg-transparent border-0 border-b-2 border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-[#e8ecc4] peer transition-colors"
                required
              />
              <label 
                htmlFor="email" 
                className="absolute text-[15px] text-white/50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#e8ecc4] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email address
              </label>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                placeholder=" "
                className="block w-full px-0 py-3 text-white bg-transparent border-0 border-b-2 border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-[#e8ecc4] peer transition-colors pr-10"
                required
              />
              <label 
                htmlFor="password" 
                className="absolute text-[15px] text-white/50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#e8ecc4] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password & Remember Me */}
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/30 rounded-[3px] checked:bg-[#e8ecc4] checked:border-[#e8ecc4] transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-[#0a1c15] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[13px] text-white/60 group-hover:text-white transition-colors select-none">Remember me</span>
              </label>
              
              <a href="#" className="text-[13px] text-[#e8ecc4] hover:text-white transition-colors font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="group relative w-full flex items-center justify-center gap-3 bg-[#e8ecc4] text-[#0a1c15] text-[15px] font-bold tracking-widest uppercase rounded-full px-8 py-4 mt-4 overflow-hidden transition-transform active:scale-95 hover:bg-white"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </form>

          {/* Sign Up Link */}
          <div className="mt-10 text-center text-[13px] text-white/50">
            Don't have an account?{' '}
            <a href="#" className="text-[#e8ecc4] hover:text-white transition-colors font-bold tracking-wide">
              Request access
            </a>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
