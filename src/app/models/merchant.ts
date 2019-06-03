/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * Change "Merchant" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or an "Animal," or something like that.
 *
 * The Merchants service manages creating instances of Merchant, so go ahead and rename
 * that something that fits your app as well.
 */
export class Merchant {
    name: string;
    src: string;
    description: string;
    amount: any;
    product_id: any;
    variant_id: any;
    longitude: any;
    latitude: any;
    item_id: any;

  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      // @ts-ignore
      this[f] = fields[f];
    }
  }

}

export interface Merchant {
  [prop: string]: any;
}
