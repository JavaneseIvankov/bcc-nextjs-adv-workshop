import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { HouseIcon, Settings } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { redirect } from 'next/dist/client/components/navigation';

const CurrentUserCard = ({
   avatarUrl,
   name,
   className,
}: {
   avatarUrl: string;
   name: string;
   className?: string;
}) => {
   return (
      <div className={cn('bg-card border px-4 py-3 flex gap-3', className)}>
         <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback />
         </Avatar>
         {name}
      </div>
   );
};

export async function Sidebar() {
   let session = await auth.api.getSession({
      headers: await headers(),
   });

   // if (!session) {
   //    redirect('/login');
   // }

   return (
      <aside className="sticky top-4 self-start w-[140px] lg:w-[220px]">
         <div className="border bg-card p-2">
            <nav className="flex flex-col gap-1">
               <SidebarItem
                  item={{
                     icon: <HouseIcon className="size-5" />,
                     title: 'Home',
                     href: '/dashboard',
                  }}
               />
               <SidebarItem
                  item={{
                     icon: <Settings className="size-5" />,
                     title: 'Settings',
                     href: '/settings',
                  }}
               />
            </nav>
         </div>
         <CurrentUserCard
            avatarUrl={
               session?.user?.image ?? 'https://i.pravatar.cc/300?img=12'
            }
            name={session?.user?.name ?? 'unknown'}
            className="mt-3"
         />
      </aside>
   );
}

type SidebarItemProps = {
   item: {
      icon: ReactNode;
      title: string;
      href: string;
   };
   className?: string;
};

export function SidebarItem({ item, className }: SidebarItemProps) {
   return (
      <Link
         href={item.href}
         className={cn(
            'hover:bg-primary/5 flex items-center gap-3 px-4 py-3 transition-colors',
            className,
         )}
      >
         {item.icon}

         <span className="text-sm font-medium">{item.title}</span>
      </Link>
   );
}
