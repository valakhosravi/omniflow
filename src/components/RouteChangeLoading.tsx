'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RouteChangeLoading({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [prevPath, setPrevPath] = useState(pathname);

    // وقتی مسیر تغییر کرد، لودینگ فعال میشه
    useEffect(() => {
        if (pathname !== prevPath) {
            setLoading(true);
            setPrevPath(pathname);
        }
    }, [pathname, prevPath]);

    // وقتی children (صفحه جدید) تغییر کرد، لودینگ رو خاموش کن
    // چون React وقتی صفحه جدید رندر شد، children هم عوض میشه
    useEffect(() => {
        if (loading) {
            // این microtask تضمین میکنه که بعد از رندر صفحه جدید، لودینگ قطع بشه
            Promise.resolve().then(() => setLoading(false));
        }
    }, [children, loading]);

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            {children}
        </>
    );
}
