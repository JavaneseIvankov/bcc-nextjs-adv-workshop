import { Sidebar } from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import { HouseIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
   return (
      <div className="container mx-auto mt-4 flex min-h-[400vh] gap-6 lg:mt-8">
         <Sidebar />
         <main className="flex-1 min-h-[600px] bg-slate-muted p-6">
            {children}
         </main>
      </div>
   );
}
