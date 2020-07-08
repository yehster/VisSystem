import express from "express";
 
function includeScript(response : express.Response, scriptURL : string)
{
	response.write("<script type='text/javascript' src='"+scriptURL+"'></script>"); 
}
interface sources
{
	scripts : Array<string>;
	templates : Array<string>;
}

export class contentLoader
{
	protected sourceInfo : sources;
	constructor (sourceInfo : sources)
	{
		this.sourceInfo = sourceInfo;
	}
	
	public generateStaticHTML(response : express.Response)
	{
		for(let scriptIdx=0;scriptIdx<this.sourceInfo.scripts.length;scriptIdx++)
		{
			includeScript(response,this.sourceInfo.scripts[scriptIdx]);
		}
		for(let templatesIdx=0;templatesIdx<this.sourceInfo.templates.length;templatesIdx++)
		{
			// retrieve templates and append to DOM
			
		}
	}
}