async function loadKnockoutTemplates(templateList)
{
	let fetchPromises = [];
	for(let idx=0;idx<templateList.length;idx++)
	{
		fetchPromises.push(fetch("/"+templateList[idx]));  // could , {cache: "force-cache"} here
		
	}
	let responses = await Promise.all(fetchPromises);
	let bodyPromises = [];
	for(let idx=0;idx<responses.length;idx++)
	{
		bodyPromises.push(responses[idx].text());
	}
	let bodies = await Promise.all(bodyPromises);
	let templates = $("<div id='koTemplates'></div>");
	$("body").append(templates);
	for(let idx=0;idx<bodies.length;idx++)
	{
		templates.append(bodies[idx]);
	}
}