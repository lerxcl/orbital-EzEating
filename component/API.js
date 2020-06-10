import firebaseDb from '../firebase/firebaseDb';

export async function getMethods(methodsRetrieved) {
    var methods = [];
    var snapshot = await firebaseDb.firestore().collection('methods').get()

    snapshot.forEach((doc) => {
        var obj = {
            id: doc.id,
            name: doc.data().name
        }
        methods.push(obj)
    }); 

    methodsRetrieved(methods);

    console.log(methods)
}

export async function getCards(cardsRetrieved) {
    var cards = [];
    var snapshot = await firebaseDb.firestore().collection('cards').get()

    snapshot.forEach((doc) => {
        var obj = {
            id: doc.id,
            name: doc.data().name
        }
        cards.push(obj)
    }); 

    cardsRetrieved(cards);

    console.log(cards)
}


