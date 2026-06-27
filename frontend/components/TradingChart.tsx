'use client';
import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export default function TradingChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, { height: 430, layout: { background: { type: ColorType.Solid, color: '#10151f' }, textColor: '#d1d4dc' }, grid: { vertLines: { color: '#1d2636' }, horzLines: { color: '#1d2636' } }, rightPriceScale: { borderColor: '#293244' }, timeScale: { borderColor: '#293244' } });
    const series = chart.addCandlestickSeries({ upColor: '#00c076', downColor: '#f6465d', borderVisible: false, wickUpColor: '#00c076', wickDownColor: '#f6465d' });
    series.setData([
      { time: '2026-06-16', open: 64200, high: 66800, low: 63100, close: 66000 }, { time: '2026-06-17', open: 66000, high: 67100, low: 65000, close: 65400 }, { time: '2026-06-18', open: 65400, high: 68900, low: 64800, close: 68100 }, { time: '2026-06-19', open: 68100, high: 70000, low: 67200, close: 69400 }, { time: '2026-06-20', open: 69400, high: 70450, low: 68400, close: 69920 }, { time: '2026-06-21', open: 69920, high: 71200, low: 69150, close: 70680 }, { time: '2026-06-22', open: 70680, high: 71600, low: 68800, close: 69350 }
    ]);
    chart.timeScale().fitContent();
    const resize = () => chart.applyOptions({ width: ref.current?.clientWidth || 0 });
    resize(); window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); chart.remove(); };
  }, []);
  return <div ref={ref} className="min-h-[430px] rounded-2xl border border-white/10 bg-krypt-panel" />;
}
