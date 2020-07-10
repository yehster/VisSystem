import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as fs from 'fs';
import * as contentLoader from "./tools/contentLoader";


let sourceInfo : contentLoader.sources = {
	scripts : [
				"https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.1/knockout-latest.min.js"
				,"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
				,"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js"
				]
	,templates :  []
	,body : ""
	,postProcess : []
};

const app = express();

const myLoader = new contentLoader.contentLoader(sourceInfo);

app.use(helmet());
app.use(cors());
app.use(express.json());

async function serveTemplate(req: express.Request, res : express.Response)
{
	let templateName = req.params['template'];
	
}
app.all("/templates/:template",serveTemplate);

function mainContent(req: express.Request,res : express.Response)
{
	res.set({'Content-Type': 'text/html'});
	res.write("<body>");
	myLoader.generateStaticHTML(res);
	res.write("Hello world!");
	res.write("</body>");

	res.status(200).send();
}
app.all("/main/",mainContent);
const server = app.listen(8080,()=> { console.log("Listening on 8080");});