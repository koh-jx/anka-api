import * as mongoose from 'mongoose';

export enum CardFace {
    WORD = 'word'
}

export interface CardDocument extends mongoose.Document {
    id: string;
    front: CardFace;
    back: CardFace;
    frontCardFaceProps: {
        frontTitle: string,
        frontDescription: string,
    };
    backCardFaceProps: {
        backTitle: string;
        backDescription: string;
    };
}
