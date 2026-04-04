import { FiSearch, FiCpu, FiTerminal } from "react-icons/fi";

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  search: <FiSearch size={16} />,
  cpu: <FiCpu size={16} />,
  terminal: <FiTerminal size={16} />,
};

export const CATEGORY_ICONS_LARGE: Record<string, React.ReactNode> = {
  search: <FiSearch size={22} />,
  cpu: <FiCpu size={22} />,
  terminal: <FiTerminal size={22} />,
};
