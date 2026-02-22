import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  label: string;
  to: string;
}

const tools: NavItem[] = [
  { label: 'Schedule Builder', to: '/builder' },
  { label: 'Group Generator', to: '/groups' },
];

interface AppHeaderProps {
  /** Extra buttons to render before the tools menu (e.g. Export, Share) */
  actions?: React.ReactNode;
}

const AppHeader = ({ actions }: AppHeaderProps) => {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav
        className="container mx-auto flex h-14 items-center justify-between px-4"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>ClassGrid</span>
        </Link>

        <div className="flex items-center gap-2">
          {actions}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Open tools menu">
                <Menu className="h-4 w-4 mr-1" />
                Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tools.map((t) => (
                <DropdownMenuItem key={t.to} asChild disabled={location.pathname === t.to}>
                  <Link to={t.to}>{t.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
