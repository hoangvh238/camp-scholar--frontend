
import { atom } from "recoil";

export type Document = {
  documentId : number,
  documentName : string,
  description : string,
  time : Date,
  author : string,
  groupName : string,
  cost : number,
  ratings : Ratings[];
  bills : number;
  authorPoints : number
};



export type Ratings = {
  description : string,
  ratingId : number,
  stars : number , 
  time : Date,
  user : number,
  document : number,
}  

export type Bill = {
  documentId : number
  userId : number, 
  time : Date,
  billId : number
} 

interface DocumentsState {
  documents : Document[]
}


const defaultDocumentState: DocumentsState = {
   documents : []
};

export const documentState = atom<DocumentsState>({
  key: "DocumentState",
  default: defaultDocumentState,
});

