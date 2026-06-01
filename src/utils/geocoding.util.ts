/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import axios from 'axios';

// export async function getCoordinatesFromAddress(address: string): Promise<{ viDo: number; kinhDo: number } | null> {
//     try {
//         console.log('Requesting Nominatim API with address:', address);
//         const response = await axios.get('https://nominatim.openstreetmap.org/search', {
//             params: {
//                 q: address,
//                 format: 'json',
//             },
//         });

//         if (response.data.length > 0) {
//             const location = response.data[0];
//             return { viDo: parseFloat(location.lat), kinhDo: parseFloat(location.lon) };
//         }

//         console.error('Nominatim API error: No results found');
//         return null;
//     } catch (error) {
//         console.error('Error calling Nominatim API:', error);
//         return null;
//     }
// }

export async function getCoordinatesFromAddress(address: string): Promise<{ viDo: number; kinhDo: number } | null> {
    try {
        console.log('Requesting Nominatim API with address:', address);

        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: address,
                    format: "json",
                },
                headers: {
                    "User-Agent":
                        "soccer-rental-api/1.0 (nguyenhuyc1821@gmail.com)",
                },
            }
        );

        if (response.data.length > 0) {
            const location = response.data[0];
            console.log('Coordinates fetched:', { viDo: parseFloat(location.lat), kinhDo: parseFloat(location.lon) });
            return { viDo: parseFloat(location.lat), kinhDo: parseFloat(location.lon) };
        }

        console.warn(`Nominatim API error: No results found for address: ${address}`);
        return null;
    } catch (error: any) {
        console.error('Error calling Nominatim API:', error.message);
        return null;
    }
}