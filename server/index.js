const express = require('express');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = 3000;

// ─── Fixture Data ───────────────────────────────────────────────────────────

const MOVIES = {
  'The Last Algorithm': { genre: 'sci-fi', duration: 135, emoji: '🤖' },
  'Midnight in Budapest': { genre: 'romance', duration: 110, emoji: '🌙' },
  'Dark Forest': { genre: 'horror', duration: 95, emoji: '🌲' },
  'Revenge of the Spreadsheet': { genre: 'comedy', duration: 105, emoji: '📊' },
  'Echoes': { genre: 'drama', duration: 120, emoji: '🔊' },
};

// Plaza Cinema Szeged — CEST (UTC+2)
const plazaData = {
  '2026-04-10': [
    { title: 'The Last Algorithm', screenings: [
      { time: '14:00', room: 'Room 1', available_seats: 45 },
      { time: '17:30', room: 'Room 2', available_seats: 120 },
      { time: '20:15', room: 'Room 1', available_seats: 80 },
    ]},
    { title: 'Midnight in Budapest', screenings: [
      { time: '15:00', room: 'Room 2', available_seats: 95 },
      { time: '18:00', room: 'Room 1', available_seats: 60 },
      { time: '21:00', room: 'Room 2', available_seats: 110 },
    ]},
    { title: 'Dark Forest', screenings: [
      { time: '16:00', room: 'Room 1', available_seats: 70 },
      { time: '19:00', room: 'Room 2', available_seats: 85 },
      { time: '22:00', room: 'Room 1', available_seats: 55 },
    ]},
    { title: 'Revenge of the Spreadsheet', screenings: [
      { time: '14:30', room: 'Room 2', available_seats: 100 },
      { time: '20:00', room: 'Room 2', available_seats: 90 },
    ]},
    { title: 'Echoes', screenings: [
      { time: '17:00', room: 'Room 1', available_seats: 75 },
    ]},
  ],
  '2026-04-11': [
    { title: 'The Last Algorithm', screenings: [
      { time: '11:00', room: 'Room 1', available_seats: 50 },
      { time: '14:00', room: 'Room 2', available_seats: 130 },
      { time: '17:30', room: 'Room 1', available_seats: 85 },
      { time: '20:15', room: 'Room 2', available_seats: 60 },
    ]},
    { title: 'Midnight in Budapest', screenings: [
      { time: '12:00', room: 'Room 2', available_seats: 100 },
      { time: '15:00', room: 'Room 1', available_seats: 70 },
      { time: '18:00', room: 'Room 2', available_seats: 90 },
      { time: '21:00', room: 'Room 1', available_seats: 45 },
    ]},
    { title: 'Dark Forest', screenings: [
      { time: '13:00', room: 'Room 1', available_seats: 65 },
      { time: '16:00', room: 'Room 2', available_seats: 80 },
      { time: '19:00', room: 'Room 1', available_seats: 55 },
      { time: '22:00', room: 'Room 2', available_seats: 40 },
    ]},
    { title: 'Revenge of the Spreadsheet', screenings: [
      { time: '11:30', room: 'Room 2', available_seats: 110 },
      { time: '14:30', room: 'Room 1', available_seats: 95 },
      { time: '20:00', room: 'Room 2', available_seats: 75 },
    ]},
    { title: 'Echoes', screenings: [
      { time: '13:00', room: 'Room 2', available_seats: 85 },
      { time: '17:00', room: 'Room 1', available_seats: 60 },
    ]},
  ],
  '2026-04-13': [
    { title: 'The Last Algorithm', screenings: [
      { time: '17:30', room: 'Room 1', available_seats: 90 },
      { time: '20:15', room: 'Room 2', available_seats: 70 },
    ]},
    { title: 'Midnight in Budapest', screenings: [
      { time: '18:00', room: 'Room 2', available_seats: 105 },
      { time: '21:00', room: 'Room 1', available_seats: 50 },
    ]},
    { title: 'Dark Forest', screenings: [
      { time: '19:00', room: 'Room 1', available_seats: 65 },
    ]},
    { title: 'Echoes', screenings: [
      { time: '17:00', room: 'Room 2', available_seats: 80 },
      { time: '20:00', room: 'Room 1', available_seats: 55 },
    ]},
  ],
};

