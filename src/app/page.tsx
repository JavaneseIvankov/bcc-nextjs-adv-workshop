// "use client";

import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { EventsListContainer } from '@/containers/events-list-container';

export default function Home() {
   return (
      <>
         <AppHeader />
         <EventsListContainer />
      </>
   );
}

function AppHeader() {
   return (
      <header className="bg-background sticky top-0 z-10 border-b">
         <div className="flex justify-between container py-3 sticky top-0 z-10">
            <AppLogo />
            <AppHeaderAction />
         </div>
      </header>
   );
}

function AppLogo() {
   return (
      <h1 className="xl:text-4xl md:text-3xl text-2xl font-bold">Evently</h1>
   );
}

function AppHeaderAction() {
   return (
      <div>
         <Popover>
            <PopoverTrigger>
               <Avatar>
                  <AvatarImage src={''} />
                  <AvatarFallback />
               </Avatar>
            </PopoverTrigger>
            <PopoverContent>
               <h1>hello</h1>
               <Separator></Separator>
            </PopoverContent>
         </Popover>
      </div>
   );
}
