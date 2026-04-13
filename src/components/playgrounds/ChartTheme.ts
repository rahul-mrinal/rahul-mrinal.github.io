import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

export const CHART_COLORS = {
  accent: "#6c63ff",
  accentGlow: "rgba(108, 99, 255, 0.15)",
  teal: "#00c9a7",
  red: "#ff6b6b",
  yellow: "#ffd93d",
  orange: "#ff9f43",
  blue: "#54a0ff",
  text: "#8b8fa7",
  grid: "rgba(46, 51, 69, 0.5)",
  surface: "#12131a",
};

export const CHART_DEFAULTS = {
  responsive: true,
  animation: { duration: 300 } as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1a1c25",
      titleColor: "#e8eaf0",
      bodyColor: "#9398ab",
      borderColor: "#2a2d3a",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: CHART_COLORS.text },
      grid: { color: CHART_COLORS.grid },
    },
    y: {
      ticks: { color: CHART_COLORS.text },
      grid: { color: CHART_COLORS.grid },
    },
  },
};
