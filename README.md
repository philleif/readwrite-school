# readwrite-school
Programmatic reading and writing practice books.

## Installation

`git clone`
`npm install`

Requires a .env file with the following variables:

NYT_API_KEY - API key from the New York Times (wordlist)
UNSPLASH_APP_ID - Unsplash.com App ID (photos)
UNSPLASH_SECRET - Unsplash.com API secret (photos)
PROJECT_ID - Google Cloud project ID (translations)
DB_URL - Mongo connection string

## Database Seeding

Scripts are seperate in order to work around API limits.

Generate wordlist from NYT: `node bin/fetch-data.js`

Import images: `node bin/image-import.js`

Import translations:  `node bin/translations-import.js`

## Sample Sentences

Export data and import a CSV of sentences for each word:

1. Create a directory in the project folder called "./tmp"
2. `node bin/generate-csv.js` will export a CSV
3. Add sentences to a new column called "New Sentence"
4. Run `node bin/csv-import.js` to add the sentences to the database

## Rendering PDFs

1. Create a "./pdf" directory inside "./tmp"
2. Make sure all the data is seeded, then run `node bin/render-pages`