import React from 'react';

/** Matches the static HTML shell so route loading never flashes a second design. */
export const SkeletonPageLoader: React.FC = () => (
  <div aria-hidden="true" className="boot-page select-none pointer-events-none">
    <div className="boot-shell">
      <div className="boot-grid">
        <div className="boot-stack">
          <div className="boot-block h-6 w-36 rounded-full" />
          <div className="boot-block h-[58px] w-full max-w-[560px]" />
          <div className="boot-block h-9 w-[65%]" />
          <div className="boot-stack mt-2 max-w-[600px] gap-2.5">
            <div className="boot-block h-4" />
            <div className="boot-block h-4 w-[88%]" />
            <div className="boot-block h-4 w-[70%]" />
          </div>
          <div className="mt-3 flex gap-3">
            <div className="boot-block h-11 w-36" />
            <div className="boot-block h-11 w-32" />
          </div>
        </div>
        <div className="boot-block boot-visual h-[380px] rounded-3xl" />
      </div>
      <div className="boot-cards">
        <div className="boot-block h-28" />
        <div className="boot-block h-28" />
        <div className="boot-block h-28" />
      </div>
    </div>
  </div>
);