// Grand Cinema Arad — EEST (UTC+3)
const grandData = {
  '2026-04-10': [
    { time: '15:00', screenings: [
      { room: 'Sala 1', movie: 'The Last Algorithm' },
      { room: 'Sala 2', movie: 'Echoes' },
    ]},
    { time: '17:00', screenings: [
      { room: 'Sala 1', movie: 'Midnight in Budapest' },
      { room: 'Sala 2', movie: 'Dark Forest' },
    ]},
    { time: '19:30', screenings: [
      { room: 'Sala 1', movie: 'The Last Algorithm' },
      { room: 'Sala 2', movie: 'Revenge of the Spreadsheet' },
    ]},
    { time: '21:00', screenings: [
      { room: 'Sala 1', movie: 'Dark Forest' },
      { room: 'Sala 2', movie: 'Midnight in Budapest' },
    ]},
    { time: '23:00', screenings: [
      { room: 'Sala 1', movie: 'The Last Algorithm' },
    ]},
  ],
  '2026-04-11': [
    { time: '12:00', screenings: [
      { room: 'Sala 1', movie: 'Echoes' },
      { room: 'Sala 2', movie: 'The Last Algorithm' },
    ]},
    { time: '14:30', screenings: [
      { room: 'Sala 1', movie: 'Midnight in Budapest' },
      { room: 'Sala 2', movie: 'Dark Forest' },
    ]},
    { time: '17:00', screenings: [
      { room: 'Sala 1', movie: 'The Last Algorithm' },
      { room: 'Sala 2', movie: 'Revenge of the Spreadsheet' },
    ]},
    { time: '19:30', screenings: [
      { room: 'Sala 1', movie: 'Dark Forest' },
      { room: 'Sala 2', movie: 'Midnight in Budapest' },
    ]},
    { time: '21:30', screenings: [
      { room: 'Sala 1', movie: 'The Last Algorithm' },
      { room: 'Sala 2', movie: 'Echoes' },
    ]},
  ],
  '2026-04-13': [
    { time: '18:00', screenings: [
      { room: 'Sala 1', movie: 'Dark Forest' },
      { room: 'Sala 2', movie: 'Echoes' },
    ]},
    { time: '20:00', screenings: [
      { room: 'Sala 1', movie: 'The Last Algorithm' },
      { room: 'Sala 2', movie: 'Midnight in Budapest' },
    ]},
    { time: '22:00', screenings: [
      { room: 'Sala 1', movie: 'Midnight in Budapest' },
    ]},
  ],
};

// Starlight Kino Makó — CEST (UTC+2)
const starlightWeek15 = {
  '2026-04-10': {
    label: 'Péntek / Friday — április 10.',
    slots: [
      { time: '15:00', teremA: 'Midnight in Budapest', teremB: '' },
      { time: '16:00', teremA: '', teremB: 'Revenge of the Spreadsheet' },
      { time: '18:00', teremA: 'Dark Forest', teremB: '' },
      { time: '19:00', teremA: '', teremB: 'Echoes' },
      { time: '20:30', teremA: 'The Last Algorithm', teremB: '' },
    ],
  },
  '2026-04-11': {
    label: 'Szombat / Saturday — április 11.',
    slots: [
      { time: '11:00', teremA: 'The Last Algorithm', teremB: '' },
      { time: '12:00', teremA: '↓', teremB: 'Echoes' },
      { time: '14:00', teremA: 'Dark Forest', teremB: '' },
      { time: '15:00', teremA: '', teremB: 'Revenge of the Spreadsheet' },
      { time: '17:00', teremA: 'Midnight in Budapest', teremB: '' },
      { time: '18:30', teremA: '', teremB: 'Dark Forest' },
      { time: '20:00', teremA: 'The Last Algorithm', teremB: '' },
    ],
    footnote: '* A szombati vetítések időpontjai eltérhetnek a szokásostól.',
  },
};

