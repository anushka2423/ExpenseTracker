export const currencyFormatter = (amount) => {
    let formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    return formatter.format(amount)
}