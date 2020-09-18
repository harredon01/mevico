/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * Change "Merchant" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or an "Animal," or something like that.
 *
 * The Merchants service manages creating instances of Merchant, so go ahead and rename
 * that something that fits your app as well.
 */
export class Report {
    name: string;
    src: string;
    icon: string;
    description: string;
    longitude: any;
    latitude: any;
    status:any;
    owner: boolean = false;
    attributes: any;
    ratings: any[];
    files: any[];
    created_at:any;
    updated_at:any;

    constructor(fields: any) {
        if (fields.object_id) {
            fields.id = fields.object_id;
        }
        if (fields.report_id) {
            fields.id = fields.report_id;
        }
        if (fields.categorizable_id) {
            fields.id = fields.categorizable_id;
        }
        if (fields.created_at) {
            if (typeof fields.created_at === 'string' || fields.created_at instanceof String) {
                fields.created_at = fields.created_at.replace(/-/g, '/');
                if (fields.created_at.includes("Z")) {
                    fields.created_at = fields.created_at.replace("T", ' ');
                    fields.created_at = fields.created_at.split(".")[0];
                    fields.created_at = new Date(fields.created_at);
                    fields.created_at = new Date(fields.created_at.getTime() - fields.created_at.getTimezoneOffset() * 60000);
                }
            }
        }

        if (fields.updated_at) {
            if (typeof fields.updated_at === 'string' || fields.updated_at instanceof String) {
                fields.updated_at = fields.updated_at.replace(/-/g, '/');
                if (fields.updated_at.includes("Z")) {
                    fields.updated_at = fields.updated_at.replace("T", ' ');
                    fields.updated_at = fields.updated_at.split(".")[0];
                    fields.updated_at = new Date(fields.updated_at);
                    fields.updated_at = new Date(fields.updated_at.getTime() - fields.updated_at.getTimezoneOffset() * 60000);
                }
            }
        }
        if (fields.Distance) {
            if (fields.Distance < 1) {
                let result = fields.Distance * 100;
                result = Math.round(result * 100) / 100;
                fields.Distance = result + " m.";
            } else {
                let result = fields.Distance;
                result = Math.round(result * 100) / 100;
                fields.Distance = result + " km.";
            }
        }
        // Quick and dirty extend/assign fields to this model
        for (const f in fields) {
            // @ts-ignore
            this[f] = fields[f];
        }
        if(!this.attributes){
            this.attributes=[];
        }
    }
}

export interface Report {
    [prop: string]: any;
}
