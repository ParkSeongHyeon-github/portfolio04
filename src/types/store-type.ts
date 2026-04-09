export interface OptionProps{
    option : string,
    basicPrice : number,
    optionName : string,
    optionPrice : number,
    optionQuantity : number
}

export interface StoreProps{
    id: string,
    category : string,
    subject : string,
    option : OptionProps[],
    delivery : string,
    totalprice : number,
    userName : string,
    userPhone : string,
    zonecode : string,
    address : string,
    addressDetail : string,
    orderId?: string
}

export type StoreWriteProps = Omit<StoreProps, "id">