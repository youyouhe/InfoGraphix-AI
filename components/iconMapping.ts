/**
 * Icon Mapping for Infographic Sections
 * Maps icon string names to lucide-react icon components
 */

import {
  // AI & Tech
  Bot, Brain, Cpu, HardDrive, Database, Server,
  // Communication
  MessageSquare, Mail, Phone, Send, Paperclip, AtSign,
  // UI & Design
  Layout, Palette, Image, Video, Film, Camera, Monitor, Smartphone,
  // Files & Docs
  FileText, FileCode, FileImage, File, FolderOpen, Files,
  // Actions
  Search, Settings, Wrench, Hammer, Zap, Bolt, Power, ToggleRight,
  // Business & Finance
  DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, LineChart,
  Wallet, CreditCard, Briefcase, Building2, Store, ShoppingCart,
  // Users & People
  Users, User, UserPlus, UserCheck, UserCircle, Users2, Handshake,
  // Security
  Shield, ShieldCheck, Lock, Unlock, Key, Eye, EyeOff,
  // Navigation & Movement
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpDown,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  Navigation, MapPin, Globe, Compass,
  // Time & Calendar
  Clock, Calendar, Timer, AlarmClock, Hourglass,
  // Status & Feedback
  CheckCircle, XCircle, AlertCircle, AlertTriangle, Info,
  Check, X, Plus, Minus, Circle,
  // Math & Logic
  Calculator, Equal, Percent, Hash,
  // Cloud & Network
  Cloud, CloudDownload, CloudUpload, Wifi, Cable,
  // Development
  Code, Terminal, GitBranch, GitCommit, Bug,
  // Health & Science
  Heart, Activity, Stethoscope, Pill, Microscope, Atom,
  // Education
  BookOpen, GraduationCap,
  // Creative
  Pen, Pencil, Paintbrush, Sparkles, Lightbulb,
  // Shapes
  Square, Triangle, Star, Diamond, Hexagon,
  // Animals & Nature
  Sun, Moon, CloudRain, Flower, Leaf,
  // Emotions
  Smile, Frown, Meh, Laugh, HeartHandshake,
  // Misc
  Box, Package, Truck, Rocket, Anchor, Flag,
  Target, Award, Medal, Trophy, Crown,
  Bell, Bookmark, Share2, Link, Copy,
  Home, Building, Factory, Warehouse,
  Layers, Grid, List, ListOrdered,
  Maximize2, Minimize2, Expand, Shrink,
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

/**
 * Icon name mapping
 * Format: 'icon-name' -> LucideIcon Component
 * Supports both 'lucide/icon-name' and plain 'icon-name' formats
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  // AI & Tech
  'robot': Bot,
  'brain': Brain,
  'cpu': Cpu,
  'chip': Cpu,
  'hard-drive': HardDrive,
  'database': Database,
  'server': Server,
  'ai': Bot,
  'machine-learning': Brain,

  // Communication
  'chat': MessageSquare,
  'message': MessageSquare,
  'email': Mail,
  'mail': Mail,
  'phone': Phone,
  'send': Send,
  'paperclip': Paperclip,
  'at-sign': AtSign,
  'comment': MessageSquare,

  // UI & Design
  'layout': Layout,
  'palette': Palette,
  'image': Image,
  'picture': Image,
  'video': Video,
  'film': Film,
  'camera': Camera,
  'monitor': Monitor,
  'desktop': Monitor,
  'laptop': Monitor,
  'mobile': Smartphone,
  'smartphone': Smartphone,

  // Files & Docs
  'file': File,
  'file-text': FileText,
  'document': FileText,
  'file-code': FileCode,
  'file-image': FileImage,
  'folder': FolderOpen,
  'files': Files,

  // Actions
  'search': Search,
  'find': Search,
  'settings': Settings,
  'wrench': Wrench,
  'tool': Hammer,
  'hammer': Hammer,
  'zap': Zap,
  'flash': Bolt,
  'bolt': Zap,
  'power': Power,
  'toggle': ToggleRight,

  // Business & Finance
  'dollar': DollarSign,
  'money': DollarSign,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'line-chart': LineChart,
  'chart': BarChart3,
  'wallet': Wallet,
  'credit-card': CreditCard,
  'briefcase': Briefcase,
  'building': Building2,
  'office': Building2,
  'store': Store,
  'shop': Store,
  'cart': ShoppingCart,
  'shopping': ShoppingCart,

  // Users & People
  'users': Users,
  'user': User,
  'user-plus': UserPlus,
  'user-check': UserCheck,
  'user-circle': UserCircle,
  'team': Users,
  'people': Users,
  'handshake': Handshake,
  'partner': Handshake,

  // Security
  'shield': Shield,
  'shield-check': ShieldCheck,
  'lock': Lock,
  'unlock': Unlock,
  'key': Key,
  'eye': Eye,
  'eye-off': EyeOff,
  'security': Shield,
  'privacy': Shield,

  // Navigation & Movement
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'navigation': Navigation,
  'map-pin': MapPin,
  'location': MapPin,
  'globe': Globe,
  'world': Globe,
  'compass': Compass,

  // Time & Calendar
  'clock': Clock,
  'time': Clock,
  'calendar': Calendar,
  'timer': Timer,
  'alarm': AlarmClock,
  'hourglass': Hourglass,

  // Status & Feedback
  'check-circle': CheckCircle,
  'success': CheckCircle,
  'x-circle': XCircle,
  'error': XCircle,
  'alert-circle': AlertCircle,
  'warning': AlertTriangle,
  'info': Info,
  'check': Check,
  'done': Check,
  'x': X,
  'close': X,
  'plus': Plus,
  'add': Plus,
  'minus': Minus,
  'circle': Circle,

  // Math & Logic
  'calculator': Calculator,
  'equal': Equal,
  'percent': Percent,
  'hash': Hash,

  // Cloud & Network
  'cloud': Cloud,
  'cloud-download': CloudDownload,
  'cloud-upload': CloudUpload,
  'wifi': Wifi,
  'ethernet': Cable,
  'cable': Cable,
  'network': Server,

  // Development
  'code': Code,
  'terminal': Terminal,
  'git': GitBranch,
  'branch': GitBranch,
  'commit': GitCommit,
  'bug': Bug,

  // Health & Science
  'heart': Heart,
  'activity': Activity,
  'pulse': Activity,
  'stethoscope': Stethoscope,
  'pill': Pill,
  'microscope': Microscope,
  'atom': Atom,
  'health': Heart,

  // Education
  'book': BookOpen,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  'chalkboard': BookOpen,
  'blackboard': BookOpen,
  'education': BookOpen,

  // Creative
  'pen': Pen,
  'pencil': Pencil,
  'paintbrush': Paintbrush,
  'brush': Paintbrush,
  'sparkles': Sparkles,
  'lightbulb': Lightbulb,
  'creative': Sparkles,

  // Shapes
  'square': Square,
  'triangle': Triangle,
  'star': Star,
  'diamond': Diamond,
  'hexagon': Hexagon,

  // Animals & Nature
  'sun': Sun,
  'moon': Moon,
  'cloud-rain': CloudRain,
  'tree': Flower,
  'flower': Flower,
  'leaf': Leaf,

  // Emotions
  'smile': Smile,
  'happy': Smile,
  'sad': Frown,
  'laugh': Laugh,
  'emoji': Smile,

  // Misc
  'box': Box,
  'package': Package,
  'truck': Truck,
  'rocket': Rocket,
  'anchor': Anchor,
  'flag': Flag,
  'target': Target,
  'award': Award,
  'medal': Medal,
  'trophy': Trophy,
  'crown': Crown,
  'bell': Bell,
  'bookmark': Bookmark,
  'share': Share2,
  'link': Link,
  'copy': Copy,
  'home': Home,
  'factory': Factory,
  'warehouse': Warehouse,
  'layers': Layers,
  'grid': Grid,
  'list': List,
  'list-ordered': ListOrdered,
};

/**
 * Normalize icon name by removing prefix and converting to lowercase
 * Handles formats like:
 * - 'mdi/robot' -> 'robot'
 * - 'lucide/brain' -> 'brain'
 * - 'robot' -> 'robot'
 */
export function normalizeIconName(iconName: string): string {
  if (!iconName) return '';

  return iconName
    .toLowerCase()
    .replace(/^(mdi|lucide|mingcute|feather)\/(.+)$/, '$2')
    .replace(/_/g, '-')
    .trim();
}

/**
 * Get icon component by name
 * Returns the lucide-react component or null if not found
 */
export function getIconComponent(iconName: string): LucideIcon | null {
  if (!iconName) return null;

  const normalized = normalizeIconName(iconName);
  return ICON_MAP[normalized] || null;
}

/**
 * Get all available icon names (for documentation/debugging)
 */
export function getAvailableIconNames(): string[] {
  return Object.keys(ICON_MAP).sort();
}
