import express from "express";
import axios from "axios";
import jsdom from "jsdom";
import { LanguageSet } from "./model/languageSet";
import cors from "cors";


const { JSDOM } = jsdom;

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("hv0357-portfolio-server");
});

app.get("/get-most-used-language", (req, res) => {
  axios
    .get(
      "https://github-readme-stats.vercel.app/api/top-langs/?username=hoangvu75&hide=javascript,html"
    )
    .then((response) => {
      const html = response.data; // insert the HTML string here

      const dom = new JSDOM(html);
      const document = dom.window.document;

      const langItems = document.querySelectorAll(
        '[data-testid="lang-items"] g'
      );

      var langList: LanguageSet[] = [];

      langItems.forEach((item) => {
        const langNameEl = item.querySelector('[data-testid="lang-name"]');
        const langPercentageEl = item.querySelector(
          '[data-testid="lang-name"] + text'
        );

        const langElement: LanguageSet = {
          langName: `${langNameEl!.textContent!.trim()}`,
          langRate: `${langPercentageEl!.textContent!.trim()}`,
        };
        langList.push(langElement); 
      });
      
      const uniqueLangList = langList.filter((lang, index, self) => {
        return index === self.findIndex((t) => (
          t.langName === lang.langName && t.langRate === lang.langRate
        ));
      }); 

      res.status(200).send({
        langList: uniqueLangList
      });
    })
    .catch((error) => {
      res.status(200).send({
        error
      });
    });
});
