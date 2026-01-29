import { cssInterop } from "nativewind";
import {
  Home,
  Heart,
  History,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Cast,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Plus,
  Trash2,
  Edit,
  Star,
  Circle,
  type LucideIcon,
} from "lucide-react-native";

// Configure cssInterop for each icon we use
const icons: LucideIcon[] = [
  Home,
  Heart,
  History,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Cast,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Plus,
  Trash2,
  Edit,
  Star,
  Circle,
];

for (const Icon of icons) {
  cssInterop(Icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

export {
  Home,
  Heart,
  History,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Cast,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Plus,
  Trash2,
  Edit,
  Star,
  Circle,
};
