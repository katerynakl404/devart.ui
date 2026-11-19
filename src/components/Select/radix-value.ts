// Radix keeps '' for "nothing picked"; an option's own empty id goes by this
const EMPTY_ID = '__empty__';

export const toRadix = (id: string) => (id === '' ? EMPTY_ID : id);
export const fromRadix = (value: string) => (value === EMPTY_ID ? '' : value);
