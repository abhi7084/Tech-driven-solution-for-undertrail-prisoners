import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';

import LoginScreen from './pages/LoginScreen';
import { FIREBASE_AUTH, FIREBASE_DB } from './firebaseConfig';
import HomeScreen from './pages/Home';
import {ProfileScreen} from './pages/Profile';
import AttorneyScreen from './pages/Attorneys';

import Family from './lawyerpages/family'
import AttorneysDetails from './pages/nested_pages/AttorneysDetails';
import AddClients from './lawyerpages/nested_pages/AddClients';
import AddLawyers from './lawyerpages/nested_pages/AddLawyer';
import UpdateCase from './lawyerpages/nested_pages/UpdateCase';
import AddRehab from './lawyerpages/nested_pages/AddRehab';
// import AddData from './lawyerpages/AddData';

import LClientsScreen from './lawyerpages/LClients';
import Lawyers from './lawyerpages/Lawyers';
import LHomeScreen from './lawyerpages/LHome';
import LMapScreen from './lawyerpages/LMap';
import LProfileScreen from './lawyerpages/LProfile';
import LClientsDetails from './lawyerpages/nested_pages/LClientsDetails';
import LawyerDetails from './lawyerpages/nested_pages/LawyerDetails';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';

import DrawerItems from './constants/MenuItems';
import LDrawerItems from './constants/LMenuItems';

import SignupScreenLawyer from './lawyerpages/SignupScreenLawyer';
import LoginScreenLawyer from './lawyerpages/LoginScreenLawyer';
import { doc, getDoc,setDoc } from 'firebase/firestore';
import ChatModal from './pages/LawModal';

import Successfull from './lawyerpages/succesfully'
import LProceedingsScreen from "./lawyerpages/LProceedings";
import LResourcesScreen from "./lawyerpages/LResources"
import LegalAidScreen from "./pages/LegalAid"
import ProceedingsScreen from "./pages/Proceedings"
import ResourcesScreen from "./pages/Resources"
import RehabScreen from "./pages/Rehab"
import ChangePassword from './pages/changePassword';

import BlockchainDocument from './src/components/BlockchainDocument';
import LegalDocumentService from './src/LegalDocumentService';

// Create a wrapper component for BlockchainDocument
const BlockchainDocumentScreen = () => {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDocument = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, check if we already have documents
      const existingDocuments = LegalDocumentService.getAllDocuments();
      if (existingDocuments.length > 0) {
        // Use the first existing document
        setDocumentId(existingDocuments[0].id);
        return;
      }

      // If no documents exist, create a new one
      const sampleDoc = await LegalDocumentService.createDocument(
        "Sample Legal Document",
        "This is a sample legal document demonstrating blockchain verification.\n\n" +
        "Document Content:\n" +
        "1. This document is digitally signed and verified using blockchain technology.\n" +
        "2. Any modifications to this document will be detected through hash verification.\n" +
        "3. The document's authenticity can be verified at any time.\n\n" +
        "Created on: " + new Date().toLocaleDateString()
      );

      if (!sampleDoc || !sampleDoc.id) {
        throw new Error('Failed to create document');
      }

      setDocumentId(sampleDoc.id);
    } catch (error) {
      console.error('Error initializing document:', error);
      setError('Failed to create document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeDocument();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Creating blockchain document...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#e91e63', 
            padding: 10, 
            borderRadius: 5 
          }}
          onPress={initializeDocument}
        >
          <Text style={{ color: 'white' }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!documentId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No document available</Text>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#e91e63', 
            padding: 10, 
            borderRadius: 5,
            marginTop: 10
          }}
          onPress={initializeDocument}
        >
          <Text style={{ color: 'white' }}>Create Document</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <BlockchainDocument documentId={documentId} />;
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MainScreen = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveTintColor: '#e91e63',
        drawerItemStyle: { marginVertical: 10 },
      }}
    >
      {DrawerItems.map((drawer) => (
        <Drawer.Screen
          key={drawer.name}
          name={drawer.name}
          options={{
            drawerIcon: ({ focused }) =>
            drawer.iconType === 'Material' ? (
                <MaterialCommunityIcons
                  name={drawer.iconName as any}
                  size={24}
                  color={focused ? '#e91e63' : 'black'}
                />
              ) : drawer.iconType === 'Feather' ? (
                <Feather
                  name={drawer.iconName as any}
                  size={24}
                  color={focused ? '#e91e63' : 'black'}
                />
              ) : (
                <></>
              ),
          }}
          component={
            drawer.name === 'Home'
              ? HomeScreen
              : drawer.name === 'Profile'
              ? ProfileScreen
              : drawer.name === 'Legal Aid'
              ? LegalAidScreen
              : drawer.name === 'Proceedings'
              ? ProceedingsScreen
              : drawer.name === 'Resources'
              ? ResourcesScreen
              : drawer.name === 'Rehabilitation'
              ? RehabScreen
              : drawer.name === 'Family'
              ? Family
              : drawer.name === 'Slot Booking'
              ? Successfull
              : drawer.name === 'Blockchain'
              ? BlockchainDocumentScreen
              : AttorneyScreen
          }
        />
      ))}
    </Drawer.Navigator>
  );
};

