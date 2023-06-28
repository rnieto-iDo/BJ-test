import imageUrlBuilder from "@sanity/image-url";
import client from "../api/sanityClient";

/** Function that uses sanity images source(url) to apply some basic options and reuturn newly built url for image with options
 *  Here: https://www.sanity.io/docs/image-url we can see all the other attributes that can be passed along side basic ones to aquire different results.
 *  Example for passing some additional options available: <img src={urlFor(image.url).focalPoint(image.metadata.focalPoint.x, image.metadata.focalPoint.y)}>
 *  In the above example we using focal points for image, that are being set in sanity studio and are contained in metadata of image (if made available in studio).
 *  This results in applying hotspot for image that we are currently working with.
 */

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client);

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
export default ({
    asset: { url },
    hotspot: { x, y },
}: {
    asset: {
        url: string;
    };
    hotspot: { x: number; y: number };
}) =>
    builder
        .image(url)
        // .height(500)
        // .width(250)
        .focalPoint(x, y)
        .crop("focalpoint")
        .size(600, 800)
        // .focalPoint(0.2, 0.7)
        .fit("crop")
        .auto("format")
        .url();
