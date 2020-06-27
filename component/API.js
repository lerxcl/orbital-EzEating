import firebaseDb from '../firebase/firebaseDb';

export async function getMethods(methodsRetrieved) {
    var methods = [];
    var snapshot = await firebaseDb.firestore().collection('methods').get()

    snapshot.forEach((doc) => {
        var obj = {
            id: doc.id,
            name: doc.data().name,
            image: doc.data().image,
        }
        methods.push(obj)
    }); 

    methodsRetrieved(methods);
}

export async function getCards(cardsRetrieved) {
    var cards = [];
    var snapshot = await firebaseDb.firestore().collection('cards').get()

    snapshot.forEach((doc) => {
        var obj = {
            id: doc.id,
            name: doc.data().name,
            image: doc.data().image,
        }
        cards.push(obj)
    }); 

    cardsRetrieved(cards);
}

export async function getNetworks(netsRetrieved) {
    var nets = [];
    var snapshot = await firebaseDb.firestore().collection('networks').get()

    snapshot.forEach((doc) => {
        var obj = {
            id: doc.id,
            name: doc.data().name,
            image: doc.data().image,
        }
        nets.push(obj)
    }); 

    netsRetrieved(nets);
}



