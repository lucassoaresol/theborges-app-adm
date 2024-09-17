import { LogOutIcon } from 'lucide-react';
import { TiThMenu } from 'react-icons/ti';
import { useMediaQuery } from 'react-responsive';

import { useAuth } from '@/app/hooks/useAuth';

import { Logo } from './Logo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';

interface IAppbar {
  isMenu: boolean;
  isLogo: boolean;
}

export function Appbar({ isLogo, isMenu }: IAppbar) {
  const { signedIn, signOut } = useAuth();

  const isMaxW = useMediaQuery({
    query: '(max-width: 425px)',
  });

  return (
    <div
      className={`flex items-center h-16 ${isMaxW ? 'p-1' : 'pt-4 pb-4 pr-6 pl-6'} bg-secondary mb-5 ${isLogo ? 'justify-between' : 'justify-end gap-2'}`}
    >
      {isMenu && (
        <Button variant="secondary" size="icon" className="rounded-full ml-2">
          <TiThMenu />
        </Button>
      )}
      {isLogo && <Logo />}
      <div>
        <ThemeSwitcher />
        {signedIn && (
          <Tooltip content="Sair">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full ml-2"
              onClick={signOut}
            >
              <LogOutIcon className="w4 h-4" />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
