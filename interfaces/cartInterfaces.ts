export interface IItem {
    quantity: number;
    sku: string;
    selected_options?: string[];
}

export interface ICartItems {
    cartId: string;
    products: IItem[];
    onSuccess?: () => void;
    onFailed?: () => void;
}

export interface IRemoveCart {
    input: {
        cart_id: string;
        cart_item_uid: string;
    };
}

export interface ICartItemUpdateInput {
    cart_item_uid: string;
    customizable_options?: any;
    gift_message?: any;
    gift_wrapping_id?: string;
    quantity?: string;
}
export interface IUpdateCart {
    input: {
        cart_id: string;
        cart_items: ICartItemUpdateInput[];
    };
    onSuccess?: () => void;
    onFailed?: () => void;
}