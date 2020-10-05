import React, { useState, useEffect } from "react";
import moment from "moment";
import Clock from "./clock/Clock";
import WeatherWidget from "./weather_widget/WeatherWidget";
import EventsList from "./events_list/EventsList";

import "./App.scss";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [calendarList, setCalendarList] = useState([]);
  const [events, setEvents] = useState([]);

  // Setup Google Calendar API
  var gapi = window.gapi,
    CLIENT_ID = process.env.REACT_APP_GCAL_CLIENT,
    API_KEY = process.env.REACT_APP_GCAL_API_KEY;

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  useEffect(() => {
    gapi.load("client:auth2", gapiInit);
  }, []);

  // If signed in, fetch events
  useEffect(() => {
    if (isSignedIn) {
      upcomingEvents();
    }
  }, [isSignedIn]);

  const gapiInit = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        // Listens for auth changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn());

        // Sets initial value of auth
        setIsSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
  };

  const addCalendar = (calendar) => {
    setCalendarList((prevState) => [...prevState, calendar]);
  };

  const addEvent = (event) => {
    setEvents((prevState) => [...prevState, event]);
  };

  const upcomingEvents = () => {
    // Get list of calendars
    gapi.client.calendar.calendarList.list({}).then(
      function(response) {
        let calendars = response.result.items.map((item) => {
          return {
            id: item.id,
            name: item.summary,
            color: item.backgroundColor,
          };
        });
        console.log(calendars);
        calendars.forEach((calendar) => {
          // Iterate through calendar events
          gapi.client.calendar.events
            .list({
              calendarId: calendar.id,
              timeMin: new Date().toISOString(),
              showDeleted: false,
              singleEvents: true,
              maxResults: 10,
              orderBy: "startTime",
            })
            .then(function(response) {
              var respEvents = response.result.items;

              if (respEvents.length > 0) {
                respEvents.forEach((event) => {
                  addEvent({
                    ...event,
                    startTime: moment(
                      event.start.dateTime || moment(event.start.date)
                    ),
                    color: calendar.color,
                  });
                });
              }
            });
        });
      },
      function(err) {
        console.error("Couldn't fetch calendars", err);
      }
    );
  };

  return (
    <div className="app">
      {isSignedIn ? (
        <div>
          <div
            style={{
              display: "flex",
              height: "200px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Clock />
            <WeatherWidget />
          </div>

          <EventsList events={events} />
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              gapi.auth2.getAuthInstance().signIn();
            }}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
