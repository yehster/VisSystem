import express from "express";
function includeScript(response : express.Response, scriptURL : string)
{
	let marker = scriptURL.indexOf("?");
	let href : string = marker > 0 ? scriptURL.replace("?","?version="+(new Date()).valueOf()) : scriptURL;
	response.write("<script type='text/javascript' src='"+href+"'></script>\n"); 
}

export interface sources
{
	scripts : Array<string>;
	templates :  Array<string> ;
	body : string;
	postProcess : Array<string>;
}

export class contentLoader
{
	protected sourceInfo : sources;
	protected templateList : Array<string>;
	constructor (sourceInfo : sources)
	{
		this.sourceInfo = sourceInfo;
		this.templateList = new Array<string>();
	}
	
	protected processTemplate(template : string)
	{
		
	}
	public generateStaticHTML(response : express.Response)
	{
		for(let scriptIdx=0;scriptIdx<this.sourceInfo.scripts.length;scriptIdx++)
		{
			includeScript(response,this.sourceInfo.scripts[scriptIdx]);
		}
		for(let templatesIdx=0;templatesIdx<this.sourceInfo.templates.length;templatesIdx++)
		{
			// Modifiy the templates as needed
			this.processTemplate(this.sourceInfo.templates[templatesIdx]);
			
		}
	}
	
	public getTemplateList()
	{
		return this.templateList;
	}
}