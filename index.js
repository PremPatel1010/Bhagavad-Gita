import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const config = {
  headers: {
    "x-rapidapi-key": "559f69015bmsh3d4bbf84101ea79p102da7jsn73c78830f281",
    "x-rapidapi-host": "bhagavad-gita3.p.rapidapi.com",
  },
};

let chapters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];


app.get("/", (req, res) => {
  res.render("index.ejs", { chapters });
});

app.get("/chapter/:chapterid", async (req, res) => {
  try {
    const chapterid = req.params.chapterid;
    const RawResponse = await axios.get(
      `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterid}/verses/1/`,
      config
    );
    const response = RawResponse.data;
    const data = {
      verseNum: response.verse_number,
      ChapNum: response.chapter_number,
      shlok: response.text,
      translation: response.translations[0].description,
    };
    res.render("card.ejs", { data });
  } catch (error) {
    console.error(error);
  }
});

app.post("/search/:id", async (req, res) => {
  try {
    const shlokId = req.body["ShlokId"];
    const chapterid = parseInt(req.params.id);
    const RawResponse = await axios.get(
      `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterid}/verses/${shlokId}/`,
      config
    );
    const response = RawResponse.data;
    const data = {
      verseNum: response.verse_number,
      ChapNum: response.chapter_number,
      shlok: response.text,
      translation: response.translations[0].description,
    };
    res.render("card.ejs", { data });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});