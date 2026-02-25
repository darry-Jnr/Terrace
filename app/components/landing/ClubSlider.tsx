"use client"
const clubs = [
    { name: 'Arsenal', logo: 'https://resources.premierleague.com/premierleague/badges/t3.png' },
    { name: 'Aston Villa', logo: 'https://resources.premierleague.com/premierleague/badges/t7.png' },
    { name: 'Bournemouth', logo: 'https://resources.premierleague.com/premierleague/badges/t91.png' },
    { name: 'Brentford', logo: 'https://resources.premierleague.com/premierleague/badges/t94.png' },
    { name: 'Brighton', logo: 'https://resources.premierleague.com/premierleague/badges/t36.png' },
    { name: 'Chelsea', logo: 'https://resources.premierleague.com/premierleague/badges/t8.png' },
    { name: 'Crystal Palace', logo: 'https://resources.premierleague.com/premierleague/badges/t31.png' },
    { name: 'Everton', logo: 'https://resources.premierleague.com/premierleague/badges/t11.png' },
    { name: 'Fulham', logo: 'https://resources.premierleague.com/premierleague/badges/t54.png' },
    { name: 'Ipswich', logo: 'https://resources.premierleague.com/premierleague/badges/t40.png' },
    { name: 'Leicester', logo: 'https://resources.premierleague.com/premierleague/badges/t13.png' },
    { name: 'Liverpool', logo: 'https://resources.premierleague.com/premierleague/badges/t14.png' },
    { name: 'Man City', logo: 'https://resources.premierleague.com/premierleague/badges/t43.png' },
    { name: 'Man Utd', logo: 'https://resources.premierleague.com/premierleague/badges/t1.png' },
    { name: 'Newcastle', logo: 'https://resources.premierleague.com/premierleague/badges/t4.png' },
    { name: 'Nottm Forest', logo: 'https://resources.premierleague.com/premierleague/badges/t17.png' },
    { name: 'Southampton', logo: 'https://resources.premierleague.com/premierleague/badges/t20.png' },
    { name: 'Spurs', logo: 'https://resources.premierleague.com/premierleague/badges/t6.png' },
    { name: 'West Ham', logo: 'https://resources.premierleague.com/premierleague/badges/t21.png' },
    { name: 'Wolves', logo: 'https://resources.premierleague.com/premierleague/badges/t39.png' },
  ]
  
  const doubled = [...clubs, ...clubs]
  
  export default function ClubSlider() {
    return (
      <section className="py-20 bg-white overflow-hidden">
        <p className="text-center text-xs font-bold tracking-widest uppercase text-slate-300 mb-10">
          Your club is waiting
        </p>
  
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
  
          <div className="flex gap-3 w-max animate-marquee">
            {doubled.map((club, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white hover:bg-slate-900 border border-slate-100 hover:border-slate-900 rounded-2xl px-5 py-3.5 cursor-pointer transition-all duration-200 group flex-shrink-0 shadow-sm hover:shadow-lg"
              >
                <img
                  src={club.logo}
                  alt={club.name}
                  width={30}
                  height={30}
                  className="object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />
                <span className="text-sm font-semibold text-slate-600 group-hover:text-white whitespace-nowrap transition-colors duration-200">
                  {club.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }