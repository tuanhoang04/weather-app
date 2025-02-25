import React, { useState, useEffect, useCallback } from "react";
import { useGeolocated } from "react-geolocated";

// Child component that uses useGeolocated
function GeoLocator ({ onLocationObtained }) {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: { enableHighAccuracy: false },
      userDecisionTimeout: 5000,
      // No need to suppress on mount because this component only mounts after the button click.
    });

  // When coordinates become available, send them to the parent.
  useEffect(() => {
    if (coords) {
      onLocationObtained(coords.latitude, coords.longitude);
    }
  }, [coords, onLocationObtained]);
  return <div></div>;
};


export default GeoLocator