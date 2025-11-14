import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import ProfileScreen from './screens/Profile';
import EditProfileScreen from './screens/EditProfile';

//เสียง
import SectionVoiceHomeScreen from './voice/SectionVoiceHome';
import AddSectionScreen from './voice/AddSection';
import PracticeDetailScreen from './voice/PracticeDetail';
import RecorderScreen from './voice/Recorder';
import EvaluationScreen from './voice/Evaluation';
import VoiceReviewScreen from './voice/VoiceReview';
import VoiceReviewDetailScreen from './voice/VoiceReviewDetail';

import NotificationScreen from './screens/Notification';
import LearnMoreScreen from './screens/Learnmore';
import LearnMoreDetail from './screens/LearnMoreDetail';

//สถานการณ์
import Situation from './situation/Situation';
import AddSectionVideo from './situation/AddSectionVideo';
import EvaluationVideo from './situation/EvaluationVideo';
import RecordDetail from './situation/RecordDetail';
import RecordItemDetail from './situation/RecordItemDetail';
import Section from './situation/Section';
import SectionDetail1 from './situation/SectionDetail1';
import SectionVideo from './situation/SectionVideo';


import { UserProvider } from "./context/UserContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {

  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Main"
          component={MyTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff'
          }}
        />

        <Stack.Screen
          name="Add"
          component={AddSectionScreen}
          options={{
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen
          name="Practice"
          component={PracticeDetailScreen}
          options={({ navigation }) => ({
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Home" })}>
                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Recorder"
          component={RecorderScreen}
          options={{
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Evaluation"
          component={EvaluationScreen}
          options={{
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="VoiceReview"
          component={VoiceReviewScreen}
          options={{
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="VoiceReviewDetail"
          component={VoiceReviewDetailScreen}
          options={{
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerStyle: { backgroundColor: '#FF8A8A' },
            headerTintColor: '#fff',
            headerShown: false
          }}
        />
        <Stack.Screen name="AddSectionVideo" component={AddSectionVideo} options={{ headerShown: false  }}/>
        <Stack.Screen name="SectionDetail1" component={SectionDetail1} options={{ headerShown: false  }}/>
        <Stack.Screen name="Section" component={Section} options={{ headerShown: false  }}/>
        <Stack.Screen name="SectionVideo" component={SectionVideo} options={{ headerShown: false  }}/>
        <Stack.Screen name="EvaluationVideo" component={EvaluationVideo} options={{ headerShown: false  }}/>
        <Stack.Screen name="RecordDetail" component={RecordDetail} options={{ headerShown: false  }}/>
        <Stack.Screen name="RecordItemDetail" component={RecordItemDetail} options={{ headerShown: false  }}/>
        <Stack.Screen name="LearnMoreDetail" component={LearnMoreDetail} options={{ headerShown: false  }}/>
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF8A8A',   // สีของปุ่มเมื่อถูกเลือก
        tabBarInactiveTintColor: '#999',    // สีของปุ่มที่ไม่ได้เลือก
        tabBarStyle: {
          backgroundColor: '#fff',          // สีพื้นหลังของ Tab Bar
        },
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={SectionVoiceHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Situation"
        component={Situation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="videocam" color={color} size={size} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Learnmore"
        component={LearnMoreScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-sharp" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}