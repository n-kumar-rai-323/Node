"use client"

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    posix: LatLngExpression | LatLngTuple;
    zoom?: number;
}

const defaults = {
    zoom: 13,
};

const Map = (MapProps: MapProps) => {
    const { zoom = defaults.zoom, posix } = MapProps;
    const [isClient, setIsClient] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div style={{ height: '100vh', width: '100vw', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>;
    }


    return (
        <div style={{ height: "100%", width: "100%" }}>
            <MapContainer
                center={posix}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", borderRadius: '0' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={posix} draggable={false}>
                    <Popup>
                        <div style={{ padding: '10px' }}>
                            <h2 style={{ margin: '0 0 10px', fontSize: '1.2rem', color: '#333' }}>You Are Here</h2>
                            <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>This is your selected location.</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Map;
