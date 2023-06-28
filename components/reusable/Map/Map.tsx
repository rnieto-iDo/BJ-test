import React, { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import cs from 'classnames';
import styles from './Map.module.scss';
import { getKey } from '../../../utils';

type MapProps = {
    // eslint-disable-next-line react/require-default-props
    className?: string;
    // eslint-disable-next-line react/require-default-props
    locations?: Array<any>;
};

const mapCenter = { lat: 40, lng: -98 };

const mapOptions = {
    mapId: process.env.GOOGLE_MAPS_ID,
    disableDefaultUI: true,
};

const markerIcon = {
    path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
    fillOpacity: 1,
    fillColor: '#6AA6FF',
    strokeWeight: 1,
    strokeColor: '#6AA6FF',
    scale: 0.5,
};

const Map: FC<MapProps> = ({ className, locations }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
    });

    if (loadError) {
        return <div>Map Loading Error: {loadError?.message}</div>;
    }
    if (!isLoaded) {
        return <div>Map Loading...</div>;
    }

    return (
        <GoogleMap zoom={4} center={mapCenter} mapContainerClassName={cs(styles.Map, className)} options={mapOptions}>
            {locations && locations.map((item: any) => <Marker key={getKey(item?.id)} title={item?.title} position={{ lat: item?.location?.lat, lng: item?.location?.lng }} icon={markerIcon} />)}
        </GoogleMap>
    );
};

export default Map;
