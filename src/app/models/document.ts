/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * Change "Item" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or an "Animal," or something like that.
 *
 * The Items service manages creating instances of Item, so go ahead and rename
 * that something that fits your app as well.
 */
export class Document {
    id: any;
    title: any;
    description: any;
    type: any;
    body: any;
    status: any;
    user: any;
    author: any;
    created_at: any;
    updated_at: any;
    files: any=[];
    constructor(fields: any) {
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

        if (fields.body) {
            if (typeof fields.body === 'string' || fields.body instanceof String) {
                fields.body = JSON.parse(fields.body);
            }
        } else {
            fields.body =[]
        }
        // Quick and dirty extend/assign fields to this model
        for (const f in fields) {
            // @ts-ignore
            this[f] = fields[f];
        }
    }
}

export interface Article {
    [prop: string]: any;
}
