// src/components/map/index.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { DatePickerWithRange } from "../date-piker";

// Corrected import path based on your Avatars.tsx location in src/components/ui
import Avatars from "../ui/avatar";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom: 13,
};

const customMarkerIcon = new Icon({
  iconUrl:
    "https://lh3.googleusercontent.com/p/AF1QipO5WX8Y9fN9wE-X-tjdSCmqtECLIMVkC-epnNvJ=w426-h240-k-no", // Replace with a valid, accessible URL for your marker icon
  shadowUrl:
    "https://lh3.googleusercontent.com/p/AF1QipO5WX8Y9fN9wE-X-tjdSCmqtECLIMVkC-epnNvJ=w426-h240-k-no", // Replace with a valid, accessible URL for your shadow icon
  iconSize: [25, 40],
  className: "rounded-full",
  iconAnchor: [12, 41],
  popupAnchor: [300, 300],
  shadowSize: [41, 41],
});

const Map = ({ posix, zoom = defaults.zoom }: MapProps) => {
  const [isClient, setIsClient] = useState(false);

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
    <div className="relative h-screen w-350">
      {/* Top Bar Container: Search, Date Picker, and Avatar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center space-x-4 p-2 bg-white rounded-lg shadow-lg">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search location..."
            className="w-[250px] md:w-[300px] lg:w-[400px] pl-9 pr-4 py-2 text-sm rounded-md focus:outline-none border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          />
        </div>
        {/* Date Picker */}
        <DatePickerWithRange className="flex-shrink-0" />
        {/* Avatar positioned like Google Maps - top right, circular, with shadow */}
      <div className="absolute top-4 right-4 z-[9999]">
        <div className="rounded-full size-16 shadow-md bg-white p-1 flex items-center justify-center overflow-hidden">
          <Avatars />
        </div>
      </div>
      </div>

      

      {/* Map Container - takes up the full space of its parent */}
      <MapContainer
        center={posix}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-none"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[27.702794, 85.315323]} icon={customMarkerIcon}>
          <Popup>Tundikhel टुंडिखेल</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;