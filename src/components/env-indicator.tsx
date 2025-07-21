'use client';

export const EnvIndicator = () => {
    if (process.env.NEXT_PUBLIC_ENV === 'production') return null;
    
    return (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
            {process.env.NEXT_PUBLIC_ENV}
        </div>
    );
}; 