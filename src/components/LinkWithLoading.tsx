'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LinkWithLoading({
                                    href,
                                    children,
                                }: {
    href: string;
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);

        router.push(href);
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <a href={href} onClick={handleClick}>
                {children}
            </a>
        </>
    );
}
