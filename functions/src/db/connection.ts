import * as admin from 'firebase-admin';

const db = admin.initializeApp().firestore()
db.settings({ignoreUndefinedProperties: true})

export = db