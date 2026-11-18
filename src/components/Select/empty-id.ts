// Radix keeps '' for "nothing picked", so an option whose own id is empty — a
// default such as "Automatic" — travels through the list under this id.
const EMPTY_ID = '__empty__';

const toRadix = (id: string) => (id === '' ? EMPTY_ID : id);
const fromRadix = (value: string) => (value === EMPTY_ID ? '' : value);

export { EMPTY_ID, fromRadix, toRadix };
