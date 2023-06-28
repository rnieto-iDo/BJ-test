/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
class BaseModel {
    fieldMapping: any;

    /**
     * Builds all the fields for this UI model from the given apiObject.
     * This method iterates through the apiObject keys and maps the fields from the API to the fields of this particular model using the fieldMapping property.
     * @param apiObject {Object} Plain Javascript object containing the response object from the api to be used to build this UI model
     * @returns {BaseModel} Returns an instance of the current UI model object
     */
    buildFromAPIObject(apiObject: any) {
        this.iterateAndMap(apiObject, this.fieldMapping);
        return this;
    }

    /**
     * Converts the UI model to a plain Javascript object with the field naming used by the API.
     * This method iterates through the keys of the current instance and maps the fields from the instance to the fields that needed by the API using the fieldMapping property.
     * @returns {Object} Returns the plain Javascript object prepared for an API request
     */
    toAPIObject(): any {
        const apiObject: any = {};
        this.iterateAndMap(this, apiObject, true);
        return apiObject;
    }

    /**
     * Iterates through the nested objects and maps the fields from source to destination based on the fieldMapping property
     * This method uses recursion to handle nested objects, if the property of the source object is an object and
     * the corresponding property in the destination object is also an object it calls the iterateAndMap method again
     * with the nested object as the source object, and the nested property in the destination object.
     * Else it will perform the mapping as usual.
     * @param source {Object} Source object to be mapped
     * @param dest {Object} Destination object to be filled during the iteration
     * @param reverse {boolean} If true the method will perform the mapping in reverse
     */
    iterateAndMap(source: any, dest: any, reverse: boolean = false) {
        Object.keys(source).forEach(key => {
            const mapKey = reverse ? dest.revGet(key) : dest.get(key);
            if (
                source[key] instanceof Object &&
                dest[mapKey] instanceof Object
            ) {
                this.iterateAndMap(source[key], dest[mapKey], reverse);
            } else {
                dest[mapKey] = source[key];
            }
        });
    }
}

export default BaseModel;
