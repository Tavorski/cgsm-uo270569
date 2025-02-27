import './dash.all.min';

const url = "/videos/sintel.mpd";
const player = dashjs.MediaPlayer().create();
player.initialize(document.querySelector("#player"), url, true);