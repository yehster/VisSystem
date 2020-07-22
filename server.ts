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
				,"/script/templateLoader.js?"
				]
	,templates :  ["templates/states/"]
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
	// update cache headers here?
	//res.set({'cache-control':'public,max-age=3600'});
	let templateName = req.params['template'];
	let directory = req.params['directory'];
	let fullPath : string;
	let templateId : string = "";
	if(directory)
	{
		fullPath = "templates" +"/" + directory + "/" +templateName;
		templateId= "dir-"+directory+"-"
	}
	else
	{
		fullPath = "templates" + "/" + templateName;
	}
	templateId = templateId+templateName.substring(0,templateName.lastIndexOf(".htm"));
	res.write("<script type='text/html' id=''"+templateId+"'>'")
	await streamToResponse(fullPath,res);
	res.write("</script>");
	res.status(200).send();	
}
app.all("/templates/:template",serveTemplate);
app.all("/templates/:directory/:template",serveTemplate);

function streamToResponse(filename : string ,res : express.Response)
{
	return new Promise((resolve,reject)=>
	{
		fs.createReadStream(filename).on("data",(data)=>{res.write(data);})
									.on("end",()=>{resolve();});
	});
}

async function serveTemplateLoader(req: express.Request, res : express.Response)
{
	res.set({"content-type":"application/javascript; charset=utf-8"});
	await streamToResponse("templateLoader/templateJSLoader.js",res);
	res.status(200).send();
}
app.all("/script/templateLoader.js",serveTemplateLoader);
async function mainContent(req: express.Request,res : express.Response)
{
	res.set({'Content-Type': 'text/html'});
	res.write("<body>");
	await myLoader.generateStaticContent(res);
	res.write("Hello world!");
	res.write("</body>");

	res.status(200).send();
}
app.all("/main/",mainContent);
const server = app.listen(8080,()=> { console.log("Listening on 8080");});