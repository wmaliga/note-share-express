export enum NoteType {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC'
}

export interface Note {
    id: number,
    type: NoteType,
    password: string,
    title: string,
    expirationDate: Date,
    data: string
}