const starlightWeek16 = {
  '2026-04-13': {
    label: 'Hétfő / Monday — április 13.',
    slots: [
      { time: '17:30', teremA: 'Midnight in Budapest', teremB: '' },
      { time: '18:00', teremA: '', teremB: 'Dark Forest' },
      { time: '20:00', teremA: 'The Last Algorithm', teremB: '' },
      { time: '20:30', teremA: '', teremB: 'Echoes' },
    ],
  },
};

// ─── Homepage ───────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cinema Kata — Border Cinemas</title>
  <style>
    body { font-family: 'Georgia', serif; background: #1a1a2e; color: #e0e0e0; margin: 0; padding: 40px; }
    h1 { color: #e94560; text-align: center; font-size: 2.2em; }
    p.subtitle { text-align: center; color: #999; margin-bottom: 40px; }
    .cinemas { max-width: 600px; margin: 0 auto; }
    .cinema-link { display: block; padding: 20px; margin: 15px 0; background: #16213e; border-left: 4px solid #e94560; text-decoration: none; color: #e0e0e0; border-radius: 4px; }
    .cinema-link:hover { background: #1a2744; }
    .cinema-link h2 { margin: 0 0 5px; color: #fff; }
    .cinema-link span { color: #888; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>🎬 Border Cinemas</h1>
  <p class="subtitle">Three cinemas near the Hungary–Romania border</p>
  <div class="cinemas">
    <a class="cinema-link" href="/plaza-szeged">
      <h2>Plaza Cinema Szeged</h2>
      <span>Szeged, Hungary — Modern multiplex</span>
    </a>
    <a class="cinema-link" href="/grand-arad">
      <h2>Grand Cinema Arad</h2>
      <span>Arad, Romania — Traditional cinema</span>
    </a>
    <a class="cinema-link" href="/starlight-mako">
      <h2>Starlight Kino Makó</h2>
      <span>Makó, Hungary — Cozy retro cinema</span>
    </a>
  </div>
</body>
</html>`);
});

// ─── Plaza Cinema Szeged ────────────────────────────────────────────────────

app.get('/plaza-szeged', (_req, res) => {
  const movieCards = Object.entries(MOVIES).map(([title, info]) => `
    <div class="movie-card">
      <div class="poster">${info.emoji}</div>
      <h3>${title}</h3>
      <span class="genre">${info.genre}</span>
      <span class="duration">${info.duration} min</span>
    </div>`).join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Plaza Cinema Szeged</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0f0f0f; color: #fff; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; }
    header h1 { font-size: 2em; font-weight: 300; letter-spacing: 2px; }
    header p { color: rgba(255,255,255,0.8); margin-top: 5px; }
    nav { background: #1a1a1a; padding: 12px 40px; border-bottom: 1px solid #333; }
    nav a { color: #aaa; text-decoration: none; margin-right: 20px; font-size: 0.9em; }
    nav a:hover { color: #fff; }
    .container { max-width: 1000px; margin: 0 auto; padding: 30px 20px; }
    h2 { color: #667eea; margin-bottom: 20px; font-weight: 400; }
    .movies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 20px; margin-bottom: 50px; }
    .movie-card { background: #1e1e1e; border-radius: 12px; padding: 20px; text-align: center; }
    .movie-card .poster { font-size: 3em; margin-bottom: 10px; }
    .movie-card h3 { font-size: 0.95em; margin-bottom: 8px; color: #eee; }
    .movie-card .genre { background: #667eea33; color: #667eea; padding: 2px 8px; border-radius: 10px; font-size: 0.75em; }
    .movie-card .duration { display: block; margin-top: 6px; color: #777; font-size: 0.8em; }
    .schedule-section { background: #1a1a1a; border-radius: 12px; padding: 30px; }
    .date-picker { margin-bottom: 20px; }
    .date-picker select { background: #2a2a2a; color: #fff; border: 1px solid #444; padding: 8px 16px; border-radius: 6px; font-size: 1em; }
    #schedule-container { min-height: 100px; color: #888; }
    .screening-movie { margin-bottom: 20px; }
    .screening-movie h3 { color: #667eea; margin-bottom: 8px; }
    .screening-item { display: inline-block; background: #2a2a2a; padding: 6px 14px; margin: 3px 6px 3px 0; border-radius: 6px; font-size: 0.9em; }
    .screening-item .time { color: #fff; font-weight: 600; }
    .screening-item .room { color: #888; margin-left: 6px; }
    .screening-item .seats { color: #4caf50; margin-left: 6px; font-size: 0.85em; }
  </style>
</head>
<body>
  <header>
    <h1>PLAZA CINEMA</h1>
    <p>Szeged — Your premium movie experience</p>
  </header>
  <nav>
    <a href="/plaza-szeged">Home</a>
    <a href="#now-showing">Now Showing</a>
    <a href="#schedule">Schedule</a>
  </nav>
  <div class="container">
    <h2 id="now-showing">🎬 Now Showing</h2>
    <div class="movies-grid">${movieCards}</div>

    <div class="schedule-section">
      <h2 id="schedule">📅 Schedule</h2>
      <div class="date-picker">
        <label for="date-select">Select date: </label>
        <select id="date-select">
          <option value="">— Choose a date —</option>
          <option value="2026-04-10">Friday, April 10</option>
          <option value="2026-04-11">Saturday, April 11</option>
          <option value="2026-04-12">Sunday, April 12</option>
          <option value="2026-04-13">Monday, April 13</option>
          <option value="2026-04-14">Tuesday, April 14</option>
        </select>
      </div>
      <div id="schedule-container">Select a date to see screenings</div>
    </div>
  </div>
  <script>
    document.getElementById('date-select').addEventListener('change', function() {
      const date = this.value;
      const container = document.getElementById('schedule-container');
      if (!date) {
        container.innerHTML = 'Select a date to see screenings';
        return;
      }
      container.innerHTML = 'Loading...';
      fetch('/plaza-szeged/api/screenings?date=' + date)
        .then(r => r.json())
        .then(data => {
          if (!data.movies || data.movies.length === 0) {
            container.innerHTML = '<p>No screenings scheduled for this date.</p>';
            return;
          }
          let html = '';
          data.movies.forEach(movie => {
            html += '<div class="screening-movie">';
            html += '<h3>' + movie.title + ' <span style="color:#888;font-size:0.8em">(' + movie.genre + ', ' + movie.duration + ')</span></h3>';
            movie.screenings.forEach(s => {
              html += '<div class="screening-item">';
              html += '<span class="time">' + s.time + '</span>';
              html += '<span class="room">' + s.room + '</span>';
              html += '<span class="seats">' + s.available_seats + ' seats</span>';
              html += '</div>';
            });
            html += '</div>';
          });
          container.innerHTML = html;
        })
        .catch(() => {
          container.innerHTML = '<p style="color:#e94560">Failed to load screenings.</p>';
        });
    });
  </script>
</body>
</html>`);
});

app.get('/plaza-szeged/api/screenings', (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter. Use ?date=YYYY-MM-DD' });
  }

  const dayData = plazaData[date];
  if (!dayData) {
    return res.json({
      cinema: 'Plaza Cinema Szeged',
      date,
      movies: [],
      note: 'No screenings scheduled for this date.',
    });
  }

  const movies = dayData.map(movie => ({
    title: movie.title,
    genre: MOVIES[movie.title].genre,
    duration: `${MOVIES[movie.title].duration} min`,
    screenings: movie.screenings,
  }));

  res.json({ cinema: 'Plaza Cinema Szeged', date, movies });
});

// ─── Grand Cinema Arad ──────────────────────────────────────────────────────

const grandAvailableDates = Object.keys(grandData);

function formatGrandDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

app.get('/grand-arad', (_req, res) => {
  const dateLinks = grandAvailableDates.map(d =>
    `<li><a href="/grand-arad/programme/${d}">${formatGrandDate(d)}</a></li>`
  ).join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grand Cinema Arad</title>
  <style>
    body { font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; background: #fdf6e3; color: #3b3b3b; margin: 0; }
    header { background: #8b0000; color: #fdf6e3; padding: 30px 40px; text-align: center; border-bottom: 4px solid #6b0000; }
    header h1 { font-size: 2.4em; letter-spacing: 3px; margin: 0; text-transform: uppercase; }
    header p { margin-top: 5px; font-style: italic; color: #daa; }
    .content { max-width: 700px; margin: 40px auto; padding: 0 20px; }
    h2 { color: #8b0000; border-bottom: 2px solid #8b0000; padding-bottom: 8px; margin-bottom: 20px; }
    ul { list-style: none; padding: 0; }
    ul li { margin: 10px 0; }
    ul li a { color: #8b0000; text-decoration: none; font-size: 1.15em; padding: 10px 15px; display: block; background: #fff8ee; border: 1px solid #e0d0b0; border-radius: 4px; }
    ul li a:hover { background: #f5e6c8; }
    footer { text-align: center; margin-top: 60px; color: #999; font-size: 0.85em; padding: 20px; }
  </style>
</head>
<body>
  <header>
    <h1>Grand Cinema Arad</h1>
    <p>Tradiție cinematografică din 1923</p>
  </header>
  <div class="content">
    <h2>Programme</h2>
    <p>Select a date to view our daily screenings:</p>
    <ul>${dateLinks}</ul>
  </div>
  <footer>Grand Cinema Arad — Strada Republicii 42, Arad, România</footer>
</body>
</html>`);
});

app.get('/grand-arad/programme/:date', (req, res) => {
  const date = req.params.date;
  const dayData = grandData[date];

  if (!dayData) {
    return res.status(404).send(`<!DOCTYPE html>
<html><head><title>Grand Cinema Arad</title>
<style>body{font-family:'Palatino Linotype',serif;background:#fdf6e3;color:#3b3b3b;text-align:center;padding:60px;}</style>
</head><body><h1>No programme available for this date.</h1><p><a href="/grand-arad">Back to programme</a></p></body></html>`);
  }

  const timeSlots = dayData.map(slot => {
    const screeningDivs = slot.screenings.map(s => `
          <div class="screening">
            <span class="room">${s.room}</span>
            <span class="movie">${s.movie}</span>
            <span class="badge">${MOVIES[s.movie].genre}</span>
          </div>`).join('');
    return `
        <div class="time-slot">
          <h3>${slot.time}</h3>${screeningDivs}
        </div>`;
  }).join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grand Cinema Arad — ${formatGrandDate(date)}</title>
  <style>
    body { font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; background: #fdf6e3; color: #3b3b3b; margin: 0; }
    header { background: #8b0000; color: #fdf6e3; padding: 25px 40px; text-align: center; border-bottom: 4px solid #6b0000; }
    header h1 { font-size: 1.8em; letter-spacing: 2px; margin: 0; }
    .content { max-width: 700px; margin: 30px auto; padding: 0 20px; }
    h2 { color: #8b0000; margin-bottom: 25px; }
    .back-link { display: inline-block; margin-bottom: 20px; color: #8b0000; text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
    .time-slot { background: #fff8ee; border: 1px solid #e0d0b0; border-radius: 6px; padding: 15px 20px; margin-bottom: 15px; }
    .time-slot h3 { color: #8b0000; font-size: 1.4em; margin: 0 0 10px; border-bottom: 1px solid #e0d0b0; padding-bottom: 6px; }
    .screening { display: flex; align-items: center; padding: 6px 0; gap: 12px; }
    .screening .room { background: #8b0000; color: #fff; padding: 2px 10px; border-radius: 3px; font-size: 0.85em; min-width: 55px; text-align: center; }
    .screening .movie { font-size: 1.05em; flex: 1; }
    .screening .badge { background: #e0d0b0; color: #5a4a2a; padding: 2px 8px; border-radius: 10px; font-size: 0.75em; }
    footer { text-align: center; margin-top: 40px; color: #999; font-size: 0.85em; padding: 20px; }
  </style>
</head>
<body>
  <header>
    <h1>Grand Cinema Arad</h1>
  </header>
  <div class="content">
    <a class="back-link" href="/grand-arad">← Back to programme</a>
    <h2>Programme — ${formatGrandDate(date)}</h2>
    ${timeSlots}
  </div>
  <footer>Grand Cinema Arad — Strada Republicii 42, Arad, România</footer>
</body>
</html>`);
});

// ─── Starlight Kino Makó ────────────────────────────────────────────────────

app.get('/starlight-mako', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Starlight Kino Makó</title>
  <style>
    body { font-family: 'Courier New', Courier, monospace; background: #2b1b17; color: #f5deb3; margin: 0; }
    header { text-align: center; padding: 40px 20px; background: linear-gradient(180deg, #3b2520 0%, #2b1b17 100%); }
    header h1 { font-size: 2.5em; color: #ffd700; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); letter-spacing: 3px; }
    header p { color: #d2a679; font-style: italic; margin-top: 5px; }
    .stars { text-align: center; color: #ffd700; font-size: 1.5em; letter-spacing: 8px; margin: 10px 0; }
    .content { max-width: 600px; margin: 30px auto; padding: 0 20px; }
    h2 { color: #ffd700; border-bottom: 1px dashed #ffd700; padding-bottom: 8px; }
    .pdf-link { display: block; margin: 15px 0; padding: 15px 20px; background: #3b2520; border: 1px solid #ffd70066; border-radius: 6px; color: #ffd700; text-decoration: none; font-size: 1.1em; }
    .pdf-link:hover { background: #4a3530; border-color: #ffd700; }
    .pdf-link span { display: block; color: #d2a679; font-size: 0.85em; margin-top: 4px; }
    .note { background: #3b2520; border-left: 3px solid #ffd700; padding: 12px 16px; margin-top: 30px; font-size: 0.9em; color: #d2a679; }
    footer { text-align: center; margin-top: 50px; padding: 20px; color: #8b6f4e; font-size: 0.8em; }
  </style>
</head>
<body>
  <header>
    <div class="stars">★ ★ ★ ★ ★</div>
    <h1>Starlight Kino</h1>
    <p>Makó — Mozi 1962 óta</p>
  </header>
  <div class="content">
    <h2>📥 Heti Műsor / Weekly Programme</h2>
    <p>Töltse le a heti műsorunkat! / Download our weekly programme:</p>
    <a class="pdf-link" href="/starlight-mako/programme/week-15">
      📄 15. hét — április 6–12.
      <span>Week 15 — April 6–12, 2026</span>
    </a>
    <a class="pdf-link" href="/starlight-mako/programme/week-16">
      📄 16. hét — április 13–19.
      <span>Week 16 — April 13–19, 2026</span>
    </a>
    <div class="note">
      Nyitvatartás: péntek–szombat (kivételes esetben hétköznap is).<br>
      <em>Open: Fridays & Saturdays (occasional weekday screenings).</em>
    </div>
  </div>
  <footer>Starlight Kino Makó — Széchenyi tér 8., Makó, Hungary — Tel: +36 62 555 123</footer>
</body>
</html>`);
});

function generateStarlightPdf(res, weekNumber, weekLabel, dateRange, daysData, comingSoonMessage) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="starlight-mako-week-${weekNumber}.pdf"`);
  doc.pipe(res);

  // Title
  doc.fontSize(22).font('Helvetica-Bold')
    .text('Starlight Kino Makó', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(16).font('Helvetica')
    .text('Heti Műsor / Weekly Programme', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(12).font('Helvetica')
    .text(dateRange, { align: 'center' });
  doc.moveDown(0.2);
  doc.fontSize(9).font('Helvetica-Oblique')
    .fillColor('#666666')
    .text('Minden időpont helyi idő. / All times in local time (helyi idő).', { align: 'center' });
  doc.fillColor('#000000');
  doc.moveDown(1.5);

  const colTime = 50;
  const colA = 170;
  const colB = 360;
  const colWidth = 180;
  const rowHeight = 28;

  for (const [dateKey, dayInfo] of Object.entries(daysData)) {
    // Day header
    doc.fontSize(13).font('Helvetica-Bold')
      .text(dayInfo.label, colTime, doc.y);
    doc.moveDown(0.5);

    // Table header
    const headerY = doc.y;
    doc.rect(colTime - 5, headerY - 3, 490, rowHeight).fill('#333333');
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
    doc.text('Idő', colTime, headerY + 5, { width: 100 });
    doc.text('Terem A', colA, headerY + 5, { width: colWidth });
    doc.text('Terem B', colB, headerY + 5, { width: colWidth });
    doc.fillColor('#000000');

    let y = headerY + rowHeight + 2;

    dayInfo.slots.forEach((slot, i) => {
      const bgColor = i % 2 === 0 ? '#f5f5f5' : '#ffffff';
      doc.rect(colTime - 5, y - 3, 490, rowHeight).fill(bgColor);
      doc.fillColor('#000000');

      doc.fontSize(10).font('Helvetica-Bold')
        .text(slot.time, colTime, y + 5, { width: 100 });

      doc.font('Helvetica').fontSize(10);
      if (slot.teremA) {
        const aColor = slot.teremA === '↓' ? '#888888' : '#000000';
        doc.fillColor(aColor).text(slot.teremA, colA, y + 5, { width: colWidth });
      }
      if (slot.teremB) {
        doc.fillColor('#000000').text(slot.teremB, colB, y + 5, { width: colWidth });
      }
      doc.fillColor('#000000');
      y += rowHeight;
    });

    if (dayInfo.footnote) {
      y += 5;
      doc.fontSize(8).font('Helvetica-Oblique')
        .fillColor('#666666')
        .text(dayInfo.footnote, colTime, y);
      doc.fillColor('#000000');
      y += 15;
    }

    doc.y = y + 20;
  }

  if (comingSoonMessage) {
    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica-Oblique')
      .fillColor('#888888')
      .text(comingSoonMessage, { align: 'center' });
    doc.fillColor('#000000');
  }

  // Footer
  doc.moveDown(3);
  doc.fontSize(8).font('Helvetica')
    .fillColor('#aaaaaa')
    .text('Starlight Kino Makó — Széchenyi tér 8. — www.starlightkino.hu', { align: 'center' });

  doc.end();
}

app.get('/starlight-mako/programme/week-15', (_req, res) => {
  generateStarlightPdf(
    res, 15,
    '15. hét',
    '2026. április 6–12.',
    starlightWeek15,
    null
  );
});

app.get('/starlight-mako/programme/week-16', (_req, res) => {
  generateStarlightPdf(
    res, 16,
    '16. hét',
    '2026. április 13–19.',
    starlightWeek16,
    'Péntek-szombati műsor hamarosan! / Friday-Saturday programme coming soon!'
  );
});

// ─── Start ──────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Cinema Kata server running at http://localhost:${PORT}`);
});
