import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.initializeApp().firestore()
db.settings({ignoreUndefinedProperties: true})


console.log(functions.config())


export {db}