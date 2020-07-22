import express from "express";
import fs from "fs";
import util from "util";

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

const readDirPromise =  util.promisify(fs.readdir);
export class contentLoader
{
	protected sourceInfo : sources;
	protected templateList : Array<string>;
	constructor (sourceInfo : sources)
	{
		this.sourceInfo = sourceInfo;
		this.templateList = new Array<string>();
	}
	
	protected async processTemplate(template : string)
	{
		let retVal = new Array<string>();
		// Generate a list of templates from the directory
		if(template[template.length-1]==="/")
		{
			let templates= await readDirPromise(template);
			for(let idx=0;idx<templates.length;idx++)
			{
				retVal.push(template+templates[idx]);
			}
		}
		else
		{
			retVal.push(template);
		}
		return retVal;
	}
	protected async handleTemplates(response : express.Response)
	{
		
		let fullList : Array<Array<String>> = new Array<Array<String>>();
		for(let templatesIdx=0;templatesIdx<this.sourceInfo.templates.length;templatesIdx++)
		{
			// Modifiy the templates as needed
			let templateList=await this.processTemplate(this.sourceInfo.templates[templatesIdx]);
			fullList = fullList.concat(templateList);
		}
		
		
		// create JSON list of templates;
		response.write("<script type='text/javascript'>");
		response.write("loadKnockoutTemplates("+JSON.stringify(fullList)+");");	
		response.write("</script>");	
	
	}
	public async generateStaticContent(response : express.Response)
	{
		for(let scriptIdx=0;scriptIdx<this.sourceInfo.scripts.length;scriptIdx++)
		{
			includeScript(response,this.sourceInfo.scripts[scriptIdx]);
		}
		await this.handleTemplates(response);
	}
	
	public getTemplateList()
	{
		return this.templateList;
	}
}