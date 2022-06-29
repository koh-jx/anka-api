import * as mongoose from 'mongoose';
import { CardDocument } from 'src/cards/interfaces/cards.interface';

export interface DeckDocument extends mongoose.Document {
    id: string;
    name: string;
    cards: string[];
}
