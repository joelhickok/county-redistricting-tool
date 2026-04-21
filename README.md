# County Redistricting Tool

My boss wanted a web app that would allow people to build **data-driven** redistricting proposals using the County's existing Districts.  When it was done, he thought it was one of the coolest apps for local government he had ever seen. _I need to resurrect it (see below)._  The need for this app was born, in part, from the lack of off-the-shelf solutions that provided helpful features for real-time data manipulation.  For example, Esri's solution - at the time, at least - was basic in comparison.

This is a full stack Node.js app that interacts on the server side with ArcGIS Online, and ArcGIS Server.  It also runs web map layers and features services on the client side.  It stores user data using IndexedDB to persist user sessions in the browser, as this avoids long-running "redistricting sessions" becoming lost across browser reloads.

An incomplete list of the tech stack this project uses includes:
ArcGIS Rest JS packages, SvelteKit, Terraformer JS, Leaflet, Leaflet Geoman, Turf.js, C3 charting (built on D3), Dexie.js, Leaflet additional plugins, and Lodash.


## Current Migration State

Unfortunately, my efforts to extract the app into my personal ArcGIS Online have resulted in a TON of extra work to get the app working again (it throws many errors pointing at the County data because the infrastructure was deactivated - such as groups and other content).  I still hope to find time to make the app work as a demo once again, but pointing at my personal ArcGIS Online content.  I also got stuck migrating the app from the early "Sapper" framework to the modern SvelteKit framework, which is much more robust.  Also a lot of work to make an old app work new again.

## Requirements:
- Create a new redistricting proposal
    * Base plan on existing districts
    * Base plan on existing proposal
    * Start from scratch
- Save redistricting proposals into the County's ArcGIS Online tenant
    * Access these saved proposals from the web app interface to view or "create new from".
- Build new plans by selecting county parcels and assigning them to a district
    * Numerous tricks exist to accelerate the selection process, such as holding keyboard shortcuts, or dragging across a map.
- Display realtime chart stats to help people "balance" the population of the districts and meet mandated requirements.
    * For example, there is an acceptable standard deviation allowed for total population of each district.
    * Show a graph and other stats to update districts totals in realtime.


## Running the project

Once the project is fully migrated to SvelteKit and into my personal ArcGIS Online space, the project runs like any other SvelteKit project.  See below.

## Environment

The .env file must contain login credentials for ArcGIS Online.  This is for reading and writing District Proposals.

Once the project migration is complete (from County to personal infrastructure), other documentation will include instructions for identifying ArcGIS Online folders and groups to manage data locations and access.

```
ARCGIS_USERNAME=my_username
ARCGIS_PASSWORD=xxxxxxxxxxxxxxxx
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

The `@sveltejs/adapter-node` package has been added for the purpose of building a server-side full stack app in production.

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
