---
name: cinema-night-organiser
description: Organise a cinema visit for a group of friends from an email thread and the local cinema websites, then write a plan to output/plan.md. Use for the Cinema Night Organiser kata.
---

# Cinema Night Organiser

Organise a cinema visit for a group of friends.

## Input
- An email thread from `data/`
- Cinema websites running on localhost:3000

## Steps

1. Read the email thread and work out each person's location,
   availability, and what movie the group wants to see.

2. Check what's showing at our local cinemas:
   - Plaza Cinema Szeged: http://localhost:3000/plaza-szeged
   - Grand Cinema Arad: http://localhost:3000/grand-arad
   - Starlight Kino Makó: http://localhost:3000/starlight-mako

3. Find the best screening that works for everyone,
   accounting for where people live and travel time.

4. Write a plan to `output/plan.md` with:
   - Movie, cinema, and showtime
   - When each person needs to leave home
   - Any notes (e.g., who's driving whom)
