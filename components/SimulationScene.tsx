
import React, { useRef, useEffect, useMemo } from 'react';
import { SimulationState } from '../types';

interface Props {
  state: SimulationState;
  onDistanceChange: (distance: number) => void;
}

const SimulationScene: React.FC<Props> = ({ state, onDistanceChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<{x: number, y: number}[]>([]);

  const stars = useMemo(() => {
    return Array.from({ length: 200 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.7 + 0.1,
      twinkle: Math.random() * 0.04
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let orbitAngle = 0;
    let time = 0;

    const render = () => {
      const { width, height } = canvas;
      time += 0.012;
      
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      stars.forEach(star => {
        const opacity = star.opacity + Math.sin(time + star.x * 200) * star.twinkle;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const centerX = width / 2;
      const centerY = height / 2;
      
      const earthX = centerX - (width > 1200 ? state.distance / 5 : (width > 800 ? state.distance / 8 : 0));
      const earthY = centerY;

      if (state.showField) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = width > 800 ? 50 : 35;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          for (let y = 0; y < height; y += 15) {
            const dx = x - earthX;
            const dy = y - earthY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Stronger deformation closer to the body
            const deform = Math.min(60, (state.earthMass * 1600) / (dist + 40));
            const angle = Math.atan2(dy, dx);
            ctx.lineTo(x - Math.cos(angle) * deform, y - Math.sin(angle) * deform);
          }
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          for (let x = 0; x < width; x += 15) {
            const dx = x - earthX;
            const dy = y - earthY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const deform = Math.min(60, (state.earthMass * 1600) / (dist + 40));
            const angle = Math.atan2(dy, dx);
            ctx.lineTo(x - Math.cos(angle) * deform, y - Math.sin(angle) * deform);
          }
          ctx.stroke();
        }
      }

      let moonX = earthX + state.distance;
      let moonY = earthY;

      if (state.isAutoOrbit) {
        const vFactor = Math.sqrt(100 / state.distance) * 0.05;
        orbitAngle += vFactor * state.velocity;
        moonX = earthX + state.distance * Math.cos(orbitAngle);
        moonY = earthY + state.distance * Math.sin(orbitAngle);
      } else {
        pathRef.current = [];
      }

      if (state.showPath && state.isAutoOrbit) {
        pathRef.current.push({x: moonX, y: moonY});
        if (pathRef.current.length > 250) pathRef.current.shift();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
        ctx.setLineDash([2, 10]);
        pathRef.current.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const earthRadius = (width > 800 ? 50 : 38) + (state.earthMass * 1.3);
      const halo = ctx.createRadialGradient(earthX, earthY, earthRadius, earthX, earthY, earthRadius * 1.8);
      halo.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
      halo.addColorStop(0.5, 'rgba(37, 99, 235, 0.05)');
      halo.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      const earthGrad = ctx.createRadialGradient(earthX - earthRadius/3, earthY - earthRadius/3, earthRadius/10, earthX, earthY, earthRadius);
      earthGrad.addColorStop(0, '#93c5fd');
      earthGrad.addColorStop(0.5, '#2563eb');
      earthGrad.addColorStop(1, '#020617');
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      const moonRadius = (width > 800 ? 12 : 9) + (state.moonMass * 35);
      const moonHalo = ctx.createRadialGradient(moonX, moonY, moonRadius, moonX, moonY, moonRadius * 2);
      moonHalo.addColorStop(0, 'rgba(248, 250, 252, 0.1)');
      moonHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonHalo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      const moonGrad = ctx.createRadialGradient(moonX - moonRadius/4, moonY - moonRadius/4, moonRadius/10, moonX, moonY, moonRadius);
      moonGrad.addColorStop(0, '#f8fafc');
      moonGrad.addColorStop(0.6, '#94a3b8');
      moonGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      if (state.showVectors) {
        const dx = moonX - earthX;
        const dy = moonY - earthY;
        const angle = Math.atan2(dy, dx);
        
        // Logarithmic scaling for vectors so they don't overpower the screen
        const rawForce = (state.earthMass * state.moonMass * 10000) / (state.distance * 0.7);
        const arrowLen = Math.max(35, Math.min(130, 20 * Math.log10(rawForce + 1)));

        // Gravity Pair (Newton's 3rd)
        drawArrow(ctx, moonX, moonY, angle + Math.PI, arrowLen, '#ef4444', `F_G: ${rawForce.toFixed(0)}N`);
        drawArrow(ctx, earthX, earthY, angle, arrowLen, '#10b981', `F_R: ${rawForce.toFixed(0)}N`);

        if (state.isAutoOrbit) {
          const velLen = 75 * state.velocity * (100 / Math.sqrt(state.distance));
          drawArrow(ctx, moonX, moonY, angle + Math.PI/2, velLen, '#f59e0b', 'V_f');
        }
      }

      animationId = requestAnimationFrame(render);
    };

    const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number, color: string, label: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.strokeStyle = color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(length, 0);
      ctx.stroke();
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(length, 0);
      ctx.lineTo(length - 12, -7);
      ctx.lineTo(length - 12, 7);
      ctx.closePath();
      ctx.fill();
      
      ctx.rotate(-angle);
      ctx.shadowBlur = 0;
      ctx.font = '900 11px "JetBrains Mono"';
      ctx.textAlign = 'center';
      
      const tx = Math.cos(angle) * (length + 22);
      const ty = Math.sin(angle) * (length + 22);
      
      const labelW = ctx.measureText(label.toUpperCase()).width;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(tx - labelW/2 - 6, ty - 8, labelW + 12, 16);
      
      ctx.fillStyle = '#fff';
      ctx.fillText(label.toUpperCase(), tx, ty + 4);
      ctx.restore();
    };

    const resize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [state, stars]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (state.isAutoOrbit) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { width } = canvasRef.current!;
    const earthX = (width / 2) - (width > 1200 ? state.distance / 5 : (width > 800 ? state.distance / 8 : 0));
    
    const onMove = (me: PointerEvent) => {
      const cx = me.clientX - rect.left;
      onDistanceChange(Math.max(120, Math.min(580, Math.abs(cx - earthX))));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative group">
      <canvas ref={canvasRef} onPointerDown={handlePointerDown} className="block cursor-crosshair" />
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-blue-500/30 rounded-full" />
      </div>
    </div>
  );
};

export default SimulationScene;