const LMainScreen = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveTintColor: '#e91e63',
        drawerItemStyle: { marginVertical: 10 },
      }}
    >
      {LDrawerItems.map((drawer) => (
        <Drawer.Screen
          key={drawer.name}
          name={drawer.name}
          options={{
            drawerIcon: ({ focused }) =>
              drawer.iconType === 'Material' ? (
                <MaterialCommunityIcons
                  name={drawer.iconName as any}
                  size={24}
                  color={focused ? '#e91e63' : 'black'}
                />
              ) : drawer.iconType === 'Feather' ? (
                <Feather
                  name={drawer.iconName as any}
                  size={24}
                  color={focused ? '#e91e63' : 'black'}
                />
              ) : (
                <></>
              ),
          }}
          component={
            drawer.name === 'Home'
              ? LHomeScreen
              : drawer.name === 'Profile'
              ? LProfileScreen
              : drawer.name === 'Clients'
              ? LClientsScreen
              : drawer.name === 'Lawyers'
              ? Lawyers
              : drawer.name === 'AddClient'
              ? AddClients
              : drawer.name === 'AddLawyer'
              ? AddLawyers
              : drawer.name === 'AddRehab'
              ? AddRehab
              : drawer.name === 'Proceedings'
              ? LProceedingsScreen
              : LResourcesScreen
              
          }
        />
      ))}
    </Drawer.Navigator>
  );
};

const Permission = () => {
  return (
    <View style={styles.centerContainer}>
      <Text>Please allow location Permission</Text>
    </View>
  );
};

const Loading = () => {
  return (
    <View style={styles.centerContainer}>
      <Text>Loading...</Text>
    </View>
  );
};

export default function App() {
  const [errorMsg, setErrorMsg] = useState('no error');

  const auth = FIREBASE_AUTH;
  const [user, setuser] = useState<User | null>(null);
  const [type, setType] = useState<string | null>(null);
  

  useEffect(() => {
    const config = async () => {
      let resf = await Location.requestForegroundPermissionsAsync();
      let resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status !== 'granted' && resb.status !== 'granted') {
        console.log('Permission to access location was denied');
      } else {
        console.log('Permission to access location granted');
        setErrorMsg('granted');
      }
    };

    config();
  }, []);

  

  // useEffect(() => {
  //   onAuthStateChanged(auth, async (user) => {
      
  //     setuser(user);
  //     if (user != null) {
  //       console.log('User signed in:', user.uid);
  //       const docRef = doc(FIREBASE_DB, '/users', user.uid);
  //       console.log('User Type:', type);
  //       const docSnap = await getDoc(docRef);
        
  //       if (docSnap.exists()) {
  //         console.log('User data:', docSnap.data()); 
  //         setType(docSnap.data().Type);
  //         console.log('Document data:', type);
  //       } else {
  //         console.log('No such document!');
  //       }
  //     } else {
  //       console.log('No user is signed in');
  //     }
  //   });
  //   console.log(type);
  // }, []);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      console.log('Auth state changed. User:', user); // Debugging
      setuser(user);
      if (user != null) {
        console.log('User signed in:', user.uid); // Debugging
        
        const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
        console.log(isNewUser)
        
        const docRef = doc(FIREBASE_DB, '/users', user.uid);
        const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log('User data:', docSnap.data()); // Debugging
            setType(docSnap.data().Type); // Update the `type` state
          } else {
            console.log('No such document!');
          }
        
      } else {
        console.log('No user is signed in');
      }
    });
  
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  

  useEffect(() => {
    console.log('Updated User Type:', type); // This will log the updated value of `type`
  }, [type]); // This effect runs whenever `type` changes

  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        {user == null ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
            {/* <Stack.Screen name="LoginLawyer" component={LoginScreenLawyer} /> */}
            <Stack.Screen name="Signup Admin" component={SignupScreenLawyer} />
            <Stack.Screen name="Change Password" component={ChangePassword} />
          </Stack.Group>
        ) : errorMsg !== 'granted' ? (
          <Stack.Group>
            <Stack.Screen name="permission" component={Permission} />
          </Stack.Group>
        ) : type === 'Admin' ? (
          <Stack.Group>
            <Stack.Screen name="Admin" component={LMainScreen} />
            <Stack.Screen name="Clients Details" component={LClientsDetails} />
            <Stack.Screen name="LawyerDetails" component={LawyerDetails} />
            {/* <Stack.Screen name="AddClients" component={AddClients} /> */}
            <Stack.Screen name="Update Case" component={UpdateCase} />
          </Stack.Group>
        ) : type === 'Prisoner' ? (
          <Stack.Group>
            <Stack.Screen name="Prisoner" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AttorneysDetails" component={AttorneysDetails} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Loading" component={Loading} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
