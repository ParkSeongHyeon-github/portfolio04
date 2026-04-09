export const ChangeNumber = (e : React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
}