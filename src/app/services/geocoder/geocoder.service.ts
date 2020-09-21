import { Injectable } from '@angular/core';
import {
    GoogleMaps,
    Environment,
    LatLng,
    ILatLng,
    GeocoderResult,
    Geocoder,
} from '@ionic-native/google-maps/ngx';
@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  constructor() { 
        if (document.URL.startsWith('http')) {
            console.log("Setting env2");
            Environment.setEnv({
                API_KEY_FOR_BROWSER_RELEASE: "AIzaSyCOmrFtRJ7CPSZwP2Ym4xFt4myqh_xFd4Q",
                API_KEY_FOR_BROWSER_DEBUG: "AIzaSyCOmrFtRJ7CPSZwP2Ym4xFt4myqh_xFd4Q"
            });
        }
    }

    getAddressFromLat(lat, long) {
        return new Promise((resolve, reject) => {
            let position = new LatLng(lat, long);
            console.log("getAddressFromLat before geocode");
            // latitude,longitude -> address
            Geocoder.geocode({
                "position": position
            }).then((results: GeocoderResult[]) => {
                console.log('location address simple', results);
                if (results.length == 0) {
                    // Not found
                    resolve(null);
                }
                resolve(results);

            }).catch((error) => {
                console.log('Error getAddressFromLat', error);
                reject(error);
            });;
            console.log("getAddressFromLat after geocode");
        });
    }

    /**
     * prepares report data for creating a marker
     */
    decodeAddressFromLatResult(results: any) {

        let container;
        try {
            container = results[0].extra.lines[0];
        }
        catch (err) {

        }

        if (container.length == 0) {
            container = [
                results[0].subThoroughfare || "",
                results[0].thoroughfare || "",
                results[0].locality || "",
                results[0].adminArea || "",
                results[0].postalCode || "",
                results[0].country || ""].join(", ");
        }
        console.log("decodeAddressFromLatResult", container);
        return container;
    }
    /**
     * prepares report data for creating a marker
     */
    decodePostalFromLatResult(results: any) {

        let container;
        let found = false
        let i = 0;
        let postal = "";
        do {
            container = results[i]
            try {
                postal = container.postalCode;
                if (postal.length > 0) {
                    found = true;
                }
            }
            catch (err) {

            }
            i++;
            if (i >= results.length) {
                found = true;
            }
        }
        while (found == false);
        console.log("decodePostalFromLatResult", postal);
        return postal;
    }
}
