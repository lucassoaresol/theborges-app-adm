import { Link } from 'react-router-dom';

import { Avatar, AvatarImage } from './ui/Avatar';

export function Logo() {
  return (
    <Link to="/">
      <div className="flex justify-center items-center gap-2 h-full">
        <Avatar className="w-12 h-12">
          <AvatarImage src="/logo.png" alt="Barbearia The Borges" />
        </Avatar>
        <span className="text-md font-bold">Barbearia The Borges</span>
      </div>
    </Link>
  );
}
