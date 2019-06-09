import { Container } from 'inversify';
import * as React from 'react';

export const DIContext = React.createContext<Container | null>(null);
