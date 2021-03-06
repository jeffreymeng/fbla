import React, { useCallback, useEffect, useState } from "react"

const firebaseConfig = {
  apiKey: "AIzaSyAxwtWhP9KDXEiqV2pAk67O2d-fnDDmxMg",
  authDomain: "fbla-website-design-2020.firebaseapp.com",
  databaseURL: "https://fbla-website-design-2020.firebaseio.com",
  projectId: "fbla-website-design-2020",
  storageBucket: "fbla-website-design-2020.appspot.com",
  messagingSenderId: "336349869076",
  appId: "1:336349869076:web:ac05b19b25c05f96b06301",
  measurementId: "G-5BBC2V2HZE",
}

const ServerContext = React.createContext({
  user: null,
  signIn: () => {
  },
  signOut: () => {
  },
  signUp: () => {
  },
  getFlights: () => {
  },
  pushFlights: () => {
  },
  updateCheckoutState: () => {
  },
  loading: false,
  error: null,
})

const ServerProvider = ({ children }) => {
  const [firebase, setFirebase] = useState(undefined)
  const [user, setUser] = useState(null)
  const [flights, setFlights] = useState(null)
  const [checkoutState, setCheckoutState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!firebase && typeof window !== "undefined") {
      const app = import("firebase/app")
      const auth = import("firebase/auth")
      const firestore = import("firebase/firestore")

      Promise.all([
        app, auth, firestore,
      ]).then(values => {
        const instance = values[0]
        instance.initializeApp(firebaseConfig)
        setFirebase(instance)
      })
    }
  }, [])

  useEffect(() => {
    if (!firebase) return

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setLoading(false)
      setUser(user)
    })
    return () => unsubscribe()
  }, [firebase])

  useEffect(() => {
    if (!firebase || !user) return;

    const unsubscribe = firebase?.firestore().collection("users")
      .doc(user.uid)
      .collection("checkout")
      .onSnapshot(function(querySnapshot) {
        let data = []
        querySnapshot.forEach(function(doc) {
          data.push(doc.data())
        });
        if (data.length === 0) setCheckoutState(null);
        else setCheckoutState(JSON.parse(data[0].state));
      });

    return () => unsubscribe;
  }, [firebase, user])

  useEffect(() => {
    if (!firebase || !user) return;

    const unsubscribe = firebase?.firestore().collection("users")
      .doc(user.uid)
      .collection("flights")
      .onSnapshot(function(querySnapshot) {
        let data = [];
        querySnapshot.forEach(function(doc) {
          data.push(doc.data());
          data[data.length-1].depart = JSON.parse(data[data.length-1].depart);
          if ("arrive" in data[data.length-1]) data[data.length-1].arrive = JSON.parse(data[data.length-1].arrive);
        });
        setFlights(data);
      });

    return () => unsubscribe;
  }, [firebase, user]);

  const signIn = useCallback((email, pass) => {
    setLoading(true)
    setError(null)
    return firebase.auth().signInWithEmailAndPassword(email, pass).catch(e => {
      setLoading(false)
      setError(e.message)
      throw error
    })
  }, [firebase])

  const signOut = useCallback(() => {
    firebase.auth().signOut()
  }, [firebase])

  const signUp = useCallback((email, pass) => {
    setError(null)
    setLoading(true)
    return firebase.auth().createUserWithEmailAndPassword(email, pass).catch((error) => {
      setLoading(false)
      setError(error.message)
      throw error
    })
  }, [firebase])

  const clearCheckoutState = useCallback((email, pass) => {
    setError(null)
    setLoading(true)
    return firebase.auth().createUserWithEmailAndPassword(email, pass).catch((error) => {
      setLoading(false)
      setError(error.message)
      throw error
    })
  }, [firebase])

  const pushFlights = useCallback((data) => {
    setError(null)
    return firebase.firestore().collection("users").doc(user.uid).collection("flights").add(data).catch(error => setError(error.message))
  }, [firebase, user])
  const getFlights = useCallback(() => {
    return new Promise((resolve, reject) => {
      firebase?.firestore().collection("users")
        .doc(user.uid)
        .collection("flights")
        .onSnapshot(function(querySnapshot) {
          let data = [];
          querySnapshot.forEach(function(doc) {
            data.push(doc.data());
          });
          resolve(data);
        });
    });
  }, [firebase, user])

  const updateCheckoutState = useCallback((state) => {
    setLoading(true);
    if (user == null) {
      return signIn("demo@gmail.com", "demo@gmail.com").then(x => {
        return updateCheckoutState(state);
      })
    } else {
      return firebase?.firestore().collection("users")
        .doc(user.uid)
        .collection("checkout")
        .doc("checkoutState")
        .set({
          state: JSON.stringify(state)
        })
        .catch(e => {
          setLoading(false);
          setError(e.message);
          throw e;
        });
    }
  }, [firebase, user]);

  return (
    <ServerContext.Provider
      value={{
        user, signIn, signOut, signUp, loading, error, pushFlights, getFlights, updateCheckoutState, checkoutState, clearCheckoutState, flights
      }}>
      {children}
    </ServerContext.Provider>
  )
}

export default ServerContext
export { ServerProvider }