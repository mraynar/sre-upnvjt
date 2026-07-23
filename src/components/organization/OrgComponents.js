import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Users, User, Shield } from "lucide-react";

// Inline LinkedIn SVG to avoid import package versions mismatch
function LinkedinIcon({ className }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

// ─── 1. Avatar Fallback component ──────────────────────────────────────────────
export function AvatarFallback({ className }) {
  return (
    <div className={`bg-white/15 dark:bg-emerald-950/40 flex items-center justify-center text-white/40 dark:text-emerald-500/40 relative overflow-hidden ${className}`}>
      <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

// ─── 2. Department Card component ──────────────────────────────────────────────
export function DepartmentCard({ dept, index }) {
  const numberStr = String(index + 1).padStart(2, "0");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="bg-[#099c6d] border-2 border-[#e8ecc4] dark:bg-[#0a1f15] dark:border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden group hover:border-[#e8ecc4] dark:hover:border-emerald-400 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between shadow-md"
    >
      {/* Decorative Index Number */}
      <div className="absolute top-4 right-6 text-[52px] font-display font-black text-white/20 dark:text-emerald-400/20 group-hover:text-[#e8ecc4] dark:group-hover:text-emerald-400/40 transition-colors">
        {numberStr}
      </div>

      <div className="flex-1 flex flex-col justify-between gap-6">
        <div>
          <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white dark:text-white mb-2 pr-12 leading-tight">
            {dept.name}
          </h4>
          <p className="text-xs md:text-sm text-emerald-50/90 dark:text-gray-300 leading-relaxed font-bold mb-4 line-clamp-3">
            {dept.description}
          </p>
        </div>

        {/* Stats & Director Summary */}
        <div className="space-y-4 pt-4 border-t border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 text-xs font-bold text-white/90">
            <User className="w-4 h-4 text-[#e8ecc4] dark:text-emerald-400" />
            <span className="truncate">
              Director: <strong className="text-[#e8ecc4] dark:text-emerald-400 font-extrabold">{dept.directorName || "Not Assigned"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/80 dark:text-gray-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#e8ecc4]/85 dark:text-emerald-400/70" />
              {dept.managerCount} Managers
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#e8ecc4]/85 dark:text-emerald-400/70" />
              {dept.staffCount} Staff Members
            </span>
          </div>
        </div>

        {/* View Team CTA Button */}
        <div className="pt-2">
          <Link
            href={`/about/organization/${dept.slug}`}
            className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-[#e8ecc4] hover:text-white dark:text-emerald-400 dark:hover:text-white transition-colors duration-300"
          >
            VIEW TEAM
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 3. Member Card component (Used for Manager and Staff) ─────────────────────
export function MemberCard({ member, fallbackRole }) {
  if (!member) return null;
  const name = member.name || "Unnamed Member";
  const role = member.role || fallbackRole || "Team Member";
  const photo = member.photo;

  return (
    <div className="group relative bg-white/10 dark:bg-[#07130e] border border-white/10 dark:border-white/5 rounded-3xl overflow-hidden hover:border-yellow-300/40 dark:hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] flex flex-col">
      <div className="aspect-[4/5] bg-black/40 overflow-hidden relative w-full">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 15vw"
            className="object-cover transition-all duration-700 ease-out filter grayscale group-hover:grayscale-0 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <AvatarFallback className="w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07130e]/90 via-[#07130e]/10 to-transparent pointer-events-none" />
      </div>
      <div className="p-4 flex-1">
        <span className="text-[9px] font-black tracking-widest uppercase text-yellow-300 dark:text-emerald-400 block mb-1">
          {role}
        </span>
        <h4 className="text-sm font-black text-white dark:text-white group-hover:text-yellow-300 dark:group-hover:text-emerald-400 transition-colors leading-tight line-clamp-2">
          {name}
        </h4>
      </div>
    </div>
  );
}

// ─── 4. Director Card component ───────────────────────────────────────────────
export function DirectorCard({ director, fallbackRole }) {
  if (!director) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white/5 border border-white/10 rounded-3xl">
        <User className="w-12 h-12 mx-auto text-white/20 mb-3" />
        <h3 className="text-lg font-black text-white/50">No Director Assigned</h3>
        <p className="text-xs text-white/40 mt-1">This position is currently empty.</p>
      </div>
    );
  }

  const name = director.name || "Director Profile";
  const role = director.role || fallbackRole || "Director";
  const photo = director.photo;
  const socials = director.socials || {};

  return (
    <div className="max-w-xl mx-auto bg-white/10 dark:bg-[#07130e] border-2 border-yellow-300 dark:border-emerald-500/40 rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center shadow-xl">
      <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden relative shrink-0 bg-black/40 border border-white/10">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="192px"
            className="object-cover"
            priority
          />
        ) : (
          <AvatarFallback className="w-full h-full" />
        )}
      </div>

      <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
        <span className="text-[11px] font-black tracking-widest uppercase text-yellow-300 dark:text-emerald-400 mb-1">
          {role}
        </span>
        <h3 className="text-2xl font-black text-white dark:text-white leading-tight">
          {name}
        </h3>
        
        {/* Social Links */}
        <div className="flex justify-center md:justify-start items-center gap-3 mt-4">
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${name}'s LinkedIn`}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-yellow-300 hover:text-slate-950 dark:hover:bg-emerald-400 flex items-center justify-center text-white transition-all duration-300"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {socials.email && (
            <a
              href={socials.email}
              aria-label={`Email ${name}`}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-yellow-300 hover:text-slate-950 dark:hover:bg-emerald-400 flex items-center justify-center text-white transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 5. Manager Section component ──────────────────────────────────────────────
export function ManagerSection({ divisions }) {
  const divisionsWithManagers = divisions ? divisions.filter(div => div.manager) : [];
  
  if (divisionsWithManagers.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-sm font-black text-yellow-300 dark:text-emerald-400 tracking-[0.25em] uppercase mb-1">
          Division Managers
        </h3>
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
          Kepengurusan Divisi
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center max-w-5xl mx-auto w-full">
        {divisionsWithManagers.map((div, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <div className="text-xs font-black tracking-widest text-white/40 uppercase text-center border-b border-white/10 pb-2">
              {div.name}
            </div>
            <MemberCard member={div.manager} fallbackRole="Division Manager" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. Staff Grid component ──────────────────────────────────────────────────
export function StaffGrid({ divisions }) {
  // Aggregate all staff across all divisions
  const allStaff = [];
  if (divisions) {
    divisions.forEach(div => {
      if (div.staff && Array.isArray(div.staff)) {
        div.staff.forEach(s => {
          allStaff.push({
            ...s,
            divisionName: div.name
          });
        });
      }
    });
  }

  if (allStaff.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-sm font-black text-yellow-300 dark:text-emerald-400 tracking-[0.25em] uppercase mb-1">
          Staff Members
        </h3>
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
          Seluruh Anggota Staf
        </h2>
      </div>

      {/* Adaptive responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 max-w-7xl mx-auto w-full">
        {allStaff.map((staffMember, idx) => (
          <MemberCard
            key={idx}
            member={staffMember}
            fallbackRole={`Staff of ${staffMember.divisionName || "Division"}`}
          />
        ))}
      </div>
    </div>
  );
}
