#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Wire.h>
#include "Adafruit_Sensor.h"
#include "DHT.h"

#include <esp_now.h>
#include <esp_wifi.h>
#include <WiFiClientSecure.h>
#include <WiFiManager.h>
#include "time.h"
#include "device_config.h"
// Libraries to get time from NTP Server
//#include <NTPClient.h>
//#include <WiFiUdp.h>
// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Set password to "" for open networks.
//#define WIFI_SSID "mFi_03A4B8"
//#define WIFI_PASSWORD "Shani19951"

// Insert Firebase project API Key
#define API_KEY "AIzaSyCTogke3NH_4Fir_dpJtEY7fPzKhsh-W_8"

// Insert Authorized Email and Corresponding Password
#define USER_EMAIL "thushariakalanka@gmail.com"
#define USER_PASSWORD "Thushari27"

// Insert RTDB URLefine the RTDB URL
#define DATABASE_URL "https://esp-firebase-demo-19eec-default-rtdb.asia-southeast1.firebasedatabase.app/"
 
// Define NTP Client to get time
//WiFiUDP ntpUDP;
//NTPClient timeClient(ntpUDP);

// Variables to save date and time
//String formattedDate;
//String day;
//String hour;
//String timestamp;

// Define Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variable to save USER UID
String uid = "kFi4xAyKBhMEuSijAjyyVBLBG6F3";
String readingID;
int cot = 0; 
// Database main path (to be updated in setup with the user UID)
String databasePath;
// Database child nodes
String idPath = "/id";
String tempPath = "/temperature";
String humPath = "/humidity";
String co2Path = "/co2";
String coPath = "/co";
String timePath = "/timestamp";

// Parent Node (to be updated in every loop)
String parentPath;

//const char* ntpServer = "pool.ntp.org";
// Set your Board ID (ESP32 Sender #1 = BOARD_ID 1, ESP32 Sender #2 = BOARD_ID 2, etc)
//#define BOARD_ID 1

// Digital pin connected to the DHT sensor
#define DHTPIN 13          //pin where the dht11 is connected
DHT dht(DHTPIN, DHT11);
float temperature;
float humidity;
float co2;
float co;

// Timer variables (send new readings every three minutes)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 900000;
int timestamp;
FirebaseJson json;

const char* ntpServer = "pool.ntp.org";
// Initialize WiFi
void initWiFi() {
  WiFiManager wifiManager;
    if (!wifiManager.autoConnect("Simon-Aire","password")) {
    Serial.println("Failed to connect and hit timeout");
    delay(3000);
    ESP.restart();
    delay(5000);
  }
  // If connected, print the local IP address
  Serial.print("Connected to WiFi. IP address: ");
  Serial.println(WiFi.localIP());
  //WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
    uint64_t chipid = ESP.getEfuseMac();//The chip ID is essentially its MAC address(length: 6 bytes).
  Serial.println("chip_id: " + get_chip_id());
  Serial.println();
}

// Function that gets current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}

float readDHTTemperature() {
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  // Read temperature as Celsius (the default)
float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  //float t = dht.readTemperature(true);
  // Check if any reads failed and exit early (to try again).
  if (isnan(t)) {    
    Serial.println("Failed to read from DHT sensor!");
    return 0;
  }
  else {
    Serial.println(t);
    return t;
  }
}

float readDHTHumidity() {
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
float h = dht.readHumidity();
  if (isnan(h)) {
    Serial.println("Failed to read from DHT sensor!");
    return 0;
  }
  else {
    Serial.println(h);
    return h;
  }
}

float readMQ7CO() {
  float mq7 = analogRead(33);
  if (isnan(mq7)) {    
    Serial.println("Failed to read from DHT sensor!");
    return 0;
  }
  else {
    Serial.println(mq7);
    return mq7;
  }
}

float readMQ135CO2() {
  float mq135 = analogRead(32);
  if (isnan(mq135)) {    
    Serial.println("Failed to read from DHT sensor!");
    return 0;
  }
  else {
    Serial.println(mq135);
    return mq135;
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
    initWiFi();                                               //reads dht sensor data 
configTime(0, 0, ntpServer);

    config.api_key = API_KEY;

    // Assign the user sign in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

    // Assign the RTDB URL (required)
  config.database_url = DATABASE_URL;

    Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  // Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

  // Assign the maximum retry of token generation
  config.max_token_generation_retry = 5;

  // Initialize the library with the Firebase authen and config
  Firebase.begin(&config, &auth);

  // Getting the user UID might take a few seconds
  /*Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
     }
  // Print user UID
  uid = auth.token.uid.c_str();*/
  Serial.print("User UID: ");
  Serial.println(uid);

  // Update database path
  databasePath = "/UsersData/" + uid + "/" + get_chip_id();
  }

void loop() {

// Send new readings to database
  if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();

    //Get current timestamp
    timestamp = getTime();
    Serial.print ("time: ");
    Serial.println (timestamp);

    parentPath= databasePath + "/" + String(timestamp);
    json.set(idPath.c_str(), String(get_chip_id()));
    json.set(tempPath.c_str(), String(readDHTTemperature()));
    json.set(humPath.c_str(), String(readDHTHumidity()));
    json.set(co2Path.c_str(), String(readMQ135CO2()));
    json.set(coPath.c_str(), String(readMQ7CO()));
    json.set(timePath, String(timestamp));
    Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, parentPath.c_str(), &json) ? "ok" : fbdo.errorReason().c_str());
 delay(2000);
      }
    }
    
 
  