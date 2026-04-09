export interface AdminProps{
    mbLevel : number,
    isReady: boolean;
}

export interface CategoryProps{
    id : string,
    menu : string,
    category : string[]
}

interface ProductOptionChildProps{
    optionName : string,
    optionPrice : number
}

export interface ProductOptionProps{
    optionCate : string,
    optionVal : ProductOptionChildProps[]
}

export interface ProductProps{
    id:string,
    category : string,
    subject : string,
    cost : string,
    price : string,
    delivery : string,
    option : ProductOptionProps[],
    content : string,
    contentImage : string,
    Image : string[],
}

export type CategoryWriteProps = Omit<CategoryProps, "id">
export type ProductWriteProps = Omit<ProductProps, "id">