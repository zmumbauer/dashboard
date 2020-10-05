import React, { useState, useEffect } from "react";
import moment from "moment";
import Background from "./Background";
import Loader from './Loader';
import Header from "./Header";
import Agenda from "./agenda/Agenda";
import "./App.scss";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [calendarList, setCalendarList] = useState([]);
  const [events, setEvents] = useState([]);
  const [fetching, setFetching] = useState(true);

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
      fetchCalendars();
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

  const fetchCalendars = () => {
    setFetching(true);
    gapi.client.calendar.calendarList.list({}).then((resp) => {
      let calendars = resp.result.items.map((item) => {
        return {
          id: item.id,
          name: item.summary,
          color: item.backgroundColor,
        };
      });
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
          .then((resp) => {
            var respEvents = resp.result.items;

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
            setFetching(false);
          }).catch((err) => {
            console.log(err);
          });
      });
    });
    
  };

  return (
    <div className="app">
      <Background />
      {isSignedIn ? (
        <div>
          <Header />
          {
            fetching ? <Loader /> :
            <Agenda
            events={events
              .sort((a, b) => {
                if (a.startTime.isBefore(b.startTime)) {
                  return -1;
                } else {
                  return 1;
                }
              })
              .slice(0, 49)}
          />
          }
          
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
