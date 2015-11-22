var Observable = require('FuseJS/Observable');


var url = {
  events: 'http://paamelding.herokuapp.com/api/events/'
};

var events              = Observable()
, event_details_active  = Observable(false)
, event_details         = Observable()
, loading_indicator     = Observable(false)
, num_of_participants   = Observable()
, participants          = Observable()
, reserve               = Observable();

function fetch_event_details(id) {
  participants.clear();
  reserve.clear();

  fetch(url.events + id).then(function (response) {
    response.json().then(function (data) {
      event_details.value = data;

      event_details.value.startTime = create_timestamp(new Date(event_details.value.startTime));
      event_details.value.endTime = create_timestamp(new Date(event_details.value.endTime));
      event_details.value.regStart = create_timestamp(new Date(event_details.value.regStart));

      event_details.value.participants.forEach(function (e) {
        if (e.reserve == false) {
          participants.add(e);
        }
        else {
          reserve.add(e);
        }
      });

      num_of_participants.value = participants.length;
      endLoading();
    });
  });
}

function create_timestamp(date) {
  return ('00' + date.getDate()).slice(-2) + '.' + ('00' + (date.getMonth() + 1)).slice(-2) + ', kl. ' + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2);
}

fetch(url.events).then(function (response) {
  response.json().then(function (data) {
    data.reverse();

    for (var i = 0; i < 10; i++) {
      var _event = data[i];
      _event.startTime = create_timestamp(new Date(_event.startTime));
      _event.regStart = create_timestamp(new Date(_event.regStart));

      events.add(_event);
    }
  });
})

function event_click(element) {
  loading_indicator.value = true;
  fetch_event_details(element.data.id);
}

function go_back() {
  event_details_active.value = false;
}

function cancel_registration(element) {
  console.log(JSON.stringify(element));
}


/* Loading
-----------------------------------------------------------------------------*/
function endLoading(){
  isLoading.value = false;
  loading_indicator.value = false;
  event_details_active.value = true;
}

function reloadHandler(){
  isLoading.value = true;
  fetch_event_details(event_details.value.id);
}

var isLoading = Observable(false);

module.exports = {
  cancel_registration:  cancel_registration,
  event_details_active: event_details_active,
  event_click: event_click,
  event_details: event_details,
  events: events,
  go_back: go_back,
  loading_indicator: loading_indicator,
  num_of_participants: num_of_participants,
  participants: participants,
  reserve: reserve,

  isLoading: isLoading,
  reloadHandler: reloadHandler
};
