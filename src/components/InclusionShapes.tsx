const InclusionShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Connected circles representing unity */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-4 border-primary/20 animate-float" />
      <div className="absolute top-28 left-24 w-24 h-24 rounded-full border-4 border-secondary/20 animate-float-delayed" />
      <div className="absolute top-60 right-20 w-40 h-40 rounded-full border-4 border-accent/15 animate-float-slow" />
      <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-primary/5 animate-pulse-soft" />
      <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-secondary/5 animate-pulse-soft" />
      {/* Dots pattern */}
      <div className="absolute bottom-20 right-10 grid grid-cols-4 gap-3 opacity-20">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-primary" />
        ))}
      </div>
    </div>
  );
};

export default InclusionShapes;
