declare module 'react-gauge-chart' {
  import { FC } from 'react';

  interface GaugeChartProps {
    id?: string;
    nrOfLevels?: number;
    colors?: string[];
    arcWidth?: number;
    percent?: number;
    textColor?: string;
    needleColor?: string;
    needleBaseColor?: string;
    hideText?: boolean;
    formatTextValue?: (value: string) => string;
    animate?: boolean;
    animDelay?: number;
    animateDuration?: number;
    arcsLength?: number[];
    cornerRadius?: number;
    marginInPercent?: number;
    style?: React.CSSProperties;
    className?: string;
  }

  const GaugeChart: FC<GaugeChartProps>;
  export default GaugeChart;
}
