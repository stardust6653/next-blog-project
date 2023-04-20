import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

interface DataProps {
  id: number;
  title: string;
  html: string;
  date: string;
  previewImg: string;
  description: string;
}

export const getData = async () => {
  const dataArr: DataProps[] = [];

  const postRef = collection(db, 'posts');
  const q = query(postRef);
  const querySnapShot = await getDocs(q);

  querySnapShot.forEach((item) => {
    const returnDoc = item.data() as DataProps;
    dataArr.push(returnDoc);
  });

  return dataArr;
};

interface PostProps {
  id: number;
  title: string;
  html: string;
  date: string;
}

export const postData = (data: PostProps) => {
  const postRef = collection(db, 'posts');

  addDoc(postRef, data);
};

export const getDescFilteredData = async () => {
  const postRef = collection(db, 'posts');
  const queryData = query(postRef, orderBy('id', 'desc'));
  const querySnapShot = await getDocs(queryData);
  const descFilteredDataArr: DataProps[] = [];

  querySnapShot.forEach((item) => {
    const returnDoc = item.data() as DataProps;
    descFilteredDataArr.push(returnDoc);
  });

  return descFilteredDataArr;
};
