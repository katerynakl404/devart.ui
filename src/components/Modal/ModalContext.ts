'use client';

import { createContext, useContext } from 'react';

/** Whether the dialog draws its own close button, for the parts around it. */
export const ModalCloseButtonContext = createContext(false);

export const useModalHasCloseButton = () => useContext(ModalCloseButtonContext);
