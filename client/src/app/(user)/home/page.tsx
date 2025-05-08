'use client'

// src/app/page.tsx
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const Map = dynamic(
    () => import('@/components/map/'),
    {
        loading: () => <p>A map is loading...</p>,
        ssr: false,
    }
);

const Page = () => {
    const [showMap, setShowMap] = useState(true); // Make map visible by default

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start', // Align items to the start (top)
                padding: '0', // Remove padding to allow map to expand to edges
                margin: '0'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '3px', width: '100%' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Explore Your Location</h1>
                <p style={{ fontSize: '1.1rem', color: '#666' }}>Discover places around you.</p>

            </div>

            <div
                style={{
                    width: '100vw', // Use full viewport width
                    height: '100vh', // Use full viewport height
                    border: 'none',  // Remove border
                    borderRadius: '0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    margin: '0',
                    padding: '0'
                }}
            >
                <Map posix={[27.7103, 85.3222]} />
            </div>

        </div>
    );
};

export default Page;