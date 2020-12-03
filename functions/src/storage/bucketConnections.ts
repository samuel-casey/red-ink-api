import * as admin from 'firebase-admin';

const storage = admin.initializeApp().storage()

export {storage}