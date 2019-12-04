# Steven Seagal

Steven Seagal is a site scraper for Adyoulike
It download a webpage given an URL on a local directory


### Installation
```shell
npm install
```

### Usage

```shell
node app.js https://www.example.com -m -h
```

- -m *optional* force a mobile user-agent
- -h *optional* set headless=false to open Chromium while scraping so you can see the process
- -s *optional* set timeout (in ms) for infinite scroll. Default value is 15000
- -v *optional* set height limit (in vh) infinite scroll. No default value
