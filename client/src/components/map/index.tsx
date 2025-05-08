"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom: 13,
};
// const customMarkerIcon = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const customMarkerIcon = new Icon({
    iconUrl: 'https://lh3.googleusercontent.com/p/AF1QipO5WX8Y9fN9wE-X-tjdSCmqtECLIMVkC-epnNvJ=w426-h240-k-no',
    shadowUrl: 'https://lh3.googleusercontent.com/p/AF1QipO5WX8Y9fN9wE-X-tjdSCmqtECLIMVkC-epnNvJ=w426-h240-k-no',
    iconSize: [25,40],
    className:"rounded-full",    
    iconAnchor: [12, 41],
    popupAnchor: [300, 300],
    shadowSize: [41, 41],
});

const Map = (MapProps: MapProps) => {
  const { zoom = defaults.zoom, posix } = MapProps;
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading Map...
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={posix}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "0" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[27.702794, 85.315323]} icon={customMarkerIcon}>
          <Popup>
          Tundikhel
          टुंडिखेल
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
